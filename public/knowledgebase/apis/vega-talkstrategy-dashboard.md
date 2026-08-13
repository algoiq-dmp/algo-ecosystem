# TalkStrategy Dashboard Guide

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Project Structure](#3-project-structure)
4. [Setup & Run](#4-setup--run)
5. [Core Systems](#5-core-systems)
   - [app.js -- State, Router, API Client](#51-appjs----state-router-api-client)
   - [components.js -- Shared UI Utilities](#52-componentsjs----shared-ui-utilities)
   - [admin.css -- Style Reference](#53-admincss----style-reference)
6. [Page Reference](#6-page-reference)
   - [Login / Register](#61-login--register)
   - [Dashboard](#62-dashboard)
   - [Accounts](#63-accounts)
   - [Users](#64-users)
   - [MQ Configs](#65-mq-configs)
   - [Strategy Configs](#66-strategy-configs)
   - [Translation Configs](#67-translation-configs)
   - [Dev Tools](#68-dev-tools)
7. [Patterns & Conventions](#7-patterns--conventions)
8. [How to Extend](#8-how-to-extend)
9. [AI Agent Instructions](#9-ai-agent-instructions)

---

## 1. Overview

**TalkStrategy Dashboard** is a React-free Single Page Application (SPA) admin dashboard for managing trading accounts, MQ configurations, strategy settings, and translation mappings.

**Tech Stack:**
- **Runtime:** Node.js
- **Server:** Express 4.18.0 (static file server + SPA fallback)
- **Client:** Vanilla JavaScript (zero frameworks -- no React, Vue, Angular)
- **CSS:** Pure CSS (single file, no preprocessors)
- **Dependencies:** Exactly one production dependency (`express`)

**Purpose:**
- Admin user management (approve/reject/delete users, create users with accounts)
- Account management (CRUD for trading accounts linked to MQ/strategy/translation configs)
- MQ server configuration management
- Strategy configuration (ratio/lot settings)
- Translation configuration (vendor-specific order format mapping)
- Dev tools (Postman collection download, API overview)

**Default port:** 3000  
**API target:** `http://localhost:50000` (configurable in `js/config.js`)

---

## 2. Architecture

### 2.1 SPA Routing

Routing is **100% in-memory**. There is:
- **No** hash-based routing (`#/page`)
- **No** History API (`pushState`/`popState`)
- **No** URL changes whatsoever

```
Navigation Flow:
  User clicks nav link (data-page attribute)
    → App.navigate('pageName')
      → state.currentPage = 'pageName'
      → renderNav()  — re-render nav bar, highlight active link
      → renderPage() — clear container, show spinner, call PageRenderers[pageName]()

  On page refresh:
    → Check localStorage for saved token + user
    → If found: navigate to 'dashboard'
    → If not found: navigate to 'login'
```

### 2.2 State Management

A single mutable state object lives in `app.js`:

```javascript
var state = {
    token: null,        // JWT string
    user: null,         // { username, role, accountId }
    currentPage: 'login'
};
```

Persisted to `localStorage`:
| Key | Value |
|---|---|
| `ts_token` | JWT string |
| `ts_user` | JSON of `{ username, role, accountId }` |

Session restore on page load: reads localStorage, validates both values exist, navigates to dashboard on success.

### 2.3 Script Load Order

Scripts in `index.html` must load in this order (dependencies):

```
config.js    → window.APP_CONFIG (API base URL)
app.js       → window.App (state, API client, router, modals)
components.js → Attaches shared UI helpers to App
pages/login.js
pages/dashboard.js
pages/accounts.js
pages/mq-configs.js
pages/strategy.js
pages/translation.js
pages/users.js
pages/devtools.js
```

Each page file is an **IIFE** (Immediately Invoked Function Expression) that attaches a render function to `window.PageRenderers`.

### 2.4 API Client

All API calls go through `App.api(method, url, body)`:

```javascript
function api(method, url, body) {
    var headers = { 'Content-Type': 'application/json' };
    if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
    var opts = { method: method, headers: headers };
    if (body) opts.body = JSON.stringify(body);
    return fetch(API + url, opts)
        .then(function(r) {
            // Returns always: { status, data, ok, error }
            // ok = r.ok && !(data && data.success === false)
            // error extracted from data.error, data.Error, data.message, data.Message
        })
        .catch(function(err) {
            return { status: 0, ok: false, error: 'Unable to connect to API...' };
        });
}
```

**Response envelope** (every call returns this shape):
```javascript
{ status: number, data: object|null, ok: boolean, error: string|null }
```

- `ok` is `true` when HTTP status is 2xx AND `data.success` is not `false`
- `error` extracts from `data.error`, `data.Error`, `data.message`, or `data.Message` (PascalCase and camelCase both supported)
- On `401` with "Authentication required": triggers session-expired modal, suppresses the error
- On network failure: returns `{ status: 0, ok: false, error: 'Unable to connect...' }`

### 2.5 Authorization Model

| Page | Who Can See |
|---|---|
| Login / Register | Everyone (no auth needed) |
| Dashboard | Admin only (role === 'admin') |
| Accounts | Admin only |
| Users | Admin only |
| MQ Configs | Admin only |
| Strategy Configs | Admin only |
| Translation Configs | Admin only |
| Dev Tools | Both admin AND regular users |

Authorization is enforced **client-side** (nav visibility). The server enforces actual authorization via JWT role claims.

---

## 3. Project Structure

```
TalkStrategy.Dashboard/
├── server.js                          # Express server (port 3000)
├── package.json                       # Metadata + express dependency
├── public/
│   ├── index.html                     # SPA shell (nav + container + script tags)
│   ├── web.config                     # IIS URL rewrite for SPA fallback
│   ├── css/
│   │   └── admin.css                  # All styles (48 lines)
│   └── js/
│       ├── config.js                  # API_BASE_URL config (1 line)
│       ├── app.js                     # Core: state, api(), router, modal, toast (207 lines)
│       ├── components.js              # Shared UI helpers (80 lines)
│       └── pages/
│           ├── login.js               # Login + Register forms (66 lines)
│           ├── dashboard.js           # Admin dashboard with stats (39 lines)
│           ├── accounts.js            # Account CRUD + user creation (173 lines)
│           ├── users.js               # User list with approve/reject/delete (22 lines)
│           ├── mq-configs.js          # MQ config CRUD (66 lines)
│           ├── strategy.js            # Strategy config CRUD (47 lines)
│           ├── translation.js         # Translation config CRUD (52 lines)
│           └── devtools.js            # Postman download + API overview (58 lines)
```

**Total application code:** ~900 lines across 12 source files.

---

## 4. Setup & Run

```bash
cd TalkStrategy.Dashboard
npm install        # installs express (only dependency)
npm start          # starts Express on port 3000
```

**Alternatively with a custom port:**
```bash
PORT=4000 npm start
```

**Prerequisites:**
- Node.js (any recent version -- Express 4.18 supports Node 8+)
- The TalkStrategy API server running on the configured `API_BASE_URL` (default: `http://localhost:50000`)

**To change the API target:** Edit `public/js/config.js`:
```javascript
window.APP_CONFIG = { API_BASE_URL: 'http://your-api-host:port' };
```

---

## 5. Core Systems

### 5.1 app.js -- State, Router, API Client

**File:** `public/js/app.js` (207 lines)  
**Exposes:** `window.App`

#### API Surface (`window.App`)

| Property/Method | Signature | Description |
|---|---|---|
| `App.state` | accessor | Direct access to state object |
| `App.api(method, url, body)` | (string, string, object?) | Fetch wrapper returning `{ status, data, ok, error }` |
| `App.showError(msg)` | (string) | Toast notification (bottom-right, 4s auto-dismiss) |
| `App.confirm(msg, onConfirm)` | (string, function) | Modal: Confirmation + Delete/Cancel buttons. Calls `onConfirm()` on accept |
| `App.navigate(page)` | (string) | Change page: updates state, re-renders nav + page |
| `App.logout()` | () | Clears state + localStorage, navigates to login |
| `App.isLoggedIn()` | () => bool | `!!state.token` |
| `App.isAdmin()` | () => bool | `state.user && state.user.role === 'admin'` |
| `App.setAuth(token, user)` | (string, object) | Sets auth state, persists to localStorage, resets session modal flag |

#### State Object

```javascript
var state = {
    token: "eyJhbGciOi...",          // JWT string
    user: {                           // null when not logged in
        username: "admin",
        role: "admin",                // "admin" | "user" | "dev"
        accountId: 1
    },
    currentPage: "dashboard"          // string key for PageRenderers lookup
};
```

#### Navigation

`App.navigate(page)`:
1. Sets `state.currentPage = page`
2. Calls `renderNav()` to update nav links and visibility
3. Calls `renderPage()` which:
   - Shows spinner in `#page-content`
   - Calls `window.PageRenderers[page](container, state, App)`
   - If no renderer found, shows "Page not found"

Nav links are rendered with `data-page` attributes and a single delegated click handler on `#nav-links`.

**Admin nav:** Dashboard, Accounts, MQ Configs, Strategy, Translation, Users, Dev Tools  
**User nav:** Dev Tools only

#### Session Expired Modal

Triggered by any API call returning 401 with "Authentication required":
- Yellow warning header: "Session Terminated"
- Clears all auth state
- Single "Login" button that navigates to login page
- Guarded against duplicate display (`_sessionModalShown` flag)

#### Toast Notifications

`App.showError(msg)` creates a fixed-position toast (`#ts-toast`) at bottom-right. Reuses existing element. 4-second auto-dismiss with fade. Styled inline:
```css
position: fixed; bottom: 24px; right: 24px;
background: #1a1a2e; color: #fff;
padding: 12px 20px; border-radius: 6px; font-size: 13px;
z-index: 9999;
```

#### Confirmation Modal

`App.confirm(msg, onConfirm)` creates a centered modal overlay with:
- "Confirmation" header
- Message body
- Red "Delete" button (calls `onConfirm`)
- "Cancel" button (closes modal)
- Click-outside-to-dismiss
- Only one confirmation modal can be open at a time

---

### 5.2 components.js -- Shared UI Utilities

**File:** `public/js/components.js` (80 lines)  
**Attaches to:** `window.App`  
**Requires:** `window.App` to already exist

#### Available Functions

##### `App.pageHeader(title, newBtnId, newBtnLabel)`
Returns HTML string for a page header with optional "+ New" button.
```javascript
// Usage:
container.innerHTML = App.pageHeader("Accounts", "btn-new-account", "+ New Account") + "...";
// Produces:
// <div class="page-header">
//   <h2>Accounts</h2>
//   <button class="btn btn-primary" id="btn-new-account">+ New Account</button>
// </div>
```
If `newBtnId` is falsy, the button is omitted.

##### `App.emptyState(msg)`
Returns a centered gray placeholder message.
```javascript
App.emptyState("No accounts found.")
// → <p style="color:#888;padding:20px">No accounts found.</p>
```

##### `App.errorAlert(msg)`
Returns a red error alert box.
```javascript
App.errorAlert("Failed to load accounts.")
// → <div class="alert alert-error">Failed to load accounts.</div>
```

##### `App.normalize(data, keys)`
Handles PascalCase/camelCase inconsistencies from API. For each key, checks `data[camelCase]` then falls back to `data[PascalCase]`. Returns a normalized object with camelCase keys.
```javascript
var item = App.normalize(raw, ['id', 'name', 'reqPort', 'isActive']);
// item.id = raw.id || raw.Id
// item.reqPort = raw.reqPort || raw.ReqPort
```

##### `App.deleteBtn(id, apiPath, opts)`
Returns a button HTML with inline `onclick` that:
1. Shows confirmation modal
2. On confirm: sends `DELETE` to `{apiPath}/{id}`
3. Shows success toast
4. Calls `window.PageRenderers.current.reload()`

Options (all with defaults):
- `confirmMsg`: `"Delete this item?"`
- `successMsg`: `"Deleted successfully"`
- `label`: `"Del"`

##### `App.collectForm(fieldDefs)`
Reads form values from DOM and assembles a payload object.

Field definition format:
```javascript
{ id: 'html-element-id', key: 'payloadKey', type: 'string'|'int'|'float'|'checkbox' }
```

Type handling:
- `checkbox`: `el.checked` (boolean)
- `int`: `parseInt(el.value) || 0`
- `float`: `parseFloat(el.value)`, returns `null` if NaN
- `string` (default): `el.value`

##### `App.crudSave(payload, config)`
Generic create/update handler.

Config:
```javascript
{
    isEdit: true/false,         // true → PUT, false → POST
    dataId: 1,                  // used for PUT: {apiPath}/{dataId}
    apiPath: '/admin/items',    // API endpoint
    createMsg: 'Created!',      // toast on create success
    updateMsg: 'Updated!',      // toast on update success
    reloadFn: loadData          // function to call after save
}
```

##### `App.listLoad(containerId, config, renderFn)`
Standard list-loading pattern:

```javascript
App.listLoad('list-container', {
    apiPath: '/admin/users',
    dataKey: 'users',           // key in response to extract list from
    emptyMsg: 'No users found'
}, function(list) {
    return list.map(function(u) { return '<tr>...</tr>'; }).join('');
});
```

1. GETs `config.apiPath`
2. Extracts list from `r.data[config.dataKey]`
3. If empty, shows empty state
4. If has items, sets container HTML to result of `renderFn(list)`

##### `App.pageInit(loadFn, showFormFn)`
Registers the current page's public API. Enables inline onclick handlers to call reload/showForm through `window.PageRenderers.current`:
```javascript
App.pageInit(loadData, showForm);
// Sets: window.PageRenderers.current = { reload: loadData, showForm: showForm }
```

---

### 5.3 admin.css -- Style Reference

**File:** `public/css/admin.css` (48 lines)

#### Color Palette

| Usage | Hex |
|---|---|
| Brand / Nav background | `#1a1a2e` |
| Primary action (blue) | `#4361ee` |
| Success (teal) | `#2a9d8f` |
| Danger (red) | `#e63946` |
| Warning / Dashboard accent (orange) | `#f4a261` |
| Page background | `#f0f2f5` |
| Card background | `#fff` |
| Text | `#333` |

#### Component Classes

| Class | Purpose |
|---|---|
| `.navbar` | Top nav bar: dark blue, 56px height, flexbox |
| `.navbar h3` | App title: 18px |
| `.nav-links a` | Nav link: muted `#a0a8c0`, 13px |
| `.nav-links a.active` | Active nav link: white, translucent bg |
| `.user-info` | Right side: username + logout button |
| `.btn` | Base button: 8px/16px padding, 4px radius, 13px |
| `.btn-primary` | Blue button |
| `.btn-danger` | Red button |
| `.btn-success` | Teal button |
| `.btn-sm` | Small button: 4px/10px, 11px |
| `.container` | Max-width 1200px, centered, 24px top margin |
| `.page-header` | Flex row: h2 + optional button, 20px bottom margin |
| `.page-header h2` | 22px, dark navy |
| `.card` | White card, 8px radius, subtle shadow |
| `.card-header` | 16px/20px padding, bottom border, 600 weight |
| `.card-body` | 20px padding |
| `.form-group` | Label + input/select/textarea, 14px bottom margin |
| `.form-group label` | Block, 13px, 500 weight, `#555` |
| `.form-group input, select, textarea` | Full width, 8px/12px padding, `#ddd` border, 13px |
| `.form-group textarea` | 100px height, monospace, 12px |
| `.form-row` | Flex row with 12px gap; children flex:1 |
| `table` | Full width, collapsed borders, 13px |
| `table th` | `#f8f9fa` bg, 10px/12px padding, 2px bottom border |
| `table td` | 8px/12px padding, `#eee` bottom border |
| `.badge` | Inline label: 2px/8px padding, 10px radius, 11px |
| `.badge-success` | Green badge |
| `.badge-warning` | Yellow badge |
| `.badge-danger` | Red badge |
| `.alert` | 12px/16px padding, 4px radius, 13px |
| `.alert-error` | Red alert background |
| `.alert-success` | Green alert background |
| `.login-box` | 400px max-width, 100px top margin, centered |
| `.hidden` | `display: none !important` |
| `.spinner` | 16px rotating border circle |
| `.port-grid` | 3-column grid, 8px gap |
| `.modal-overlay` | Fixed fullscreen, rgba(0,0,0,0.45), flex centered, z-index: 10000 |
| `.modal-dialog` | White, 8px radius, box shadow, 360-480px width |
| `.modal-header` | 16px/20px padding, 16px font, bottom border |
| `.modal-header-warning` | Yellow warning background `#fff3cd`, `#856404` text |
| `.modal-body` | 20px padding, 14px, `#555` |
| `.modal-footer` | 12px/20px padding, top border, flex-end, 8px gap |

#### Z-Index Hierarchy
| Element | z-index |
|---|---|
| Toast notification | 9999 |
| Modal overlay | 10000 |

---

## 6. Page Reference

### 6.1 Login / Register

**File:** `public/js/pages/login.js` (66 lines)  
**Renderer:** `window.PageRenderers.login`  
**Auth required:** No

#### Login Form

Renders a centered card with:
- Username input (`#login-username`, placeholder "admin")
- Password input (`#login-password`)
- Error div (`#login-error`, hidden by default)
- Submit button (`#btn-login`)

**Flow:**
1. Collects username/password (validates non-empty)
2. `App.api('POST', '/auth/login', { username, password })`
3. On success: `App.setAuth(r.data.token, { username: r.data.username, role: r.data.role, accountId: r.data.accountId })` → navigates to dashboard
4. On failure: Shows error in `#login-error`

Handles both form `submit` and button `click` events.

#### Registration Form

Triggered by "Register" link at the bottom of the login card. Replaces login HTML in-place.

**Fields:**
- Username (`#reg-username`)
- Password (`#reg-password`, placeholder "Min 6 chars")
- Email (`#reg-email`)

**Validation:**
- Username and password required
- Password >= 6 characters

**API call:** `App.api('POST', '/auth/register', { username, password, email })`

On success: Shows "Registration successful. Awaiting admin approval." with green styling.

"Back to Login" link re-calls `window.PageRenderers.login()`.

---

### 6.2 Dashboard

**File:** `public/js/pages/dashboard.js` (39 lines)  
**Renderer:** `window.PageRenderers.dashboard`  
**Auth required:** Admin

#### Structure

1. Shows spinner while loading
2. Fires **4 parallel API calls** via `Promise.all`:
   - `GET /admin/users` → user count + pending count
   - `GET /admin/accounts` → account count
   - `GET /admin/mq-configs` → MQ config count
   - `GET /admin/strategy-configs` → strategy count (fetched but not displayed)
3. Renders **4 stat cards** in a `form-row`:
   - Total Users (blue `#4361ee`)
   - Pending Approval (red `#e63946`)
   - Accounts (teal `#2a9d8f`)
   - MQ Configs (orange `#f4a261`)
4. Renders a "Quick Links" card with navigation buttons to Users, Accounts, MQ Configs, Strategy Configs

#### API Calls
| Call | Purpose | Error Handling |
|---|---|---|
| `GET /admin/users` | Count users + pending | If any of the 4 fail, shows the first error |
| `GET /admin/accounts` | Count accounts | |
| `GET /admin/mq-configs` | Count MQ configs | |
| `GET /admin/strategy-configs` | Count strategies | (fetched, not displayed in UI) |

Does NOT call `App.pageInit()` (no reload needed).

---

### 6.3 Accounts

**File:** `public/js/pages/accounts.js` (173 lines)  
**Renderer:** `window.PageRenderers.accounts`  
**Auth required:** Admin

#### Initialization

1. Renders page header with "+ New Account" button
2. Loads three dependency configs in parallel (MQ, Strategy, Translation) via `loadConfigs()`
3. Calls `loadAccounts()` which uses `App.listLoad` to fetch and display account table
4. Attaches click handler on `#btn-new-account` → `showForm(null)`

#### Dependency Loading

`loadConfigs(cb)` fetches all three config types in parallel using a counter pattern:

```javascript
var loaded = 0;
function tryCallback() { loaded++; if (loaded === 3) cb(); }
App.api('GET', '/admin/mq-configs').then(/* store in mqConfigs */).then(tryCallback);
App.api('GET', '/admin/strategy-configs').then(/* store in strategyConfigs */).then(tryCallback);
App.api('GET', '/admin/translation-configs').then(/* store in translationConfigs */).then(tryCallback);
```

Each config item is normalized using `App.normalize(raw, keys)`.

#### Table Rendering

**Columns:** ID, Name, User (userId), MQ Config (resolved name + ip:port), Strategy (raw ID), Active (Yes/No badge), Actions (Edit + Delete)

The "Edit" button uses inline onclick: `onclick="window.PageRenderers.current.showForm(id)"`

The "Delete" button uses `App.deleteBtn(id, '/admin/accounts')`.

#### Edit Form (renderForm)

**Editing (isEdit = true):**
- Name input
- MQ Config dropdown (from loaded `mqConfigs`)
- Strategy Config dropdown (from loaded `strategyConfigs`)
- Translation Config dropdown (from loaded `translationConfigs`, with "None" option)
- Active dropdown (Yes/No)
- Update + Cancel buttons

Uses `App.collectForm` and `App.crudSave` to PUT to `/admin/accounts/{id}`.

#### Create Form (renderNewUserForm)

**Creating (isEdit = false):**
Combined user + account creation form:
- Username input
- Password input (readonly) + "Generate" button (random 12-char password)
- Account Name (auto-fills as `{username}_account`)

**Auto-fill behavior:** Account name follows username as user types. If user manually edits account name, `data-manual="1"` attribute stops auto-fill.

**Save:** `POST /admin/users/create-with-account` with payload:
```json
{ "username": "...", "password": "...", "accountName": "...", "mqConfigId": 1, "strategyConfigId": 1, "translationConfigId": 1 }
```

On success: displays the generated password in the toast (IMPORTANT: captured only at this point), reloads account list.

#### API Calls
| Call | Purpose |
|---|---|
| `GET /admin/accounts` | List all accounts |
| `GET /admin/mq-configs` | Populate MQ config dropdown |
| `GET /admin/strategy-configs` | Populate strategy config dropdown |
| `GET /admin/translation-configs` | Populate translation config dropdown |
| `PUT /admin/accounts/{id}` | Update account |
| `DELETE /admin/accounts/{id}` | Delete account |
| `POST /admin/users/create-with-account` | Create user + account together |

---

### 6.4 Users

**File:** `public/js/pages/users.js` (22 lines)  
**Renderer:** `window.PageRenderers.users`  
**Auth required:** Admin

#### Structure

Renders page header (no "New" button). Users are created via the Accounts page.

Uses `App.listLoad` with config:
```javascript
{ apiPath: '/admin/users', dataKey: 'users', emptyMsg: 'No users found.' }
```

**Table columns:** ID, Username, Role, Status (Approved/Pending badge), Email, Created date, Actions

**Status badges:**
- Approved: `<span class="badge badge-success">Approved</span>`
- Pending: `<span class="badge badge-warning">Pending</span>`

**Actions (context-dependent):**
- **Approved users:** "Del" button → inline confirm → `DELETE /admin/users/{id}`
- **Pending users:** "Approve" button (`POST /admin/users/{id}/approve`) + "Reject" button (inline confirm → `POST /admin/users/{id}/reject`)

All actions call `window.PageRenderers.current.reload()` on success.

**Page init:** `App.pageInit(loadUsers)` -- enables reload from inline onclick handlers.

#### API Calls
| Call | Purpose |
|---|---|
| `GET /admin/users` | List all users |
| `POST /admin/users/{id}/approve` | Approve pending user |
| `POST /admin/users/{id}/reject` | Reject (delete) pending user |
| `DELETE /admin/users/{id}` | Delete user + associated account |

---

### 6.5 MQ Configs

**File:** `public/js/pages/mq-configs.js` (66 lines)  
**Renderer:** `window.PageRenderers['mq-configs']` (bracket notation for hyphenated key)  
**Auth required:** Admin

#### Structure

1. Renders page header with "+ New MQ Config" button
2. Calls `loadConfigs()`
3. Attaches `showForm(null)` to the new button

**List rendering:** Uses `App.listLoad` with `dataKey: 'configs'`. Each item normalized with keys: `['id', 'name', 'ip', 'reqPort', 'subPort', 'queueSize']`.

Each config is rendered as a **card**:
- Header: Name + IP + Edit button + Delete button
- Body: Req Port, Sub Port, Queue Size displayed in form-rows

**Edit form (`renderForm`):**
- Name, IP, Req Port, Sub Port, Queue Size inputs
- Uses `App.collectForm` with `type: 'int'` for port fields
- Uses `App.crudSave` for POST (create) or PUT (edit)

**Defaults for new configs:**
```javascript
{ id: 0, name: 'New MQ', ip: 'localhost', reqPort: 5580, subPort: 5570, queueSize: 1000 }
```

**Page init:** `App.pageInit(loadConfigs, showForm)`.

#### API Calls
| Call | Purpose |
|---|---|
| `GET /admin/mq-configs` | List all MQ configs |
| `POST /admin/mq-configs` | Create new MQ config |
| `PUT /admin/mq-configs/{id}` | Update existing MQ config |
| `DELETE /admin/mq-configs/{id}` | Delete MQ config |

---

### 6.6 Strategy Configs

**File:** `public/js/pages/strategy.js` (47 lines)  
**Renderer:** `window.PageRenderers.strategy`  
**Auth required:** Admin

#### Structure

1. Renders page header with "+ New Strategy" button
2. Calls `loadConfigs()`
3. Attaches `showForm` to the new button

**List rendering:** Uses `App.listLoad` with `dataKey: 'configs'`. Normalized keys: `['id', 'name', 'isRatioEnabled', 'lotMultiplier', 'maxOrderQty', 'splitOrdersEnabled', 'rejectIfExceedsCap', 'lotRoundingMode', 'priceMultiplier']`.

Each config is rendered as a **card**:
- Header: Name + Ratio ON/OFF badge (green/yellow)
- Body (form-row pairs): Multiplier, Max Order Qty, Rounding mode, Split Orders (Yes/No), Reject If Cap (Yes/No), Price Multiplier

**Note:** No Edit button in the list. Only Delete is available. The showForm only supports CREATE mode.

**Create form:**
- Name (default: "New Strategy")
- Lot Multiplier (number, step 0.1, default: 1)
- Max Order Qty (number, default: 5000)
- Rounding Mode (select: RoundUp / RoundNearest)
- Price Multiplier (number, step 0.01)
- Checkboxes: Ratio Enabled, Split Orders, Reject If Exceeds Cap

Uses `App.collectForm` with types: `checkbox` for booleans, `float` for decimal fields, `int` for quantity.

**Page init:** `App.pageInit(loadConfigs, showForm)`.

#### API Calls
| Call | Purpose |
|---|---|
| `GET /admin/strategy-configs` | List all strategy configs |
| `POST /admin/strategy-configs` | Create new strategy config |
| `DELETE /admin/strategy-configs/{id}` | Delete strategy config |

---

### 6.7 Translation Configs

**File:** `public/js/pages/translation.js` (52 lines)  
**Renderer:** `window.PageRenderers.translation`  
**Auth required:** Admin

#### Structure

1. Renders page header with "+ New Translation" button
2. Calls `loadConfigs()`
3. Attaches `showForm` to the new button

**List rendering:** Uses `App.listLoad` with `dataKey: 'configs'`. Normalized keys: `['id', 'name', 'vendorType', 'defaultExchange', 'defaultProductType', 'defaultOrderType', 'fieldMappings']`.

Each config is rendered as a **card**:
- Header: Name + Vendor Type badge (green)
- Body: Default Exchange, Default Product, Default Order Type
- Field Mappings count displayed as `Object.keys(item.fieldMappings).length`

**Note:** No Edit button. Only Delete. showForm only supports CREATE mode.

**Create form:**
- Name (default: "XTS Translation")
- Vendor Type (default: "XTS")
- Default Exchange, Default Product, Default Order Type, Default Validity
- Field Mappings (textarea, JSON format)
- Static Defaults (textarea, JSON format)

JSON textarea values are parsed with try/catch:
```javascript
try { payload.fieldMappings = JSON.parse(fieldMappingsEl.value); } catch(e) { payload.fieldMappings = {}; }
```

Payload assembly: First uses `App.collectForm` for basic text fields, then manually adds parsed JSON dictionaries.

**Page init:** `App.pageInit(loadConfigs, showForm)`.

#### API Calls
| Call | Purpose |
|---|---|
| `GET /admin/translation-configs` | List all translation configs |
| `POST /admin/translation-configs` | Create new translation config |
| `DELETE /admin/translation-configs/{id}` | Delete translation config |

---

### 6.8 Dev Tools

**File:** `public/js/pages/devtools.js` (58 lines)  
**Renderer:** `window.PageRenderers.devtools`  
**Auth required:** Bearer token (available to both admin and regular users)

#### Structure

Renders two cards:

**Card 1 -- Postman Collection:**
- Description text explaining what the collection contains
- "View Postman Collection" button: Opens `{API_BASE_URL}/api/docs/postman` in a new tab
- "Download Postman Collection" button:
  ```javascript
  fetch(API + '/docs/postman')
      .then(r => r.blob())
      .then(blob => {
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'TalkStrategyAPI.postman_collection.json';
          a.click();
          URL.revokeObjectURL(url);
      });
  ```
- Status paragraph (`#dl-status`) for download progress

**Card 2 -- API Overview:**
- Static HTML table listing all API categories and endpoints
- Categories: Auth (4), Enums (2), Health (1), Messaging (3), Subscriptions (3), XTS Orders (3), Admin Users (4), Admin Accounts (4), Admin MQ Config (4), Admin Strategy (4), Admin Translation (4)
- JWT info: 12-hour expiry, immediate blacklist on logout, old token invalidated on refresh

Does NOT call `App.pageInit()`.

---

## 7. Patterns & Conventions

### 7.1 Page File Template

Every page file follows this exact structure:

```javascript
window.PageRenderers = window.PageRenderers || {};
window.PageRenderers.pageName = function(container, state, App) {
    // 1. Set initial HTML (spinner or skeleton)
    container.innerHTML = App.pageHeader("Title", "btn-id", "+ New") + '<div id="list"></div>';

    // 2. Define load/config functions
    function loadData() { /* fetch + render */ }
    function showForm(editId) { /* show create/edit form */ }

    // 3. Trigger initial load
    loadData();

    // 4. Register for external access (enables inline onclick reloads)
    App.pageInit(loadData, showForm);

    // 5. Attach event handlers
    document.getElementById('btn-id').addEventListener('click', function() {
        showForm(null);
    });
};
```

### 7.2 API Call Patterns

**Pattern 1: Simple GET with inline handling**
```javascript
App.api('GET', '/admin/users').then(function(r) {
    if (!r.ok) { App.showError(r.error); return; }
    var users = r.data.users;
    // render users...
});
```

**Pattern 2: CRUD save**
```javascript
App.crudSave(payload, {
    isEdit: !!editId,
    dataId: editId,
    apiPath: '/admin/mq-configs',
    createMsg: 'MQ config created',
    updateMsg: 'MQ config updated',
    reloadFn: loadData
});
```

**Pattern 3: List loading**
```javascript
App.listLoad('list-container', {
    apiPath: '/admin/items',
    dataKey: 'items',
    emptyMsg: 'No items found.'
}, function(items) {
    return items.map(function(item) {
        return '<tr><td>' + item.name + '</td>' + App.deleteBtn(item.id, '/admin/items') + '</tr>';
    }).join('');
});
```

**Pattern 4: Parallel dependency loading**
```javascript
var mqConfigs = [], strategyConfigs = [];
var loaded = 0;
function tryCallback() { loaded++; if (loaded === 2) afterLoad(); }
App.api('GET', '/admin/mq-configs').then(function(r) { mqConfigs = r.data.configs; tryCallback(); });
App.api('GET', '/admin/strategy-configs').then(function(r) { strategyConfigs = r.data.configs; tryCallback(); });
```

### 7.3 Form Handling

**Collecting form values:**
```javascript
var payload = App.collectForm([
    { id: 'input-name',    key: 'name',       type: 'string' },
    { id: 'input-port',    key: 'reqPort',    type: 'int' },
    { id: 'input-mult',    key: 'multiplier', type: 'float' },
    { id: 'check-active',  key: 'isActive',   type: 'checkbox' }
]);
```

**Building form HTML:**
```html
<div class="form-group">
    <label>Name</label>
    <input type="text" id="input-name" value="default">
</div>
<div class="form-row">
    <div class="form-group">
        <label>Req Port</label>
        <input type="number" id="input-port" value="5580">
    </div>
    <div class="form-group">
        <label>Ratio Enabled</label>
        <input type="checkbox" id="check-active">
    </div>
</div>
<div class="modal-footer">
    <button class="btn btn-primary" id="btn-save">Save</button>
    <button class="btn" id="btn-cancel">Cancel</button>
</div>
```

### 7.4 Error Handling

- **API errors:** Check `r.ok` -- if false, show `App.showError(r.error)`
- **Network errors:** Caught by the `api()` catch handler, returns `{ ok: false, error: 'Unable to connect to API...' }`
- **401/Session:** Handled globally in `api()` -- triggers session-expired modal, suppresses error to prevent cascade
- **Form validation:** Manual checks before submit, errors shown via `App.showError()`
- **Login-specific errors:** Inline `alert-error` div within the login card

### 7.5 Page Init Pattern

`App.pageInit(loadFn, showFormFn)` stores references to the page's load and form functions on `window.PageRenderers.current`. This enables inline `onclick` handlers in dynamically generated HTML to call `window.PageRenderers.current.reload()` and `window.PageRenderers.current.showForm(id)` without needing global variables.

### 7.6 Navigation Convention

All nav links use `data-page` attributes. The nav click handler in `app.js` is a single delegated listener:
```html
<a href="#" data-page="accounts">Accounts</a>
```

### 7.7 HTML Skeleton

```html
<div id="app" class="container no-nav">
    <div id="page-content">
        <!-- Page renderer replaces this entirely -->
    </div>
</div>
```

The `no-nav` class adds extra top margin when the nav is hidden (login page). After login, `renderNav()` removes `no-nav`.

---

## 8. How to Extend

### 8.1 Adding a New Page

1. **Create the page file** at `public/js/pages/yourpage.js`:

    ```javascript
    window.PageRenderers = window.PageRenderers || {};
    window.PageRenderers.yourpage = function(container, state, App) {
        container.innerHTML = App.pageHeader("Your Page Title", "btn-new", "+ New") +
            '<div class="card"><div class="card-body" id="list-container"><div class="spinner"></div></div></div>';

        function loadData() {
            App.listLoad('list-container', {
                apiPath: '/admin/your-resource',
                dataKey: 'items',
                emptyMsg: 'No items found.'
            }, function(items) {
                return '<table>' +
                    '<tr><th>ID</th><th>Name</th><th>Actions</th></tr>' +
                    items.map(function(item) {
                        return '<tr><td>' + item.id + '</td><td>' + item.name + '</td><td>' +
                            App.deleteBtn(item.id, '/admin/your-resource') +
                            '</td></tr>';
                    }).join('') +
                    '</table>';
            });
        }

        function showForm(editId) {
            // render form, handle save with App.crudSave or App.api
        }

        loadData();
        App.pageInit(loadData, showForm);
        document.getElementById('btn-new').addEventListener('click', function() { showForm(null); });
    };
    ```

2. **Add the script tag** to `public/index.html` (before the closing `</body>`, after other page scripts):

    ```html
    <script src="js/pages/yourpage.js"></script>
    ```

3. **Add nav link** in `app.js`, inside `renderNav()`, in the admin section:

    ```javascript
    nav.innerHTML += '<a href="#" data-page="yourpage">Your Page</a>';
    ```

### 8.2 Adding Edit Functionality to a Page

If a page currently only supports Create (like Strategy and Translation configs), add Edit by:

1. **Add an Edit button** to the list rendering:

    ```javascript
    '<button class="btn btn-sm" onclick="window.PageRenderers.current.showForm(' + item.id + ')">Edit</button>'
    ```

2. **Modify `showForm(editId)`** to handle edit mode:

    ```javascript
    function showForm(editId) {
        if (editId) {
            // Fetch the item, then call renderForm with isEdit = true
            App.api('GET', '/admin/items').then(function(r) {
                var item = r.data.items.find(function(i) { return i.id === editId; });
                renderForm(item, true);
            });
        } else {
            renderForm(defaults, false);
        }
    }
    ```

3. **In `renderForm(data, isEdit)`**, use `App.crudSave` with `isEdit`:

    ```javascript
    document.getElementById('btn-save').addEventListener('click', function() {
        var payload = App.collectForm(fieldDefs);
        App.crudSave(payload, {
            isEdit: isEdit,
            dataId: data.id,
            apiPath: '/admin/items',
            createMsg: 'Created!',
            updateMsg: 'Updated!',
            reloadFn: loadData
        });
    });
    ```

### 8.3 Changing the API Base URL

Edit `public/js/config.js`:

```javascript
window.APP_CONFIG = { API_BASE_URL: 'http://new-api-host:50000' };
```

This is the only file that contains the API URL. All other code references `window.APP_CONFIG.API_BASE_URL` or the derived `API` variable.

### 8.4 Adding a Form with JSON Fields

For fields that contain JSON data (like TranslationConfig's FieldMappings):

```javascript
// In renderForm:
// 1. Create textarea with JSON.stringify'd default
container.innerHTML += '<div class="form-group">' +
    '<label>Field Mappings</label>' +
    '<textarea id="input-mappings">' + JSON.stringify(data.fieldMappings || {}, null, 2) + '</textarea>' +
    '</div>';

// 2. On save, collect basic fields first, then add parsed JSON
document.getElementById('btn-save').addEventListener('click', function() {
    var payload = App.collectForm([
        { id: 'input-name', key: 'name', type: 'string' }
        // ... other scalar fields
    ]);

    try {
        payload.fieldMappings = JSON.parse(document.getElementById('input-mappings').value);
    } catch(e) {
        payload.fieldMappings = {};
    }

    App.crudSave(payload, { ... });
});
```

### 8.5 Adding a New Toast Type

The `App.showError(msg)` function creates toasts. To add a success variant:

```javascript
App.showSuccess = function(msg) {
    var toast = document.getElementById('ts-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ts-toast';
        document.body.appendChild(toast);
    }
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#2a9d8f;color:#fff;padding:12px 20px;border-radius:6px;font-size:13px;z-index:9999;transition:opacity 0.3s';
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(function() { toast.style.opacity = '0'; }, 4000);
};
```

Add this to `components.js` or `app.js`.

---

## 9. AI Agent Instructions

### 9.1 How to Use This Guide

This document is a complete reference for modifying and extending the TalkStrategy Dashboard. When asked to make changes:

1. **Identify which file(s)** need changes from the [Page Reference](#6-page-reference) or [Core Systems](#5-core-systems) sections
2. **Follow the pattern** from the nearest existing page that does something similar
3. **Use the utility functions** from [components.js](#52-componentsjs----shared-ui-utilities) rather than writing low-level DOM manipulation
4. **Follow the API client contract**: always check `r.ok` before using `r.data`

### 9.2 Target-Specific Guidance

#### DeepSeek v4 Pro / DeepSeek V4 Flash

**Best for:** Adding new pages, creating new CRUD features, modifying existing forms.

**Recommended approach:**
- When adding a page, use the [Adding a New Page](#81-adding-a-new-page) template
- For form work, use `App.collectForm` and `App.crudSave` -- DeepSeek handles the field definition arrays well
- For API calls, follow the envelope pattern: `App.api(...).then(r => { if (!r.ok) ...; })`

**Example prompt:**
```
Using the TalkStrategy Dashboard guide, add a new page at /js/pages/positions.js
that displays a table of net positions fetched from GET /api/positions/vendor.
Show columns: Symbol, Quantity, Average Price. Include an "Exit All" button
that calls POST /api/positions/squareoff?isDay=true.
Follow the patterns from the existing accounts.js page.
```

#### Claude

**Best for:** Refactoring, explaining code flow, adding validation logic.

**Recommended approach:**
- Claude excels at understanding the existing code patterns and replicating them
- For complex forms with interdependent fields, Claude handles the logic well
- When something needs to work differently for admin vs regular users, Claude's conditional logic generation is strong

**Example prompt:**
```
In the TalkStrategy Dashboard, the strategy config page currently only supports
creating new configs. Add edit support following these requirements:
- Add an "Edit" button next to the "Del" button in the config card
- Clicking "Edit" should load the existing config values into the form
- The form should use PUT /api/admin/strategy-configs/{id} for updates
- All checkboxes and dropdowns must reflect current values
Reference the accounts.js page for the edit pattern.
```

#### Gemini

**Best for:** Adding styling, layout changes, CSS modifications, generating complete new features.

**Recommended approach:**
- Gemini handles large context well -- provide the full document
- For CSS changes, reference the class table in section 5.3
- For new features, use Gemini to generate the complete page file

**Example prompt:**
```
Using the TalkStrategy Dashboard guide, add a dark mode toggle to the navbar
that persists to localStorage. Requirements:
- Add a moon/sun toggle button in the .user-info area of the navbar
- Apply a dark theme using CSS custom properties or class toggling
- Store preference in localStorage key 'ts_darkmode'
- Restore preference on page load
- All existing .card, .modal-dialog, table, and form elements must adapt
```

#### General Guardrails for All AI Agents

1. **Never modify `config.js`** unless explicitly asked to change the API URL
2. **Never change the script load order** in `index.html` -- dependencies are strict
3. **Always use `App.api()`** for API calls -- never use raw `fetch()`
4. **Always check `r.ok`** before accessing `r.data` in API responses
5. **Use existing CSS classes** from the [class table](#53-admincss----style-reference) -- don't add inline styles except where the existing codebase does (toasts, some layout)
6. **Follow the IIFE pattern** -- new page files must attach to `window.PageRenderers`
7. **Keep `App.pageInit(loadFn, showFormFn)`** calls in pages that have inline onclick handlers calling `window.PageRenderers.current.reload()`
8. **Normalize API responses** using `App.normalize(data, keys)` when the server might return PascalCase or camelCase
9. **Don't add external dependencies** -- the dashboard is intentionally zero-dependency on the client side
10. **Test the login flow** after any changes to `app.js` -- the auth state management is centralized there
