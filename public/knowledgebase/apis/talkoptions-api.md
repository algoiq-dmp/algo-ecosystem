# TalkOptions API Documentation

**Base URL:** `hhttps://webapi.talkoptions.in`

**Authentication:** All endpoints require the `x-bypass` header for authentication.

---

## Table of Contents

- [Login](#login)
  - [Login (General)](#report-1) (1 endpoints)
  - [Send EmailOTP](#report-2) (1 endpoints)
  - [VerifyEmailOTP](#report-3) (1 endpoints)
  - [SaveVerifiedMobile](#report-4) (1 endpoints)
  - [VerifyMobileOTP](#report-5) (1 endpoints)
  - [SendForgotPassword](#report-6) (1 endpoints)
  - [VerifyForgotPasswordOTP](#report-7) (1 endpoints)
  - [SigninWithGoogle](#report-8) (1 endpoints)
  - [LoginfromLoginID](#report-9) (1 endpoints)
  - [CreateUser](#report-10) (1 endpoints)
  - [TalkDeltaEndLogin](#report-11) (1 endpoints)
  - [UpdateMobNoGoogleLogin](#report-12) (1 endpoints)
  - [ForgetChangePassword](#report-13) (1 endpoints)
  - [SendEmailMobileOTPBroker](#report-14) (1 endpoints)
  - [SendEmailMobileOTPOKBroker](#report-15) (1 endpoints)
  - [VerifyEmailMobileOTP](#report-16) (1 endpoints)
  - [CreatePasswordNewBroker](#report-17) (1 endpoints)
- [Market](#market)
  - [1. Adv/Dec Distribution](#report-18) (8 endpoints)
  - [2. Sectorial Analysis](#report-19) (3 endpoints)
  - [3. Adv/Dec Heatmap](#report-20) (4 endpoints)
  - [4. Nifty Contributors](#report-21) (1 endpoints)
  - [5. Futures Buildup Trend](#report-22) (1 endpoints)
  - [6. Gift Nifty](#report-23) (1 endpoints)
  - [7. Market Active Days](#report-24) (1 endpoints)
  - [8. Mobile](#report-25) (3 endpoints)
  - [1.Gainers-Loosers](#report-26) (1 endpoints)
  - [2.Out-And-Under-Performers](#report-27) (1 endpoints)
  - [3.Only Buyer And Seller](#report-28) (1 endpoints)
  - [4.Highs-and-lows](#report-29) (1 endpoints)
  - [5.five-days-up-and-down](#report-30) (1 endpoints)
  - [6.FII-DII](#report-31) (2 endpoints)
  - [1.Most Active Value & Volume](#report-32) (1 endpoints)
  - [2.Bulk & Block Deals](#report-33) (1 endpoints)
  - [3.Highest & Lowest Delivery](#report-34) (1 endpoints)
  - [4.VDP Report](#report-35) (1 endpoints)
  - [5.Open High & Open Low](#report-36) (1 endpoints)
  - [6.Result Calendar](#report-37) (1 endpoints)
  - [1.Future Stocks](#report-38) (1 endpoints)
  - [2.Put Call Ratio](#report-39) (1 endpoints)
  - [3.Most Active Calls/Puts](#report-40) (1 endpoints)
  - [4.Ban List (MWPL)](#report-41) (1 endpoints)
  - [5.Future Open Interest](#report-42) (1 endpoints)
- [Analysis](#analysis)
  - [1.IV Screener](#report-43) (1 endpoints)
  - [2. IV Skew Analysis](#report-44) (1 endpoints)
  - [3.IV Historical Analysis](#report-45) (2 endpoints)
  - [4.IV Rank & Percentile](#report-46) (2 endpoints)
  - [5.IV Trends](#report-47) (2 endpoints)
  - [6.Volga IV Table](#report-48) (1 endpoints)
  - [7.Volga IV Strike](#report-49) (1 endpoints)
  - [8.IV Time Chart](#report-50) (1 endpoints)
  - [9.OHLC IV Data](#report-51) (1 endpoints)
  - [1. Intraday Buildup](#report-52) (3 endpoints)
  - [2.Intraday IV](#report-53) (6 endpoints)
  - [3.Straddle Chart](#report-54) (4 endpoints)
  - [4.Strangle Chart](#report-55) (2 endpoints)
  - [5.Multi Straddle Charts](#report-56) (4 endpoints)
  - [6.OI Intervals](#report-57) (2 endpoints)
  - [7.Cash Future Pair Trading](#report-58) (1 endpoints)
  - [8.Future Pair Trading](#report-59) (1 endpoints)
  - [9.Historical Data](#report-60) (2 endpoints)
  - [1.Options Chain](#report-61) (1 endpoints)
  - [2.Open Interest](#report-62) (3 endpoints)
  - [3.Change In OI](#report-63) (2 endpoints)
  - [4.put-call-ratio](#report-64) (3 endpoints)
  - [5.MaxPain](#report-65) (1 endpoints)
  - [6.Option Scans](#report-66) (1 endpoints)
  - [7.Multistrike-oi](#report-67) (8 endpoints)
  - [8.Options-Premium-Analysis](#report-68) (1 endpoints)
  - [9.Liquidity Finder](#report-69) (1 endpoints)
  - [10.Premium Decay](#report-70) (1 endpoints)
  - [11.Options Dashboard](#report-71) (3 endpoints)
  - [1.Futures Heatmap](#report-72) (2 endpoints)
  - [2.Straddle Chain](#report-73) (1 endpoints)
  - [3.Butterfly](#report-74) (1 endpoints)
  - [4.Calendar Spread Chain](#report-75) (1 endpoints)
  - [5.Arbitrage Screener](#report-76) (1 endpoints)
  - [6. Ratio Analysis](#report-77) (1 endpoints)
  - [7.Strategy Charts](#report-78) (1 endpoints)
  - [1. Strategy Builder](#report-79) (2 endpoints)
  - [2. Kuber Alpha](#report-80) (2 endpoints)
  - [SaveMyStrategy](#report-81) (1 endpoints)
  - [GetFuturesAllExpires](#report-82) (1 endpoints)
  - [GetFutureFeeds](#report-83) (1 endpoints)
  - [GetPayOffTable](#report-84) (1 endpoints)
  - [FastStrategies](#report-85) (1 endpoints)
  - [GetSelectedMyStrategy](#report-86) (1 endpoints)
  - [GetStandardDeviation](#report-87) (1 endpoints)
  - [CalculatePayOffChart](#report-88) (1 endpoints)
  - [GetCalculatedGreeks](#report-89) (1 endpoints)
  - [GetCalculatedProfitLoss](#report-90) (1 endpoints)
  - [GenerateMarginCalculatorToken](#report-91) (1 endpoints)
  - [GetMyStrategyList](#report-92) (1 endpoints)
  - [DynamicStrategyBldr](#report-93) (1 endpoints)
  - [LTPusingToken](#report-94) (1 endpoints)
  - [DeletelegsFromStrategy](#report-95) (1 endpoints)
  - [GetStrategyPayOff](#report-96) (1 endpoints)
  - [CalculateMargin](#report-97) (1 endpoints)
  - [MTM](#report-98) (1 endpoints)
  - [RevertExit](#report-99) (1 endpoints)
  - [CalculatePayOff](#report-100) (1 endpoints)
  - [CalculateGreeks](#report-101) (1 endpoints)
  - [DeleteOrder](#report-102) (1 endpoints)
  - [GetUpcomingtrades](#report-103) (1 endpoints)
  - [GetOrderbook](#report-104) (1 endpoints)
  - [DeleteAllTrades](#report-105) (1 endpoints)
  - [UpdateOrder](#report-106) (1 endpoints)
  - [AddOptionsOrder](#report-107) (1 endpoints)
  - [GetOptionsStrike](#report-108) (1 endpoints)
  - [GetFastStrategy](#report-109) (1 endpoints)
  - [SqureoffPosition](#report-110) (1 endpoints)
  - [GetSpotRate](#report-111) (1 endpoints)
  - [GetFuturesContracts](#report-112) (1 endpoints)
  - [Expiries](#report-113) (1 endpoints)
- [Strategies](#strategies)
  - [1. Calls Puts](#report-114) (1 endpoints)
  - [2. Open High](#report-115) (1 endpoints)
  - [3. Open Low](#report-116) (1 endpoints)
  - [4. Nifty Contributors V2](#report-117) (1 endpoints)
  - [GetExpiryMotnths](#report-118) (1 endpoints)
  - [1. Bull Call Debit Spread](#report-119) (1 endpoints)
  - [2. Bull Put Credit Spread](#report-120) (1 endpoints)
  - [3. Bear Call Credit Spread](#report-121) (1 endpoints)
  - [4. Bear Put Debit Spread](#report-122) (1 endpoints)
  - [5. Ratio Spread](#report-123) (1 endpoints)
  - [1. Short Straddle](#report-124) (1 endpoints)
  - [2. Long Straddle](#report-125) (1 endpoints)
  - [3. Short Strangle](#report-126) (1 endpoints)
  - [1. Short Call Butterfly](#report-127) (1 endpoints)
  - [2. Long Call Butterfly](#report-128) (1 endpoints)
  - [3. Short Put Butterfly](#report-129) (1 endpoints)
  - [4. Long Put Butterfly](#report-130) (1 endpoints)
- [Search Result (Underlying)](#search-result-underlying)
  - [UnderlyingSideBar](#report-131) (1 endpoints)
  - [UnderlyingMainChart](#report-132) (1 endpoints)
  - [UnderlyingPricetablebySearch](#report-133) (1 endpoints)
  - [UnderlyingPPMovingAverage](#report-134) (1 endpoints)
  - [UnderlyingDayHighLowRange](#report-135) (1 endpoints)
  - [UnderlyingFutureContract](#report-136) (1 endpoints)
  - [FutureSideBar](#report-137) (1 endpoints)
  - [FutureMainChart](#report-138) (1 endpoints)
  - [FutureOITrendChart](#report-139) (1 endpoints)
  - [FutureChangeOIChart](#report-140) (2 endpoints)
  - [FutureIntradayBuildUp](#report-141) (1 endpoints)
  - [FuturePriceTablebySearch](#report-142) (1 endpoints)
  - [FutureContract](#report-143) (1 endpoints)
  - [FutureAndUnderlyingGaugesData](#report-144) (1 endpoints)
  - [OptionsMainChart](#report-145) (1 endpoints)
  - [OptionsIntradayBuildUp](#report-146) (1 endpoints)
  - [OptionsMostActiveCalls](#report-147) (1 endpoints)
  - [OptionsOpenInterestChart](#report-148) (1 endpoints)
  - [OptionsChangeInOIChart](#report-149) (1 endpoints)
  - [OptionsOIandChInOI](#report-150) (1 endpoints)
  - [OptionsCLiveMaxPainChart](#report-151) (1 endpoints)
  - [OptionsPriceVsPCRChart](#report-152) (1 endpoints)
  - [IndicesChartData](#report-153) (1 endpoints)
  - [HomeSearchResult](#report-154) (1 endpoints)
  - [SearchStocksByName](#report-155) (1 endpoints)
  - [ExpiryValidate](#report-156) (1 endpoints)
  - [MarketMoodIndex](#report-157) (1 endpoints)
  - [OptionsSideBar](#report-158) (1 endpoints)
- [Profile](#profile)
  - [ChangePasswordProfile](#report-159) (1 endpoints)
  - [BillingDetails](#report-160) (1 endpoints)
  - [SaveUserBillingDetails](#report-161) (1 endpoints)
  - [BillingHistory](#report-162) (1 endpoints)
  - [CheckProfileDetailsForInvoicing](#report-163) (1 endpoints)
  - [checkLoginSession](#report-164) (1 endpoints)
  - [ForceUpdateLoginSession](#report-165) (1 endpoints)
  - [getMobileUpdateVersion](#report-166) (1 endpoints)
  - [LogoutUser](#report-167) (1 endpoints)
  - [saveProfileDetailsForInvoicing](#report-168) (1 endpoints)
  - [setMobileUpdateVersion](#report-169) (1 endpoints)
  - [TerminateSession](#report-170) (1 endpoints)
  - [UnlinkBrokerAccount](#report-171) (1 endpoints)
  - [updateLoginSession](#report-172) (1 endpoints)
  - [UpdateProfile](#report-173) (1 endpoints)
  - [Logout](#report-174) (1 endpoints)
  - [GetProfileDetails](#report-175) (1 endpoints)
  - [ChangePassword](#report-176) (1 endpoints)
  - [1. Aalap Payment Gateway](#report-177) (7 endpoints)
  - [2. Payment Gateway](#report-178) (3 endpoints)
  - [3. Payment Gateway V2](#report-179) (3 endpoints)
  - [1. Coupon Code](#report-180) (2 endpoints)
  - [1. License](#report-181) (2 endpoints)
  - [1. Plan Access](#report-182) (2 endpoints)
- [Notification](#notification)
  - [GetNotificationList](#report-183) (1 endpoints)
  - [SaveUserNotification](#report-184) (1 endpoints)
  - [GetUserNotificationListRead](#report-185) (1 endpoints)
  - [CreateTicketsTalkOptions](#report-186) (1 endpoints)
  - [GetUrlName](#report-187) (1 endpoints)
  - [GetAlertOI](#report-188) (1 endpoints)
  - [GetAlertsData](#report-189) (1 endpoints)
- [Feeds](#feeds)
  - [GetSpotFuture](#report-190) (1 endpoints)
  - [GetHeaderFeeds](#report-191) (1 endpoints)
  - [GetMaxFeedTime](#report-192) (1 endpoints)
  - [GetLastFeedTime](#report-193) (1 endpoints)
  - [GetEnviroment](#report-194) (1 endpoints)
  - [GetIPandUserAgent](#report-195) (1 endpoints)
- [NSE Contracts](#nse-contracts)
  - [GetScripName](#report-196) (1 endpoints)
  - [GetExpiries](#report-197) (1 endpoints)
  - [GetExpiriesMonthly](#report-198) (1 endpoints)
  - [GetFOStocks](#report-199) (1 endpoints)
  - [StockListByIndices](#report-200) (1 endpoints)
  - [GetEqFODataFromToken](#report-201) (1 endpoints)
  - [GetScripExpiryStrikeData](#report-202) (1 endpoints)
  - [GetFuturesExpiry](#report-203) (1 endpoints)
  - [SearchResults](#report-204) (1 endpoints)
  - [GetIndicesName](#report-205) (1 endpoints)
  - [GetToken](#report-206) (1 endpoints)
  - [GetScripNameGroupWise](#report-207) (1 endpoints)
  - [GetFutOptExpiries](#report-208) (1 endpoints)
  - [GetScripNames](#report-209) (1 endpoints)
  - [GetExpiriesFuture](#report-210) (1 endpoints)
  - [GetExpiryStrike](#report-211) (1 endpoints)
  - [GetFoIndexList](#report-212) (1 endpoints)
  - [GetLotSize](#report-213) (1 endpoints)
  - [GetExpiryStrikeData](#report-214) (1 endpoints)
  - [GetTokenWithLotSize](#report-215) (1 endpoints)
  - [FlushCache](#report-216) (1 endpoints)
  - [StartBackgroundService](#report-217) (1 endpoints)
  - [StopBackgroundService](#report-218) (1 endpoints)
  - [ChecsymbolinFnO](#report-219) (1 endpoints)
  - [GetIVScreenerYesterdayResponsesDown](#report-220) (1 endpoints)
- [Portfolio](#portfolio)
  - [GetEditPortfolioSpecific](#report-221) (1 endpoints)
  - [DeletePortfolioAllPosition](#report-222) (1 endpoints)
  - [CloseOneLegPositionEdit](#report-223) (1 endpoints)
  - [CheckStrategyEON](#report-224) (1 endpoints)
  - [SaveMyStrategyPortfolio](#report-225) (1 endpoints)
  - [UpdateMyStrategyPortfolio](#report-226) (1 endpoints)
  - [RefreshPriceCall](#report-227) (1 endpoints)
  - [PracPortfolioAll](#report-228) (1 endpoints)
  - [GetOneLegsPosition](#report-229) (1 endpoints)
  - [portfolioCheckCountandActive](#report-230) (1 endpoints)
  - [SaveStrategiesInPortfolio](#report-231) (1 endpoints)
  - [CheckStrategyExists](#report-232) (1 endpoints)
  - [DeleteStrategyOrLeg](#report-233) (1 endpoints)
  - [GetAllLogsData](#report-234) (1 endpoints)
  - [ModifyLogData](#report-235) (1 endpoints)
  - [GetExitAllLegPositions](#report-236) (1 endpoints)
  - [SaveExitAllLegPositions](#report-237) (1 endpoints)
  - [GetPortfolioData](#report-238) (1 endpoints)
  - [GetAddLegsData](#report-239) (1 endpoints)
  - [GetOneLegDetails](#report-240) (1 endpoints)
  - [RenameStrategy](#report-241) (1 endpoints)
  - [GetAddExitDataForLog](#report-242) (1 endpoints)
  - [GetPortfolioOpenCloseCount](#report-243) (1 endpoints)
  - [ResetPrice](#report-244) (1 endpoints)
  - [AddNewLegInStrategy](#report-245) (1 endpoints)
  - [ModifyStrategy](#report-246) (1 endpoints)
  - [SaveAddExitLogData](#report-247) (1 endpoints)
  - [1. Trading Calls](#report-248) (1 endpoints)
  - [2. Favourite Strategy](#report-249) (3 endpoints)
  - [3. Reports Data](#report-250) (1 endpoints)
  - [4. Paper Trade](#report-251) (2 endpoints)
  - [5. Portfolio Actions](#report-252) (2 endpoints)
- [Market Mood Index (MMI)](#market-mood-index-mmi)
  - [GetOptionScans](#report-253) (1 endpoints)
  - [ResultCalender](#report-254) (1 endpoints)
  - [FIIDIIActivity](#report-255) (1 endpoints)
  - [Getstraddlechain](#report-256) (1 endpoints)
  - [GetSpotFuture](#report-257) (1 endpoints)
  - [OptionChain](#report-258) (1 endpoints)
  - [GetOpenInterest](#report-259) (1 endpoints)
  - [SectorialChartAnalysis](#report-260) (1 endpoints)
  - [UnderlyingSideBar](#report-261) (1 endpoints)
  - [UnderlyingMainChart](#report-262) (1 endpoints)
  - [IndicesChartData](#report-263) (1 endpoints)
  - [GetHeaderFeeds](#report-264) (1 endpoints)
  - [MarketMoodIndex](#report-265) (1 endpoints)
- [Summary](#summary)
  - [GetSummaryYesterdayClosing](#report-266) (1 endpoints)
  - [GetSummaryYesterdayIVRank](#report-267) (1 endpoints)
  - [GetSummaryTodaysOpening](#report-268) (1 endpoints)
- [Watchlist](#watchlist)
  - [SaveWatchlistSymbol](#report-269) (1 endpoints)
  - [RemoveWatchlistSymbol](#report-270) (1 endpoints)
  - [GetWatchlistNames](#report-271) (1 endpoints)
  - [SaveWatchListNames](#report-272) (1 endpoints)
  - [DeleteWatchlistNames](#report-273) (1 endpoints)
  - [Updatewatchlistsymbol](#report-274) (1 endpoints)
  - [GetwatchlistSymbol](#report-275) (1 endpoints)
  - [CheckSymbolInWatchlist](#report-276) (1 endpoints)
- [AI Analysis](#ai-analysis)
  - [1. Analyze Image](#report-277) (1 endpoints)
  - [2. OpenAI History](#report-278) (1 endpoints)
  - [3. Token & Cleanup](#report-279) (2 endpoints)

---

# Login

## Authentication

<a id="report-1"></a>

### Login (General)

#### 1. Login (General)

**Method:** `POST`  
**Endpoint:** `/api/Auth/Login`  
**Description:** Executes the Login (General) action under the Auth module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Password | String | Yes |  | ketaki@123 |
| UserName | String | Yes |  | 8767955401 |

**Sample Request:**

```json
{
  "UserName": "abcyx@gmail.com",
  "Password": "123456"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": null,
"Message": "Api Executed Successfully",
"Result": {
"LicenseToken": {
"LoginID": 25630,
"IsLicenseActive": 1,
"PaymentStatus": 0,
"LicensePlan": "Premium Plan",
"LicensePlanType": "Pro",
"LicenseExpiry": "2025-08-12T10:00:38",
"DaysLeftToExpiry": 174,
"EnableLicenseUpgradeBtn": false,
"LicenseAlert": false,
"RemainingLicenseDays": 0,
"ShowFreeTrail": false,
"LicenseTypeMY": "Yearly"
},
"Profile": {
"UserName": "xyz xyz xyz",
"IsAlreadyLoggedIn": true,
"UserCred": "xyz@gmail.com",
"DisclaimerStatus": true,
"FeedbackStatus": true,
"UserCreatedDate": "2024-07-09T12:57:28",
"MobileNo": "1111111111",
"IsEventUser": false,
"EmailID": "xyz@gmail.com"
},
"isBrokerMapped": false,
"BrokerName": "",
"userUCC": "-",
"BrokerLTime": "-",
"isValidUser": "LoginSuccess",


"AccessToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjI1NjMwIiwiVXNlcklEIjoiaGFyc2hhbC5hbG
dvaXFAZ21haWwuY29tIiwiVXNlck5hbWUiOiJIYXJzaGFsIEFiaGltYW4gVGhha2FyZSIsIk1vYmlsZU5vIj
oiNzg3NTY2MjU1MCIsIkxfVHlwZSI6IlBybyIsIlNlc3Npb25JRCI6IjIxNjRiNDhjLThmYmYtNDhmYy04M2
I3LTJhY2JiMzhkNjk2NSIsIm5iZiI6MTczOTk2MDMyNywiZXhwIjoxNzQwMDQ2NzI3LCJpYXQiOjE3Mzk5Nj
AzMjcsImlzcyI6IjdlYzE1NzBmLWZkNGUtNGZhNy05MjQ3LTZlNzNhY2JkNTNiMCIsImF1ZCI6ImY4OTBlOG
U5LTdmMTAtNGI2Yi1hMzFmLTJlM2Y0Mzg2NTViMyJ9.IJQ2RzIksEGYk2NIrfL3qglCI_FVWdQ82SWtydLrd
7c",
"TokenExpiresIn": 86399,
"SessionID": "2164b48c-8fbf-48fc-83b7-2acbb38d6965"}}
```

---

<a id="report-2"></a>

### Send EmailOTP

#### 1. Send EmailOTP

**Method:** `GET`  
**Endpoint:** `/api/Auth/sendEmailOTP`  
**Description:** The SendEmailOTP API is used to generate and send a One-Time Password (OTP) to the user's registered email address. This OTP is typically used for user authentication, email verification, or other security purposes.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EmailID | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-3"></a>

### VerifyEmailOTP

#### 1. VerifyEmailOTP

**Method:** `GET`  
**Endpoint:** `/api/Auth/verifyEmailOTP`  
**Description:** The VerifyEmailOTP API is used to validate a One-Time Password (OTP) that was sent to a user's registered email address. This API ensures that the provided OTP is correct and within its valid time frame. It is commonly used for email verification, account activation, or password recovery.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EmailID | String | No |  | string |
| EmailOTP | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-4"></a>

### SaveVerifiedMobile

#### 1. SaveVerifiedMobile

**Method:** `GET`  
**Endpoint:** `/api/Auth/SaveVerifiedMobile`  
**Description:** The SaveVerifiedMobile API is used to save and update the verified status of a mobile number in the system. After a mobile number is successfully verified using an OTP or other means, this API is called to persist the verified status. It is commonly used in scenarios like user registration, profile updates, and account recovery.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EmailID | String | No |  | string |
| MobileNo | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-5"></a>

### VerifyMobileOTP

#### 1. VerifyMobileOTP

**Method:** `GET`  
**Endpoint:** `/api/Auth/VerifyMobileOTP`  
**Description:** The VerifyMobileOTP API is used to verify a One-Time Password (OTP) sent to a user's mobile number. It is typically used during mobile number verification for registration, login, or account recovery. Upon successful verification, the mobile number can be marked as verified in the system.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EmailID | String | No |  | string |
| MobileNo | String | No |  | string |
| MobileOTP | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-6"></a>

### SendForgotPassword

#### 1. SendForgotPassword

**Method:** `GET`  
**Endpoint:** `/api/Auth/SendForgorpasswordOTP`  
**Description:** Executes the SendForgotPassword action under the Auth module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| MobileNo | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-7"></a>

### VerifyForgotPasswordOTP

#### 1. VerifyForgotPasswordOTP

**Method:** `GET`  
**Endpoint:** `/api/Auth/VerifyForgotPasswordOTP`  
**Description:** The VerifyForgotPasswordOTP API is used to validate the OTP (One-Time Password) sent to a user's registered mobile number or email address during the password recovery process. Upon successful verification, the user will be allowed to proceed with resetting their password.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| MobileNo | String | No |  | string |
| MobileOTP | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-8"></a>

### SigninWithGoogle

#### 1. SigninWithGoogle

**Method:** `POST`  
**Endpoint:** `/api/Auth/SignInWithGoogle`  
**Description:** Executes the SigninWithGoogle action under the Auth module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EmailID | String | Yes |  | string |
| FullName | String | Yes |  | string |

**Sample Request:**

```json
{
  "EmailID": "string",
  "FullName": "string"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"LicenseToken": {
"LoginID": 28037,
"IsLicenseActive": 1,
"PaymentStatus": 0,
"LicensePlan": "Premium Plan",
"LicensePlanType": "Pro",
"LicenseExpiry": "2025-04-24T09:16:20",
"DaysLeftToExpiry": 30,
"EnableLicenseUpgradeBtn": false,
"LicenseAlert": false,
"RemainingLicenseDays": 0,
"ShowFreeTrail": false,
"LicenseTypeMY": "Monthly"
},
"Profile": {
"UserName": "Akshay",
"IsAlreadyLoggedIn": true,
"UserCred": "akshay.algoiq@gmail.com",
"DisclaimerStatus": true,
"FeedbackStatus": true,
"UserCreatedDate": "2024-08-06T09:43:20",
"MobileNo": "7030911706",
"IsEventUser": false,
"EmailID": "akshay.algoiq@gmail.com"
},
"isBrokerMapped": false,
"BrokerName": "",
"userUCC": "-",
"BrokerLTime": "-",
"isValidUser": "LoginSuccess",
"AccessToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjI4MDM3IiwiVXNlcklEIjoiYWtzaGF5LmFsZ2
9pcUBnbWFpbC5jb20iLCJVc2VyTmFtZSI6IkFrc2hheSIsIk1vYmlsZU5vIjoiNzAzMDkxMTcwNiIsIkxfVH
lwZSI6IlBybyIsIlNlc3Npb25JRCI6ImFkY2UxNGU2LTljMWYtNDAxYy04YjI2LWZkN2Q5Yzg0NTgzMSIsIk
lQQWRkcmVzcyI6IjExMC4yMjYuMTgyLjIxNiIsIlVzZXJBZ2VudCI6IlBvc3RtYW5SdW50aW1lLzcuNDMuMi
IsInNob3dGcmVlVHJhaWwiOiJmYWxzZSIsIm5iZiI6MTc0Mjg4NTU4MSwiZXhwIjoxNzQyOTcxOTgxLCJpYX
QiOjE3NDI4ODU1ODEsImlzcyI6IjdlYzE1NzBmLWZkNGUtNGZhNy05MjQ3LTZlNzNhY2JkNTNiMCIsImF1ZC


I6ImY4OTBlOGU5LTdmMTAtNGI2Yi1hMzFmLTJlM2Y0Mzg2NTViMyJ9.246oHhTrNJtGeK0kwZ2hUph9Qy_oM
f_ZMGao4x4j4qs",
"TokenExpiresIn": 86399,
"SessionID": "adce14e6-9c1f-401c-8b26-fd7d9c845831"
}
}
```

---

<a id="report-9"></a>

### LoginfromLoginID

#### 1. LoginfromLoginID

**Method:** `GET`  
**Endpoint:** `/api/Auth/LoginFromLoginID`  
**Description:** Executes the LoginfromLoginID action under the Auth module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | String | No |  | 7757 |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"LicenseToken": {
"LoginID": 28037,
"IsLicenseActive": 1,
"PaymentStatus": 0,
"LicensePlan": "Premium Plan",
"LicensePlanType": "Pro",
"LicenseExpiry": "2025-04-24T09:16:20",
"DaysLeftToExpiry": 30,
"EnableLicenseUpgradeBtn": false,
"LicenseAlert": false,
"RemainingLicenseDays": 0,
"ShowFreeTrail": false,
"LicenseTypeMY": "Monthly"
},
"Profile": {
"UserName": "Akshay",
"IsAlreadyLoggedIn": true,
"UserCred": "BMX24949",
"DisclaimerStatus": true,
"FeedbackStatus": true,
"UserCreatedDate": "2024-08-06T09:43:20",
"MobileNo": "7030911706",
"IsEventUser": false,
"EmailID": "akshay.algoiq@gmail.com"
},


"isBrokerMapped": false,
"BrokerName": "",
"userUCC": "-",
"BrokerLTime": "-",
"isValidUser": "LoginSuccess",
"AccessToken":
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjI4MDM3IiwiVXNlcklEIjoiQk1YMjQ5NDkiLC
JVc2VyTmFtZSI6IkFrc2hheSIsIk1vYmlsZU5vIjoiNzAzMDkxMTcwNiIsIkxfVHlwZSI6IlBybyIsIlNlc3
Npb25JRCI6IjU4ZjE5NmY5LTBjZDUtNDFjMy1hY2NkLWNjNGU2MGQ0MmFjOSIsIklQQWRkcmVzcyI6IjExMC
4yMjYuMTgyLjIxNiIsIlVzZXJBZ2VudCI6IlBvc3RtYW5SdW50aW1lLzcuNDMuMiIsInNob3dGcmVlVHJhaW
wiOiJmYWxzZSIsIm5iZiI6MTc0Mjg4NjE4NywiZXhwIjoxNzQyOTcyNTg3LCJpYXQiOjE3NDI4ODYxODcsIm
lzcyI6IjdlYzE1NzBmLWZkNGUtNGZhNy05MjQ3LTZlNzNhY2JkNTNiMCIsImF1ZCI6ImY4OTBlOGU5LTdmMT
AtNGI2Yi1hMzFmLTJlM2Y0Mzg2NTViMyJ9.GIgLIFy8OK-ayMGu80pArIRdxcxJvgHzL34m4184K8A",
"TokenExpiresIn": 86399,
"SessionID": "58f196f9-0cd5-41c3-accd-cc4e60d42ac9"
}
}
```

---

<a id="report-10"></a>

### CreateUser

#### 1. CreateUser

**Method:** `POST`  
**Endpoint:** `/api/Auth/CreateUser`  
**Description:** Create a new user account.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| MobileNo | String | Yes |  | stri |
| EmailID | String | Yes |  | string |
| LoginID | String | Yes |  | string |
| FullName | String | Yes |  | string |
| Password | String | Yes |  | string |
| IsEventUser | Integer | Yes |  | 3283 |

**Sample Request:**

```json
{
  "MobileNo": "stri",
  "EmailID": "string",
  "LoginID": "string",
  "FullName": "string",
  "Password": "string",
  "IsEventUser": 3283
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-11"></a>

### TalkDeltaEndLogin

#### 1. TalkDeltaEndLogin

**Method:** `POST`  
**Endpoint:** `/api/Auth/TalkDeltaEndLogin`  
**Description:** End TalkDelta login session.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| MobileNo | String | Yes |  | stri |
| EmailID | String | Yes |  | string |
| LoginID | String | Yes |  | string |
| FullName | String | Yes |  | string |
| Password | String | Yes |  | string |
| IsEventUser | Integer | Yes |  | 3283 |

**Sample Request:**

```json
{
  "MobileNo": "stri",
  "EmailID": "string",
  "LoginID": "string",
  "FullName": "string",
  "Password": "string",
  "IsEventUser": 3283
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 114,
  "Message": "string",
  "Result": {
    "LicenseToken": {
      "LoginID": 4143,
      "IsLicenseActive": 328,
      "PaymentStatus": 481,
      "LicensePlan": "string",
      "LicensePlanType": "string",
      "LicenseExpiry": "1974-02-17T12:27:30.281Z",
      "DaysLeftToExpiry": 7841,
      "EnableLicenseUpgradeBtn": false,
      "LicenseAlert": true,
      "RemainingLicenseDays": 8498,
      "ShowFreeTrail": true,
      "LicenseTypeMY": "string"
    },
    "Profile": {
      "UserName": "string",
      "IsAlreadyLoggedIn": false,
      "UserCred": "string",
      "DisclaimerStatus": false,
      "FeedbackStatus": false,
      "UserCreatedDate": "1962-10-08T01:43:53.166Z",
      "MobileNo": "string",
      "IsEventUser": false,
      "EmailID": "string"
    },
    "isBrokerMapped": false,
    "BrokerName": "string",
    "userUCC": "string",
    "BrokerLTime": "string",
    "isValidUser": "string",
    "AccessToken": "string",
    "TokenExpiresIn": 6939,
    "SessionID": "string",
    "TokenExpiryDatetime": "2014-12-18T02:59:42.227Z"
  }
}
```

---

<a id="report-12"></a>

### UpdateMobNoGoogleLogin

#### 1. UpdateMobNoGoogleLogin

**Method:** `GET`  
**Endpoint:** `/api/Auth/UpdateMobNoGoogleLogin`  
**Description:** Update mobile number for Google login.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EmailID | String | No |  | string |
| MobileNo | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-13"></a>

### ForgetChangePassword

#### 1. ForgetChangePassword

**Method:** `POST`  
**Endpoint:** `/api/Auth/ForgetChangePassword`  
**Description:** Change password via forgot password flow.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Password | String | Yes |  | string |
| UserName | String | Yes |  | string |

**Sample Request:**

```json
{
  "Password": "string",
  "UserName": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-14"></a>

### SendEmailMobileOTPBroker

#### 1. SendEmailMobileOTPBroker

**Method:** `POST`  
**Endpoint:** `/api/Auth/SendEmailMobileOTPBroker`  
**Description:** Send email/mobile OTP for broker login.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EventUser | Integer | Yes |  | 1033 |
| ID | Integer | Yes |  | 3049 |
| MobileNo | String | Yes |  | string |
| EmailID | String | Yes |  | string |
| LoginID | String | Yes |  | string |
| Password | String | Yes |  | string |
| ConfirmPassword | String | Yes |  | string |
| FullName | String | Yes |  | string |
| Gender | String | Yes |  | string |
| DOB | String | Yes |  | string |
| MobileOTP | String | Yes |  | string |
| EmailOTP | String | Yes |  | string |
| CreatedDate | String | Yes |  | string |
| LastLoginDate | String | Yes |  | string |
| LastPasswordUpdatedate | String | Yes |  | string |
| IsActive | Integer | Yes |  | 7603 |
| PaymentStatus | Integer | Yes |  | 2778 |
| SField1 | String | Yes |  | string |
| SField2 | String | Yes |  | string |
| NField1 | Integer | Yes |  | 4086 |
| NField2 | Integer | Yes |  | 8578 |
| Pincode | String | Yes |  | string |
| City | String | Yes |  | string |
| State | String | Yes |  | string |
| Country | String | Yes |  | string |
| Occupation | String | Yes |  | string |
| Industry | String | Yes |  | string |
| AnnualIncome | String | Yes |  | string |
| AlternateNumber | String | Yes |  | string |
| BrokerName | String | Yes |  | string |
| CountProfile | Integer | Yes |  | 4184 |
| LoginType | String | Yes |  | string |

**Sample Request:**

```json
{
  "EventUser": 1033,
  "ID": 3049,
  "MobileNo": "string",
  "EmailID": "string",
  "LoginID": "string",
  "Password": "string",
  "ConfirmPassword": "string",
  "FullName": "string",
  "Gender": "string",
  "DOB": "string",
  "MobileOTP": "string",
  "EmailOTP": "string",
  "CreatedDate": "string",
  "LastLoginDate": "string",
  "LastPasswordUpdatedate": "string",
  "IsActive": 7603,
  "PaymentStatus": 2778,
  "SField1": "string",
  "SField2": "string",
  "NField1": 4086,
  "NField2": 8578,
  "Pincode": "string",
  "City": "string",
  "State": "string",
  "Country": "string",
  "Occupation": "string",
  "Industry": "string",
  "AnnualIncome": "string",
  "AlternateNumber": "string",
  "BrokerName": "string",
  "CountProfile": 4184,
  "LoginType": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 541,
  "Message": "string",
  "Result": {
    "isSuccess": false,
    "Result": "string",
    "Message": "string"
  }
}
```

---

<a id="report-15"></a>

### SendEmailMobileOTPOKBroker

#### 1. SendEmailMobileOTPOKBroker

**Method:** `POST`  
**Endpoint:** `/api/Auth/SendEmailMobileOTPOKBroker`  
**Description:** Send email/mobile OTP OK for broker.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EventUser | Integer | Yes |  | 1033 |
| ID | Integer | Yes |  | 3049 |
| MobileNo | String | Yes |  | string |
| EmailID | String | Yes |  | string |
| LoginID | String | Yes |  | string |
| Password | String | Yes |  | string |
| ConfirmPassword | String | Yes |  | string |
| FullName | String | Yes |  | string |
| Gender | String | Yes |  | string |
| DOB | String | Yes |  | string |
| MobileOTP | String | Yes |  | string |
| EmailOTP | String | Yes |  | string |
| CreatedDate | String | Yes |  | string |
| LastLoginDate | String | Yes |  | string |
| LastPasswordUpdatedate | String | Yes |  | string |
| IsActive | Integer | Yes |  | 7603 |
| PaymentStatus | Integer | Yes |  | 2778 |
| SField1 | String | Yes |  | string |
| SField2 | String | Yes |  | string |
| NField1 | Integer | Yes |  | 4086 |
| NField2 | Integer | Yes |  | 8578 |
| Pincode | String | Yes |  | string |
| City | String | Yes |  | string |
| State | String | Yes |  | string |
| Country | String | Yes |  | string |
| Occupation | String | Yes |  | string |
| Industry | String | Yes |  | string |
| AnnualIncome | String | Yes |  | string |
| AlternateNumber | String | Yes |  | string |
| BrokerName | String | Yes |  | string |
| CountProfile | Integer | Yes |  | 4184 |
| LoginType | String | Yes |  | string |

**Sample Request:**

```json
{
  "EventUser": 1033,
  "ID": 3049,
  "MobileNo": "string",
  "EmailID": "string",
  "LoginID": "string",
  "Password": "string",
  "ConfirmPassword": "string",
  "FullName": "string",
  "Gender": "string",
  "DOB": "string",
  "MobileOTP": "string",
  "EmailOTP": "string",
  "CreatedDate": "string",
  "LastLoginDate": "string",
  "LastPasswordUpdatedate": "string",
  "IsActive": 7603,
  "PaymentStatus": 2778,
  "SField1": "string",
  "SField2": "string",
  "NField1": 4086,
  "NField2": 8578,
  "Pincode": "string",
  "City": "string",
  "State": "string",
  "Country": "string",
  "Occupation": "string",
  "Industry": "string",
  "AnnualIncome": "string",
  "AlternateNumber": "string",
  "BrokerName": "string",
  "CountProfile": 4184,
  "LoginType": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 541,
  "Message": "string",
  "Result": {
    "isSuccess": false,
    "Result": "string",
    "Message": "string"
  }
}
```

---

<a id="report-16"></a>

### VerifyEmailMobileOTP

#### 1. VerifyEmailMobileOTP

**Method:** `POST`  
**Endpoint:** `/api/Auth/VerifyEmailMobileOTP`  
**Description:** Verify email and mobile OTP.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EventUser | Integer | Yes |  | 1033 |
| ID | Integer | Yes |  | 3049 |
| MobileNo | String | Yes |  | string |
| EmailID | String | Yes |  | string |
| LoginID | String | Yes |  | string |
| Password | String | Yes |  | string |
| ConfirmPassword | String | Yes |  | string |
| FullName | String | Yes |  | string |
| Gender | String | Yes |  | string |
| DOB | String | Yes |  | string |
| MobileOTP | String | Yes |  | string |
| EmailOTP | String | Yes |  | string |
| CreatedDate | String | Yes |  | string |
| LastLoginDate | String | Yes |  | string |
| LastPasswordUpdatedate | String | Yes |  | string |
| IsActive | Integer | Yes |  | 7603 |
| PaymentStatus | Integer | Yes |  | 2778 |
| SField1 | String | Yes |  | string |
| SField2 | String | Yes |  | string |
| NField1 | Integer | Yes |  | 4086 |
| NField2 | Integer | Yes |  | 8578 |
| Pincode | String | Yes |  | string |
| City | String | Yes |  | string |
| State | String | Yes |  | string |
| Country | String | Yes |  | string |
| Occupation | String | Yes |  | string |
| Industry | String | Yes |  | string |
| AnnualIncome | String | Yes |  | string |
| AlternateNumber | String | Yes |  | string |
| BrokerName | String | Yes |  | string |
| CountProfile | Integer | Yes |  | 4184 |
| LoginType | String | Yes |  | string |

**Sample Request:**

```json
{
  "EventUser": 1033,
  "ID": 3049,
  "MobileNo": "string",
  "EmailID": "string",
  "LoginID": "string",
  "Password": "string",
  "ConfirmPassword": "string",
  "FullName": "string",
  "Gender": "string",
  "DOB": "string",
  "MobileOTP": "string",
  "EmailOTP": "string",
  "CreatedDate": "string",
  "LastLoginDate": "string",
  "LastPasswordUpdatedate": "string",
  "IsActive": 7603,
  "PaymentStatus": 2778,
  "SField1": "string",
  "SField2": "string",
  "NField1": 4086,
  "NField2": 8578,
  "Pincode": "string",
  "City": "string",
  "State": "string",
  "Country": "string",
  "Occupation": "string",
  "Industry": "string",
  "AnnualIncome": "string",
  "AlternateNumber": "string",
  "BrokerName": "string",
  "CountProfile": 4184,
  "LoginType": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4197,
  "Message": "string",
  "Result": {
    "Id": 4863,
    "MobiileNo": "string",
    "EmaildId": "string",
    "Password": "string",
    "LoginId": "string",
    "FullName": "string",
    "Result": "string"
  }
}
```

---

<a id="report-17"></a>

### CreatePasswordNewBroker

#### 1. CreatePasswordNewBroker

**Method:** `POST`  
**Endpoint:** `/api/Auth/CreatePasswordNewBroker`  
**Description:** Create new password for broker account.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ID | Integer | Yes |  | 6003 |
| Password | String | Yes |  | string |
| FullName | String | Yes |  | string |

**Sample Request:**

```json
{
  "ID": 6003,
  "Password": "string",
  "FullName": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4314,
  "Message": "string",
  "Result": true
}
```

---

# Market

## Market Overview

<a id="report-18"></a>

### 1. Adv/Dec Distribution

#### 1. AdvDecDisFutureEquityLoser

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvDecDisFutureEquetyLooser`  
**Description:** Executes the AdvDecDisFutureEquityLoser action under the Market Overview module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"Symbol": "OFSS",
"LTP": "7610",
"LTPChange": "-235.6",
"Change": "-3"
}}}
```

---

#### 2. AdvDecDistributionEquetyGainer

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvDecDistributionEquetyGainer`  
**Description:** Get equity gainers from advances/declines distribution.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"Symbol": "BANKA",
"LTP": "81.32",
"LTPChange": "13.55",
"Change": "19.99"
}}}
```

---

#### 3. AdvDecDisFutureEquityGainer

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvDecDisFutureEquetyGainer`  
**Description:** Executes the AdvDecDisFutureEquityGainer action under the Market Overview module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"Symbol": "TITAGARH",
"LTP": "773.2",
"LTPChange": "50.25",
"Change": "6.95"
}}}
```

---

#### 4. AdvDecDistributionHeaderFeeds

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvDecDistributionHeaderFeeds`  
**Description:** Get advances/declines distribution header feeds.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 2706,
  "Message": "",
  "Result": [
    {
      "contrct": {
        "Scrip": "string",
        "Expiry": "string",
        "Strike": 3389.985912830109,
        "CP": "string",
        "Token": 9623,
        "Instrument": "string",
        "FeedSegment": "string"
      },
      "LTP": 6979.721461194501,
      "FeedTime": "1975-12-22T14:52:46.509Z",
      "OI": 4159.125508793877,
      "Volume": 9943,
      "ChangePrice": 7315.522868775952,
      "ChangePercent": 4164.095961078282
    },
    {
      "contrct": {
        "Scrip": "string",
        "Expiry": "string",
        "Strike": 8202.16373898133,
        "CP": "string",
        "Token": 4981,
        "Instrument": "string",
        "FeedSegment": "string"
      },
      "LTP": 821.7019275405479,
      "FeedTime": "2020-04-11T12:39:42.894Z",
      "OI": 1178.1097849320888,
      "Volume": 9899,
      "ChangePrice": 6555.642049568626,
      "ChangePercent": 2579.364177252521
    }
  ]
}
```

---

#### 5. AdvDecDistributionEquetyLooser

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvDecDistributionEquetyLooser`  
**Description:** Get equity losers distribution data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 8839,
  "Message": "string",
  "Result": {
    "Data": [
      {
        "nToken": "string",
        "Symbol": "string",
        "LTP": "string",
        "LTPChange": "string",
        "Change": "strin"
      },
      {
        "nToken": "string",
        "Symbol": "string",
        "LTP": "string",
        "LTPChange": "string",
        "Change": "string"
      }
    ],
    "ResultDate": [
      {
        "Symbol": "string",
        "FormattedDate": "string",
        "Purpose": "stri"
      },
      {
        "Symbol": "string",
        "FormattedDate": "string",
        "Purpose": "string"
      }
    ]
  }
}
```

---

#### 6. AdvDecDisTopVolumeFuture

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvDecDisTopVolumeFuture`  
**Description:** Get top volume future distribution.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| DaysValues | String | Yes |  | string |

**Sample Request:**

```json
{
  "DaysValues": "5"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1014,
  "Message": "string",
  "Result": [
    {
      "nToken": "string",
      "Symbol": "string",
      "Volume": "string",
      "Change": 1127.2291208692197,
      "AvgVolume": "string",
      "ADDVVResCal": [
        {
          "Symbol": "string",
          "FormattedDate": "string",
          "Purpose": "string"
        },
        {
          "Symbol": "string",
          "FormattedDate": "string",
          "Purpose": "string"
        }
      ]
    },
    {
      "nToken": "string",
      "Symbol": "string",
      "Volume": "stri",
      "Change": 9603.342416573076,
      "AvgVolume": "string",
      "ADDVVResCal": [
        {
          "Symbol": "string",
          "FormattedDate": "string",
          "Purpose": "string"
        },
        {
          "Symbol": "string",
          "FormattedDate": "string",
          "Purpose": "string"
        }
      ]
    }
  ]
}
```

---

#### 7. AdvancesDeclinersChart

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvancesDeclinersChart`  
**Description:** Get advances/decliners chart data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Sector | String | Yes |  | string |

**Sample Request:**

```json
{
  "Sector": "NIFTY"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1851,
  "Message": "string",
  "Result": [
    7685,
    9670
  ]
}
```

---

#### 8. AdvancesDeclinersDistribution

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/AdvancesDeclinersDistribution`  
**Description:** Executes the AdvancesDeclinersDistribution action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1041,
  "Message": "string",
  "Result": [
    {
      "IndicesName": "string",
      "Value": "string",
      "Change": "string",
      "ChangePercent": "string",
      "PrevPrice": "string",
      "FeedSegment": "string",
      "Token": "string"
    },
    {
      "IndicesName": "string",
      "Value": "string",
      "Change": "string",
      "ChangePercent": "string",
      "PrevPrice": "string",
      "FeedSegment": "string",
      "Token": "string"
    }
  ]
}
```

---

<a id="report-19"></a>

### 2. Sectorial Analysis

#### 1. SectorialAnalysis

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/SectorialAnalysis`  
**Description:** Get sectorial analysis data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "NIFTY 50"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6116,
  "Message": "string",
  "Result": [
    {
      "Token": 1263,
      "ScripName": "string",
      "SpotPrice": 4429.245016668116,
      "SpotChange": 3000.5876554662314,
      "SpotChangePer": 1412.5715820222729,
      "Volume": 2322.571369138784,
      "Segment": "string"
    },
    {
      "Token": 4824,
      "ScripName": "string",
      "SpotPrice": 2447.3120288999507,
      "SpotChange": 9932.45524106709,
      "SpotChangePer": 9679.839393523727,
      "Volume": 1819.2243271454122,
      "Segment": "string"
    }
  ]
}
```

---

#### 2. SectorialChartAnalysis

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/SectorialChartAnalysis`  
**Description:** Get sectorial chart analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6116,
  "Message": "string",
  "Result": [
    {
      "Token": 1263,
      "ScripName": "string",
      "SpotPrice": 4429.245016668116,
      "SpotChange": 3000.5876554662314,
      "SpotChangePer": 1412.5715820222729,
      "Volume": 2322.571369138784,
      "Segment": "string"
    },
    {
      "Token": 4824,
      "ScripName": "string",
      "SpotPrice": 2447.3120288999507,
      "SpotChange": 9932.45524106709,
      "SpotChangePer": 9679.839393523727,
      "Volume": 1819.2243271454122,
      "Segment": "string"
    }
  ]
}
```

---

#### 3. IndicesDaily

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/IndicesDaily`  
**Description:** Get daily indices data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndicesName | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6079,
  "Message": "string",
  "Result": [
    {
      "symbol": "string",
      "date": "stri",
      "close": 6700.654382920968
    },
    {
      "symbol": "string",
      "date": "string",
      "close": 5158.878802142015
    }
  ]
}
```

---

<a id="report-20"></a>

### 3. Adv/Dec Heatmap

#### 1. AdvancesDeclinesHeatmapSector

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvancesDeclinesHeatmapSector`  
**Description:** Get advances declines heatmap by sector.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| GroupName | String | Yes |  | str |
| Filter | String | Yes |  | string |
| FilterDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "GroupName": "str",
  "Filter": "string",
  "FilterDate": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 7311,
  "Message": "string",
  "Result": [
    {
      "SectorName": "string",
      "ChangePercent": "string"
    },
    {
      "SectorName": "string",
      "ChangePercent": "string"
    }
  ]
}
```

---

#### 2. AdvancesDeclinesHeatmapData

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/AdvancesDeclinesHeatmapData`  
**Description:** Get advances declines heatmap data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| GroupName | String | Yes |  | str |
| Filter | String | Yes |  | string |
| FilterDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "GroupName": "str",
  "Filter": "string",
  "FilterDate": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 9754,
  "Message": "string",
  "Result": [
    {
      "ScripName": "string",
      "LTP": "string",
      "ChangePercent": "string",
      "Token": 1177
    },
    {
      "ScripName": "stri",
      "LTP": "string",
      "ChangePercent": "string",
      "Token": 7560
    }
  ]
}
```

---

#### 3. AdvancesDeclinesHeatmapCount

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/AdvancesDeclinesHeatmapCount`  
**Description:** Get advances declines heatmap count.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| FilterDate | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 7029,
  "Message": "string",
  "Result": [
    {
      "ScripName": "string",
      "Advances": "string",
      "Declines": "string"
    },
    {
      "ScripName": "string",
      "Advances": "string",
      "Declines": "stri"
    }
  ]
}
```

---

#### 4. GetAdvancesDeclinesHeatmapCardData

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/GetAdvancesDeclinesHeatmapCardData`  
**Description:** Get advances declines heatmap card data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 7024,
  "Message": "string",
  "Result": {
    "Token": 3730,
    "ScripName": "string",
    "LTP": 9328.693526744128,
    "Open": 13.767979796757146,
    "High": 1856.1434191987635,
    "Low": 4482.660186709597,
    "PrevLTP": 6732.5853975449745,
    "Change": 6571.676796464625,
    "ChangePercent": 1591.2597247147041,
    "ISINNumber": "string",
    "Segment": "string",
    "LotSize": 7705,
    "AvgIV": 7502.619642042907,
    "ChartData": [
      {
        "ScripName": "string",
        "Close": 9748.05063780804,
        "Date": "string"
      },
      {
        "ScripName": "string",
        "Close": 1611.5904589745478,
        "Date": "string"
      }
    ]
  }
}
```

---

<a id="report-21"></a>

### 4. Nifty Contributors

#### 1. GetNiftyContributorsToday

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/GetNiftyContributorsToday`  
**Description:** Retrieves the list of positive and negative contributors to the Nifty index movement for the current trading day. Data is sourced from the SP_Nifty_CONTRIBUTORS stored procedure.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | Nifty 50 |
| startDays | String | Yes |  |  |
| P_TIME | String | Yes |  |  |

**Sample Request:**

```json
{
  "indexName": "NIFTY",
  "startDays": "1",
  "p_TIME": "09:25:00"
}
```

**Sample Response:**

```json
{
  "statusCode": 200,
  "message": "Api Executed Successfully",
  "status": true,
  "result": {
    "positiveContributors": [
      {
        "scripName": "RELIANCE",
        "token": 2885,
        "ltp": 2456.8,
        "changePercent": "0.69",
        "weightage": 10.25,
        "contribution": 8.45
      }
    ],
    "negativeContributors": [
      {
        "scripName": "HDFC",
        "token": 3400,
        "ltp": 1620.5,
        "changePercent": "-0.58",
        "weightage": 8.75,
        "contribution": -5.12
      }
    ]
  }
}
```

---

<a id="report-22"></a>

### 5. Futures Buildup Trend

#### 1. GetFutureBuiltupScreener

**Method:** `POST`  
**Endpoint:** `/api/MarketOverview/GetFutureBuiltupScreener`  
**Description:** Provides a futures buildup screener that classifies stocks into buildup categories (Long Buildup, Short Buildup, Short Covering, Long Unwinding) based on price and OI changes over 1-day and 5-day periods.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| SelectedBuildup | String | Yes |  | string |
| IsAndFilter | Boolean | Yes |  | false |

**Sample Request:**

```json
{
  "selectedBuildup": "Long Buildup",
  "isAndFilter": false
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "Data": [
      {
        "symbol": "RELIANCE",
        "price": 2456.8,
        "price_Change1D": 1.5,
        "st_Outlook": "Long Buildup",
        "mt_Outlook": "Long Buildup",
        "token": 2885
      }
    ]
  }
}
```

---

<a id="report-23"></a>

### 6. Gift Nifty

#### 1. GiftNifty

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/GiftNifty`  
**Description:** Get Gift Nifty data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4881,
  "Message": "string",
  "Result": {
    "ScripName": "string",
    "Open": 5096.931002944154,
    "TodayHigh": 5480.661044498997,
    "TodayLow": 9037.278741699192,
    "PreviousClose": 8573.74633829592,
    "LTP": 2146.801097784836,
    "LTPchange": 2021.9997644562527,
    "LTPChaPer": 4761.591533806626,
    "Price": "string",
    "Time": "string"
  }
}
```

---

<a id="report-24"></a>

### 7. Market Active Days

#### 1. GetMarketActiveDays

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/GetMarketActiveDays`  
**Description:** Get market active days data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-25"></a>

### 8. Mobile

#### 1. OIGainerMobile

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/OIGainerMobile`  
**Description:** Get OI gainer data for mobile.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4003,
  "Message": "string",
  "Result": [
    {
      "Symbol": "string",
      "Price": 8743.323496165032,
      "changeper": 3778.078458403782
    },
    {
      "Symbol": "string",
      "Price": 7634.913263722076,
      "changeper": 3581.5898570602035
    }
  ]
}
```

---

#### 2. Near52WkHigh

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/Near52WkHigh`  
**Description:** Get stocks near 52 week high.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4003,
  "Message": "string",
  "Result": [
    {
      "Symbol": "string",
      "Price": 8743.323496165032,
      "changeper": 3778.078458403782
    },
    {
      "Symbol": "string",
      "Price": 7634.913263722076,
      "changeper": 3581.5898570602035
    }
  ]
}
```

---

#### 3. Near52WkLow

**Method:** `GET`  
**Endpoint:** `/api/MarketOverview/Near52WkLow`  
**Description:** Get stocks near 52 week low.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4003,
  "Message": "string",
  "Result": [
    {
      "Symbol": "string",
      "Price": 8743.323496165032,
      "changeper": 3778.078458403782
    },
    {
      "Symbol": "string",
      "Price": 7634.913263722076,
      "changeper": 3581.5898570602035
    }
  ]
}
```

---

## Price Analysis

<a id="report-26"></a>

### 1.Gainers-Loosers

#### 1. GainerandLoosers

**Method:** `POST`  
**Endpoint:** `/api/MarketPriceAnalysis/GainerandLoosers`  
**Description:** Gainers and Losers analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |
| GLType | String | Yes |  | string |
| DaysType | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "all",
  "GLType": "Gainer",
  "DaysType": "daily"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"Token": 17295,
"CompanyName": "Nagarjun Fert And Che Ltd",
"sscript": "NAGAFERT",
"LTP": 6.93,
"PreviousClose": 8.2,
"NetChanges": -1.27,
"ChangesINPercent": -15.49,
"Volume": "1.04 Cr"
}}}
```

---

<a id="report-27"></a>

### 2.Out-And-Under-Performers

#### 1. GetOutANDUnderPerformance

**Method:** `POST`  
**Endpoint:** `/api/MarketPriceAnalysis/GetOutANDUnderPerformance`  
**Description:** Out and Under Performers analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |
| OUType | String | Yes |  | string |
| DaysType | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "nifty 500",
  "OUType": "Out",
  "DaysType": "1 Week"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"Token": 17295,
"CompanyName": "Nagarjun Fert And Che Ltd",
"sscript": "NAGAFERT",
"LTP": 6.93,
"PreviousClose": 8.2,
"NetChanges": -1.27,
"ChangesINPercent": -15.49,
"Volume": "1.04 Cr"
}}}
```

---

<a id="report-28"></a>

### 3.Only Buyer And Seller

#### 1. GetOnlyBuyerAndSeller

**Method:** `POST`  
**Endpoint:** `/api/MarketPriceAnalysis/GetOnlyBuyerAndSeller`  
**Description:** Only Buyer and Seller analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| BSType | String | Yes |  | string |
| IndexName | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "DMType": "Daily",
  "StocksName": "stock",
  "FOorCash": "F&O"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"Date": "10 Feb",
"FllBuyValue": 15783,
"FllSellValue": 17780,
"FllNetValue": -1997,
"DllBuyValue": 60925,
"DllSellValue": 62738,
"DllNetValue": -1813,
"CashInOut": -3810,
"TotalFllBuyValue1": 15783,
"TotalFllBuySellValue1": 17780,
"TotalFllBuyNetValue1": -1997,
"TotalDllBuyValue1": 60925,
"TotalDllBuySellValue1": 62738,
"TotalDllBuyNetValue1": -1813,
"TotalCashInOut1": -3810
}}}
```

---

<a id="report-29"></a>

### 4.Highs-and-lows

#### 1. GetHighsLows

**Method:** `POST`  
**Endpoint:** `/api/MarketPriceAnalysis/GetHighsLows`  
**Description:** Highs and Lows analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |
| HLType | String | Yes |  | strin |
| DaysType | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "nifty 500",
  "HLType": "High",
  "DaysType": "daily"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "Data": []
  }
}
```

---

<a id="report-30"></a>

### 5.five-days-up-and-down

#### 1. GetFiveDaysUpDown

**Method:** `POST`  
**Endpoint:** `/api/MarketPriceAnalysis/GetFiveDaysUpDown`  
**Description:** Five Days Up and Down analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |
| FDUDType | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "nifty 500",
  "DaysType": "5 Days"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "Data": []
  }
}
```

---

<a id="report-31"></a>

### 6.FII-DII

#### 1. FIIDIIActivity

**Method:** `POST`  
**Endpoint:** `/api/MarketPriceAnalysis/FIIDIIActivity`  
**Description:** FII/DII Activity analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 1512 |
| PageSize | Integer | Yes |  | 4539 |
| DMType | String | Yes |  | string |
| StocksName | String | Yes |  | strin |
| FOorCash | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "DMType": "Daily",
  "StocksName": "stock",
  "FOorCash": "F&O"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "Data": []
  }
}
```

---

#### 2. FIIDIIGraph

**Method:** `POST`  
**Endpoint:** `/api/MarketPriceAnalysis/FIIDIIGraph`  
**Description:** FII/DII Graph analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 1512 |
| PageSize | Integer | Yes |  | 4539 |
| DMType | String | Yes |  | string |
| StocksName | String | Yes |  | strin |
| FOorCash | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "DMType": "Daily",
  "StocksName": "stock",
  "FOorCash": "F&O"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "Data": []
  }
}
```

---

## Volume Analysis

<a id="report-32"></a>

### 1.Most Active Value & Volume

#### 1. MostActiveValueVolume

**Method:** `POST`  
**Endpoint:** `/api/MarketVolumeAnalysis/MostActiveValueVolume`  
**Description:** Executes the MostActiveValueVolume action under the Market Volume Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |
| VVType | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "nifty 500",
  "VVType": "value"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"CompanyName": "RELIANCE INDUSTRIES LTD",
"TradedVolume": "1.65 Cr",
"LTP": "1249.8",
"PrevPrice": "1209.6",
"ChangePercent": "3.32",
"VALUE": "2.05 L",
"Token": 2885,
"ScripName": "RELIANCE"
}}}
```

---

<a id="report-33"></a>

### 2.Bulk & Block Deals

#### 1. BulkBlockDeals

**Method:** `POST`  
**Endpoint:** `/api/MarketVolumeAnalysis/BulkBlockDeals`  
**Description:** Executes the BulkBlockDeals action under the Market Volume Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 2641 |
| PageSize | Integer | Yes |  | 8193 |
| FromDate | String | Yes |  | string |
| ToDate | String | Yes |  | string |
| BulkBlockType | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "FromDate": "14 FEB 2025",
  "ToDate": "17 FEB 2025",
  "BulkBlockType": "Block"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"DealDate": "17 Feb 2025",
"CompanyName": "Kothari Products Ltd.",
"Clientname": "DEEPAK KOTHARI",
"DealType": "BUY",
"Quantity": "1210927",
"TradePrice": "176.40",
"VALUE": "21.36 Cr"
}}}
```

---

<a id="report-34"></a>

### 3.Highest & Lowest Delivery

#### 1. HighestLowestDelivery

**Method:** `POST`  
**Endpoint:** `/api/MarketVolumeAnalysis/HighestLowestDelivery`  
**Description:** Executes the HighestLowestDelivery action under the Market Volume Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 6242 |
| PageSize | Integer | Yes |  | 2227 |
| IndexName | String | Yes |  | stri |
| HLType | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "IndexName": "nifty 50",
  "HLType": "High"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"CompanyName": "ITC LTD",
"ScripName": "ITC",
"Token": 1660,
"PrevClose": 403.9,
"CurrentPrice": 405.8,
"change": 0.47,
"TotalTrdQuantity": 11180761,
"DelieveryQuantity": 8316240,
"DelieveryPercent": 74.38
}}}
```

---

<a id="report-35"></a>

### 4.VDP Report

#### 1. VDPReport

**Method:** `POST`  
**Endpoint:** `/api/MarketVolumeAnalysis/VDPReport`  
**Description:** Executes the VDPReport action under the Market Volume Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| RFType | String | Yes |  | string |

**Sample Request:**

```json
{
  "RFType": "Rise"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"companyname": "CAMBRIDGE TECH ENTER LTD",
"SYMBOL": "CTE",
"TrdQuntyDate1": 153246,
"DelQntyDate1": 82792,
"PriceDate1": 56.99,
"TrdQuntyDate2": 184247,
"DelQntyDate2": 102411,
"PriceDate2": 56.2,
"TrdQuntyDate3": 198232,
"DelQntyDate3": 127094,
"PriceDate3": 53.39,


"RiseInPrice": -6.32,
"Token": 14218,
"LTP": 51.8000,
"MyProperty": null
}}}
```

---

<a id="report-36"></a>

### 5.Open High & Open Low

#### 1. OpenHighsLows

**Method:** `POST`  
**Endpoint:** `/api/MarketVolumeAnalysis/OpenHighsLows`  
**Description:** Executes the OpenHighsLows action under the Market Volume Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| HLType | String | Yes |  | string |
| IndexName | String | Yes |  | string |

**Sample Request:**

```json
{
  "HLType": "High",
  "IndexName": "all"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"ScripName": "BINANIIND",
"LTP": 11.51,
"ChangePercent": 3.88,
"Open": 12.13,
"ltpChange": 0.43,
"Volume": "13.91 K",
"Token": 13625
}}}
```

---

<a id="report-37"></a>

### 6.Result Calendar

#### 1. ResultCalender

**Method:** `POST`  
**Endpoint:** `/api/MarketVolumeAnalysis/ResultCalender`  
**Description:** Get result calendar data for derivative updates.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| FilterType | String | Yes |  | string |
| FOType | String | Yes |  | string |
| Type | String | Yes |  | string |

**Sample Request:**

```json
{
  "FilterType": "string",
  "FOType": "string",
  "Type": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 8981,
  "Message": "string",
  "Result": {
    "PageNo": 364,
    "PageSize": 2037.9930800011525,
    "TotalRecords": 8967,
    "TotalPages": 4109.287426197055,
    "Data": [
      {
        "Symbol": "string",
        "Company": "string",
        "purpose": "string",
        "Details": "string",
        "Date": "string"
      },
      {
        "Symbol": "string",
        "Company": "string",
        "purpose": "string",
        "Details": "string",
        "Date": "string"
      }
    ]
  }
}
```

---

## Derivative Update

<a id="report-38"></a>

### 1.Future Stocks

#### 1. FutureStocks

**Method:** `POST`  
**Endpoint:** `/api/MarketDerivativeUpdates/FutureStocks`  
**Description:** Retrieves future stocks F&O data including symbol, company, purpose, details, and event date.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| FSType | String | Yes |  | string |

**Sample Request:**

```json
{
  "FSType": "All options"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"Symbol": "HUDCO",
"Company": "Housing & Urban Development Corporation Limited",


"purpose": "Dividend",
"Details": "To consider dividend second interim for the financial
year 2024-25 and fixation of record date",
"Date": "10 Mar 2025"
}
],
"PageNo": 0,
"PageSize": 0,
"TotalRecords": 0,
"TotalPages": 0
}
}
```

---

<a id="report-39"></a>

### 2.Put Call Ratio

#### 1. PutCallRatio

**Method:** `POST`  
**Endpoint:** `/api/MarketDerivativeUpdates/PutCallRatio`  
**Description:** Executes the PutCallRatio action under the Market Derivative Updates module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| PCRType | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "all",
  "Expiry": "all",
  "PCRType": "optidx"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"ScriptName": "BANKNIFTY",
"CALLOI": "2.43 Cr",
"PUTOI": "2.33 Cr",
"PCR": 0.96,
"Token": 0,
"Ltp": 0,
"ExpiryDate": "27 Mar 2025"
}}}
```

---

<a id="report-40"></a>

### 3.Most Active Calls/Puts

#### 1. MostActiveCallsAndPuts

**Method:** `POST`  
**Endpoint:** `/api/MarketDerivativeUpdates/MostActiveCallsAndPuts`  
**Description:** Retrieves the most active calls and puts data with OI, volume, and LTP details.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| MACPType | String | Yes |  | string |
| SCP | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | stri |

**Sample Request:**

```json
{
  "MACPType": "Indices",
  "SCP": "Calls",
  "ScripName": "all",
  "Expiry": "all",
  "Sort": "Desc",
  "ColumnName": "OI"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "CallPutData": [
      {
        "Token": 45480,
        "Symbol": "NIFTY",
        "Expiry": "13 Mar 2025",
        "Strike": 22800,
        "SCP": "CE",
        "LTP": 36.55,
        "LTPChange": -13.2,
        "LTPChangePercent": -26.53,
        "Volume": "11.72 Cr",
        "OI": "1.20 Cr"
      }
    ]
  }
}
```

---

<a id="report-41"></a>

### 4.Ban List (MWPL)

#### 1. BanList(MWPL)

**Method:** `GET`  
**Endpoint:** `/api/MarketDerivativeUpdates/BanList(MWPL)`  
**Description:** Retrieves the Ban List (MWPL) of stocks that are in the ban period for F&O trading.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Authorization | Bearer {{token}} |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| GridFilter | String | Yes | Filter for grid data (e.g. All Stocks). | All Stocks |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4624,
  "Message": "string",
  "Result": {
    "MWPLAll": [
      {
        "ScripName": "string",
        "MWPL": 2069.3465358994345,
        "OpenInterest": 5001.382588088679,
        "MWPLPercent": 5400.607980456802,
        "YesMWPLPercent": 4034.302150103284
      },
      {
        "ScripName": "string",
        "MWPL": 9611.509943720386,
        "OpenInterest": 9855.314805042392,
        "MWPLPercent": 26.08201735108784,
        "YesMWPLPercent": 1027.016053925096
      }
    ],
    "ChartData": [
      {
        "ScripName": "string",
        "MWPLPercent": 1083.8001198313596
      },
      {
        "ScripName": "string",
        "MWPLPercent": 6002.292085204371
      }
    ],
    "PageNo": 2320,
    "PageSize": 5515,
    "Count": 4422
  }
}
```

---

<a id="report-42"></a>

### 5.Future Open Interest

#### 1. GetFuturesOpenInterest

**Method:** `POST`  
**Endpoint:** `/api/MarketDerivativeUpdates/GetFuturesOpenInterest`  
**Description:** Retrieves historical futures Open Interest data for a given scrip with price and OI changes. Supports date range filtering and buildup classification.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | NIFTY |
| Expiry | String | Yes |  | 28 Apr 2026 |
| Filter | String | Yes |  | 1m |
| StartDate | String | Yes |  |  |
| EndDate | String | Yes |  |  |

**Sample Request:**

```json
{
  "scripName": "NIFTY",
  "expiry": "Combined",
  "startDate": "01 Jun 2026",
  "endDate": "19 Jun 2026"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "scripName": "NIFTY",
      "ltp": 24500,
      "oi": 12500000,
      "priceChange": 1.2,
      "oiChange": 5.8,
      "builtup": "Long Build Up",
      "volume": 8500000
    }
  ]
}
```

---

# Analysis

## IV Analysis

<a id="report-43"></a>

### 1.IV Screener

#### 1. GetIVScreener

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetIVScreener`  
**Description:** Retrieves the Implied Volatility (IV) screener list with filtering by page, sector, script, volume, and expiry.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 5564 |
| PageSize | Integer | Yes |  | 2953 |
| Condition | Integer | Yes |  | 6187 |
| Sector | String | Yes |  | string |
| Script | String | Yes |  | str |
| VolAbove | String | Yes |  | string |
| VolBelow | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| columnName | String | Yes |  | string |
| Sort | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "Condition": 0,
  "Sector": "All",
  "Script": "",
  "VolAbove": "All",
  "VolBelow": "All",
  "Expiry": "20 FEB 2025"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"IVScreenerList": [
{
"ScriptName": "ANGELONE",
"Sector": "",
"Scp": "PE",
"EQLTP": 2355.1,
"StrikeATM": 2400,
"LiveLTP": 0,
"LiveIV": 0,
"AvgIV": 61.34,
"PredictedIV": 0,
"MaxIV200": 112.58,
"MinIV200": 31.75,
"MaxIV100": 112.58,
"MinIV100": 31.75,
"MaxIV30": 112.58,
"MinIV30": 41.61,
"MaxIV10": 90.2,
"MinIV10": 44.74,
"YesterDayClosingIV": 44.74,
"MaxIVYesterday": 0,
"MinIVYesterday": 0
}}}
```

---

<a id="report-44"></a>

### 2. IV Skew Analysis

#### 1. GetIVSkew

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetIVSkew`  
**Description:** Executes the GetIVSkew action under the IV Screener module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexAndStockName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |
| NumberofStrikes | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexAndStockName": "NIFTY",
  "ExpiryDate": "",
  "NumberofStrikes": "10"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",


"Result": {
"SpotPrice": "22795.90",
"SpotPriceChange": "-117.25",
"SpotPriceChangePer": "-0.51",
"FuturePrice": "22799.60",
"FuturePriceChange": "-142.90",
"FuturePriceChangePer": "-0.62",
"AvgCallIV": "8.77",
"AvgPutIV": "14.34",
"NearByStrike": "22800",
"IVSkewData": [
{
"CallIV": "0",
"CallLTP": "476.65",
"CallChange": "-135.35",
"nStrike": "22350",
"PutIV": "14.03",
"PutLTP": "23.2",
"PutChange": "3.95"
}}}
```

---

<a id="report-45"></a>

### 3.IV Historical Analysis

#### 1. GetIVHistoricalSelectedDetails

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetIVHistoricalSelectedDetails`  
**Description:** Get detailed historical IV data for selected parameters.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | Yes |  | string |
| MWType | String | Yes |  | string |
| SelectedDate | String | Yes |  | string |
| SelectedSpot | String | Yes |  | string |
| SelectedDays | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScriptName": "string",
  "MWType": "string",
  "SelectedDate": "string",
  "SelectedSpot": "string",
  "SelectedDays": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4390,
  "Message": "string",
  "Result": {
    "ddate": "string",
    "CallIV": "string",
    "PutIV": "string",
    "ExpiryDays": 6969,
    "WeekDays": "string",
    "StrikePrice": "string",
    "CE_Price": "string",
    "PE_Price": "string",
    "FuturePrice": "string",
    "OptionType": "string"
  }
}
```

---

#### 2. GetIVHistorical

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetIVHistorical`  
**Description:** Executes the GetIVHistorical action under the IV Screener module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | Yes |  | string |
| MWType | String | Yes |  | string |
| Fromdate | String | Yes |  | string |
| Todate | String | Yes |  | string |
| OptionType | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScriptName": "nifty",
  "MWType": "Weekly",
  "Fromdate": "",
  "Todate": "",
  "OptionType": "Year"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"GetIVdata": [
{
"FuturePrice": "22913.15",
"OptionType": "",
"ddate": "20 Feb 2025",
"CallIV": "12.20",
"PutIV": "13.46",
"ExpiryDays": 7,
"WeekDays": "Thursday",
"StrikePrice": "",
"CE_Price": "",
"PE_Price": ""
}}}
```

---

<a id="report-46"></a>

### 4.IV Rank & Percentile

#### 1. GetIVRankGainerLooser

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetIVRankGainerLooser`  
**Description:** Get IV rank gainers and losers.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| RankText | String | Yes |  | string |

**Sample Request:**

```json
{
  "RankText": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 2527,
  "Message": "stri",
  "Result": {
    "PageNo": 5859,
    "PageSize": 255.31194421339666,
    "TotalRecords": 8409,
    "TotalPages": 840.8738379497738,
    "Data": [
      {
        "SYMBOL": "string",
        "LTP": "string",
        "Change": "string",
        "LiveIv": "string",
        "IvChange": "string",
        "IvRank": "string",
        "Ivpercentile": "string",
        "Token": "string",
        "Segment": "string"
      },
      {
        "SYMBOL": "string",
        "LTP": "string",
        "Change": "string",
        "LiveIv": "string",
        "IvChange": "string",
        "IvRank": "string",
        "Ivpercentile": "string",
        "Token": "string",
        "Segment": "string"
      }
    ],
    "Count": 4455,
    "IVRankRCalendar": [
      {
        "Symbol": "string",
        "FormattedDate": "string",
        "Purpose": "string"
      },
      {
        "Symbol": "string",
        "FormattedDate": "string",
        "Purpose": "string"
      }
    ]
  }
}
```

---

#### 2. GetIVRankAndPercentile

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetIVRankAndPercentile`  
**Description:** Executes the GetIVRankAndPercentile action under the IV Screener module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 1 |
| PageSize | Integer | Yes |  | 20 |
| NoOfDays | String | Yes |  | 1 month |
| RankText | String | Yes |  | High Rank |

**Sample Request:**

```json
{
  "RankText": "High",
  "NoOfDays": "1 year"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data": [
{
"SYMBOL": "MANAPPURAM",
"LTP": "201.32",
"Change": "-2.00",
"LiveIv": "97.11",
"IvChange": "85.07",
"IvRank": "100",
"Ivpercentile": "67.46"
}}}
```

---

<a id="report-47"></a>

### 5.IV Trends

#### 1. CFIV_Yesterday

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/CFIV_Yesterday`  
**Description:** Get yesterday closing IV data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 5564 |
| PageSize | Integer | Yes |  | 2953 |
| Condition | Integer | Yes |  | 6187 |
| Sector | String | Yes |  | string |
| Script | String | Yes |  | str |
| VolAbove | String | Yes |  | string |
| VolBelow | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| columnName | String | Yes |  | string |
| Sort | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 5564,
  "PageSize": 2953,
  "Condition": 6187,
  "Sector": "string",
  "Script": "str",
  "VolAbove": "string",
  "VolBelow": "string",
  "Expiry": "string",
  "columnName": "string",
  "Sort": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 9037,
  "Message": "string",
  "Result": {
    "IVScreenerList": [
      {
        "ScriptName": "string",
        "Sector": "string",
        "Scp": "string",
        "EQLTP": 5392.442680313449,
        "StrikeATM": 1132.6806565023983,
        "LiveLTP": 564.9236688837101,
        "LiveIV": 8234.543269847874,
        "AvgIV": 5581.209405837569,
        "PredictedIV": 181.96253025132057,
        "YesterIVFor": 7494.296547227313,
        "MaxIV200": 7331.745965372769,
        "MinIV200": 2044.9627901576962,
        "MaxIV100": 3887.05984570058,
        "MinIV100": 3024.7535358463538,
        "MaxIV30": 240.11734471548252,
        "MinIV30": 1309.5919592191808,
        "MaxIV10": 9279.935646817614,
        "MinIV10": 3145.9614615144947,
        "YesterDayClosingIV": 3069.0780346054703,
        "MaxIVYesterday": 621.57810880058,
        "MinIVYesterday": 2167.355061230649,
        "Segment": "string",
        "EQToken": "string",
        "LiveToken": "string",
        "FlagName": "string",
        "Change": 9002.219224434846,
        "PreviousIV": 3023.5941372206553,
        "ChangeInPercent": 802.4270290838675
      },
      {
        "ScriptName": "string",
        "Sector": "string",
        "Scp": "string",
        "EQLTP": 6864.563825171191,
        "StrikeATM": 2050.448102034168,
        "LiveLTP": 847.7772583097632,
        "LiveIV": 3823.3168020749895,
        "AvgIV": 8759.20486809236,
        "PredictedIV": 9324.895651779389,
        "YesterIVFor": 4234.658447773574,
        "MaxIV200": 7158.732315116552,
        "MinIV200": 5953.036867746193,
        "MaxIV100": 1042.9066220446837,
        "MinIV100": 6114.183946712899,
        "MaxIV30": 3642.307004395604,
        "MinIV30": 5724.37934027751,
        "MaxIV10": 8665.079380778961,
        "MinIV10": 1684.2611639558113,
        "YesterDayClosingIV": 5873.673113988182,
        "MaxIVYesterday": 3170.6300375674723,
        "MinIVYesterday": 4489.01194391605,
        "Segment": "string",
        "EQToken": "string",
        "LiveToken": "string",
        "FlagName": "string",
        "Change": 7812.465550628571,
        "PreviousIV": 1798.2478905655719,
        "ChangeInPercent": 5242.911161401238
      }
    ],
    "ScriptName": [
      "string",
      "string"
    ],
    "IVSResultCalendar": [
      {
        "Symbol": "string",
        "FormattedDate": "string",
        "Purpose": "string"
      },
      {
        "Symbol": "string",
        "FormattedDate": "string",
        "Purpose": "string"
      }
    ]
  }
}
```

---

#### 2. GetAverageIV

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetAverageIV`  
**Description:** Calculates and returns the average Implied Volatility (IV) for Call and Put options over time. Uses the Black-Scholes model. Supports SMA smoothing with configurable window size.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Instrument | String | Yes |  | s |
| Strike | Number | Yes |  | 837.5452953120965 |
| Interval | String | Yes |  | string |
| Window_Size | Integer | Yes |  | 8743 |

**Sample Request:**

```json
{
  "indexStockName": "NIFTY",
  "expiry": "27 Jun 2026",
  "instrument": "OPT",
  "interval": "5 Min",
  "window_Size": 5
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "data": [
      {
        "feedUpdateTime": "2026-06-19T09:30:00",
        "underlyingPrice": "24500.00",
        "callSmaIV": 14.25,
        "putSmaIV": 15.8,
        "callIV": 14.5,
        "putIV": 16.1,
        "liveCallIV": 14.5,
        "livePutIV": 16.1
      }
    ]
  }
}
```

---

<a id="report-48"></a>

### 6.Volga IV Table

#### 1. GetVolgaIVTableData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetVolgaIVTableData`  
**Description:** Provides strike-wise IV analysis with 5-day historical IV data, current IV positioning, IV score, and actionable signals (Buy/Wait/Sell) based on IV percentiles.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Scripname | String | Yes |  | ABB |
| Expiry | String | Yes |  | 26 may 2026 |

**Sample Request:**

```json
{
  "scripname": "NIFTY",
  "expiry": "27 Jun 2026"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "scripName": "NIFTY",
      "token": 43726,
      "strike": 24500,
      "type": "CE",
      "iv_1D": 14.5,
      "fiveD_HighIV": 16.8,
      "fiveD_LowIV": 12.5,
      "fiveD_AvgIV": 14.2,
      "ivScore": 0.47,
      "action": "Buy",
      "currentIV": 14.5
    }
  ]
}
```

---

<a id="report-49"></a>

### 7.Volga IV Strike

#### 1. GetVolgaIVStrikeData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/GetVolgaIVStrikeData`  
**Description:** Returns OHLC (Open, High, Low, Close) IV data for a specific strike price and option type (CE/PE) across a specified day range.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Scripname | String | Yes |  | Nifty |
| Expiry | String | Yes |  | 12 may 2026 |
| Strike | Integer | Yes |  | 24250 |
| Scp | String | Yes |  | Ce |
| Day | String | Yes |  | 1D IV |

**Sample Request:**

```json
{
  "scripname": "NIFTY",
  "expiry": "27 Jun 2026",
  "strike": 24500,
  "scp": "CE",
  "day": "1"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "openIV": 14.2,
    "highIV": 16.8,
    "lowIV": 12.5,
    "closeIV": 14.5,
    "avgIV": 14.2
  }
}
```

---

<a id="report-50"></a>

### 8.IV Time Chart

#### 1. IVTimeChart

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/IVTimeChart`  
**Description:** Returns intraday IV time series data for the ATM strike, showing how Call and Put IV changes over time during the trading day.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Scripname | String | Yes |  | nifty |
| Expiry | String | Yes |  | 19 may 2026 |

**Sample Request:**

```json
{
  "scripname": "NIFTY",
  "expiry": "27 Jun 2026"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "scripName": "NIFTY",
      "strike": 24500,
      "expiry": "27 Jun 2026",
      "feedtimeonly": "09:30",
      "celtp": 250,
      "peltp": 180,
      "callIV": 14.5,
      "putIV": 16.1
    }
  ]
}
```

---

<a id="report-51"></a>

### 9.OHLC IV Data

#### 1. OHLCDataToCalCulateIVs

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIV/OHLCDataToCalCulateIVs`  
**Description:** Calculates today's OHLC IV values (Open, High, Low, Live, Average) for a given scrip, strike, and option type using the Black-Scholes model.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | Nifty |
| Expiry | String | Yes |  | 12 May 2026 |
| Strike | String | Yes |  | 24450 |
| Scp | String | Yes |  | Ce |

**Sample Request:**

```json
{
  "scripName": "NIFTY",
  "expiry": "27 Jun 2026",
  "scp": "CE"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "token": "43726",
    "scripName": "NIFTY",
    "scp": "CE",
    "openIV": "14.20",
    "liveIV": "14.50",
    "highIV": "16.80",
    "lowIV": "12.50",
    "avgIV": "14.20"
  }
}
```

---

## Intraday Analysis

<a id="report-52"></a>

### 1. Intraday Buildup

#### 1. GetIntradayBuildupStrike

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetIntradayBuildupStrike`  
**Description:** Executes the GetIntradayBuildupStrike action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "BankNIFTY"
}
```

---

#### 2. GetIntradayBuildUP

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetIntradayBuildUP`  
**Description:** Executes the GetIntradayBuildUP action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |
| OFType | String | Yes |  | stri |
| Expiry | String | Yes |  | string |
| Times | String | Yes |  | string |
| strike | Number | Yes |  | 9838.073545743904 |

**Sample Request:**

```json
{
  "IndexName": "string",
  "OFType": "stri",
  "Expiry": "string",
  "Times": "string",
  "strike": 9838.073545743904
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": []
}
```

---

#### 3. GetIntradayBuildupExpiry

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetIntradayBuildupExpiry`  
**Description:** Executes the GetIntradayBuildupExpiry action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | string |
| OFType | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexName": "BankNIFTY"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
"27 Feb 2025",
"06 Mar 2025",
"13 Mar 2025",
"20 Mar 2025",
"27 Mar 2025",
"03 Apr 2025",
"24 Apr 2025",
"26 Jun 2025",
"25 Sep 2025",
"24 Dec 2025"
"ATMStrike": 49000,
"FeedTime": "0001-01-01T00:00:00" } }
```

---

<a id="report-53"></a>

### 2.Intraday IV

#### 1. GetIntradayIVONLoad

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetIntradayIVONLoad`  
**Description:** Executes the GetIntradayIVONLoad action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | st |

**Sample Request:**

```json
{
  "IndexStockName": "string",
  "Expiry": "st"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": []
}
```

---

#### 2. GetIntradayIVExpiryStrike

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetIntradayIVExpiryStrike`  
**Description:** Executes the GetIntradayIVExpiryStrike action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| UFVal | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexStockName": "Nifty",
  "Expiry": "20 FEB 2024",
  "UFVal": "U"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "Expiries": [
        "02/27/2025 00:00:00",
        "03/06/2025 00:00:00",
        "03/13/2025 00:00:00",
        "03/20/2025 00:00:00",
        "03/27/2025 00:00:00",
        "04/03/2025 00:00:00",
        "04/24/2025 00:00:00",
        "06/26/2025 00:00:00",
        "09/25/2025 00:00:00",
        "12/24/2025 00:00:00"
      ],
      "Strikes": []
    }
  ]
}
```

---

#### 3. GetIntradayIVLHLAValues

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetIntradayIVLHLAValues`  
**Description:** Executes the GetIntradayIVLHLAValues action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| 0 | String | Yes |  | string |
| 1 | String | Yes |  | string |

**Sample Request:**

```json
[
  "string",
  "string"
]
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": []
}
```

---

#### 4. GetIntradayIVStrikeChange

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetIntradayIVStrikeChange`  
**Description:** Executes the GetIntradayIVStrikeChange action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |

**Sample Request:**

```json
{
  "IndexStockName": "NIFTY",
  "Expiry": "20 FEB 2025",
  "Strike": "24200"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": []
}
```

---

#### 5. GetIntradayIVChartData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetIntradayIVChartData`  
**Description:** Executes the GetIntradayIVChartData action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| TokenList | Array | Yes |  | ["string","string"] |

**Sample Request:**

```json
{
  "TokenList": [
    "43916",
    "43917"
  ]
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": []
}
```

---

#### 6. GetUnderlyingData

**Method:** `GET`  
**Endpoint:** `/api/AnalysisIntraday/GetUnderlyingData`  
**Description:** Executes the GetUnderlyingData action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | No |  | string |

---

<a id="report-54"></a>

### 3.Straddle Chart

#### 1. GetStraddleChartData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetStraddleChartData`  
**Description:** Executes the GetStraddleChartData action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |
| Interval | String | Yes |  | string |
| SMA | Integer | Yes |  | 306 |

**Sample Request:**

```json
{
  "IndexStockName": "NIFTY",
  "Expiry": "null",
  "Strike": "0",
  "Interval": "1m"
}
```

---

#### 2. GetStraddlesChartDatanew

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetStraddlesChartDatanew`  
**Description:** Get straddles chart data (new version).

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |
| Interval | String | Yes |  | string |
| SMA | Integer | Yes |  | 306 |

**Sample Request:**

```json
{
  "IndexStockName": "string",
  "Expiry": "string",
  "Strike": "string",
  "Interval": "string",
  "SMA": 306
}
```

---

#### 3. GetSSChartLTPOIData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetSSChartLTPOIData`  
**Description:** Get SS chart LTP and OI data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| RowCount | Integer | Yes |  | 7377 |

**Sample Request:**

```json
{
  "IndexStockName": "string",
  "Expiry": "string",
  "RowCount": 7377
}
```

---

#### 4. GetSSChartExpiryStrikeData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetSSChartExpiryStrikeData`  
**Description:** Get SS chart expiry and strike data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | str |

**Sample Request:**

```json
{
  "IndexStockName": "string",
  "Expiry": "str"
}
```

---

<a id="report-55"></a>

### 4.Strangle Chart

#### 1. GetStrangleChartData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetStrangleChartData`  
**Description:** Executes the GetStrangleChartData action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| CallStrike | Number | Yes |  | 2991.2399750861796 |
| PutStrike | Number | Yes |  | 2004.3461659009654 |
| ZoomFilter | String | Yes |  | string |
| SMA | Integer | Yes |  | 9641 |

**Sample Request:**

```json
{
  "IndexStockName": "Nifty",
  "Expiry": "27 FEB 2025",
  "CallStrike": 24200,
  "PutStrike": 24200,
  "ZoomFilter": "1m"
}
```

---

#### 2. GetStrangleChartDatas

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetStrangleChartDatas`  
**Description:** Get strangle chart data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexStockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| CallStrike | Number | Yes |  | 2991.2399750861796 |
| PutStrike | Number | Yes |  | 2004.3461659009654 |
| ZoomFilter | String | Yes |  | string |
| SMA | Integer | Yes |  | 9641 |

**Sample Request:**

```json
{
  "IndexStockName": "string",
  "Expiry": "string",
  "CallStrike": 2991.2399750861796,
  "PutStrike": 2004.3461659009654,
  "ZoomFilter": "string",
  "SMA": 9641
}
```

---

<a id="report-56"></a>

### 5.Multi Straddle Charts

#### 1. GetMultiStraddle

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetMultiStraddle`  
**Description:** Retrieves multi-straddle strike data for a given symbol, expiry and ATM strike.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| symbol | String | Yes |  | string |
| expiry | String | Yes |  | string |
| atmstrike | Number | Yes |  | 5015.47786967577 |

**Sample Request:**

```json
{
  "symbol": "NIFTY",
  "expiry": "",
  "atmstrike": 24250
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "tokens": "43896,43897",
      "Symbol": "NIFTY",
      "Expiry": "27 Mar 2025",
      "Strike": 24250,
      "ExpiryType": "Near Month ATM"
    }
  ]
}
```

---

#### 2. GetMultiStrike

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetMultiStrike`  
**Description:** Executes the GetMultiStrike action under the Intraday Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| symbol | String | Yes |  | string |
| expiry | String | Yes |  | string |
| atmstrike | Number | Yes |  | 5015.47786967577 |

**Sample Request:**

```json
{
  "symbol": "Nifty",
  "expiry": "27 FEB 2025",
  "atmstrike": 24250
}
```

---

#### 3. GetMultiStraddleChart

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetMultiStraddleChart`  
**Description:** Retrieves multi-straddle chart data for given tokens and interval.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| tokens | String | Yes |  | string |
| interval | String | Yes |  | string |
| SMA | Integer | Yes |  | 3223 |

**Sample Request:**

```json
{
  "tokens": "43896,43897",
  "interval": "1"
}
```

---

#### 4. GetMultiStraddleChartSMA

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetMultiStraddleChartSMA`  
**Description:** Get multi straddle chart with SMA.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| tokens | String | Yes |  | string |
| interval | String | Yes |  | string |
| SMA | Integer | Yes |  | 3223 |

**Sample Request:**

```json
{
  "tokens": "string",
  "interval": "string",
  "SMA": 3223
}
```

---

<a id="report-57"></a>

### 6.OI Intervals

#### 1. GetOIInterval

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/GetOIInterval`  
**Description:** Analyzes Open Interest changes across multiple time intervals (3-min, 15-min, 60-min, Daily) to identify OI gainers and losers.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| scripName | String | No | Scrip/index name | NIFTY |
| expiry | String | No | Expiry date | 27 Jun 2026 |
| cpType | String | No | Call/Put type filter |  |

**Sample Request:**

```json
{
  "scripName": "NIFTY",
  "expiry": "27 Jun 2026"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "oiGainer": [
      {
        "strike_3": 24500,
        "scp_3": "CE",
        "oi_change_3": 5000
      }
    ],
    "oiLoser": [
      {
        "strike_3": 24600,
        "scp_3": "PE",
        "oi_change_3": -3000
      }
    ]
  }
}
```

---

#### 2. OIIntervalExpiries

**Method:** `GET`  
**Endpoint:** `/api/AnalysisIntraday/OIIntervalExpiries`  
**Description:** Returns available expiry dates for OI Interval analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Authorization | Bearer {{token}} |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | Yes |  | NIFTY |
| BhavDate | String | Yes |  | 19 Jun 2026 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "Expiries": [
      "27 Jun 2026",
      "03 Jul 2026"
    ]
  }
}
```

---

<a id="report-58"></a>

### 7.Cash Future Pair Trading

#### 1. CashFuturePairTrading

**Method:** `GET`  
**Endpoint:** `/api/AnalysisIntraday/CashFuturePairTrading`  
**Description:** Analyzes the price relationship between cash (equity) and futures prices for the same underlying. Tracks the basis and spread movement.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| scripName1 | String | No | Cash scrip name | RELIANCE |
| scripName2 | String | No | Future scrip name | RELIANCE |
| expiry2 | String | No | Future expiry date | 27 Jun 2026 |
| interval | String | No | Time interval | 5 Min |
| sma | Integer | No | SMA window | 5 |
| historicalDate | String | No | Historical date filter |  |

**Sample Request:**

```json
{
  "scripName1": "RELIANCE",
  "scripName2": "RELIANCE",
  "expiry2": "27 Jun 2026",
  "interval": "5 Min",
  "sma": 5
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "time": "2026-06-19T09:30:00",
      "cashLTP": 2450,
      "futltp2": 2465,
      "difference": -15
    }
  ]
}
```

---

<a id="report-59"></a>

### 8.Future Pair Trading

#### 1. FuturePairTrading

**Method:** `GET`  
**Endpoint:** `/api/AnalysisIntraday/FuturePairTrading`  
**Description:** Analyzes the price relationship between two futures contracts for pair trading strategies. Tracks the difference, spread, amount difference, and SMA.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| scripName1 | String | No | First scrip name | NIFTY |
| expiry1 | String | No | First expiry date | 27 Jun 2026 |
| scripName2 | String | No | Second scrip name | BANKNIFTY |
| expiry2 | String | No | Second expiry date | 27 Jun 2026 |
| interval | String | No | Time interval | 5 Min |
| sma | Integer | No | SMA window | 5 |
| historicalDate | String | No | Historical date filter |  |

**Sample Request:**

```json
{
  "scripName1": "NIFTY",
  "expiry1": "27 Jun 2026",
  "scripName2": "BANKNIFTY",
  "expiry2": "27 Jun 2026",
  "interval": "5 Min",
  "sma": 5
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "time": "2026-06-19T09:30:00",
      "futltp1": 24500,
      "futltp2": 52000,
      "difference": -27500
    }
  ]
}
```

---

<a id="report-60"></a>

### 9.Historical Data

#### 1. GetHistoricalDate

**Method:** `GET`  
**Endpoint:** `/api/AnalysisIntraday/GetHistoricalDate`  
**Description:** Get historical date for intraday analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 2. YearlyAnalysis

**Method:** `POST`  
**Endpoint:** `/api/AnalysisIntraday/YearlyAnalysis`  
**Description:** Get yearly analysis data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Authorization | Bearer {{token}} |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| IndexStockName | String | Yes | Stock or index name. | NIFTY |
| Expiry | String | Yes | Expiry date. | 27 Jun 2026 |

---

## Options Analysis

<a id="report-61"></a>

### 1.Options Chain

#### 1. OptionChain

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/OptionChain`  
**Description:** Executes the OptionChain action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Rowcount | Integer | Yes |  | 9824 |
| isLotSize | Boolean | Yes |  | true |
| isFullValue | Boolean | Yes |  | false |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "Rowcount": 9824,
  "isLotSize": true,
  "isFullValue": false
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 5263,
  "Message": "string",
  "Result": {
    "OptionChain": [
      {
        "Script": "string",
        "Instrument": "string",
        "Strike": 555.2207033074752,
        "CallToken": 7127,
        "PutToken": 6400,
        "CallOI": "string",
        "PutOI": "string",
        "BroadcastConstant": 7701,
        "ExchangeID": 8526,
        "ExpiryDate": "string",
        "DbCallPrice": "st",
        "DbCallPriceChange": "string",
        "DbCallPriceChangePercent": "string",
        "DbCallOI": "string",
        "DbCallOIChange": "string",
        "DbPutPrice": "string",
        "DbPutPriceChange": "string",
        "DbPutPriceChangePercnet": "string",
        "DbPutOI": "string",
        "DbPutOIChange": "string",
        "CallIV": "string",
        "PutIV": "string",
        "CallVolume": "string",
        "PutVolume": "string",
        "CallOIChangePercent": "string",
        "PutOIChangePercent": "string",
        "CallDelta1": "string",
        "PutDelta1": "string",
        "CallTheta1": "string",
        "PutTheta1": "string",
        "CallGamma1": "string",
        "PutGamma1": "string",
        "PutVega1": "string",
        "CallVega1": "string",
        "CallRho1": "string",
        "PutRho1": "string",
        "PCR": "string",
        "PutIntrinsicValue": "string",
        "PutTimeValue": "string",
        "CallIntrinsicValue": "string",
        "CallTimeValue": "string",
        "PutIVChange": "string",
        "CallIVChange": "string",
        "CallBuiltUP": "string",
        "PutBuiltUp": "string",
        "PutOIProgress": "string",
        "CallOIProgress": "string"
      },
      {
        "Script": "string",
        "Instrument": "string",
        "Strike": 8208.292549043263,
        "CallToken": 7992,
        "PutToken": 4627,
        "CallOI": "string",
        "PutOI": "string",
        "BroadcastConstant": 9858,
        "ExchangeID": 3571,
        "ExpiryDate": "string",
        "DbCallPrice": "string",
        "DbCallPriceChange": "string",
        "DbCallPriceChangePercent": "string",
        "DbCallOI": "string",
        "DbCallOIChange": "string",
        "DbPutPrice": "string",
        "DbPutPriceChange": "string",
        "DbPutPriceChangePercnet": "string",
        "DbPutOI": "string",
        "DbPutOIChange": "string",
        "CallIV": "string",
        "PutIV": "string",
        "CallVolume": "string",
        "PutVolume": "string",
        "CallOIChangePercent": "string",
        "PutOIChangePercent": "string",
        "CallDelta1": "string",
        "PutDelta1": "string",
        "CallTheta1": "string",
        "PutTheta1": "string",
        "CallGamma1": "string",
        "PutGamma1": "string",
        "PutVega1": "string",
        "CallVega1": "string",
        "CallRho1": "string",
        "PutRho1": "string",
        "PCR": "string",
        "PutIntrinsicValue": "string",
        "PutTimeValue": "string",
        "CallIntrinsicValue": "string",
        "CallTimeValue": "string",
        "PutIVChange": "string",
        "CallIVChange": "string",
        "CallBuiltUP": "string",
        "PutBuiltUp": "string",
        "PutOIProgress": "string",
        "CallOIProgress": "str"
      }
    ],
    "Expiries": [
      "str",
      "string"
    ],
    "CurrentPrice": {
      "NearByStrike": 5654.433152620284,
      "LotSize": 9464,
      "SToken": 3564,
      "FoToken": 3285,
      "sFutureExpiry": "string"
    },
    "minmaxRes": [
      {
        "CStrike3": 6208.153362958333,
        "CStrikeValue3": 7948.349178754286,
        "CStrike2": 3940.167104453658,
        "CStrikeValue2": 6097.162345963452,
        "CStrike1": 6593.38287484571,
        "CStrikeValue1": 6225.720537049022,
        "Highs": "string",
        "PStrikeValue1": 6802.4163033089735,
        "PStrike1": 4446.882529262546,
        "PStrikeValue2": 2108.665525501279,
        "PStrike2": 8503.406147052987,
        "PStrikeValue3": 5706.160275812924,
        "PStrike3": 4838.834264707923
      },
      {
        "CStrike3": 156.05485567701248,
        "CStrikeValue3": 9567.938624367627,
        "CStrike2": 7399.2482367016455,
        "CStrikeValue2": 9052.764510963087,
        "CStrike1": 2285.0512162226178,
        "CStrikeValue1": 1355.3976848033233,
        "Highs": "string",
        "PStrikeValue1": 7155.673514746212,
        "PStrike1": 2325.0776919689174,
        "PStrikeValue2": 9052.582952812156,
        "PStrike2": 6840.660257593882,
        "PStrikeValue3": 4512.780338510436,
        "PStrike3": 6127.3057717626125
      }
    ],
    "TotalPutOI": "string",
    "TotalCallOI": "string",
    "TotalPCR": "string"
  }
}
```

---

<a id="report-62"></a>

### 2.Open Interest

#### 1. GetChartFUTOIData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetChartFUTOIData`  
**Description:** Executes the GetChartFUTOIData action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "StockName": "acc",
  "ExpiryDate": "null"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Expiry": [
"27 Feb 2025",
"27 Mar 2025",
"24 Apr 2025"
],
"PCR": [
{
"ScriptName": "29 Nov 2024",
"CALLOI": "1500",
"PUTOI": "2261.00",
"PCR": 0,
"Token": 0,
"Ltp": 0,
"ExpiryDate": "27 Feb 2025"
}}}
```

---

#### 2. GetChartOIDataDayWise

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetChartOIDataDayWise`  
**Description:** Executes the GetChartOIDataDayWise action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "StockName": "acc",
  "ExpiryDate": "null"
}
```

**Sample Response:**

```json
{ {
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"Strike": "27 Dec 2024",
"CallOI": "600",
"PutOI": "1800",
"LTP": "2065.6",
"Callltp": 0,
"Putltp": 0
}}}
```

---

#### 3. GetOpenInterest

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetOpenInterest`  
**Description:** Executes the GetOpenInterest action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |
| NumberofStrikes | Integer | Yes |  | 2255 |

**Sample Request:**

```json
{
  "StockName": "string",
  "ExpiryDate": "string",
  "NumberofStrikes": 2255
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 7381,
  "Message": "strin",
  "Result": [
    {
      "Strike": "string",
      "CallOI": "string",
      "PutOI": "string",
      "LTP": "string",
      "Callltp": 5817.208516544605,
      "Putltp": 3096.556035929039,
      "Token": 7509,
      "FeedTime": "2014-05-04T02:24:41.990Z"
    },
    {
      "Strike": "string",
      "CallOI": "string",
      "PutOI": "string",
      "LTP": "string",
      "Callltp": 1654.5301111964038,
      "Putltp": 5139.698597117055,
      "Token": 7657,
      "FeedTime": "1989-05-10T07:07:17.281Z"
    }
  ]
}
```

---

<a id="report-63"></a>

### 3.Change In OI

#### 1. GetChangeinOI

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetChangeInOI`  
**Description:** Executes the GetChangeinOI action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| FromTime | String | Yes |  | string |
| ToTime | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |
| NumberofStrikes | Integer | Yes |  | 7552 |

**Sample Request:**

```json
{
  "StockName": "NIFTY",
  "FromTime": "09:15",
  "ToTime": "13:15",
  "ExpiryDate": "Null",
  "NumberofStrikes": 5
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"LTPChange": "-20.4",
"LTPChangePercent": "-0.09",
"LTPFuturesChange": "-23.4",
"LTPFuturesChangePercent": "-0.1",
"OIChangeTime": [
{
"Id": "NIFTY",
"Name": "21 Feb 2025 09:16",
"Category": "22882.75"
},
"SpotPrice": "22892.8",
"SpotPriceChange": "",
"SpotPriceChangePer": "",
"FuturePrice": "22919.1",
"FuturePriceChange": "",


"FuturePriceChangePer": "",
"AvgCallIV": "6028650",
"AvgPutIV": "7313550",
"NearByStrike": "",
"IVSkewData": [
{
"CallIV": "112425",
"CallLTP": "300.55",
"CallChange": null,
"nStrike": "22700",
"PutIV": "704925",
"PutLTP": "73.85",
"PutChange": null}}
```

---

#### 2. GetChartFUTOIChangeData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetChartFUTOIChangeData`  
**Description:** Executes the GetChartFUTOIChangeData action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "StockName": "nifty",
  "ExpiryDate": "null"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Expiry": [
"27 Feb 2025",
"27 Mar 2025",
"24 Apr 2025"
],
"PCR": [
{
"ScriptName": "01 Feb 2025",
"CALLOI": "-382500",
"PUTOI": "23555.55",
"PCR": 0,
"Token": 0,
"Ltp": 0,
"ExpiryDate": "27 Feb 2025"
}}}
```

---

<a id="report-64"></a>

### 4.put-call-ratio

#### 1. GetHistoricalPCR

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetHistoricalPCR`  
**Description:** Executes the GetHistoricalPCR action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Script | String | Yes |  | string |
| Expiries | String | Yes |  | string |
| Expiry1 | String | Yes |  | string |
| Expiry2 | String | Yes |  | string |
| Expiry3 | String | Yes |  | string |
| Expiry4 | String | Yes |  | string |

**Sample Request:**

```json
{
  "Script": "Nifty",
  "Expiries": "NULL",
  "Expiry1": "",
  "Expiry2": "",
  "Expiry3": "",
  "Expiry4": ""
}
```

**Sample Response:**

```json
{
"Status": true,


"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Data1": {
"sExpiry": [
"27 Feb 2025",
"06 Mar 2025",
"13 Mar 2025",
"20 Mar 2025",
"27 Mar 2025",
"03 Apr 2025",
"24 Apr 2025",
"26 Jun 2025",
"25 Sep 2025",
"24 Dec 2025",
"25 Jun 2026",
"31 Dec 2026"
],
"_historicalpcr": [
{
"id": 0,
"dates": "20 Feb 2025",
"weekdates": "Thursday",
"spotprice": "22913.15",
"pcr": "0.83",
"previouspcr": "",
"spotpricechangeper": "-0.08612081",
"sScript": "",
"pcr1expiry": "",
"pcr2expiry": "",
"pcr3expiry": "",
"pcr4expiry": "",
"avgpcr": 0
}}}
```

---

#### 2. GetPCR

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetPCR`  
**Description:** Executes the GetPCR action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| RangeTxt | Integer | Yes |  | 1757 |

**Sample Request:**

```json
{
  "ScriptName": "nifty",
  "Expiry": "null",
  "RangeTxt": 10
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"PCR": 0.724,
"LTP": 22777.60,
"SCRIPNAME": "nifty",
"Expiry": "27 Feb 2025",
"time": "2025-02-21 10:50",
"PrevLTP": -5.2,
"ChangePercent": -0.02,
"FeedTime": "0001-01-01T00:00:00"
}}
```

---

#### 3. GetMultiScripPCR

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetMultiScripPCR`  
**Description:** Get PCR data for multiple scrips.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Time | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "Time": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4837,
  "Message": "string",
  "Result": [
    [
      {
        "ScripName": "string",
        "Expiry": "string",
        "PCR": 1277.2885921013487,
        "FeedTime": "string",
        "FeeTimeDate": "2004-09-03T18:36:47.780Z"
      },
      {
        "ScripName": "string",
        "Expiry": "stri",
        "PCR": 6633.560085580377,
        "FeedTime": "string",
        "FeeTimeDate": "1981-03-28T05:51:24.914Z"
      }
    ],
    [
      {
        "ScripName": "string",
        "Expiry": "string",
        "PCR": 1986.8134765731415,
        "FeedTime": "string",
        "FeeTimeDate": "1976-03-21T01:18:03.697Z"
      },
      {
        "ScripName": "string",
        "Expiry": "string",
        "PCR": 7602.5242482616995,
        "FeedTime": "s",
        "FeeTimeDate": "2016-05-23T00:57:45.548Z"
      }
    ]
  ]
}
```

---

<a id="report-65"></a>

### 5.MaxPain

#### 1. GetMaxPain

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetMaxPain`  
**Description:** Executes the GetMaxPain action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Scrip | String | Yes |  | string |
| StockExpiry | String | Yes |  | string |

**Sample Request:**

```json
{
  "Scrip": "nifty",
  "StockExpiry": "null"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Scrips": null,
"MaxPain": [
{
"nStrike": 21300,
"CallOI": 75,
"PutOI": 2646000,
"CallPain": 0,
"PutPain": 128182590000,
"nMaxPain": 128182590000}}
```

---

<a id="report-66"></a>

### 6.Option Scans

#### 1. GetOptionScans

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetOptionScans`  
**Description:** Retrieves option scan results for filtering and analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| GroupName | String | Yes |  | string |
| toprow | String | Yes |  | string |

**Sample Request:**

```json
{
  "GroupName": "string",
  "toprow": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 3954,
  "Message": "string",
  "Result": {
    "PriceUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "PriceDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "NearHighList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "NearLowList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "OIUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "OIDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "RolloversList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "OILimitList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "ActiveFuturesList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "VolumeGainersList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "IVUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "IVDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "PCRUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "PCRDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "DeliveryHeavyList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "DeliveryUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "BasisUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "BasisDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "AboveVWapList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "BelowVWapList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "LongBuildUp": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "ShortBuildUp": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "ShortCoveringUp": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "LongUnWanding": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "FeedTime": "1997-07-14T04:15:49.013Z"
  }
}
```

---

<a id="report-67"></a>

### 7.Multistrike-oi

#### 1. GetMultiStrikeData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetMultiStrikedata`  
**Description:** Executes the GetMultiStrikeData action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| sScript | String | Yes |  | string |
| Expiry | String | Yes |  | string |

**Sample Request:**

```json
{
  "sScript": "nifty",
  "Expiry": ""
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"List": [
{
"Token": "55629",
"Segment": "FO",
"Scripname": "NIFTY",
"Strike": "22750",
"Expiry": "27 Feb 2025",
"SCP": "CE"
},
"Expiry": [
"27 Feb 2025",
"06 Mar 2025",
"13 Mar 2025",
"20 Mar 2025",
"27 Mar 2025",
"03 Apr 2025",
"24 Apr 2025",
"26 Jun 2025",
"25 Sep 2025",
"24 Dec 2025",
"25 Jun 2026",
"31 Dec 2026"
]}}
```

---

#### 2. GetStocksStrikes

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetStocksStrikes`  
**Description:** Executes the GetStocksStrikes action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| sScript | String | Yes |  | string |
| Expiry | String | Yes |  | string |

**Sample Request:**

```json
{
  "sScript": "Reliance",
  "Expiry": "Null"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"CallsLTP": "208.5",
"Strike": "1020",
"PutsLTP": "0.15",
"ATM": "1240",
"FeedTime": "0001-01-01T00:00:00"
}}
```

---

#### 3. InsertMultiStrikeDynamicData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/InsertMultiStrikeDynamicData`  
**Description:** Executes the InsertMultiStrikeDynamicData action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | Integer | Yes |  | 1181 |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| GroupName | String | Yes |  | string |
| SCP | Array | Yes |  | ["string","string"] |
| Strike | Array | Yes |  | ["string","string"] |

**Sample Request:**

```json
{
  "LoginID": 6630,
  "ScripName": "Nifty",
  "Expiry": "20 FEB 2024",
  "GroupName": "Nifty 50",
  "SCP": [
    "CE"
  ],
  "Strike": [
    "24150"
  ]
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6691,
  "Message": "string",
  "Result": 6350
}
```

---

#### 4. GetMultiStrikeDynamicData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetMultiStrikeDynamicData`  
**Description:** Executes the GetMultiStrikeDynamicData action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| token | Integer | Yes |  | 9113 |
| segment | String | Yes |  | string |

**Sample Request:**

```json
{
  "token": 157188,
  "segment": "FO"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 5179,
  "Message": "string",
  "Result": [
    {
      "ScripName": "string",
      "Expiry": "string",
      "OI": "string",
      "FeedUpdateTime": "string",
      "Instrument": "string",
      "Strike": "string",
      "SCP": "string"
    },
    {
      "ScripName": "string",
      "Expiry": "string",
      "OI": "string",
      "FeedUpdateTime": "string",
      "Instrument": "string",
      "Strike": "string",
      "SCP": "string"
    }
  ]
}
```

---

#### 5. UpdateRenameGroupMultiStrike

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/UpdateRenameGroupMultiStrike`  
**Description:** Executes the UpdateRenameGroupMultiStrike action under the Option Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | Integer | Yes |  | 781 |
| OldGrpName | String | Yes |  | string |
| NewGrpNam | String | Yes |  | string |

**Sample Request:**

```json
{
  "LoginID": 781,
  "OldGrpName": "string",
  "NewGrpNam": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6691,
  "Message": "string",
  "Result": 6350
}
```

---

#### 6. GetMultiStrikeOIChartData

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetMultistrikeOIChartdata`  
**Description:** Retrieves multi-strike OI chart data for a given token and segment.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| token | Integer | Yes |  | 9113 |
| segment | String | Yes |  | string |

**Sample Request:**

```json
{
  "token": 157188,
  "segment": "FO"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "ScripName": "NIFTY",
      "Expiry": "27 Mar 2025",
      "OI": "22934.9",
      "FeedUpdateTime": "2025-02-21 09:15",
      "Instrument": "FUTIDX",
      "Strike": "22800",
      "SCP": "CE"
    }
  ]
}
```

---

#### 7. GetLTPForMultiStrikeGraph

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetLTPForMultiStrikeGraph`  
**Description:** Retrieves LTP and OI data for multi-strike graph.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "Nifty"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "OI": "22934.9",
      "FeedUpdateTime": "2025-02-21 09:15",
      "FeedTime": "2025-02-21T09:15:00"
    }
  ]
}
```

---

#### 8. DeleteGroupMultiStrike

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/DeleteGroupMultiStrike`  
**Description:** Delete a group of multi-strike data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | Integer | Yes |  | 237 |
| OldGrpName | String | Yes |  | string |

**Sample Request:**

```json
{
  "LoginID": 237,
  "OldGrpName": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6691,
  "Message": "string",
  "Result": 6350
}
```

---

<a id="report-68"></a>

### 8.Options-Premium-Analysis

#### 1. GetOptionPremiumAnalysis

**Method:** `POST`  
**Endpoint:** `/api/AnalysisSpecial/GetOptionPremiumAnalysis`  
**Description:** Retrieves Option Premium Analysis data with projected vs live IV and premium values.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| NumberofStrikes | Integer | Yes |  | 388 |
| IsChecked | Boolean | Yes |  | false |
| UnderlyingChange | Number | Yes |  | 5580.971913489401 |
| IvChange | Number | Yes |  | 5692.274508259876 |
| nDaysChange | Integer | Yes |  | 4298 |
| IVChecked | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "NumberofStrikes": 388,
  "IsChecked": false,
  "UnderlyingChange": 5580.971913489401,
  "IvChange": 5692.274508259876,
  "nDaysChange": 4298,
  "IVChecked": "string"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"LTP": {
"NearByStrike": 0,
"LotSize": 75,
"SToken": 4,
"FoToken": 35013,
"sFutureExpiry": ""
},
"OPAData": [
{
"col": "0.29",


"Expiry": "0001-01-01T00:00:00",
"cProjected_IV": 15.16,
"cLive_IV": "15.16",
"cProjected_premium": 37867.5,
"cLTP": 37867.5,
"Strike": "22350",
"pLTP": 1428.75,
"pProjected_premium": 1428.75,
"pLive_IV": "13.04",
"pProjected_IV": 13.04,
"pol": "14.61",
"DayLeft": 6,
"ATMPrice": 22800,
"GetTodayDate": "21 Feb 2025",
"PremiumChange": "22786.45",
"DayToExpiry": 6,
"CallDelta1": 64.5,
"PutDelta1": -10.5,
"CallGamma1": 0.04,
"CallTheta1": -668.6,
"PutTheta1": -472.5,
"PutGamma1": 0.04,
"PutVega1": 395.84,
"CallVega1": 485.41
}}}
```

---

<a id="report-69"></a>

### 9.Liquidity Finder

#### 1. LiquidityFinder

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/LiquidityFinder`  
**Description:** Provides an option chain view enhanced with liquidity analysis. Identifies liquid strikes based on average call/put volume, bid-ask spreads, and order book depth. Includes Greeks and arbitrage detection.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| scripName | String | Yes | Scrip/index name (e.g. NIFTY) | NIFTY |
| expiry | String | Yes | Expiry date | 27 Jun 2026 |
| rowcount | Integer | No | Number of rows (default: 30) | 30 |
| delAbove | String | No | Delta above filter |  |
| delBelow | String | No | Delta below filter |  |
| isLotSize | Boolean | No | Per-lot calculation flag | false |
| isFullValue | Boolean | No | Full value display flag | false |

**Sample Request:**

```json
{
  "scripName": "NIFTY",
  "expiry": "27 Jun 2026",
  "rowcount": 30,
  "isLotSize": false,
  "isFullValue": false
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "optionChain": [
      {
        "strike": "24500",
        "callOI": "125000",
        "putOI": "98000",
        "callIV": "14.50",
        "putIV": "16.10",
        "callDelta1": 0.52,
        "putDelta1": -0.48
      }
    ],
    "totalPutOI": "980000",
    "totalCallOI": "1250000",
    "totalPCR": "0.78"
  }
}
```

---

<a id="report-70"></a>

### 10.Premium Decay

#### 1. PreminumDecay

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/PreminumDecay`  
**Description:** Tracks the decay of option premiums over time for both Call and Put options. Calculates premium decay values and SMA for trend analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | Nifty |
| Expiry | String | Yes |  |  |
| Rowcount | Integer | Yes |  | 5 |
| Interval | String | Yes |  | 1 |
| SMA | Integer | Yes |  | 50 |

**Sample Request:**

```json
{
  "scripName": "NIFTY",
  "expiry": "27 Jun 2026",
  "rowcount": 20,
  "interval": "5 Min",
  "sma": 5
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "feedUpdateTime": "2026-06-19T09:30:00",
      "callDecayValue": -2.5,
      "putDecayValue": -1.8,
      "callSMA": -2.2,
      "putSMA": -1.65
    }
  ]
}
```

---

<a id="report-71"></a>

### 11.Options Dashboard

#### 1. CallAndPutValues

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/CallAndPutValues`  
**Description:** Get call and put values for options.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| sScript | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| UFVal | String | Yes |  | string |

**Sample Request:**

```json
{
  "sScript": "string",
  "Expiry": "string",
  "UFVal": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6785,
  "Message": "string",
  "Result": {
    "sScript": [
      "string",
      "string"
    ],
    "Expiry": [
      "string",
      "string"
    ],
    "MAStrikes": [
      "string",
      "string"
    ]
  }
}
```

---

#### 2. Futuredashboard

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/Futuredashboard`  
**Description:** Get future dashboard data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| GroupName | String | Yes |  | str |
| toprow | String | Yes |  | string |

**Sample Request:**

```json
{
  "GroupName": "str",
  "toprow": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 5319,
  "Message": "string",
  "Result": {
    "PriceUpList": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ],
    "PriceDownList": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ],
    "OIUpList": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ],
    "OIDownList": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "",
        "OIChangePercent": "st",
        "RollOvers": "string"
      }
    ],
    "RolloversList": [
      {
        "ScripName": "string",
        "Token": "s",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "st",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ],
    "OILimitList": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "str",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ],
    "LongBuildUp": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "strin",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ],
    "ShortBuildUp": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "strin",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ],
    "ShortCovering": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "strin",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ],
    "LongUnwinding": [
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Instrument": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "RollOvers": "string"
      }
    ]
  }
}
```

---

#### 3. Optiondashboard

**Method:** `GET`  
**Endpoint:** `/api/AnalysisOptions/Optiondashboard`  
**Description:** Get option dashboard data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| sType | String | No |  | string |
| rowCount | String | No |  | 4213 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4774,
  "Message": "string",
  "Result": {
    "Topgainer": [
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      }
    ],
    "Toplooser": [
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "s",
        "OI": "strin",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      }
    ],
    "TopOIloosers": [
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      }
    ],
    "TopOIgainer": [
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      }
    ],
    "ActivebyContract": [
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "strin",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "",
        "OIChange": "stri",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      }
    ],
    "Activebyvalue": [
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      }
    ],
    "Volumegainer": [
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      },
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      }
    ],
    "Volumelooser": [
      {
        "ScripName": "string",
        "Token": "string",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "string",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      },
      {
        "ScripName": "string",
        "Token": "strin",
        "Strike": "string",
        "SCP": "string",
        "Ltp": "string",
        "ltpChange": "string",
        "LtpChangePercent": "string",
        "OI": "string",
        "OIChange": "string",
        "OIChangePercent": "string",
        "values": "string",
        "Volume": "st",
        "VolumeChange": "string",
        "VolumeChangePercent": "string"
      }
    ]
  }
}
```

---

## Special Analysis

<a id="report-72"></a>

### 1.Futures Heatmap

#### 1. BuiltUpHistoryByScripname

**Method:** `POST`  
**Endpoint:** `/api/AnalysisSpecial/BuiltUpHistoryByScripname`  
**Description:** Executes the BuiltUpHistoryByScripname action under the Special Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "JUBLFOOD",
  "ExpiryDate": "27 FEB 2025"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 5974,
  "Message": "string",
  "Result": {
    "Symbol": "string",
    "Expiry": "string",
    "LTP": "str",
    "LTPPercent": 3904.26040169096,
    "FutureChange": "string",
    "HeatRemarks": "string",
    "FutureOI": "string",
    "FutureOIChange": "string",
    "FutureOIInPercentage": "string",
    "EQLiveLtp": "string",
    "EQLiveChange": "string",
    "EQLiveInPercentage": "string",
    "Basis": "string",
    "PreviousDate": "string",
    "PreLTP": "string",
    "LTPChnage": "string",
    "OI": "string",
    "OIChange": "string",
    "ISINNumber": "string",
    "AvgIV": "string",
    "GetListDat": [
      {
        "value": "<Circular reference to #/components/schemas/FutureExpiryResponse detected>"
      },
      {
        "value": "<Circular reference to #/components/schemas/FutureExpiryResponse detected>"
      }
    ]
  }
}
```

---

#### 2. FutureHeatmap

**Method:** `POST`  
**Endpoint:** `/api/AnalysisSpecial/FutureHeatmap`  
**Description:** Retrieves futures heatmap data showing builtup, OI, and price changes across stocks.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| BuiltRemarks | String | Yes |  | string |
| GainerorLooser | String | Yes |  | string |
| PercenteChange | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "BuiltRemarks": "string",
  "GainerorLooser": "string",
  "PercenteChange": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 6865,
  "Message": "string",
  "Result": {
    "Symbol": "string",
    "LTP": 1076.394680247672,
    "LTPPercent": 2029.1890848970318,
    "HeatRemarks": "string",
    "VOLUME": "string",
    "PositiveAllOption": 5193,
    "NegativeAllOption": 6860,
    "NiftyGainer": 3484,
    "NiftyLoser": 653,
    "BankNiftyGainer": 5539,
    "BankNiftyLoser": 7929,
    "FinniftyGainer": 1620,
    "FinniftyLoser": 6147,
    "MidCapNiftyGainer": 975,
    "MidCapNiftyLoser": 6398,
    "PreLTP": 8930.117428317983,
    "LTPChnage": 8283.02850835008,
    "OI1": "string",
    "OIChange": 4655.194939835578,
    "LonBuiltupcnt": 5164,
    "ShortCoveringcnt": 88,
    "LongUnwindingcnt": 2449,
    "ShortBuiltupcnt": 8707,
    "OIChangeInPer": 1018.9430382616727,
    "GetListDat": [
      {
        "value": "<Circular reference to #/components/schemas/FutureHeatmapResponse detected>"
      },
      {
        "value": "<Circular reference to #/components/schemas/FutureHeatmapResponse detected>"
      }
    ],
    "GetExpiryList": [
      "string",
      "string"
    ],
    "Token": 8909,
    "segment": "string"
  }
}
```

---

<a id="report-73"></a>

### 2.Straddle Chain

#### 1. Getstraddlechain

**Method:** `POST`  
**Endpoint:** `/api/AnalysisSpecial/Getstraddlechain`  
**Description:** Executes the Getstraddlechain action under the Special Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| StockName | String | Yes | Stock or index name. | NIFTY |
| Expiry | String | Yes | Expiry date. | 26 Jun 2026 |
| NumberofStrikes | Integer | Yes | Number of strikes to show on each side. | 5 |
| IsPerLot | Boolean | Yes | Whether to show prices per lot. | true |

**Sample Request:**

```json
{
  "StockName": "NIFTY",
  "Expiry": "28 jul 2026",
  "NumberofStrikes": "5",
  "IsPerLot": false
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 5382,
  "Message": "string",
  "Result": {
    "LivePrice": "string",
    "LivePriceChange": "string",
    "LivePriceChangePer": "string",
    "ButterflyCenter": "string",
    "LotSize": "string",
    "FuturePrice": "string",
    "FuturePriceChange": "string",
    "FuturePriceChangePer": "string",
    "SChain": [
      {
        "Strike": "string",
        "CallLTP": "string",
        "PutLTP": "string",
        "StraddlePrice": "string",
        "StraddlePriceChange": "string",
        "StraddleChange": "string",
        "Straddle5Change": "string",
        "AvgIV": "string",
        "CallOI": "string",
        "PutOI": "string",
        "NetDelta": "string",
        "NetTheta": "string",
        "NetGamma": "string",
        "NetVega": "string",
        "CEToken": "string",
        "PEToken": "string",
        "Segment": "string"
      },
      {
        "Strike": "string",
        "CallLTP": "string",
        "PutLTP": "string",
        "StraddlePrice": "string",
        "StraddlePriceChange": "string",
        "StraddleChange": "string",
        "Straddle5Change": "string",
        "AvgIV": "string",
        "CallOI": "string",
        "PutOI": "string",
        "NetDelta": "string",
        "NetTheta": "string",
        "NetGamma": "string",
        "NetVega": "string",
        "CEToken": "string",
        "PEToken": "string",
        "Segment": "string"
      }
    ],
    "Expiry": [
      "string",
      "string"
    ],
    "Token": 9199,
    "FoToken": 596
  }
}
```

---

<a id="report-74"></a>

### 3.Butterfly

#### 1. Butterfly

**Method:** `POST`  
**Endpoint:** `/api/AnalysisSpecial/butterfly`  
**Description:** Executes the Butterfly action under the Special Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| StrikesGap | String | Yes |  | string |
| NumberofStrikes | String | Yes |  | string |
| SCP | String | Yes |  | string |
| LongShortType | String | Yes |  | string |
| StrikeS | String | Yes |  | string |
| IsPerLot | Boolean | Yes |  | true |

**Sample Request:**

```json
{
  "StockName": "Nifty",
  "Expiry": "20 FEB 2025",
  "StrikesGap": "1",
  "NumberofStrikes": "5",
  "SCP": "CE",
  "LongShortType": "LONG",
  "StrikeS": "0",
  "IsPerLot": true
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 2160,
  "Message": "string",
  "Result": {
    "LivePrice": "string",
    "LivePriceChange": "string",
    "LivePriceChangePer": "string",
    "ButterflyCenter": "string",
    "LotSize": "string",
    "FuturePrice": "string",
    "FuturePriceChange": "string",
    "FuturePriceChangePer": "string",
    "BList": [
      {
        "Leg1nStrike": "string",
        "Leg1Premium": "string",
        "Leg2nStrike": "string",
        "Leg2Premium": "string",
        "Leg3nStrike": "string",
        "Leg3Premium": "string",
        "NetDebitCredit": "string",
        "MaxProfit": "string",
        "MaxLoss": "string",
        "MaxProfitPer": "string",
        "BreakevenMinus": "string",
        "BreakevenPlus": "string",
        "Leg1Token": "string",
        "Leg2Token": "string",
        "Leg3Token": "string",
        "Segment": "string"
      },
      {
        "Leg1nStrike": "string",
        "Leg1Premium": "string",
        "Leg2nStrike": "string",
        "Leg2Premium": "string",
        "Leg3nStrike": "string",
        "Leg3Premium": "string",
        "NetDebitCredit": "string",
        "MaxProfit": "string",
        "MaxLoss": "string",
        "MaxProfitPer": "string",
        "BreakevenMinus": "string",
        "BreakevenPlus": "string",
        "Leg1Token": "string",
        "Leg2Token": "string",
        "Leg3Token": "string",
        "Segment": "string"
      }
    ],
    "SChain": [
      {
        "LivePrice": "string",
        "LivePriceChange": "string",
        "LivePriceChangePer": "string",
        "ButterflyCenter": "string",
        "LotSize": "string",
        "FuturePrice": "string",
        "FuturePriceChange": "string",
        "FuturePriceChangePer": "string",
        "SChain": [
          {
            "Strike": "string",
            "CallLTP": "string",
            "PutLTP": "string",
            "StraddlePrice": "strin",
            "StraddlePriceChange": "string",
            "StraddleChange": "string",
            "Straddle5Change": "string",
            "AvgIV": "string",
            "CallOI": "string",
            "PutOI": "string",
            "NetDelta": "string",
            "NetTheta": "string",
            "NetGamma": "string",
            "NetVega": "string",
            "CEToken": "string",
            "PEToken": "string",
            "Segment": "string"
          },
          {
            "Strike": "string",
            "CallLTP": "string",
            "PutLTP": "string",
            "StraddlePrice": "string",
            "StraddlePriceChange": "string",
            "StraddleChange": "string",
            "Straddle5Change": "string",
            "AvgIV": "string",
            "CallOI": "string",
            "PutOI": "string",
            "NetDelta": "string",
            "NetTheta": "string",
            "NetGamma": "string",
            "NetVega": "string",
            "CEToken": "string",
            "PEToken": "string",
            "Segment": "string"
          }
        ],
        "Expiry": [
          "string",
          "st"
        ],
        "Token": 5418,
        "FoToken": 9047
      },
      {
        "LivePrice": "string",
        "LivePriceChange": "string",
        "LivePriceChangePer": "string",
        "ButterflyCenter": "string",
        "LotSize": "string",
        "FuturePrice": "string",
        "FuturePriceChange": "string",
        "FuturePriceChangePer": "string",
        "SChain": [
          {
            "Strike": "string",
            "CallLTP": "string",
            "PutLTP": "string",
            "StraddlePrice": "string",
            "StraddlePriceChange": "string",
            "StraddleChange": "string",
            "Straddle5Change": "string",
            "AvgIV": "string",
            "CallOI": "string",
            "PutOI": "string",
            "NetDelta": "string",
            "NetTheta": "string",
            "NetGamma": "string",
            "NetVega": "stri",
            "CEToken": "string",
            "PEToken": "string",
            "Segment": "string"
          },
          {
            "Strike": "string",
            "CallLTP": "string",
            "PutLTP": "string",
            "StraddlePrice": "string",
            "StraddlePriceChange": "string",
            "StraddleChange": "string",
            "Straddle5Change": "string",
            "AvgIV": "string",
            "CallOI": "string",
            "PutOI": "string",
            "NetDelta": "string",
            "NetTheta": "string",
            "NetGamma": "string",
            "NetVega": "string",
            "CEToken": "string",
            "PEToken": "string",
            "Segment": "string"
          }
        ],
        "Expiry": [
          "string",
          "string"
        ],
        "Token": 3157,
        "FoToken": 1806
      }
    ],
    "Token": 5128,
    "FoToken": 9411,
    "sScript": [
      "string",
      "string"
    ],
    "Expiry": [
      "string",
      "str"
    ],
    "MAStrikes": [
      "strin",
      "string"
    ]
  }
}
```

---

<a id="report-75"></a>

### 4.Calendar Spread Chain

#### 1. GetCalendarSpreadChain

**Method:** `POST`  
**Endpoint:** `/api/AnalysisOptions/GetCalendarSpreadChain`  
**Description:** Retrieves calendar spread chain data for options analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | NIFTY |
| Expiry1 | String | Yes |  |  |
| Expiry2 | String | Yes |  |  |
| Expiry3 | String | Yes |  |  |
| strikecount | String | Yes |  | 5 |
| PerLot | Boolean | Yes |  | false |

**Sample Request:**

```json
{
  "ScripName": "Nifty",
  "Expiry1": "",
  "Expiry2": "",
  "Expiry3": "",
  "strikecount": 10,
  "PerLot": true
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 7618,
  "Message": "string",
  "Result": {
    "Expiry": [
      "string",
      "string"
    ],
    "CAlender": [
      {
        "Segment": "string",
        "T1CallToken": 3208,
        "T1PutToken": 5578,
        "T1CallDelta": 3955.90569537108,
        "T1CallIV": 8925.768533381735,
        "T1CallLTP": 1768.0649051799157,
        "T1CallChange": 5967.112339643137,
        "T1CallChangePercent": 5732.330370740741,
        "T1PutDelta": 3026.06157963482,
        "T1PutIV": 8118.629312758221,
        "T1PutLTP": 9685.842601881734,
        "T1PutChange": 3079.0769475010184,
        "T1PutChangePercent": 2598.752545620275,
        "T2CallToken": 3594,
        "T2PutToken": 7545,
        "T2CallDelta": 2060.101749083705,
        "T2CallIV": 3069.3614465962883,
        "T2CallLTP": 9510.94145400945,
        "T2CallChange": 4891.286516136939,
        "T2CallChangePercent": 5844.834743652936,
        "T2PutDelta": 2658.0280175005823,
        "T2PutIV": 6056.073495636494,
        "T2PutLTP": 6889.834015322444,
        "T2PutChange": 1687.6308535049645,
        "T2PutChangePercent": 3112.519291857745,
        "T3CallToken": 6409,
        "T3PutToken": 3470,
        "T3CallDelta": 316.17351950451234,
        "T3CallIV": 2107.976141746848,
        "T3CallLTP": 5101.927627062501,
        "T3CallChange": 606.0918871380072,
        "T3CallChangePercent": 6766.663539605693,
        "T3PutDelta": 556.7914898049175,
        "T3PutIV": 1243.769056484545,
        "T3PutLTP": 8357.586067572065,
        "T3PutChange": 4663.605729410054,
        "T3PutChangePercent": 8980.647588372392,
        "Strike": 4118.641924355037,
        "Expiry1": "string",
        "Expiry2": "string",
        "Expiry3": "string"
      },
      {
        "Segment": "string",
        "T1CallToken": 3264,
        "T1PutToken": 3619,
        "T1CallDelta": 5632.069853995101,
        "T1CallIV": 7724.987980292657,
        "T1CallLTP": 4050.7719130692885,
        "T1CallChange": 9766.616698796286,
        "T1CallChangePercent": 8404.879126081642,
        "T1PutDelta": 7181.424338034223,
        "T1PutIV": 5492.52550502664,
        "T1PutLTP": 1164.6427830194784,
        "T1PutChange": 2040.1160855439505,
        "T1PutChangePercent": 8359.142349488617,
        "T2CallToken": 516,
        "T2PutToken": 2853,
        "T2CallDelta": 2545.273224528999,
        "T2CallIV": 4281.955955838539,
        "T2CallLTP": 9230.818070749658,
        "T2CallChange": 3022.766385240503,
        "T2CallChangePercent": 9820.7843669781,
        "T2PutDelta": 4937.9609739154475,
        "T2PutIV": 9148.663900462252,
        "T2PutLTP": 2279.5194716812193,
        "T2PutChange": 1393.3509819526369,
        "T2PutChangePercent": 8537.954908928597,
        "T3CallToken": 4751,
        "T3PutToken": 7011,
        "T3CallDelta": 226.5913047092294,
        "T3CallIV": 4679.158571668269,
        "T3CallLTP": 9094.049032593923,
        "T3CallChange": 3517.5173360268764,
        "T3CallChangePercent": 2906.685291802971,
        "T3PutDelta": 6080.800810112643,
        "T3PutIV": 4590.317635848644,
        "T3PutLTP": 4762.431647473142,
        "T3PutChange": 4740.7802312765425,
        "T3PutChangePercent": 3837.6093785965336,
        "Strike": 77.62522141819383,
        "Expiry1": "string",
        "Expiry2": "string",
        "Expiry3": "string"
      }
    ],
    "LTP": {
      "NearByStrike": 3160.057545942672,
      "LotSize": 3635,
      "SToken": 3295,
      "FoToken": 7525,
      "sFutureExpiry": "string"
    },
    "FeedTime": "1997-03-06T07:57:55.843Z"
  }
}
```

---

<a id="report-76"></a>

### 5.Arbitrage Screener

#### 1. ArbitrageScreener

**Method:** `POST`  
**Endpoint:** `/api/AnalysisSpecial/arbitragescreener`  
**Description:** Executes the ArbitrageScreener action under the Special Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Expiry | String | Yes |  | string |
| sector | String | Yes |  | string |
| AscVal | String | Yes |  | string |
| ColumnName | String | Yes |  | string |

**Sample Request:**

```json
{
  "Expiry": "",
  "sector": "All",
  "AscVal": "",
  "ColumnName": ""
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4136,
  "Message": "string",
  "Result": {
    "Expiry": [
      "string",
      "string"
    ],
    "aarbitrage": [
      {
        "Stock": "string",
        "SpotPrice": 3979.1286074820055,
        "FuturePrice": 368.48623692087745,
        "Basis": 319.58330291638634,
        "BasisPer": 475.43514143069785,
        "Change": 9293.418238095514,
        "ChangePer": 3837.9363588091087,
        "LotSize": "string",
        "PreviousBasic": 5428.997822155481,
        "Segmant": "string"
      },
      {
        "Stock": "string",
        "SpotPrice": 9353.477261905913,
        "FuturePrice": 6750.608521106516,
        "Basis": 5013.950432722391,
        "BasisPer": 72.78287314333554,
        "Change": 9937.569885534022,
        "ChangePer": 4368.856178013853,
        "LotSize": "string",
        "PreviousBasic": 8352.81712923678,
        "Segmant": "string"
      }
    ]
  }
}
```

---

<a id="report-77"></a>

### 6. Ratio Analysis

#### 1. RatioAnalysis

**Method:** `POST`  
**Endpoint:** `/api/AnalysisSpecial/RatioAnalysis`  
**Description:** Executes the RatioAnalysis action under the Special Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | Nifty |
| Expiry | String | Yes |  | 28 oct 2025 |
| Gap | Integer | Yes |  | 7889 |
| Scp | String | Yes |  | string |
| Strike | Number | Yes |  | 4855.66835374901 |
| Buylot | Integer | Yes |  | 7483 |
| Selllot | Integer | Yes |  | 2772 |
| SellRatio | Number | Yes |  | 6103.135505569837 |
| BuyRatio | Number | Yes |  | 3020.284530439574 |
| perlot | Boolean | Yes |  | false |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "Expiry": "06 MAR 2025",
  "Gap": 1,
  "Scp": "CE",
  "Strike": 0,
  "Buylot": 1,
  "Selllot": 2,
  "SellRatio": 1,
  "BuyRatio": 2,
  "perlot": true
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 9985,
  "Message": "string",
  "Result": {
    "Expiries": [
      "string",
      "string"
    ],
    "RatioList": [
      {
        "Id": 1991,
        "Segmanet": "string",
        "BuyStrike": 2417.89437788388,
        "BuyLTP": 2400.0717834053753,
        "SellStrike": 3948.5680655221354,
        "SellLTP": 5277.004502380858,
        "Expiry": "string",
        "ScripName": "string",
        "PremiumDiff": 602.9882028959155,
        "Share": 2001.1445047023658,
        "lotsize": 1257,
        "Strike": 1544.4701409286065,
        "CDelta": 8318.113135296902,
        "PDelta": 3957.064455437458,
        "CTheta": 2758.0617181254306,
        "PTheta": 6238.094944849373,
        "perlot": true,
        "BuyToken": 665,
        "SellToken": 3284
      },
      {
        "Id": 2505,
        "Segmanet": "string",
        "BuyStrike": 2399.6703015714506,
        "BuyLTP": 8393.880650373208,
        "SellStrike": 2598.176512200692,
        "SellLTP": 6704.516309275623,
        "Expiry": "string",
        "ScripName": "string",
        "PremiumDiff": 2424.6172802949873,
        "Share": 1541.9524192424649,
        "lotsize": 3542,
        "Strike": 8215.707728426652,
        "CDelta": 8127.462080196426,
        "PDelta": 1067.2466261583468,
        "CTheta": 9270.591241690201,
        "PTheta": 5274.12137489391,
        "perlot": true,
        "BuyToken": 9534,
        "SellToken": 1516
      }
    ]
  }
}
```

---

<a id="report-78"></a>

### 7.Strategy Charts

#### 1. StrategyCharts

**Method:** `POST`  
**Endpoint:** `/api/AnalysisSpecial/StrategyChart`  
**Description:** Executes the StrategyCharts action under the Special Analysis module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| legs | Array | Yes |  | [{"BuySell":"string","Token":"string"},{"BuySell":"string","Token":"string"}] |
| Chart1 | String | Yes |  | string |
| Chart2 | String | Yes |  | string |
| Compare | String | Yes |  | strin |

**Sample Request:**

```json
{
  "legs": [
    {
      "BuySell": "B",
      "Token": "63524"
    }
  ],
  "Chart1": "LTP",
  "Chart2": "OI",
  "Compare": "NIFTY"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 855,
  "Message": "string",
  "Result": [
    [
      {
        "Scripname": "string",
        "ExpiryDate": "string",
        "Strike": "string",
        "SCP": "string",
        "Underlying": 5979.386465669183,
        "Value1": "string",
        "Value2": "string",
        "FeedTime": "string",
        "BuySell": "string",
        "Segment": "string"
      },
      {
        "Scripname": "string",
        "ExpiryDate": "string",
        "Strike": "string",
        "SCP": "string",
        "Underlying": 100.8184383228361,
        "Value1": "string",
        "Value2": "string",
        "FeedTime": "string",
        "BuySell": "string",
        "Segment": "string"
      }
    ],
    [
      {
        "Scripname": "string",
        "ExpiryDate": "string",
        "Strike": "string",
        "SCP": "string",
        "Underlying": 9399.457631999598,
        "Value1": "string",
        "Value2": "string",
        "FeedTime": "string",
        "BuySell": "string",
        "Segment": "string"
      },
      {
        "Scripname": "string",
        "ExpiryDate": "string",
        "Strike": "string",
        "SCP": "string",
        "Underlying": 6840.522065023578,
        "Value1": "string",
        "Value2": "string",
        "FeedTime": "string",
        "BuySell": "string",
        "Segment": "string"
      }
    ]
  ]
}
```

---

## Strategy Builder

<a id="report-79"></a>

### 1. Strategy Builder

#### 1. DeleteMyStrategy

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/DeleteStrategy`  
**Description:** Executes the DeleteMyStrategy action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | Yes |  | niftydata |
| LoginId | Integer | Yes |  | 28037 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | No |  | string |

**Sample Request:**

```json
{
  "StrategyName": "niftydata",
  "LoginId": 28037
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "api executed successfully",
  "Result": 1
}
```

---

#### 2. StrategyBuilderStocks

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/SearchStrategyBldrStocks`  
**Description:** Executes the StrategyBuilderStocks action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "api executed successfully",
  "Result": [
    {
      "value": "BANKNIFTY",
      "valueCopy": "BANKNIFTY",
      "label": "BANKNIFTY"
    },
    {
      "value": "FINNIFTY",
      "valueCopy": "FINNIFTY",
      "label": "FINNIFTY"
    },
    {
      "value": "MIDCPNIFTY",
      "valueCopy": "MIDCPNIFTY",
      "label": "MIDCPNIFTY"
    },
    {
      "value": "NIFTY",
      "valueCopy": "NIFTY",
      "label": "NIFTY"
    },
    {
      "value": "NIFTYNXT50",
      "valueCopy": "NIFTYNXT50",
      "label": "NIFTYNXT50"
    }
  ]
}
```

---

<a id="report-80"></a>

### 2. Kuber Alpha

#### 1. Kuber_GetRequiredToken

**Method:** `GET`  
**Endpoint:** `/api/KuberAlpha/Kuber_GetRequiredToken`  
**Description:** Get required token for Kuber Alpha.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 2. Kuber_GetATMStrike

**Method:** `GET`  
**Endpoint:** `/api/KuberAlpha/Kuber_GetATMStrike`  
**Description:** Get ATM strike for Kuber Alpha.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-81"></a>

### SaveMyStrategy

#### 1. SaveMyStrategy

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/SaveMyStrategy`  
**Description:** Executes the SaveMyStrategy action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| payoffleg | Array | Yes |  | [{"Id":8787,"Expiry":"string","Strike":5284.307342501226,"sCP":"string","LotSize":9499,"BuySell":"string","LTP":2928.7198212163344,"CustomIVVal":8008.644911699512,"IVchangStatus":true,"Token":3019},{"Id":6288,"Expiry":"string","Strike":9357.474448772098,"sCP":"st","LotSize":9948,"BuySell":"string","LTP":7655.5168283647945,"CustomIVVal":8558.446907819853,"IVchangStatus":false,"Token":8842}] |
| ScripName | String | Yes |  | string |
| NdayChange | Integer | Yes |  | 7308 |
| CommonIVChangestatus | String | Yes |  | string |
| StrategyName | String | Yes |  | string |
| Loginid | Integer | Yes |  | 5443 |

**Sample Request:**

```json
{
  "payoffleg": [
    {
      "Id": 0,
      "Expiry": "20 FEB 2025",
      "Strike": 24000,
      "sCP": "CE",
      "LotSize": 1,
      "BuySell": "B",
      "LTP": 15.2,
      "CustomIVVal": 0,
      "IVchangStatus": true,
      "Token": 43726
    }
  ],
  "ScripName": "NIFTY",
  "NdayChange": 0,
  "CommonIVChangestatus": "",
  "StrategyName": "niftydata",
  "Loginid": 28037
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "api executed successfully",
  "Result": 1
}
```

---

<a id="report-82"></a>

### GetFuturesAllExpires

#### 1. GetFuturesAllExpires

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/GetFuturesAllExpires`  
**Description:** Executes the GetFuturesAllExpires action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "ExpiryDate": ""
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "api executed successfully",
  "Result": 22184.8
}
```

---

<a id="report-83"></a>

### GetFutureFeeds

#### 1. GetFutureFeeds

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/GetFuturefeeds`  
**Description:** Executes the GetFutureFeeds action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "ExpiryDate": ""
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "api executed successfully",
"Result": [
{
"Token": 35001,
"ScripName": "NIFTY MAR FUT",
"LTP": 22325.00,
"Change": 133.95,
"ChangePercent": 0.60,
"Expiry": "27 Mar 2025"
}}
```

---

<a id="report-84"></a>

### GetPayOffTable

#### 1. GetPayOffTable

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/GetPayOffTable`  
**Description:** Executes the GetPayOffTable action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| payoffleg | Array | Yes |  | [{"Id":70,"Expiry":"string","Strike":364.2058236110812,"sCP":"string","LotSize":5583,"BuySell":"string","LTP":7639.078993423891,"CustomIVVal":5800.512369279491,"IVchangStatus":false,"Token":4227},{"Id":5168,"Expiry":"string","Strike":9004.202107241712,"sCP":"string","LotSize":3060,"BuySell":"s","LTP":8174.9105293740995,"CustomIVVal":1738.6189497020066,"IVchangStatus":false,"Token":8760}] |
| ScripName | String | Yes |  | string |
| PayOffGap | Number | Yes |  | 2504.5632067704514 |
| NdayChange | Integer | Yes |  | 8115 |
| CommonIVChangestatus | String | Yes |  | string |

**Sample Request:**

```json
{
  "payoffleg": [
    {
      "Id": 0,
      "Expiry": "06 MAR 2025",
      "Strike": 22300,
      "sCP": "PE",
      "LotSize": 1,
      "BuySell": "S",
      "LTP": 0.35,
      "CustomIVVal": 0,
      "IVchangStatus": true,
      "Token": 50335
    }
  ],
  "ScripName": "NIFTY",
  "PayOffGap": 0,
  "NdayChange": 0,
  "CommonIVChangestatus": "false"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "api executed successfully",
"Result": [
{
"changepercent": 0,
"Premium": 22268.85,
"TheoreticalPriceToday": 25.04,
"TheoreticalPriceExpiry": 31.15,
"TodaysPnL": -1851.75,
"ExpiryDayPnL": -2310,
"DateWisePnL": -1851.75
}}
```

---

<a id="report-85"></a>

### FastStrategies

#### 1. FastStrategies

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/FastStrategies`  
**Description:** Executes the FastStrategies action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |
| StrategyName | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "ExpiryDate": "06 MAR 2025",
  "StrategyName": "Call Calendar Spread"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "api executed successfully",
"Result": [
{
"changepercent": 0,
"Premium": 22268.85,
"TheoreticalPriceToday": 25.04,
"TheoreticalPriceExpiry": 31.15,
"TodaysPnL": -1851.75,
"ExpiryDayPnL": -2310,
"DateWisePnL": -1851.75
}}
```

---

<a id="report-86"></a>

### GetSelectedMyStrategy

#### 1. GetSelectedMyStrategy

**Method:** `GET`  
**Endpoint:** `/api/StrategiesBuilder/GetSelectedMyStrategy`  
**Description:** Executes the GetSelectedMyStrategy action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | Yes |  | AKKK1 |
| LoginId | Integer | Yes |  | 28037 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | No |  | string |

**Sample Request:**

```json
{
  "StrategyName": "AKKK1",
  "LoginId": 28037
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "api executed successfully",
  "Result": {
    "GetMyStrategy": null,
    "OptionExpiry": null,
    "FutureExpiry": null,
    "NextnDays": 0
  }
}
```

---

<a id="report-87"></a>

### GetStandardDeviation

#### 1. GetStandardDeviation

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/GetStandardDeviation`  
**Description:** Executes the GetStandardDeviation action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| NofDays | Integer | Yes |  | 2993 |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "NofDays": 0
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "api executed successfully",
  "Result": {
    "MinDS2": 23479.05,
    "DS1Points": 0,
    "DS1PointsPercent": 0,
    "MinDS1": 23479.05,
    "PlusDS1": 23479.05,
    "DS2PointsPercent": 0,
    "DS2Points": 0,
    "PlusDS2": 23479.05,
    "LTP": 23479.05
  }
}
```

---

<a id="report-88"></a>

### CalculatePayOffChart

#### 1. CalculatePayOffChart

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/CalculatePayoffchart`  
**Description:** Executes the CalculatePayOffChart action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| payoffleg | Array | Yes | Array of option legs with strike, expiry, buy/sell, LTP, IV details. | [{"Id":1,"Expiry":"28 Jul 2026","Strike":24000,"sCP":"CE","LotSize":75,"BuySell":"Buy","LTP":150.5,"CustomIVVal":18.2,"IVchangStatus":false,"Token":4405}] |
| ScripName | String | Yes | Underlying scrip name. | NIFTY |
| NdayChange | Integer | Yes | Number of days for change calculation. | 1 |
| CommonIVChangestatus | String | Yes | Common IV change status. | false |
| IfLotTorF | Boolean | Yes | Whether to use lot size. | true |

**Sample Request:**

```json
{
  "payoffleg": [
    {
      "Id": 1,
      "Expiry": "28 Jul 2026",
      "Strike": 24000,
      "sCP": "CE",
      "LotSize": 75,
      "BuySell": "Buy",
      "LTP": 150.5,
      "CustomIVVal": 18.2,
      "IVchangStatus": false,
      "Token": 4405
    },
    {
      "Id": 2,
      "Expiry": "28 Jul 2026",
      "Strike": 25000,
      "sCP": "PE",
      "LotSize": 75,
      "BuySell": "Buy",
      "LTP": 120.3,
      "CustomIVVal": 16.8,
      "IVchangStatus": false,
      "Token": 4406
    }
  ],
  "ScripName": "NIFTY",
  "NdayChange": 1,
  "CommonIVChangestatus": "false",
  "IfLotTorF": true
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "api executed successfully",
"Result": {
"FinalChartData": [
{
"Premium": 22280,
"TheoreticalPriceToday": 0,
"TheoreticalPriceExpiry": 1170,
"TodaysPnL": 26.25,
"ExpiryDayPnL": -87723.75,
"DateWisePnL": 26.25
},
{
"Premium": 22284.95,
"TheoreticalPriceToday": 0,
"TheoreticalPriceExpiry": 1165.05,
"TodaysPnL": 26.25,
"ExpiryDayPnL": -87352.5,
"DateWisePnL": 26.25
},
{
"Premium": 22294.95,
"TheoreticalPriceToday": 0,
"TheoreticalPriceExpiry": 1155.05,
"TodaysPnL": 26.25,
"ExpiryDayPnL": -86602.5,
"DateWisePnL": 26.25
}}}
```

---

<a id="report-89"></a>

### GetCalculatedGreeks

#### 1. GetCalculatedGreeks

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/GetCaclulatedGreeks`  
**Description:** Executes the GetCalculatedGreeks action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| payoffleg | Array | Yes |  | [{"Id":4277,"Expiry":"string","Strike":6004.415560596271,"sCP":"string","LotSize":3155,"BuySell":"string","LTP":1375.3683269925432,"CustomIVVal":369.3042742201524,"IVchangStatus":false,"Token":4013},{"Id":6355,"Expiry":"string","Strike":223.68836733991148,"sCP":"string","LotSize":7364,"BuySell":"string","LTP":8486.336974211934,"CustomIVVal":6145.043216975343,"IVchangStatus":false,"Token":7583}] |
| ScripName | String | Yes |  | string |
| LTPChangePercent | Number | Yes |  | 3398.5062277971024 |
| NdayChange | Integer | Yes |  | 6440 |
| LotMultiplyer | Boolean | Yes |  | false |
| CommonIVChangestatus | String | Yes |  | string |
| IfLotTorF | Boolean | Yes |  | false |

**Sample Request:**

```json
{
  "payoffleg": [
    {
      "Id": 0,
      "Expiry": "20 FEB 2025",
      "Strike": 23450,
      "sCP": "PE",
      "LotSize": 1,
      "BuySell": "S",
      "LTP": 0.35,
      "CustomIVVal": 0,
      "IVchangStatus": true,
      "Token": 50335
    }
  ],
  "ScripName": "NIFTY",
  "PayOffGap": 0,
  "NdayChange": 0,
  "CommonIVChangestatus": "false"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "api executed successfully",
  "Result": [
    {
      "BSType": "S",
      "Instrument": "1 X NIFTY 20 Feb 23450 PE",
      "IV": 0,
      "Delta": 0,
      "Theta": 0,
      "Gamma": 0,
      "Vega": 0,
      "strike": 23450,
      "Expiry": "20 FEB 2025",
      "SCP": "PE",
      "LotSize": 1,
      "Token": 0
    },
    {
      "BSType": "",
      "Instrument": "Total",
      "IV": 0,
      "Delta": 0,
      "Theta": 0,
      "Gamma": 0,
      "Vega": 0,
      "strike": 0,
      "Expiry": "",
      "SCP": "",
      "LotSize": 0,
      "Token": 0
    }
  ]
}
```

---

<a id="report-90"></a>

### GetCalculatedProfitLoss

#### 1. GetCalculatedProfitLoss

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/GetCalculatedProfitloss`  
**Description:** Executes the GetCalculatedProfitLoss action under the Strategy Builder module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| payoffleg | Array | Yes |  | [{"Id":4277,"Expiry":"string","Strike":6004.415560596271,"sCP":"string","LotSize":3155,"BuySell":"string","LTP":1375.3683269925432,"CustomIVVal":369.3042742201524,"IVchangStatus":false,"Token":4013},{"Id":6355,"Expiry":"string","Strike":223.68836733991148,"sCP":"string","LotSize":7364,"BuySell":"string","LTP":8486.336974211934,"CustomIVVal":6145.043216975343,"IVchangStatus":false,"Token":7583}] |
| ScripName | String | Yes |  | string |
| LTPChangePercent | Number | Yes |  | 3398.5062277971024 |
| NdayChange | Integer | Yes |  | 6440 |
| LotMultiplyer | Boolean | Yes |  | false |
| CommonIVChangestatus | String | Yes |  | string |
| IfLotTorF | Boolean | Yes |  | false |

**Sample Request:**

```json
{
  "payoffleg": [
    {
      "Id": 0,
      "Expiry": "20 FEB 2025",
      "Strike": 23450,
      "sCP": "PE",
      "LotSize": 1,
      "BuySell": "S",
      "LTP": 0.35,
      "CustomIVVal": 0,
      "IVchangStatus": true,
      "Token": 50335
    }
  ],
  "ScripName": "NIFTY",
  "PayOffGap": 0,
  "NdayChange": 0,
  "CommonIVChangestatus": "false"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "api executed successfully",
  "Result": {
    "ProfitLoss": [
      {
        "BuySell": "S",
        "Instrument": "1 X NIFTY 20 Feb 23450 PE",
        "EntryPrice": 0.35,
        "TargetPrice": 0,
        "LTP": 0,
        "ProfitLoss": 0,
        "LivePNl": 0.35,
        "Token": 0
      }
    ],
    "TotalTargetPnl": 0,
    "TotalLivePnl": 26.25
  }
}
```

---

<a id="report-91"></a>

### GenerateMarginCalculatorToken

#### 1. GenerateMarginCalculatorToken

**Method:** `GET`  
**Endpoint:** `/api/StrategiesBuilder/GenerateMarginCalculatorToken`  
**Description:** The GenerateMarginCalculatorToken API is used to generate a secure authentication token for accessing the margin calculator services. This

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1413,
  "Message": "string",
  "Result": {
    "nullable": true
  }
}
```

---

<a id="report-92"></a>

### GetMyStrategyList

#### 1. GetMyStrategyList

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/GetMyStrategyList`  
**Description:** Get the list of saved strategies.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1413,
  "Message": "string",
  "Result": {
    "nullable": true
  }
}
```

---

<a id="report-93"></a>

### DynamicStrategyBldr

#### 1. DynamicStrategyBldr

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/DynamicStrategyBldr`  
**Description:** Build dynamic strategy with custom legs.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |
| StrikeValue | Number | Yes |  | 8829.47789027418 |
| strValType | String | Yes |  | string |
| SCP | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "ExpiryDate": "string",
  "StrikeValue": 8829.47789027418,
  "strValType": "string",
  "SCP": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1413,
  "Message": "string",
  "Result": {
    "nullable": true
  }
}
```

---

<a id="report-94"></a>

### LTPusingToken

#### 1. LTPusingToken

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/LTPusingToken`  
**Description:** Get LTP price using token.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| Token | Integer | Yes | Token of the scrip. | 4405 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1413,
  "Message": "string",
  "Result": {
    "nullable": true
  }
}
```

---

<a id="report-95"></a>

### DeletelegsFromStrategy

#### 1. DeletelegsFromStrategy

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/DeletelegsFromStrategy`  
**Description:** Delete specific legs from a strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| 0 | Integer | Yes |  | 7009 |
| 1 | Integer | Yes |  | 3823 |

**Sample Request:**

```json
[
  7009,
  3823
]
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1413,
  "Message": "string",
  "Result": {
    "nullable": true
  }
}
```

---

<a id="report-96"></a>

### GetStrategyPayOff

#### 1. GetStrategyPayOff

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/GetStrategyPayOff`  
**Description:** Get payoff data for a strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| param | Array | Yes |  | [{"Token":8198,"BuySell":"string","Interval":"string","LotSize":7324,"isLotSize":true,"isLotMultiplyer":true},{"Token":996,"BuySell":"string","Interval":"string","LotSize":9808,"isLotSize":false,"isLotMultiplyer":true}] |

**Sample Request:**

```json
{
  "param": [
    {
      "Token": 8198,
      "BuySell": "string",
      "Interval": "string",
      "LotSize": 7324,
      "isLotSize": true,
      "isLotMultiplyer": true
    },
    {
      "Token": 996,
      "BuySell": "string",
      "Interval": "string",
      "LotSize": 9808,
      "isLotSize": false,
      "isLotMultiplyer": true
    }
  ]
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1413,
  "Message": "string",
  "Result": {
    "nullable": true
  }
}
```

---

<a id="report-97"></a>

### CalculateMargin

#### 1. CalculateMargin

**Method:** `POST`  
**Endpoint:** `/api/StrategiesBuilder/CalculateMargin`  
**Description:** Calculate margin requirements for a strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| 0 | Object | Yes |  | {"Product":6610,"Strike":5937.762434617417,"Symbol":"nifty","UserCodeID":9989,"UserGroupId":8470,"UserNameID":35,"NetQuantity":6467,"BuySell":8468,"usernameofSession":"string","BrokerId":8803,"OptionType":7748,"Token":552} |
| 1 | Object | Yes |  | {"Product":8847,"Strike":4077.805808430692,"Symbol":"nifty","UserCodeID":2162,"UserGroupId":5952,"UserNameID":35,"NetQuantity":9197,"BuySell":3361,"usernameofSession":"string","BrokerId":9142,"OptionType":4164,"Token":8139} |

**Sample Request:**

```json
[
  {
    "Product": 6610,
    "Strike": 5937.762434617417,
    "Symbol": "nifty",
    "UserCodeID": 9989,
    "UserGroupId": 8470,
    "UserNameID": 35,
    "NetQuantity": 6467,
    "BuySell": 8468,
    "usernameofSession": "string",
    "BrokerId": 8803,
    "OptionType": 7748,
    "Token": 552
  },
  {
    "Product": 8847,
    "Strike": 4077.805808430692,
    "Symbol": "nifty",
    "UserCodeID": 2162,
    "UserGroupId": 5952,
    "UserNameID": 35,
    "NetQuantity": 9197,
    "BuySell": 3361,
    "usernameofSession": "string",
    "BrokerId": 9142,
    "OptionType": 4164,
    "Token": 8139
  }
]
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1413,
  "Message": "string",
  "Result": {
    "nullable": true
  }
}
```

---

## Options Simulator

<a id="report-98"></a>

### MTM

#### 1. MTM

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/MTM`  
**Description:** Executes the MTM action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Date | String | Yes |  | string |
| Time | String | Yes |  | string |
| ScripName | String | Yes |  | string |

**Sample Request:**

```json
{
  "Date": "string",
  "Time": "string",
  "ScripName": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 5178,
  "Message": "string",
  "Result": {
    "Time": "strin",
    "total_tradepnl": 6963.674517102217,
    "total_orderpnl": 2362.957418722744,
    "total_mtm": 5240.824431227882,
    "spot": 1454.007953825327
  }
}
```

---

<a id="report-99"></a>

### RevertExit

#### 1. RevertExit

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/RevertExit`  
**Description:** Executes the RevertExit action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Orderbook_id | Integer | Yes |  | 7925 |
| Revert_lot | Integer | Yes |  | 3631 |

**Sample Request:**

```json
{
  "Orderbook_id": 7925,
  "Revert_lot": 3631
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4314,
  "Message": "string",
  "Result": true
}
```

---

<a id="report-100"></a>

### CalculatePayOff

#### 1. CalculatePayOff

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/CalculatePayOff`  
**Description:** Executes the CalculatePayOff action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | Yes |  | string |
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |
| IfLotTorF | Boolean | Yes |  | true |
| LotMultiplyer | Boolean | Yes |  | true |
| NdayChange | Integer | Yes |  | 6463 |

**Sample Request:**

```json
{
  "Symbol": "string",
  "BhavDate": "string",
  "Time": "string",
  "IfLotTorF": true,
  "LotMultiplyer": true,
  "NdayChange": 6463
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 5511,
  "Message": "string",
  "Result": {
    "greeksdata": [
      {
        "BuySell": "string",
        "Symbol": "string",
        "Expiry": "string",
        "Strike": 5417.742350047983,
        "SCP": "string",
        "Lot": 1604,
        "Delta": 762.8144884901621,
        "Gamma": 4083.074653827785,
        "Theta": 4060.511521893999,
        "Vega": 200.32299035092737,
        "IV": 9389.918322798785
      },
      {
        "BuySell": "string",
        "Symbol": "string",
        "Expiry": "string",
        "Strike": 9297.853515303183,
        "SCP": "string",
        "Lot": 6264,
        "Delta": 8017.160301965738,
        "Gamma": 3666.145262163625,
        "Theta": 3159.269307696573,
        "Vega": 9381.483942963047,
        "IV": 2090.8059980465964
      }
    ],
    "totalGreeks": {
      "TotalDelta": 1070.5466551293052,
      "TotalGamma": 6247.631048641344,
      "TotalTheta": 5490.663298450105,
      "TotalVega": 1003.2240308296192
    }
  }
}
```

---

<a id="report-101"></a>

### CalculateGreeks

#### 1. CalculateGreeks

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/CalculateGreeks`  
**Description:** Executes the CalculateGreeks action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | Yes |  | string |
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |
| IfLotTorF | Boolean | Yes |  | true |
| LotMultiplyer | Boolean | Yes |  | true |
| NdayChange | Integer | Yes |  | 6463 |

**Sample Request:**

```json
{
  "Symbol": "string",
  "BhavDate": "string",
  "Time": "string",
  "IfLotTorF": true,
  "LotMultiplyer": true,
  "NdayChange": 6463
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 5511,
  "Message": "string",
  "Result": {
    "greeksdata": [
      {
        "BuySell": "string",
        "Symbol": "string",
        "Expiry": "string",
        "Strike": 5417.742350047983,
        "SCP": "string",
        "Lot": 1604,
        "Delta": 762.8144884901621,
        "Gamma": 4083.074653827785,
        "Theta": 4060.511521893999,
        "Vega": 200.32299035092737,
        "IV": 9389.918322798785
      },
      {
        "BuySell": "string",
        "Symbol": "string",
        "Expiry": "string",
        "Strike": 9297.853515303183,
        "SCP": "string",
        "Lot": 6264,
        "Delta": 8017.160301965738,
        "Gamma": 3666.145262163625,
        "Theta": 3159.269307696573,
        "Vega": 9381.483942963047,
        "IV": 2090.8059980465964
      }
    ],
    "totalGreeks": {
      "TotalDelta": 1070.5466551293052,
      "TotalGamma": 6247.631048641344,
      "TotalTheta": 5490.663298450105,
      "TotalVega": 1003.2240308296192
    }
  }
}
```

---

<a id="report-102"></a>

### DeleteOrder

#### 1. DeleteOrder

**Method:** `GET`  
**Endpoint:** `/api/OptionsSimulator/DeleteOrder`  
**Description:** Executes the DeleteOrder action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| order_id | String | No |  | 4213 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4314,
  "Message": "string",
  "Result": true
}
```

---

<a id="report-103"></a>

### GetUpcomingtrades

#### 1. GetUpcomingtrades

**Method:** `GET`  
**Endpoint:** `/api/OptionsSimulator/GetUpcomingtrades`  
**Description:** Executes the GetUpcomingtrades action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |
| BhavDate | String | No |  | string |
| Time | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-104"></a>

### GetOrderbook

#### 1. GetOrderbook

**Method:** `GET`  
**Endpoint:** `/api/OptionsSimulator/GetOrderbook`  
**Description:** Executes the GetOrderbook action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |
| BhavDate | String | No |  | string |
| Time | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-105"></a>

### DeleteAllTrades

#### 1. DeleteAllTrades

**Method:** `GET`  
**Endpoint:** `/api/OptionsSimulator/DeleteAllTrades`  
**Description:** Executes the DeleteAllTrades action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-106"></a>

### UpdateOrder

#### 1. UpdateOrder

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/UpdateOrder`  
**Description:** Executes the UpdateOrder action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Orderid | Integer | Yes |  | 2796 |
| Token | Integer | Yes |  | 7307 |
| BuySell | String | Yes |  | string |
| Symbol | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | Number | Yes |  | 1125.5397977974678 |
| sCP | String | Yes |  | string |
| Lot | Integer | Yes |  | 2823 |
| EntryPrice | Number | Yes |  | 7953.645058133115 |
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |

**Sample Request:**

```json
{
  "Orderid": 2796,
  "Token": 7307,
  "BuySell": "string",
  "Symbol": "string",
  "Expiry": "string",
  "Strike": 1125.5397977974678,
  "sCP": "string",
  "Lot": 2823,
  "EntryPrice": 7953.645058133115,
  "BhavDate": "string",
  "Time": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-107"></a>

### AddOptionsOrder

#### 1. AddOptionsOrder

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/AddOptionsOrder`  
**Description:** Executes the AddOptionsOrder action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |
| Symbol | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| sCP | String | Yes |  | string |
| BuySell | String | Yes |  | string |
| Strike | Number | Yes |  | 5165.614882538132 |
| Lot | Integer | Yes |  | 2507 |

**Sample Request:**

```json
{
  "BhavDate": "string",
  "Time": "string",
  "Symbol": "string",
  "Expiry": "string",
  "sCP": "string",
  "BuySell": "string",
  "Strike": 5165.614882538132,
  "Lot": 2507
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-108"></a>

### GetOptionsStrike

#### 1. GetOptionsStrike

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/GetOptionsStrike`  
**Description:** Executes the GetOptionsStrike action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | Yes |  | string |
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |
| Expiry | String | Yes |  | string |

**Sample Request:**

```json
{
  "Symbol": "string",
  "BhavDate": "string",
  "Time": "string",
  "Expiry": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 3730,
  "Message": "st",
  "Result": [
    4894.126376666268,
    828.2656785493115
  ]
}
```

---

<a id="report-109"></a>

### GetFastStrategy

#### 1. GetFastStrategy

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/GetFastStrategy`  
**Description:** Executes the GetFastStrategy action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |
| StrategyName | String | Yes |  | string |

**Sample Request:**

```json
{
  "Symbol": "string",
  "Expiry": "string",
  "BhavDate": "string",
  "Time": "string",
  "StrategyName": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

<a id="report-110"></a>

### SqureoffPosition

#### 1. SqureoffPosition

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/SqureoffPosition`  
**Description:** Executes the SqureoffPosition action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| simu_orderbook_id | Integer | Yes |  | 3883 |
| Lot | Integer | Yes |  | 4876 |
| Token | Integer | Yes |  | 2847 |
| sCP | String | Yes |  | string |
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |

**Sample Request:**

```json
{
  "simu_orderbook_id": 3883,
  "Lot": 4876,
  "Token": 2847,
  "sCP": "string",
  "BhavDate": "string",
  "Time": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

<a id="report-111"></a>

### GetSpotRate

#### 1. GetSpotRate

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/GetSpotRate`  
**Description:** Executes the GetSpotRate action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | Yes |  | string |
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |

**Sample Request:**

```json
{
  "Symbol": "string",
  "BhavDate": "string",
  "Time": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

<a id="report-112"></a>

### GetFuturesContracts

#### 1. GetFuturesContracts

**Method:** `POST`  
**Endpoint:** `/api/OptionsSimulator/GetFuturesContracts`  
**Description:** Executes the GetFuturesContracts action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | Yes |  | string |
| BhavDate | String | Yes |  | string |
| Time | String | Yes |  | string |

**Sample Request:**

```json
{
  "Symbol": "string",
  "BhavDate": "string",
  "Time": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

<a id="report-113"></a>

### Expiries

#### 1. Expiries

**Method:** `GET`  
**Endpoint:** `/api/OptionsSimulator/Expiries`  
**Description:** Executes the Expiries action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |
| BhavDate | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

# Strategies

## Directional(single Leg)

<a id="report-114"></a>

### 1. Calls Puts

#### 1. GetCallPutStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/GetCallPutStrategies`  
**Description:** Executes the GetCallPutStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 5439 |
| PageSize | Integer | Yes |  | 4239 |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Option | String | Yes |  | string |
| CallsPutsVal | String | Yes |  | string |
| Buysellval | String | Yes |  | string |
| nDays | Array | Yes |  | [false,false] |
| Premium | String | Yes |  | string |
| preStart | Number | Yes |  | 5365.620975036096 |
| preEnd | Number | Yes |  | 5907.4928753574 |
| Strike | String | Yes |  | string |
| Strikestart | Number | Yes |  | 7563.523506449499 |
| Strikeend | Number | Yes |  | 1486.44681057003 |
| IVval | String | Yes |  | string |
| IVstart | Number | Yes |  | 9298.325861426076 |
| IVend | Number | Yes |  | 5117.953145510548 |
| MlossProfitval | String | Yes |  | string |
| Maxlossstart | Number | Yes |  | 1574.4176318915627 |
| Maxlossend | Number | Yes |  | 7551.881696735499 |
| Probability | Array | Yes |  | [false,false] |
| Moneyness | Array | Yes |  | [false,false] |
| Delta | Array | Yes |  | [false,false] |
| PageNumber | Integer | Yes |  | 7193 |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| OrderByParams | String | Yes |  | string |
| Countorder | Integer | Yes |  | 4413 |
| isLotSize | Boolean | Yes |  | false |
| probmaxval | Number | Yes |  | 5166.390181175359 |
| probminval | Number | Yes |  | 5082.117198070128 |
| deltaminval | Number | Yes |  | 228.8998093437411 |
| deltamaxval | Number | Yes |  | 7751.024363563794 |

**Sample Request:**

```json
{
  "ScripName": "ALL",
  "Expiry": null,
  "Option": "Indices",
  "CallsPutsVal": "Calls",
  "Buysellval": "Buy",
  "nDays": [
    true,
    true,
    false
  ],
  "Premium": "Above",
  "preStart": 0,
  "preEnd": 0,
  "Strike": "Above",
  "Strikestart": 0,
  "Strikeend": 0,
  "IVval": "Above",
  "IVstart": 0,
  "IVend": 0,
  "MlossProfitval": "Above",
  "Maxlossstart": 0,
  "Maxlossend": 0,
  "Probability": null,
  "Moneyness": [
    false,
    true,
    true,
    false,
    false
  ],
  "Delta": null,
  "PageNumber": 1,
  "Sort": "desc",
  "ColumnName": "POP",
  "OrderByParams": null,
  "Countorder": 0,
  "isLotSize": false,
  "probmaxval": 70,
  "probminval": 30,
  "deltaminval": 0.4,
  "deltamaxval": 0.7
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 8633,
  "Message": "string",
  "Result": {
    "PageNo": 236,
    "PageSize": 9479.660903788801,
    "TotalRecords": 4624,
    "TotalPages": 2377.5595083997737,
    "CAllPutList": [
      {
        "ScripName": "string",
        "Price": 5711.108678634056,
        "Strike": 230.80590816449754,
        "Moneyness": 833.1419459053468,
        "Expiry": "1970-01-17T10:05:27.930Z",
        "Premium": 3726.695023323234,
        "preStart": 9928.62156749639,
        "preEnd": 4400.092443387624,
        "Breakeven": 8204.623883021812,
        "OI": 435.5530447046596,
        "OIChange": 8079.919916789861,
        "LiveIV": 842.188169444098,
        "nDay": 1751.6355815421014,
        "MaxLoss": 3722.9064842569314,
        "Delta": 6835.351790824342,
        "Probability": 9320.731495026479,
        "MonthName": "string",
        "Token": 1506,
        "LotSize": 5336,
        "LTPf": 3317.556859457009,
        "Deltaf": 9.163180992610709,
        "maxlossf": 7548.0161461705
      },
      {
        "ScripName": "string",
        "Price": 8139.874229504427,
        "Strike": 9913.072323071545,
        "Moneyness": 2432.639805979946,
        "Expiry": "1988-05-10T16:51:07.976Z",
        "Premium": 4004.229556649637,
        "preStart": 363.0394112880242,
        "preEnd": 5941.455104056663,
        "Breakeven": 1769.832069586006,
        "OI": 3330.486108842876,
        "OIChange": 2481.3325399341425,
        "LiveIV": 2516.23389896479,
        "nDay": 1891.8770267160555,
        "MaxLoss": 2640.9559895445177,
        "Delta": 8482.346145622012,
        "Probability": 8237.56896204156,
        "MonthName": "string",
        "Token": 8995,
        "LotSize": 6078,
        "LTPf": 8522.873294185298,
        "Deltaf": 4034.175785750529,
        "maxlossf": 3971.407976925252
      }
    ]
  }
}
```

---

<a id="report-115"></a>

### 2. Open High

#### 1. OpenHigh

**Method:** `POST`  
**Endpoint:** `/api/Strategies/OpenHigh`  
**Description:** Screens stocks or indices that have opened higher and provides strategy signals with M2M calculation. Supports filtering by Open High type, time interval, historical dates.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Authorization | Bearer {{token}} |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| OHType | String | No | Open High type filter | string |
| Expiry | String | No | Expiry date | string |
| Time | String | No | Time filter | string |
| HistoricalDate | String | No | Historical date | string |
| M2MCalculationType | String | No | M2M calculation type | string |
| RateTime | String | No | Rate time reference | string |
| ResultType | String | No | Result type filter | string |
| LotMultiplier | Integer | No | Lot multiplier (default: 0) | 0 |

**Sample Request:**

```json
{
  "OHType": "string",
  "Expiry": "string",
  "Time": "string",
  "HistoricalDate": "string",
  "M2MCalculationType": "string",
  "RateTime": "string",
  "ResultType": "string",
  "LotMultiplier": 0
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "scripName": "RELIANCE",
      "ltp": 2456.8,
      "changePercent": 1.2,
      "result": "Buy",
      "lotsize": 500,
      "m2m": 13400
    }
  ]
}
```

---

<a id="report-116"></a>

### 3. Open Low

#### 1. OpenLow

**Method:** `POST`  
**Endpoint:** `/api/Strategies/OpenLow`  
**Description:** Screens stocks or indices that have opened lower and provides strategy signals with M2M calculation. Supports filtering by Open Low type, time interval, historical dates.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ohType | String | No | Open Low type filter | All |
| expiry | String | No | Expiry date | 27 Jun 2026 |
| time | String | No | Time filter | 09:30 |
| historicalDate | String | No | Historical date |  |
| m2mCalculationType | String | No | M2M type: Buy Future, Sell Put, Synthetic Buy |  |
| rateTime | String | Yes | Rate time reference | 09:15:00 |
| resultType | String | Yes | Result type filter: ALL or specific value | ALL |
| lotMultiplier | Integer | No | Lot multiplier (default: 1) | 1 |

**Sample Request:**

```json
{
  "ohType": "All",
  "expiry": "27 Jun 2026",
  "time": "09:30",
  "rateTime": "09:15:00",
  "resultType": "ALL",
  "lotMultiplier": 1
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "scripName": "HDFCBANK",
      "ltp": 1620.5,
      "changePercent": -0.8,
      "result": "Sell",
      "lotsize": 550,
      "m2m": -10725
    }
  ]
}
```

---

<a id="report-117"></a>

### 4. Nifty Contributors V2

#### 1. GetNiftyContributors

**Method:** `POST`  
**Endpoint:** `/api/Strategies/GetNiftyContributors`  
**Description:** Advanced version of Nifty Contributors with M2M calculation support. Returns positive and negative index contributors with futures/options data, strike prices, lot sizes, stoploss information.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | Yes |  | NIFTY 50 |
| startDays | String | Yes |  | 2026-04-20 |
| P_TIME | String | Yes |  | 15:20 |
| P_Rate_time | String | Yes |  | 09:25 |
| P_expiry | String | Yes |  | 28 apr 2026 |

**Sample Request:**

```json
{
  "indexName": "NIFTY",
  "startDays": "1",
  "p_TIME": "09:25:00",
  "p_Rate_time": "09:30:00",
  "p_expiry": "27 Jun 2026",
  "lotMultiplier": 1,
  "lotMultiplier2": 1,
  "m2mCalculationType": "buy future",
  "m2mCalculationType2": "sell future"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "positiveContributors": [
      {
        "scripName": "RELIANCE",
        "ltp": 2456.8,
        "contribution": 8.45,
        "m2m2": 8400
      }
    ],
    "negativeContributors": [
      {
        "scripName": "HDFC",
        "ltp": 1620.5,
        "contribution": -5.12,
        "m2m2": -5225
      }
    ]
  }
}
```

---

<a id="report-118"></a>

### GetExpiryMotnths

#### 1. GetExpiryMotnths

**Method:** `GET`  
**Endpoint:** `/api/Strategies/GetExpiryMotnths`  
**Description:** Get available expiry months.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| options | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 2094,
  "Message": "string",
  "Result": [
    "string",
    "string"
  ]
}
```

---

## Spreads

<a id="report-119"></a>

### 1. Bull Call Debit Spread

#### 1. BullCallDebitSpreadStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/BullCallDebitSpreadStrategies`  
**Description:** Executes the BullCallDebitSpreadStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 4601 |
| PageSize | Integer | Yes |  | 3000 |
| IdxstkVal | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Leg1premium | String | Yes |  | string |
| leg1Start | Number | Yes |  | 8791.267706903054 |
| leg1End | Number | Yes |  | 25.254990488443596 |
| Leg2premium | String | Yes |  | string |
| leg2Start | Number | Yes |  | 4253.876817759883 |
| leg2End | Number | Yes |  | 4302.889922820778 |
| NetDebit | String | Yes |  | string |
| NetdebitStart | Number | Yes |  | 8855.77675022585 |
| NetDebitEnd | Number | Yes |  | 5811.116751735579 |
| Maxprofit | String | Yes |  | string |
| Maxprofitstart | Number | Yes |  | 7730.168332820462 |
| maxprofitEnd | Number | Yes |  | 2349.785069915615 |
| nDays | Array | Yes |  | [true,false] |
| Riskrewardratio | Array | Yes |  | [false,false] |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| Month | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | false |
| probminval | Integer | Yes |  | 9051 |
| probmaxval | Integer | Yes |  | 3078 |
| cdeltaminval | Number | Yes |  | 1891.0272089389423 |
| cdeltamaxval | Number | Yes |  | 3731.541919106802 |
| pdeltaminval | Number | Yes |  | 6913.758408537067 |
| pdeltamaxval | Number | Yes |  | 8825.19859907169 |
| SpreadReport | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "IdxstkVal": "Indices",
  "ScripName": "ALL",
  "Expiry": "",
  "Leg1premium": "string",
  "leg1Start": 0,
  "leg1End": 0,
  "Leg2premium": "string",
  "leg2Start": 0,
  "leg2End": 0,
  "NetDebit": "string",
  "NetdebitStart": 0,
  "NetDebitEnd": 0,
  "Maxprofit": "string",
  "Maxprofitstart": 0,
  "maxprofitEnd": 0,
  "nDays": [
    true
  ],
  "Riskrewardratio": [
    true
  ],
  "probability": [
    true
  ],
  "Sort": "desc",
  "ColumnName": "OI",
  "Month": "aug",
  "isLotSize": true
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "BullCallDebitSpread": null,
    "Straddle": null,
    "Expiries": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-120"></a>

### 2. Bull Put Credit Spread

#### 1. BullPutCreditSpreadStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/BullPutCreditSpreadStrategies`  
**Description:** Executes the BullPutCreditSpreadStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 4601 |
| PageSize | Integer | Yes |  | 3000 |
| IdxstkVal | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Leg1premium | String | Yes |  | string |
| leg1Start | Number | Yes |  | 8791.267706903054 |
| leg1End | Number | Yes |  | 25.254990488443596 |
| Leg2premium | String | Yes |  | string |
| leg2Start | Number | Yes |  | 4253.876817759883 |
| leg2End | Number | Yes |  | 4302.889922820778 |
| NetDebit | String | Yes |  | string |
| NetdebitStart | Number | Yes |  | 8855.77675022585 |
| NetDebitEnd | Number | Yes |  | 5811.116751735579 |
| Maxprofit | String | Yes |  | string |
| Maxprofitstart | Number | Yes |  | 7730.168332820462 |
| maxprofitEnd | Number | Yes |  | 2349.785069915615 |
| nDays | Array | Yes |  | [true,false] |
| Riskrewardratio | Array | Yes |  | [false,false] |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| Month | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | false |
| probminval | Integer | Yes |  | 9051 |
| probmaxval | Integer | Yes |  | 3078 |
| cdeltaminval | Number | Yes |  | 1891.0272089389423 |
| cdeltamaxval | Number | Yes |  | 3731.541919106802 |
| pdeltaminval | Number | Yes |  | 6913.758408537067 |
| pdeltamaxval | Number | Yes |  | 8825.19859907169 |
| SpreadReport | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "IdxstkVal": "Indices",
  "ScripName": "ALL",
  "Expiry": "",
  "Leg1premium": "",
  "leg1Start": 0,
  "leg1End": 0,
  "Leg2premium": "",
  "leg2Start": 0,
  "leg2End": 0,
  "NetDebit": "",
  "NetdebitStart": 0,
  "NetDebitEnd": 0,
  "Maxprofit": "",
  "Maxprofitstart": 0,
  "maxprofitEnd": 0,
  "nDays": [
    true
  ],
  "Riskrewardratio": [
    true
  ],
  "probability": [
    true
  ],
  "Sort": "desc",
  "ColumnName": "OI",
  "Month": "aug",
  "isLotSize": true
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "BullCallDebitSpread": null,
    "Straddle": null,
    "Expiries": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-121"></a>

### 3. Bear Call Credit Spread

#### 1. BearCallCreditSpreadStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/BearCallCreditSpreadStrategies`  
**Description:** Get Bear Call Credit Spread strategies.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 4601 |
| PageSize | Integer | Yes |  | 3000 |
| IdxstkVal | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Leg1premium | String | Yes |  | string |
| leg1Start | Number | Yes |  | 8791.267706903054 |
| leg1End | Number | Yes |  | 25.254990488443596 |
| Leg2premium | String | Yes |  | string |
| leg2Start | Number | Yes |  | 4253.876817759883 |
| leg2End | Number | Yes |  | 4302.889922820778 |
| NetDebit | String | Yes |  | string |
| NetdebitStart | Number | Yes |  | 8855.77675022585 |
| NetDebitEnd | Number | Yes |  | 5811.116751735579 |
| Maxprofit | String | Yes |  | string |
| Maxprofitstart | Number | Yes |  | 7730.168332820462 |
| maxprofitEnd | Number | Yes |  | 2349.785069915615 |
| nDays | Array | Yes |  | [true,false] |
| Riskrewardratio | Array | Yes |  | [false,false] |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| Month | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | false |
| probminval | Integer | Yes |  | 9051 |
| probmaxval | Integer | Yes |  | 3078 |
| cdeltaminval | Number | Yes |  | 1891.0272089389423 |
| cdeltamaxval | Number | Yes |  | 3731.541919106802 |
| pdeltaminval | Number | Yes |  | 6913.758408537067 |
| pdeltamaxval | Number | Yes |  | 8825.19859907169 |
| SpreadReport | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 4601,
  "PageSize": 3000,
  "IdxstkVal": "string",
  "ScripName": "string",
  "Expiry": "string",
  "Leg1premium": "string",
  "leg1Start": 8791.267706903054,
  "leg1End": 25.254990488443596,
  "Leg2premium": "string",
  "leg2Start": 4253.876817759883,
  "leg2End": 4302.889922820778,
  "NetDebit": "string",
  "NetdebitStart": 8855.77675022585,
  "NetDebitEnd": 5811.116751735579,
  "Maxprofit": "string",
  "Maxprofitstart": 7730.168332820462,
  "maxprofitEnd": 2349.785069915615,
  "nDays": [
    true,
    false
  ],
  "Riskrewardratio": [
    false,
    false
  ],
  "Sort": "string",
  "ColumnName": "string",
  "Month": "string",
  "isLotSize": false,
  "probminval": 9051,
  "probmaxval": 3078,
  "cdeltaminval": 1891.0272089389423,
  "cdeltamaxval": 3731.541919106802,
  "pdeltaminval": 6913.758408537067,
  "pdeltamaxval": 8825.19859907169,
  "SpreadReport": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6476,
  "Message": "string",
  "Result": {
    "PageNo": 7592,
    "PageSize": 8317.266826713512,
    "TotalRecords": 6741,
    "TotalPages": 2342.403175868706,
    "BullCallDebitSpread": [
      {
        "Id": 524,
        "Symbol": "string",
        "Price": 428.92031387051776,
        "Expiry": "1962-12-03T19:41:04.914Z",
        "Strike": 2727,
        "StrikeLTP": 6181.905484712483,
        "Leg1": 5821,
        "Leg1Premium": 614.4011046083398,
        "Leg2": 2311,
        "Leg2Premium": 688.5662008187298,
        "NetDebit": 9645.639318638734,
        "MaxProfit": 4264.415495492147,
        "MaxProfitPercent": 6445.081750491208,
        "MaxLoss": 7817.122860618595,
        "Breakeven": 8876.890437613014,
        "Probability": 5171.153643010842,
        "RiskRewardRatio": 731.2903863945719,
        "MonthName": "string",
        "Leg1Token": 6679,
        "Leg2Token": 6425,
        "LotValue": 6077,
        "Leg1Delta": 5773.152955853935,
        "Leg2Delta": 7868.914870792701,
        "Leg1LTP": 1195.8597907367973,
        "Leg2LTP": 3944.312302132833
      },
      {
        "Id": 6810,
        "Symbol": "string",
        "Price": 3416.3277716668026,
        "Expiry": "1961-08-24T17:34:55.280Z",
        "Strike": 5854,
        "StrikeLTP": 2777.2827009385214,
        "Leg1": 1270,
        "Leg1Premium": 546.4042089423815,
        "Leg2": 9433,
        "Leg2Premium": 5622.074867339624,
        "NetDebit": 6803.920538550745,
        "MaxProfit": 8285.701617577894,
        "MaxProfitPercent": 2477.6129338538058,
        "MaxLoss": 3343.0289153476924,
        "Breakeven": 1229.6313801855852,
        "Probability": 9293.30185034433,
        "RiskRewardRatio": 485.7945494775162,
        "MonthName": "string",
        "Leg1Token": 4020,
        "Leg2Token": 300,
        "LotValue": 5791,
        "Leg1Delta": 6621.204010931871,
        "Leg2Delta": 3565.81809400234,
        "Leg1LTP": 1368.7644828864043,
        "Leg2LTP": 3019.9752417825152
      }
    ],
    "Straddle": [
      {
        "Symbol": "string",
        "EquityLTP": 3443.7371788008386,
        "Expiry": "1950-08-22T20:32:17.264Z",
        "Strike": 5236,
        "CallLTP": 2774.0415956281763,
        "PutLTP": 263.8969372419142,
        "NetDelta": 9852.779735585176,
        "AVGIV": 2247.344782131497,
        "NetCredit": 2569.0898570661,
        "BreakEvenMinus": 6899.954628860401,
        "BreakEvenPlus": 9434.039054858998,
        "Probability": 5368.565374147247
      },
      {
        "Symbol": "string",
        "EquityLTP": 8857.913551759711,
        "Expiry": "2020-06-21T05:59:53.264Z",
        "Strike": 9622,
        "CallLTP": 6848.472834145016,
        "PutLTP": 7315.0678648516605,
        "NetDelta": 6329.137826980626,
        "AVGIV": 9315.479643737383,
        "NetCredit": 3596.7090508154074,
        "BreakEvenMinus": 412.31611974411607,
        "BreakEvenPlus": 7210.457145247997,
        "Probability": 2170.2548822797876
      }
    ],
    "Expiries": [
      "string",
      "string"
    ]
  }
}
```

---

<a id="report-122"></a>

### 4. Bear Put Debit Spread

#### 1. BullPutDebitSpreadStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/BearPutDebitSpreadStrategies`  
**Description:** Executes the BullPutDebitSpreadStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 4601 |
| PageSize | Integer | Yes |  | 3000 |
| IdxstkVal | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Leg1premium | String | Yes |  | string |
| leg1Start | Number | Yes |  | 8791.267706903054 |
| leg1End | Number | Yes |  | 25.254990488443596 |
| Leg2premium | String | Yes |  | string |
| leg2Start | Number | Yes |  | 4253.876817759883 |
| leg2End | Number | Yes |  | 4302.889922820778 |
| NetDebit | String | Yes |  | string |
| NetdebitStart | Number | Yes |  | 8855.77675022585 |
| NetDebitEnd | Number | Yes |  | 5811.116751735579 |
| Maxprofit | String | Yes |  | string |
| Maxprofitstart | Number | Yes |  | 7730.168332820462 |
| maxprofitEnd | Number | Yes |  | 2349.785069915615 |
| nDays | Array | Yes |  | [true,false] |
| Riskrewardratio | Array | Yes |  | [false,false] |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| Month | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | false |
| probminval | Integer | Yes |  | 9051 |
| probmaxval | Integer | Yes |  | 3078 |
| cdeltaminval | Number | Yes |  | 1891.0272089389423 |
| cdeltamaxval | Number | Yes |  | 3731.541919106802 |
| pdeltaminval | Number | Yes |  | 6913.758408537067 |
| pdeltamaxval | Number | Yes |  | 8825.19859907169 |
| SpreadReport | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "IdxstkVal": "Indices",
  "ScripName": "All",
  "Expiry": "",
  "Leg1premium": "Above",
  "leg1Start": 0,
  "leg1End": 0,
  "Leg2premium": "Above",
  "leg2Start": 0,
  "leg2End": 0,
  "NetDebit": "Above",
  "NetdebitStart": 0,
  "NetDebitEnd": 0,
  "Maxprofit": "Above",
  "Maxprofitstart": 0,
  "maxprofitEnd": 0,
  "nDays": [
    true,
    false,
    false
  ],
  "Riskrewardratio": [
    false,
    true,
    false,
    false
  ],
  "Sort": "desc",
  "ColumnName": "POP",
  "Month": "Feb",
  "isLotSize": true,
  "probminval": 0,
  "probmaxval": 0,
  "cdeltaminval": 0.4,
  "cdeltamaxval": 0.6,
  "pdeltaminval": 0.4,
  "pdeltamaxval": 0.6,
  "SpreadReport": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "BullCallDebitSpread": null,
    "Straddle": null,
    "Expiries": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-123"></a>

### 5. Ratio Spread

#### 1. RatioSpreadStrategy

**Method:** `POST`  
**Endpoint:** `/api/Strategies/RatioSpreadStrategy`  
**Description:** Get Ratio Spread strategies.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 3098 |
| PageSize | Integer | Yes |  | 1905 |
| ScripName | String | Yes |  | string |
| IdxStkVal | String | Yes |  | string |
| CallsPutsVal | String | Yes |  | string |
| nDays | Array | Yes |  | [true,true] |
| SellRatio | Number | Yes |  | 114.37355904719615 |
| BuyRatio | Number | Yes |  | 9223.938543433487 |
| PremiumDiff | String | Yes |  | string |
| prediffStart | Number | Yes |  | 652.9070882649623 |
| prediffEnd | Number | Yes |  | 758.0359614646337 |
| BuyPremVal | String | Yes |  | string |
| BuyPremstart | Number | Yes |  | 6198.20146666945 |
| BuyPremend | Number | Yes |  | 1046.6236701383957 |
| SellPremVal | String | Yes |  | string |
| SellPremstart | Number | Yes |  | 9490.633017829048 |
| SellPremend | Number | Yes |  | 4725.043125773263 |
| BuyDeltastart | Number | Yes |  | 4723.31171875592 |
| BuyDeltaend | Number | Yes |  | 83.7159727719805 |
| NetDeltastart | Number | Yes |  | 1062.8333250458932 |
| NetDeltaend | Number | Yes |  | 1895.714150082659 |
| Netthetaval | String | Yes |  | string |
| Netthetastart | Number | Yes |  | 8812.448326348353 |
| Netthetaend | Number | Yes |  | 5947.239507562463 |
| PageNumber | Integer | Yes |  | 6712 |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | true |
| StrikeGaps | Array | Yes |  | [8477.504934039285,4629.674100065548] |

**Sample Request:**

```json
{
  "PageNo": 3098,
  "PageSize": 1905,
  "ScripName": "string",
  "IdxStkVal": "string",
  "CallsPutsVal": "string",
  "nDays": [
    true,
    true
  ],
  "SellRatio": 114.37355904719615,
  "BuyRatio": 9223.938543433487,
  "PremiumDiff": "string",
  "prediffStart": 652.9070882649623,
  "prediffEnd": 758.0359614646337,
  "BuyPremVal": "string",
  "BuyPremstart": 6198.20146666945,
  "BuyPremend": 1046.6236701383957,
  "SellPremVal": "string",
  "SellPremstart": 9490.633017829048,
  "SellPremend": 4725.043125773263,
  "BuyDeltastart": 4723.31171875592,
  "BuyDeltaend": 83.7159727719805,
  "NetDeltastart": 1062.8333250458932,
  "NetDeltaend": 1895.714150082659,
  "Netthetaval": "string",
  "Netthetastart": 8812.448326348353,
  "Netthetaend": 5947.239507562463,
  "PageNumber": 6712,
  "Sort": "string",
  "ColumnName": "string",
  "isLotSize": true,
  "StrikeGaps": [
    8477.504934039285,
    4629.674100065548
  ]
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1737,
  "Message": "string",
  "Result": {
    "PageNo": 6785,
    "PageSize": 9852.510174135134,
    "TotalRecords": 3160,
    "TotalPages": 2360.0047190525843,
    "RsList": [
      {
        "ScripName": "string",
        "Price": 4996.96268814725,
        "Expiry": "1966-11-17T16:32:13.546Z",
        "BuyStrike": 3076.8337619089302,
        "BuyLtp": 452.14542341675434,
        "BuyDelta": 2595.0629470119434,
        "BuyTheta": 1852.3249908533978,
        "SellStrike": 5007.562197113591,
        "SellLtp": 6392.493960208838,
        "SellDelta": 5254.781540622528,
        "SellTheta": 1581.3660667633967,
        "PremiumDiff": 8850.65189005244,
        "NetDelta": 5695.443551582897,
        "NetTheta": 2038.2360505934005,
        "BuyToken": 4342,
        "SellToken": 2344,
        "MonthName": "string",
        "ltp1": 8220.98045052014,
        "ltp2": 4646.644488551108,
        "delta1": 3597.4024449714293,
        "delta2": 9456.904312475279,
        "netdeltaf": 5775.297386737937,
        "netthetaf": 5787.309072815827,
        "StrikeGap": 3531.988868469913
      },
      {
        "ScripName": "st",
        "Price": 1510.582417648374,
        "Expiry": "2002-05-07T14:08:44.720Z",
        "BuyStrike": 6412.865460224566,
        "BuyLtp": 8654.186490193055,
        "BuyDelta": 5713.645012374073,
        "BuyTheta": 9886.14685547562,
        "SellStrike": 7804.854015279836,
        "SellLtp": 1437.388056193296,
        "SellDelta": 5047.959444580688,
        "SellTheta": 9653.985317846822,
        "PremiumDiff": 3553.8985105411225,
        "NetDelta": 5801.39279665135,
        "NetTheta": 5567.370549860233,
        "BuyToken": 9505,
        "SellToken": 9327,
        "MonthName": "string",
        "ltp1": 6673.45203304141,
        "ltp2": 4100.768061673594,
        "delta1": 3075.42693284647,
        "delta2": 3065.7975462627783,
        "netdeltaf": 1592.4446259077386,
        "netthetaf": 5088.417469005828,
        "StrikeGap": 3171.0792817466695
      }
    ]
  }
}
```

---

## Straddle And Strangle

<a id="report-124"></a>

### 1. Short Straddle

#### 1. ShortstraddleStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/ShortStraddleStrategies`  
**Description:** Executes the ShortstraddleStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 5129 |
| PageSize | Integer | Yes |  | 4451 |
| IDXSTKVal | String | Yes |  | string |
| IDXSTKName | String | Yes |  | string |
| ExpiryArray | Array | Yes |  | [true,false] |
| CallDeltaArray | Array | Yes |  | [true,true] |
| PutDeltaArray | Array | Yes |  | [false,true] |
| ProbabilityArray | Array | Yes |  | [true,true] |
| CPArray | Array | Yes |  | ["string","string"] |
| PPArray | Array | Yes |  | ["string","string"] |
| AIArray | Array | Yes |  | ["string","string"] |
| NCArray | Array | Yes |  | ["string","string"] |
| sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | false |
| probminval | Integer | Yes |  | 2220 |
| probmaxval | Integer | Yes |  | 7586 |
| cdeltaminval | Number | Yes |  | 1346.8490966619195 |
| cdeltamaxval | Number | Yes |  | 2495.1078134045556 |
| pdeltaminval | Number | Yes |  | 9815.309914626721 |
| pdeltamaxval | Number | Yes |  | 8106.949952943199 |
| CPVal | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "IdxstkVal": "Indices",
  "ScripName": "All",
  "Expiry": "",
  "Leg1premium": "Above",
  "leg1Start": 0,
  "leg1End": 0,
  "Leg2premium": "Above",
  "leg2Start": 0,
  "leg2End": 0,
  "NetDebit": "Above",
  "NetdebitStart": 0,
  "NetDebitEnd": 0,
  "Maxprofit": "Above",
  "Maxprofitstart": 0,
  "maxprofitEnd": 0,
  "nDays": [
    true,
    false,
    false
  ],
  "Riskrewardratio": [
    false,
    true,
    false,
    false
  ],
  "Sort": "desc",
  "ColumnName": "POP",
  "Month": "Feb",
  "isLotSize": true,
  "probminval": 0,
  "probmaxval": 0,
  "cdeltaminval": 0.4,
  "cdeltamaxval": 0.6,
  "pdeltaminval": 0.4,
  "pdeltamaxval": 0.6,
  "SpreadReport": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "ShortList": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-125"></a>

### 2. Long Straddle

#### 1. LongstraddleStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/LongStraddleStrategies`  
**Description:** Executes the LongstraddleStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 5129 |
| PageSize | Integer | Yes |  | 4451 |
| IDXSTKVal | String | Yes |  | string |
| IDXSTKName | String | Yes |  | string |
| ExpiryArray | Array | Yes |  | [true,false] |
| CallDeltaArray | Array | Yes |  | [true,true] |
| PutDeltaArray | Array | Yes |  | [false,true] |
| ProbabilityArray | Array | Yes |  | [true,true] |
| CPArray | Array | Yes |  | ["string","string"] |
| PPArray | Array | Yes |  | ["string","string"] |
| AIArray | Array | Yes |  | ["string","string"] |
| NCArray | Array | Yes |  | ["string","string"] |
| sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | false |
| probminval | Integer | Yes |  | 2220 |
| probmaxval | Integer | Yes |  | 7586 |
| cdeltaminval | Number | Yes |  | 1346.8490966619195 |
| cdeltamaxval | Number | Yes |  | 2495.1078134045556 |
| pdeltaminval | Number | Yes |  | 9815.309914626721 |
| pdeltamaxval | Number | Yes |  | 8106.949952943199 |
| CPVal | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "IdxstkVal": "Indices",
  "ScripName": "All",
  "Expiry": "",
  "Leg1premium": "Above",
  "leg1Start": 0,
  "leg1End": 0,
  "Leg2premium": "Above",
  "leg2Start": 0,
  "leg2End": 0,
  "NetDebit": "Above",
  "NetdebitStart": 0,
  "NetDebitEnd": 0,
  "Maxprofit": "Above",
  "Maxprofitstart": 0,
  "maxprofitEnd": 0,
  "nDays": [
    true,
    false,
    false
  ],
  "Riskrewardratio": [
    false,
    true,
    false,
    false
  ],
  "Sort": "desc",
  "ColumnName": "POP",
  "Month": "Feb",
  "isLotSize": true,
  "probminval": 0,
  "probmaxval": 0,
  "cdeltaminval": 0.4,
  "cdeltamaxval": 0.6,
  "pdeltaminval": 0.4,
  "pdeltamaxval": 0.6,
  "SpreadReport": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "ShortList": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-126"></a>

### 3. Short Strangle

#### 1. ShortstrangleStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/ShortStrangleStrategies`  
**Description:** Executes the ShortstrangleStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 3487 |
| PageSize | Integer | Yes |  | 2795 |
| StrangleType | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| sType | String | Yes |  | string |
| nDays | Array | Yes |  | [false,true] |
| CallDelta | Array | Yes |  | [false,false] |
| PutDelta | Array | Yes |  | [false,false] |
| CEPremiumstart | Number | Yes |  | 7563.3704212039875 |
| CEPremiumend | Number | Yes |  | 4139.050259257435 |
| PEPremiumstart | Number | Yes |  | 6222.794688732174 |
| PEPremiumend | Number | Yes |  | 7498.453318755273 |
| CPArray | Array | Yes |  | ["string","string"] |
| PPArray | Array | Yes |  | ["string","string"] |
| AIArray | Array | Yes |  | ["string","string"] |
| NCArray | Array | Yes |  | ["string","string"] |
| AVGIVstart | Number | Yes |  | 6387.851493694734 |
| AVGIVend | Number | Yes |  | 4815.790405131804 |
| NetCreditstart | Number | Yes |  | 9931.311774224878 |
| NetCreditend | Number | Yes |  | 6976.055017332989 |
| Probability | Array | Yes |  | [true,false] |
| PageNumber | Integer | Yes |  | 569 |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| OrderByParams | String | Yes |  | string |
| Countorder | Integer | Yes |  | 9547 |
| isLotSize | Boolean | Yes |  | false |
| probminval | Integer | Yes |  | 8066 |
| probmaxval | Integer | Yes |  | 5368 |
| cdeltaminval | Number | Yes |  | 7547.696601621834 |
| cdeltamaxval | Number | Yes |  | 748.1003434837174 |
| pdeltaminval | Number | Yes |  | 4815.532376083189 |
| pdeltamaxval | Number | Yes |  | 2661.6680250674895 |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "IdxstkVal": "Indices",
  "ScripName": "All",
  "Expiry": "",
  "Leg1premium": "Above",
  "leg1Start": 0,
  "leg1End": 0,
  "Leg2premium": "Above",
  "leg2Start": 0,
  "leg2End": 0,
  "NetDebit": "Above",
  "NetdebitStart": 0,
  "NetDebitEnd": 0,
  "Maxprofit": "Above",
  "Maxprofitstart": 0,
  "maxprofitEnd": 0,
  "nDays": [
    true,
    false,
    false
  ],
  "Riskrewardratio": [
    false,
    true,
    false,
    false
  ],
  "Sort": "desc",
  "ColumnName": "POP",
  "Month": "Feb",
  "isLotSize": true,
  "probminval": 0,
  "probmaxval": 0,
  "cdeltaminval": 0.4,
  "cdeltamaxval": 0.6,
  "pdeltaminval": 0.4,
  "pdeltamaxval": 0.6,
  "SpreadReport": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "shortLongList": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-126b"></a>

### 4. Long Strangle

#### 1. LongStrangleStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/ShortStrangleStrategies`  
**Description:** Retrieves Long Strangle strategies. Same endpoint as Short Strangle with StrangleType set to Long.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| PageNo | Integer | Yes | Page number. | 1 |
| PageSize | Integer | Yes | Records per page. | 10 |
| StrangleType | String | Yes | Strangle type. | Long |
| ScripName | String | Yes | Scrip name or All. | All |
| sType | String | Yes | Indices or Stocks. | Indices |
| nDays | Array | Yes | Days filter. | [true,false,false] |
| CallDelta | Array | Yes | Call delta filter. | [false,false] |
| PutDelta | Array | Yes | Put delta filter. | [false,false] |
| CEPremiumstart | Number | Yes | CE premium start. | 0 |
| CEPremiumend | Number | Yes | CE premium end. | 0 |
| PEPremiumstart | Number | Yes | PE premium start. | 0 |
| PEPremiumend | Number | Yes | PE premium end. | 0 |
| Probability | Array | Yes | Probability filter. | [true,false] |
| PageNumber | Integer | Yes | Page number. | 1 |
| Sort | String | Yes | Sort order. | desc |
| ColumnName | String | Yes | Column to sort by. | POP |
| isLotSize | Boolean | Yes | Show per lot size. | true |
| probminval | Integer | Yes | Min probability value. | 0 |
| probmaxval | Integer | Yes | Max probability value. | 0 |
| cdeltaminval | Number | Yes | Min call delta. | 0.3 |
| cdeltamaxval | Number | Yes | Max call delta. | 0.5 |
| pdeltaminval | Number | Yes | Min put delta. | 0.3 |
| pdeltamaxval | Number | Yes | Max put delta. | 0.5 |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "StrangleType": "Long",
  "ScripName": "All",
  "sType": "Indices",
  "nDays": [true,false,false],
  "CallDelta": [false,false],
  "PutDelta": [false,false],
  "CEPremiumstart": 0,
  "CEPremiumend": 0,
  "PEPremiumstart": 0,
  "PEPremiumend": 0,
  "Probability": [true,false],
  "PageNumber": 1,
  "Sort": "desc",
  "ColumnName": "POP",
  "isLotSize": true,
  "probminval": 0,
  "probmaxval": 0,
  "cdeltaminval": 0.3,
  "cdeltamaxval": 0.5,
  "pdeltaminval": 0.3,
  "pdeltamaxval": 0.5
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "shortLongList": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

## Butterfly Strategies

<a id="report-127"></a>

### 1. Short Call Butterfly

#### 1. ShortCallButterflyStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/ShortCallButterflyStrategies`  
**Description:** Executes the ShortCallButterflyStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 1654 |
| PageSize | Integer | Yes |  | 9110 |
| ScripName | String | Yes |  | string |
| Option | String | Yes |  | string |
| CallPut | String | Yes |  | string |
| PageNumber | Integer | Yes |  | 2009 |
| nDays | Array | Yes |  | [false,true] |
| spreadstart | Integer | Yes |  | 3404 |
| spreadend | Integer | Yes |  | 4647 |
| Leg1Value | String | Yes |  | string |
| Leg2Value | String | Yes |  | string |
| Leg3Value | String | Yes |  | string |
| Leg1PremiumStart | Number | Yes |  | 7607.226302278498 |
| Leg1PremiumEnd | Number | Yes |  | 4139.476981762607 |
| Leg2PremiumStart | Number | Yes |  | 9105.097685425368 |
| Leg2PremiumEnd | Number | Yes |  | 877.5038160195514 |
| Leg3PremiumStart | Number | Yes |  | 2958.296794018418 |
| Leg3PremiumEnd | Number | Yes |  | 1744.5239203315377 |
| NetCreditValue | String | Yes |  | string |
| NetCreditstart | Number | Yes |  | 1364.277407738086 |
| NetCreditend | Number | Yes |  | 1039.6814967941248 |
| MaxLossValue | String | Yes |  | string |
| MaxLossStart | Number | Yes |  | 112.14833673651947 |
| MaxLossEnd | Number | Yes |  | 4526.517073355023 |
| Probability | Array | Yes |  | [false,false] |
| Moneyness | Array | Yes |  | [false,true] |
| RiskRewardRatio | Array | Yes |  | [false,false] |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | true |
| probminval | Integer | Yes |  | 7066 |
| probmaxval | Integer | Yes |  | 370 |
| cdeltaminval | Number | Yes |  | 5758.875891224989 |
| cdeltamaxval | Number | Yes |  | 804.2324838665205 |
| pdeltaminval | Number | Yes |  | 3443.754562135752 |
| pdeltamaxval | Number | Yes |  | 6749.3542695191745 |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "ScripName": "All",
  "Option": "Indices",
  "CallPut": "CE",
  "PageNumber": 1,
  "nDays": [
    true
  ],
  "spreadstart": 0,
  "spreadend": 0,
  "Leg1Value": "Above",
  "Leg2Value": "Above",
  "Leg3Value": "Above",
  "Leg1PremiumStart": 0,
  "Leg1PremiumEnd": 0,
  "Leg2PremiumStart": 0,
  "Leg2PremiumEnd": 0,
  "Leg3PremiumStart": 0,
  "Leg3PremiumEnd": 0,
  "NetCreditValue": "Above",
  "NetCreditstart": 0,
  "NetCreditend": 0,
  "MaxLossValue": "Above",
  "MaxLossStart": 0,
  "MaxLossEnd": 0,
  "Probability": [
    true
  ],
  "Moneyness": [
    true
  ],
  "RiskRewardRatio": [
    true
  ],
  "Sort": "desc",
  "ColumnName": "POP",
  "isLotSize": true,
  "probminval": 30,
  "probmaxval": 70,
  "cdeltaminval": 0,
  "cdeltamaxval": 0,
  "pdeltaminval": 0,
  "pdeltamaxval": 0
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "ShortCPBList": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-128"></a>

### 2. Long Call Butterfly

#### 1. LongCallButterflyStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/LongCallButterflyStrategies`  
**Description:** Executes the LongCallButterflyStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 6904 |
| PageSize | Integer | Yes |  | 3918 |
| StrangleType | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| sType | String | Yes |  | string |
| nDays | Array | Yes |  | [true,true] |
| CallDelta | Array | Yes |  | [false,false] |
| PutDelta | Array | Yes |  | [true,true] |
| CEPremiumstart | Number | Yes |  | 6245.826604317944 |
| CEPremiumend | Number | Yes |  | 5168.09596045285 |
| PEPremiumstart | Number | Yes |  | 4963.760651797522 |
| PEPremiumend | Number | Yes |  | 6456.061602570613 |
| CPArray | Array | Yes |  | ["string","string"] |
| PPArray | Array | Yes |  | ["string","string"] |
| AIArray | Array | Yes |  | ["string","string"] |
| NCArray | Array | Yes |  | ["string","string"] |
| AVGIVstart | Number | Yes |  | 4649.383653219829 |
| AVGIVend | Number | Yes |  | 2225.1554498104965 |
| NetCreditstart | Number | Yes |  | 3579.9199359683985 |
| NetCreditend | Number | Yes |  | 6064.984447966428 |
| Probability | Array | Yes |  | [true,false] |
| PageNumber | Integer | Yes |  | 5207 |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| OrderByParams | String | Yes |  | string |
| Countorder | Integer | Yes |  | 4149 |
| isLotSize | Boolean | Yes |  | true |
| probminval | Integer | Yes |  | 5252 |
| probmaxval | Integer | Yes |  | 8805 |
| cdeltaminval | Number | Yes |  | 3033.687159771916 |
| cdeltamaxval | Number | Yes |  | 4600.739953481514 |
| pdeltaminval | Number | Yes |  | 5792.366465292962 |
| pdeltamaxval | Number | Yes |  | 8514.014361207695 |
| Moneyness | Array | Yes |  | [false,false] |
| spreadstart | Integer | Yes |  | 1550 |
| spreadend | Integer | Yes |  | 4083 |
| Leg1Value | String | Yes |  | string |
| Leg2Value | String | Yes |  | string |
| Leg3Value | String | Yes |  | string |
| MaxLossValue | String | Yes |  | string |
| NetCreditValue | String | Yes |  | string |
| Leg1PremiumStart | Integer | Yes |  | 246 |
| Leg1Premiumend | Integer | Yes |  | 9981 |
| Leg2PremiumStart | Integer | Yes |  | 185 |
| Leg2Premiumend | Integer | Yes |  | 2022 |
| Leg3PremiumStart | Integer | Yes |  | 4329 |
| Leg3Premiumend | Integer | Yes |  | 5143 |
| MaxProfitStart | Integer | Yes |  | 3251 |
| MaxProfitend | Integer | Yes |  | 9861 |
| MaxLossStart | Integer | Yes |  | 6994 |
| MaxLossend | Integer | Yes |  | 7149 |
| RiskRewardRatio | Array | Yes |  | [false,true] |
| sCallPut | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 10,
  "StrangleType": "string",
  "ScripName": "All",
  "sType": "Indices",
  "nDays": [
    true
  ],
  "CallDelta": [
    true
  ],
  "PutDelta": [
    true
  ],
  "CEPremiumstart": 0,
  "CEPremiumend": 0,
  "PEPremiumstart": 0,
  "PEPremiumend": 0,
  "CPArray": [
    "string"
  ],
  "PPArray": [
    "string"
  ],
  "AIArray": [
    "string"
  ],
  "NCArray": [
    "string"
  ],
  "AVGIVstart": 0,
  "AVGIVend": 0,
  "NetCreditstart": 0,
  "NetCreditend": 0,
  "Probability": [
    true
  ],
  "PageNumber": 1,
  "Sort": "desc",
  "ColumnName": "POP",
  "OrderByParams": "",
  "Countorder": 0,
  "isLotSize": true,
  "probminval": 0,
  "probmaxval": 0,
  "cdeltaminval": 0,
  "cdeltamaxval": 0,
  "pdeltaminval": 0,
  "pdeltamaxval": 0,
  "Moneyness": [
    true
  ],
  "spreadstart": 0,
  "spreadend": 0,
  "Leg1Value": "Above",
  "Leg2Value": "Above",
  "Leg3Value": "Above",
  "MaxLossValue": "Above",
  "NetCreditValue": "Above",
  "Leg1PremiumStart": 0,
  "Leg1Premiumend": 0,
  "Leg2PremiumStart": 0,
  "Leg2Premiumend": 0,
  "Leg3PremiumStart": 0,
  "Leg3Premiumend": 0,
  "MaxProfitStart": 0,
  "MaxProfitend": 0,
  "MaxLossStart": 0,
  "MaxLossend": 0,
  "RiskRewardRatio": [
    true
  ],
  "sCallPut": "CE"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "LCPList": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-129"></a>

### 3. Short Put Butterfly

#### 1. ShortPutButterflyStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/ShortPutButterflyStrategies`  
**Description:** Executes the ShortPutButterflyStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 1654 |
| PageSize | Integer | Yes |  | 9110 |
| ScripName | String | Yes |  | string |
| Option | String | Yes |  | string |
| CallPut | String | Yes |  | string |
| PageNumber | Integer | Yes |  | 2009 |
| nDays | Array | Yes |  | [false,true] |
| spreadstart | Integer | Yes |  | 3404 |
| spreadend | Integer | Yes |  | 4647 |
| Leg1Value | String | Yes |  | string |
| Leg2Value | String | Yes |  | string |
| Leg3Value | String | Yes |  | string |
| Leg1PremiumStart | Number | Yes |  | 7607.226302278498 |
| Leg1PremiumEnd | Number | Yes |  | 4139.476981762607 |
| Leg2PremiumStart | Number | Yes |  | 9105.097685425368 |
| Leg2PremiumEnd | Number | Yes |  | 877.5038160195514 |
| Leg3PremiumStart | Number | Yes |  | 2958.296794018418 |
| Leg3PremiumEnd | Number | Yes |  | 1744.5239203315377 |
| NetCreditValue | String | Yes |  | string |
| NetCreditstart | Number | Yes |  | 1364.277407738086 |
| NetCreditend | Number | Yes |  | 1039.6814967941248 |
| MaxLossValue | String | Yes |  | string |
| MaxLossStart | Number | Yes |  | 112.14833673651947 |
| MaxLossEnd | Number | Yes |  | 4526.517073355023 |
| Probability | Array | Yes |  | [false,false] |
| Moneyness | Array | Yes |  | [false,true] |
| RiskRewardRatio | Array | Yes |  | [false,false] |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| isLotSize | Boolean | Yes |  | true |
| probminval | Integer | Yes |  | 7066 |
| probmaxval | Integer | Yes |  | 370 |
| cdeltaminval | Number | Yes |  | 5758.875891224989 |
| cdeltamaxval | Number | Yes |  | 804.2324838665205 |
| pdeltaminval | Number | Yes |  | 3443.754562135752 |
| pdeltamaxval | Number | Yes |  | 6749.3542695191745 |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 50,
  "ScripName": "All",
  "Option": "Indices",
  "CallPut": "PE",
  "PageNumber": 1,
  "nDays": [
    true
  ],
  "spreadstart": 0,
  "spreadend": 0,
  "Leg1Value": "Above",
  "Leg2Value": "Above",
  "Leg3Value": "Above",
  "Leg1PremiumStart": 0,
  "Leg1PremiumEnd": 0,
  "Leg2PremiumStart": 0,
  "Leg2PremiumEnd": 0,
  "Leg3PremiumStart": 0,
  "Leg3PremiumEnd": 0,
  "NetCreditValue": "Above",
  "NetCreditstart": 0,
  "NetCreditend": 0,
  "MaxLossValue": "Above",
  "MaxLossStart": 0,
  "MaxLossEnd": 0,
  "Probability": [
    true
  ],
  "Moneyness": [
    true
  ],
  "RiskRewardRatio": [
    true
  ],
  "Sort": "desc",
  "ColumnName": "POP",
  "isLotSize": true,
  "probminval": 30,
  "probmaxval": 70,
  "cdeltaminval": 0,
  "cdeltamaxval": 0,
  "pdeltaminval": 0,
  "pdeltamaxval": 0
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "LCPList": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

<a id="report-130"></a>

### 4. Long Put Butterfly

#### 1. LongPutButterflyStrategies

**Method:** `POST`  
**Endpoint:** `/api/Strategies/LongPutButterflyStrategies`  
**Description:** Executes the LongPutButterflyStrategies action under the Strategies module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 6904 |
| PageSize | Integer | Yes |  | 3918 |
| StrangleType | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| sType | String | Yes |  | string |
| nDays | Array | Yes |  | [true,true] |
| CallDelta | Array | Yes |  | [false,false] |
| PutDelta | Array | Yes |  | [true,true] |
| CEPremiumstart | Number | Yes |  | 6245.826604317944 |
| CEPremiumend | Number | Yes |  | 5168.09596045285 |
| PEPremiumstart | Number | Yes |  | 4963.760651797522 |
| PEPremiumend | Number | Yes |  | 6456.061602570613 |
| CPArray | Array | Yes |  | ["string","string"] |
| PPArray | Array | Yes |  | ["string","string"] |
| AIArray | Array | Yes |  | ["string","string"] |
| NCArray | Array | Yes |  | ["string","string"] |
| AVGIVstart | Number | Yes |  | 4649.383653219829 |
| AVGIVend | Number | Yes |  | 2225.1554498104965 |
| NetCreditstart | Number | Yes |  | 3579.9199359683985 |
| NetCreditend | Number | Yes |  | 6064.984447966428 |
| Probability | Array | Yes |  | [true,false] |
| PageNumber | Integer | Yes |  | 5207 |
| Sort | String | Yes |  | string |
| ColumnName | String | Yes |  | string |
| OrderByParams | String | Yes |  | string |
| Countorder | Integer | Yes |  | 4149 |
| isLotSize | Boolean | Yes |  | true |
| probminval | Integer | Yes |  | 5252 |
| probmaxval | Integer | Yes |  | 8805 |
| cdeltaminval | Number | Yes |  | 3033.687159771916 |
| cdeltamaxval | Number | Yes |  | 4600.739953481514 |
| pdeltaminval | Number | Yes |  | 5792.366465292962 |
| pdeltamaxval | Number | Yes |  | 8514.014361207695 |
| Moneyness | Array | Yes |  | [false,false] |
| spreadstart | Integer | Yes |  | 1550 |
| spreadend | Integer | Yes |  | 4083 |
| Leg1Value | String | Yes |  | string |
| Leg2Value | String | Yes |  | string |
| Leg3Value | String | Yes |  | string |
| MaxLossValue | String | Yes |  | string |
| NetCreditValue | String | Yes |  | string |
| Leg1PremiumStart | Integer | Yes |  | 246 |
| Leg1Premiumend | Integer | Yes |  | 9981 |
| Leg2PremiumStart | Integer | Yes |  | 185 |
| Leg2Premiumend | Integer | Yes |  | 2022 |
| Leg3PremiumStart | Integer | Yes |  | 4329 |
| Leg3Premiumend | Integer | Yes |  | 5143 |
| MaxProfitStart | Integer | Yes |  | 3251 |
| MaxProfitend | Integer | Yes |  | 9861 |
| MaxLossStart | Integer | Yes |  | 6994 |
| MaxLossend | Integer | Yes |  | 7149 |
| RiskRewardRatio | Array | Yes |  | [false,true] |
| sCallPut | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1,
  "PageSize": 50,
  "StrangleType": "",
  "ScripName": "All",
  "sType": "Indices",
  "nDays": [
    true
  ],
  "CallDelta": [
    true
  ],
  "PutDelta": [
    true
  ],
  "CEPremiumstart": 0,
  "CEPremiumend": 0,
  "PEPremiumstart": 0,
  "PEPremiumend": 0,
  "CPArray": [
    "string"
  ],
  "PPArray": [
    "string"
  ],
  "AIArray": [
    "string"
  ],
  "NCArray": [
    "string"
  ],
  "AVGIVstart": 0,
  "AVGIVend": 0,
  "NetCreditstart": 0,
  "NetCreditend": 0,
  "Probability": [
    true
  ],
  "PageNumber": 0,
  "Sort": "desc",
  "ColumnName": "POP",
  "OrderByParams": "",
  "Countorder": 0,
  "isLotSize": true,
  "probminval": 0,
  "probmaxval": 0,
  "cdeltaminval": 0,
  "cdeltamaxval": 0,
  "pdeltaminval": 0,
  "pdeltamaxval": 0,
  "Moneyness": [
    true
  ],
  "spreadstart": 0,
  "spreadend": 0,
  "Leg1Value": "Above",
  "Leg2Value": "Above",
  "Leg3Value": "Above",
  "MaxLossValue": "Above",
  "NetCreditValue": "Above",
  "Leg1PremiumStart": 0,
  "Leg1Premiumend": 0,
  "Leg2PremiumStart": 0,
  "Leg2Premiumend": 0,
  "Leg3PremiumStart": 0,
  "Leg3Premiumend": 0,
  "MaxProfitStart": 0,
  "MaxProfitend": 0,
  "MaxLossStart": 0,
  "MaxLossend": 0,
  "RiskRewardRatio": [
    true
  ],
  "sCallPut": "PE"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "LCPList": null,
    "PageNo": 0,
    "PageSize": 0,
    "TotalRecords": 0,
    "TotalPages": 0
  }
}
```

---

# Search Result (Underlying)

## Search Results

<a id="report-131"></a>

### UnderlyingSideBar

#### 1. UnderlyingSideBar

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/UnderlyingSideBar`  
**Description:** Retrieves underlying sidebar data including LTP, price movement, pivot points and key market levels for a given scrip.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| Scriptname | String | Yes | Scrip name to search. | NIFTY |

**Sample Request:**

```json
{
  "Scriptname": "NIFTY"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "ListUnderData": [
      {
        "Token": 4,
        "LTP": "23326.7",
        "LTPChange": 136.05,
        "LTPChangePercent": 0.59,
        "ScripName": "NIFTY",
        "LOW": 23132.8,
        "HIGH": 23402.7,
        "OPEN": 23168.25,
        "Close": 23190.65,
        "BID1PRICE": 0,
        "ASK1PRICE": 0,
        "YearsHigh": 26277.35,
        "YearsLow": 21281.45,
        "VOLUMEFutures": "66.01 L",
        "OIFutures": "1.93 Cr",
        "FutureOIDiff": "34.43 K",
        "FutureOIDiffPercent": "0.18",
        "LotSize": "75",
        "IndustryName": "INDEX"
      }
    ],
    "ClassicivotPoint": 23127.1,
    "ClassicPivotPoint": 0,
    "R1Classic": 23280.25,
    "R2Classic": 23369.85,
    "R3Classic": 23523,
    "S1Classic": 23037.5,
    "S2Classic": 22884.35,
    "S3Classic": 22794.75,
    "FiboivotPoint": 23127.1,
    "FibPivotPoint": 0,
    "R1Fibo": 23219.83,
    "R2Fibo": 23277.12,
    "R3Fibo": 23369.85,
    "S1Fibo": 23034.37,
    "S2Fibo": 22977.08,
    "S3Fibo": 22884.35
  }
}
```

---

<a id="report-132"></a>

### UnderlyingMainChart

#### 1. UnderlyingMainChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/UnderlyingMainChart`  
**Description:** Executes the UnderlyingMainChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| FilterForGraph | String | Yes |  | string |

**Sample Request:**

```json
{
  "StockName": "string",
  "FilterForGraph": "string"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"mainChart": [
{
"Date": "21 Mar 2025 09:16",
"Close": "23147.75"
},
{
"Date": "21 Mar 2025 09:17",
"Close": "23164.9"
},
],


"StartIndexValue": "23147.75",
"EndIndexValue": ""
}
}
```

---

<a id="report-133"></a>

### UnderlyingPricetablebySearch

#### 1. UnderlyingPricetablebySearch

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/UnderlyingPriceTablebySearch`  
**Description:** Executes the UnderlyingPricetablebySearch action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | No |  | string |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"DATE": "20 Mar 2025",
"OPEN": 23036.60,
"High": 23216.70,
"LOW": 22973.95,
"CLOSE": 23190.65,
"VOLUME": "0.00",
"DELIVERY": 0,
"TwentyDaySMA": 22565.81,
"FiftyDaySMA": 22972.01,
"TwoHundredDaySMA": 24061.59,
"ChangePercentage": 1.24,
"DeliveryPer": 0
}}
```

---

<a id="report-134"></a>

### UnderlyingPPMovingAverage

#### 1. UnderlyingPPMovingAverage

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/UnderlyingPPMovingAverage`  
**Description:** Executes the UnderlyingPPMovingAverage action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | No |  | string |

**Sample Response:**

```json
{
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"Days": "10 Day",
"Low": 22245.85,
"High": 23216.7,
"percentbar": 97.32,
"Average": 22636.44,
"Performance": 3.57
},
{
"Days": "20 Day",
"Low": 21964.6,
"High": 23216.7,
"percentbar": 97.92,
"Average": 22565.81,
"Performance": 1.82
},
{
"Days": "50 Day",
"Low": 21964.6,
"High": 23807.3,
"percentbar": 66.54,
"Average": 22972.01,
"Performance": -0.75
},
{
"Days": "100 Day",
"Low": 21964.6,
"High": 24857.75,
"percentbar": 42.38,
"Average": 23531.80,
"Performance": -4.06
},
{
"Days": "200 Day",
"Low": 21281.45,
"High": 26277.35,
"percentbar": 38.22,
"Average": 24061.59,
"Performance": 6.70
},
{
"Days": "YTD",
"Low": 21964.6,
"High": 24226.7,
"percentbar": 54.2,
"Average": 23063.38,
"Performance": -1.65
},
{
"Days": "52 Week",
"Low": 21281.45,
"High": 26277.35,
"percentbar": 38.22,
"Average": 23748.75,
"Performance": 6.08
}
]


}}
```

---

<a id="report-135"></a>

### UnderlyingDayHighLowRange

#### 1. UnderlyingDayHighLowRange

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/UnderlyingDayHighLowRange`  
**Description:** Executes the UnderlyingDayHighLowRange action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "Time": "10:00 AM",
      "Low": "23132.80",
      "High": "23276.70",
      "Volume": "-"
    },
    {
      "Time": "11:00 AM",
      "Low": "23132.80",
      "High": "23357.70",
      "Volume": "-"
    },
    {
      "Time": "12:00 PM",
      "Low": "23132.80",
      "High": "23370.80",
      "Volume": "-"
    },
    {
      "Time": "13:00 PM",
      "Low": "23132.80",
      "High": "23402.40",
      "Volume": "-"
    },
    {
      "Time": "14:00 PM",
      "Low": "23132.80",
      "High": "23402.70",
      "Volume": "-"
    },
    {
      "Time": "15:00 PM",
      "Low": "23132.80",
      "High": "23402.70",
      "Volume": "-"
    },
    {
      "Time": "15:30 PM",
      "Low": "23132.80",
      "High": "23402.70",
      "Volume": "-"
    }
  ]
}
```

---

<a id="report-136"></a>

### UnderlyingFutureContract

#### 1. UnderlyingFutureContract

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/UnderlyingFutureContract`  
**Description:** Executes the UnderlyingFutureContract action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "FutureData": [
      {
        "ChangeINOI2": "-4.71 L (-3.06%)",
        "sScriptDescription": "NIFTY 27 Mar 2025 FUT",
        "OI": "1.49 Cr",
        "ChangeInOI": "1.54 Cr",
        "PreOpenInterest": 0,
        "OpenInterestInPercent": null,
        "Volume": "66.79 L",
        "LTP": 23382.1,
        "HIGH": 23438,
        "LOW": 23172,
        "LOTSIZE": 0,
        "ExpiryDate": null,
        "ScripName": null,
        "SCP": "FO",
        "LTPChange": 23200.25,
        "LTPInPercent": "181.85 (0.78 %)",
        "OPEN": 23195.05,
        "CLOSE": 23200.25,
        "Token": 35001
      },
      {
        "ChangeINOI2": "3.87 L (14.46%)",
        "sScriptDescription": "NIFTY 24 Apr 2025 FUT",
        "OI": "30.64 L",
        "ChangeInOI": "26.77 L",
        "PreOpenInterest": 0,
        "OpenInterestInPercent": null,
        "Volume": "19.57 L",
        "LTP": 23534.35,
        "HIGH": 23574,
        "LOW": 23315.75,
        "LOTSIZE": 0,
        "ExpiryDate": null,
        "ScripName": null,
        "SCP": "FO",
        "LTPChange": 23346.5,
        "LTPInPercent": "187.85 (0.8 %)",
        "OPEN": 23330.05,
        "CLOSE": 23346.5,
        "Token": 54452
      },
      {
        "ChangeINOI2": "78.30 K (6.7%)",
        "sScriptDescription": "NIFTY 29 May 2025 FUT",
        "OI": "12.47 L",
        "ChangeInOI": "11.68 L",
        "PreOpenInterest": 0,
        "OpenInterestInPercent": null,
        "Volume": "4.27 L",
        "LTP": 23660,
        "HIGH": 23697,
        "LOW": 23435.65,
        "LOTSIZE": 0,
        "ExpiryDate": null,
        "ScripName": null,
        "SCP": "FO",
        "LTPChange": 23458.2,
        "LTPInPercent": "201.8 (0.86 %)",
        "OPEN": 23455,
        "CLOSE": 23458.2,
        "Token": 57133
      }
    ],
    "Roll": {
      "ROLLOVERCOST": 0.22,
      "ROLLOVERPercent": "22.00",
      "RollOverCostINR": 152.25,
      "ROCINRInPercent": "0.65"
    }
  }
}
```

---

<a id="report-137"></a>

### FutureSideBar

#### 1. FutureSideBar

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/FutureSideBar`  
**Description:** Retrieves future sidebar data including LTP, OI, volume, pivot points for a given scrip and expiry.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "FuturesideBardata": [
      {
        "Token": 35001,
        "ScripName": "NIFTY",
        "Expiry": "27 Mar 2025",
        "LTP": 23382.1,
        "LTPChange": 181.85,
        "LTPChangePer": 0.78,
        "Open": 23195.05,
        "Close": 23200.25,
        "High": 23438,
        "Low": 23172,
        "Volume": "66.79 L",
        "volumeRatio": 0.45,
        "OI": "1.49 Cr",
        "OIChange": "-4.71 L",
        "OIChangePer": -3.06,
        "LotSize": 75,
        "Sector": "INDEX",
        "Underlying": "23382.1000",
        "PreviousOI": "1.54 Cr",
        "Bid1Price": "23382.1",
        "Ask1Price": "23386.4",
        "CumulativeOI": "1.93 Cr"
      }
    ],
    "ClassicPivotPoint": 23270.08,
    "FibPivotPoint": 23270.08,
    "R1Classic": 23368.16,
    "R2Classic": 23536.08,
    "R3Classic": 23634.16,
    "R1Fibo": 23371.69,
    "R2Fibo": 23434.47,
    "R3Fibo": 23536.08,
    "S1Classic": 23102.16,
    "S2Classic": 23004.08,
    "S3Classic": 22836.16,
    "S1Fibo": 23168.47,
    "S2Fibo": 23105.69,
    "S3Fibo": 23004.08
  }
}
```

---

<a id="report-138"></a>

### FutureMainChart

#### 1. FutureMainChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/FutureMainChart`  
**Description:** Executes the FutureMainChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Filter | String | Yes |  | string |
| FilPriceOI | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "Filter": "string",
  "FilPriceOI": "string"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"ScripName": "NIFTY",
"Expiry": "27 Mar 2025",
"FeedUpdateTime": "21 Mar 2025 09:16",
"LTP": 23190,
"Underlying": 23147.75
},
{
"ScripName": "NIFTY",
"Expiry": "27 Mar 2025",
"FeedUpdateTime": "21 Mar 2025 09:17",
"LTP": 23205,
"Underlying": 23164.9
}}
```

---

<a id="report-139"></a>

### FutureOITrendChart

#### 1. FutureOITrendChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/FutureOITrendChart`  
**Description:** Executes the FutureOITrendChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |

**Sample Request:**

```json
{
  "StockName": "string",
  "ExpiryDate": "string"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Expiry": [
"27 Mar 2025",
"24 Apr 2025",
"29 May 2025"
],
"PCR": [
{
"ScriptName": "27 Dec 2024",
"CALLOI": "35175",
"PUTOI": "24275.45",
"PCR": 0,
"Token": 0,
"Ltp": 0,
"ExpiryDate": "27 Mar 2025"
},
{
"ScriptName": "30 Dec 2024",
"CALLOI": "77400",
"PUTOI": "24116.00",
"PCR": 0,
"Token": 0,
"Ltp": 0,
"ExpiryDate": "27 Mar 2025"
}}}
```

---

<a id="report-140"></a>

### FutureChangeOIChart

#### 1. FutureChangeOIChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/FutureOIChart`  
**Description:** Executes the FutureChangeOIChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | NIFTY |
| Expiry | String | Yes |  | NULL |
| SCP | String | Yes |  | CE |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "Expiry": "NULL",
  "SCP": "CE"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"Script": "NIFTY",
"Instrument": "",
"Strike": 23100,
"CallToken": 0,
"PutToken": 0,
"BroadcastConstant": 0,
"ExchangeID": 0,
"ExpiryDate": "03/27/2025 00:00:00",
"DbCallPrice": 0,
"DbCallPriceChange": 0,
"DbCallOI": 0,
"DbCallOIChange": -584700,
"DbPutPrice": 0,
"DbPutPriceChange": 0,
"DbPutOI": 0,
"DbPutOIChange": 2725725,
"CallIV": 0,
"PutIV": 0,
"CallVolume": 0,
"PutVolume": 0,
"CallOIChangePercent": 0,
"PutOIChangePercent": 0
}}
```

---

#### 2. FutureChangeOIChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/FutureChangeOIChart`  
**Description:** Executes the FutureChangeOIChart action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| SCP | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "SCP": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

<a id="report-141"></a>

### FutureIntradayBuildUp

#### 1. FutureIntradayBuildUp

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/FutureIntradayBuildUp`  
**Description:** Executes the FutureIntradayBuildUp action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | NIFTY |
| Expiry | String | Yes |  | NULL |
| SCP | String | Yes |  | CE |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |
| Expiry | String | No |  | string |
| Strike | String | No |  | string |
| SCP | String | No |  | string |
| option | String | No |  | string |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "Expiry": "NULL",
  "SCP": "CE"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"Interval": "15:25 - 15:30",
"BuildUp": "Long Build Up",
"PriceChange": 2.4,
"PriceChangePer": 0.01,
"OIChange": "9825.00",
"OIChangeper": 0.07,
"VolumeChange": "66.66 L",
"Price": 23384.4
},
{
"Interval": "15:20 - 15:25",
"BuildUp": "Short Covering",
"PriceChange": 9.25,
"PriceChangePer": 0.04,
"OIChange": "-41.93 K",
"OIChangeper": -0.28,
"VolumeChange": "64.32 L",
"Price": 23382
}}
```

---

<a id="report-142"></a>

### FuturePriceTablebySearch

#### 1. FuturePriceTablebySearch

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/FuturePriceTablebySearch`  
**Description:** Executes the FuturePriceTablebySearch action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "Expiry": "NULL"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"DATE": "20 Mar 2025",
"OPEN": 23069.90,
"High": 23232.60,
"LOW": 23015.00,
"CLOSE": 23200.25,
"Volume": "77.97 L",
"OI": "1.54 Cr",
"OICH": "-10.29 L",
"OIChPer": "-6.26",
"ChangePercentage": 0.99
},
{
"DATE": "19 Mar 2025",
"OPEN": 22934.00,
"High": 22993.00,
"LOW": 22872.00,
"CLOSE": 22972.95,
"Volume": "44.31 L",
"OI": "1.64 Cr",
"OICH": "-3.21 L",
"OIChPer": "-1.91",
"ChangePercentage": 0.34
}}
```

---

<a id="report-143"></a>

### FutureContract

#### 1. FutureContract

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/FutureFutureContract`  
**Description:** of the future contract,

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | NIFTY |
| Expiry | String | Yes |  | NULL |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | No |  | string |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "Expiry": "NULL"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"FutureData": [
{
"ChangeINOI2": "-4.71 L (-3.06%)",
"sScriptDescription": "NIFTY 27 Mar 2025 FUT",
"OI": "1.49 Cr",
"ChangeInOI": "1.54 Cr",
"PreOpenInterest": 0,
"OpenInterestInPercent": null,
"Volume": "66.79 L",
"LTP": 23382.1,
"HIGH": 23438,
"LOW": 23172,
"LOTSIZE": 0,
"ExpiryDate": null,
"ScripName": null,
"SCP": "FO",
"LTPChange": 23200.25,
"LTPInPercent": "181.85 (0.78 %)",
"OPEN": 23195.05,
"CLOSE": 23200.25,
"Token": 35001
},
{
"ChangeINOI2": "3.87 L (14.46%)",
"sScriptDescription": "NIFTY 24 Apr 2025 FUT",
"OI": "30.64 L",
"ChangeInOI": "26.77 L",
"PreOpenInterest": 0,
"OpenInterestInPercent": null,
"Volume": "19.57 L",
"LTP": 23534.35,
"HIGH": 23574,
"LOW": 23315.75,
"LOTSIZE": 0,
"ExpiryDate": null,
"ScripName": null,
"SCP": "FO",
"LTPChange": 23346.5,
"LTPInPercent": "187.85 (0.8 %)",


"OPEN": 23330.05,
"CLOSE": 23346.5,
"Token": 54452
}}}
```

---

<a id="report-144"></a>

### FutureAndUnderlyingGaugesData

#### 1. FutureAndUnderlyingGaugesData

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/FutureAndUnderlyingGuagesData`  
**Description:** Executes the FutureAndUnderlyingGaugesData action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | Number | Yes |  | 6447.894436688708 |
| SCP | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "Expiry": "NULL",
  "Strike": 0,
  "SCP": "CE"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "PCRGauge": "1.01",
    "LiveIVGauge": "10.92",
    "DailyVolatilityGauge": "0.83",
    "AnnualisedVolatilityGauge": "15.83"
  }
}
```

---

<a id="report-145"></a>

### OptionsMainChart

#### 1. OptionsMainChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/OptionsMainChart`  
**Description:** Executes the OptionsMainChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Token | Integer | Yes |  | 6699 |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |
| SCP | String | Yes |  | string |
| DateFilter | String | Yes |  | string |
| typeofdata | String | Yes |  | string |

**Sample Request:**

```json
{
  "Token": 0,
  "ScripName": "NIFTY",
  "Expiry": "NULL",
  "Strike": "0",
  "SCP": "CE",
  "DateFilter": "1D",
  "typeofdata": "Price"
}
```

---

<a id="report-146"></a>

### OptionsIntradayBuildUp

#### 1. OptionsIntradayBuildUp

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/OptionsIntradayBuildup`  
**Description:** Executes the OptionsIntradayBuildUp action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |
| Expiry | String | No |  | string |
| Strike | String | No |  | string |
| SCP | String | No |  | string |
| option | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "Interval": "15:25 - 15:30",
      "BuildUp": "Long Unwinding",
      "PriceChange": -5.7,
      "PriceChangePer": -3.93,
      "OIChange": "-2.76 L",
      "OIChangeper": -11.12,
      "VolumeChange": "15.50 Cr",
      "Price": 139.3
    },
    {
      "Interval": "15:20 - 15:25",
      "BuildUp": "Short Covering",
      "PriceChange": 4.45,
      "PriceChangePer": 3.17,
      "OIChange": "-1.81 L",
      "OIChangeper": -6.8,
      "VolumeChange": "15.36 Cr",
      "Price": 145
    },
    {
      "Interval": "15:15 - 15:20",
      "BuildUp": "Long Unwinding",
      "PriceChange": -3.55,
      "PriceChangePer": -2.46,
      "OIChange": "-2.79 L",
      "OIChangeper": -9.47,
      "VolumeChange": "15.23 Cr",
      "Price": 140.55
    },
    {
      "Interval": "15:10 - 15:15",
      "BuildUp": "Short Covering",
      "PriceChange": 3,
      "PriceChangePer": 2.13,
      "OIChange": "-2.30 L",
      "OIChangeper": -7.24,
      "VolumeChange": "15.10 Cr",
      "Price": 144.1
    },
    {
      "Interval": "15:05 - 15:10",
      "BuildUp": "Short Covering",
      "PriceChange": 2.85,
      "PriceChangePer": 2.06,
      "OIChange": "-95.33 K",
      "OIChangeper": -2.92,
      "VolumeChange": "14.94 Cr",
      "Price": 141.1
    }
  ]
}
```

---

<a id="report-147"></a>

### OptionsMostActiveCalls

#### 1. OptionsMostActiveCalls

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/OptionsMostActiveCalls`  
**Description:** Executes the OptionsMostActiveCalls action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| SCP | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "SCP": "string"
}
```

**Sample Response:**

```json
{
"Puts": 23500,
"OIChange": "72.13 L",
"LTP": 70,
"Delta": "0.35",
"Volume": "23.92 Cr",
"OIChangePercent": "-7.09",
"LTPChangePercent": 117.39
},
```

---

<a id="report-148"></a>

### OptionsOpenInterestChart

#### 1. OptionsOpenInterestChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/OptionsOpenInterestChart`  
**Description:** Executes the OptionsOpenInterestChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |
| NumberofStrikes | Integer | Yes |  | 2255 |

**Sample Request:**

```json
{
  "StockName": "string",
  "ExpiryDate": "string",
  "NumberofStrikes": 2255
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"Strike": "23150",
"CallOI": "987750",
"PutOI": "2951700",
"LTP": "",
"Callltp": 276.2,
"Putltp": 46.5,
"Token": 4,
"FeedTime": "0001-01-01T00:00:00"
},
{
"Strike": "23200",
"CallOI": "4326900",
"PutOI": "7381125",
"LTP": "",
"Callltp": 238.95,
"Putltp": 58,
"Token": 4,
"FeedTime": "0001-01-01T00:00:00"
}}
```

---

<a id="report-149"></a>

### OptionsChangeInOIChart

#### 1. OptionsChangeInOIChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/OptionsChangeInOIChart`  
**Description:** Executes the OptionsChangeInOIChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| SCP | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "SCP": "string"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"Script": "NIFTY",
"Instrument": "",
"Strike": 23100,
"CallToken": 0,
"PutToken": 0,
"BroadcastConstant": 0,
"ExchangeID": 0,
"ExpiryDate": "03/27/2025 00:00:00",
"DbCallPrice": 0,
"DbCallPriceChange": 0,
"DbCallOI": 0,
"DbCallOIChange": -584700,
"DbPutPrice": 0,
"DbPutPriceChange": 0,
"DbPutOI": 0,
"DbPutOIChange": 2725725,
"CallIV": 0,
"PutIV": 0,
"CallVolume": 0,
"PutVolume": 0,
"CallOIChangePercent": 0,
"PutOIChangePercent": 0
}}
```

---

<a id="report-150"></a>

### OptionsOIandChInOI

#### 1. OptionsOIandChInOI

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/OptionsOIandChInOI`  
**Description:** Executes the OptionsOIandChInOI action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |
| Expiry | String | No |  | string |
| Strike | String | No |  | string |
| SCP | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "CeLtp": 0,
      "PeLtp": 0,
      "LASTCeLtp": 0,
      "LASTPeLtp": 0,
      "pcr": 1.01,
      "calloi": 2206950,
      "putoi": 2220150,
      "calloiinlackandc": "22.07 L",
      "putoiinkackanc": "22.20 L",
      "calloichange": 1206075,
      "callchangeoilandc": "12.06 L",
      "putchangeoilandc": "19.88 L",
      "putoichange": 1988400,
      "CEtoken": 51120,
      "petoken": 51121,
      "LTP": 0,
      "OI": 0,
      "IV": 0,
      "FeedUpdateTime": ""
    }
  ]
}
```

---

<a id="report-151"></a>

### OptionsCLiveMaxPainChart

#### 1. OptionsCLiveMaxPainChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/OptionsCLiveMaxPainChart`  
**Description:** Executes the OptionsCLiveMaxPainChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Scrip | String | Yes |  | string |
| StockExpiry | String | Yes |  | string |

**Sample Request:**

```json
{
  "Scrip": "NIFTY",
  "StockExpiry": "NULL"
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"Scrips": null,
"MaxPain": [
{
"nStrike": 21900,
"CallOI": 70650,
"PutOI": 2158500,
"CallPain": 0,
"PutPain": 110386570000,
"nMaxPain": 110386570000
},
{
"nStrike": 21950,
"CallOI": 16200,
"PutOI": 492150,
"CallPain": 3532500,
"PutPain": 104033588750,
"nMaxPain": 104037121250
},
],
"SelectedScrip": null,
"MaxpainStrike": 23200,
"FeedTime": "0001-01-01T00:00:00"
}
}
```

---

<a id="report-152"></a>

### OptionsPriceVsPCRChart

#### 1. OptionsPriceVsPCRChart

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/OptionsPriceVsPCRChart`  
**Description:** Executes the OptionsPriceVsPCRChart action under the Search Results module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| RangeTxt | Integer | Yes |  | 1757 |

**Sample Request:**

```json
{
  "ScriptName": "NIFTY",
  "Expiry": "NULL",
  "RangeTxt": 0
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "PCR": 1.115,
      "LTP": 23147.75,
      "SCRIPNAME": "nifty",
      "Expiry": "27 Mar 2025",
      "time": "2025-03-21 09:16",
      "PrevLTP": -42.9,
      "ChangePercent": -0.18,
      "FeedTime": "0001-01-01T00:00:00"
    }
  ]
}
```

---

<a id="report-153"></a>

### IndicesChartData

#### 1. IndicesChartData

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/IndicesChartData`  
**Description:** Get indices chart data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-154"></a>

### HomeSearchResult

#### 1. HomeSearchResult

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/HomeSearchResult`  
**Description:** Get home page search results.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| s | e | Yes |  | a |
| S | t | Yes |  | r |
| N | I | Yes |  | F |

---

<a id="report-155"></a>

### SearchStocksByName

#### 1. SearchStocksByName

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/SearchStocksByName`  
**Description:** Search stocks by name.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScriptName | String | No |  | string |

---

<a id="report-156"></a>

### ExpiryValidate

#### 1. ExpiryValidate

**Method:** `GET`  
**Endpoint:** `/api/SearchResults/ExpiryValidate`  
**Description:** Validate expiry date.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Expiry | String | No |  | string |

---

<a id="report-157"></a>

### MarketMoodIndex

#### 1. MarketMoodIndex

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/MarketMoodIndex`  
**Description:** Get market mood index data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-158"></a>

### OptionsSideBar

#### 1. OptionsSideBar

**Method:** `POST`  
**Endpoint:** `/api/SearchResults/OptionsSideBar`  
**Description:** Get options sidebar data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | str |
| SCP | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "Strike": "str",
  "SCP": "string"
}
```

---

# Profile

## Profile

<a id="report-159"></a>

### ChangePasswordProfile

#### 1. ChangePasswordProfile

**Method:** `POST`  
**Endpoint:** `/api/Profile/ChangePasswordProfile`  
**Description:** The ChangePasswordProfile API allows users to change their account password by providing their current (old) password and a new password.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | Integer | Yes |  | 5252 |
| OldPassword | String | Yes |  | string |
| NewPassword | String | Yes |  | string |

**Sample Request:**

```json
{
  "LoginID": 30825,
  "OldPassword": "",
  "NewPassword": ""
}
```

---

<a id="report-160"></a>

### BillingDetails

#### 1. BillingDetails

**Method:** `POST`  
**Endpoint:** `/api/Profile/BillingDetails`  
**Description:** Executes the BillingDetails action under the Profile module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | Integer | Yes |  | 3564 |
| UCC | String | Yes |  | string |

**Sample Request:**

```json
{
  "LoginID": 3564,
  "UCC": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "ID": 0,
      "MobileNo": "9888989727",
      "EmailID": "rahulkumar.algoiq@gmail.com",
      "LoginID": null,
      "Password": null,
      "ConfirmPassword": null,
      "FullName": "Rahul",
      "Gender": "",
      "DOB": "",
      "MobileOTP": null,
      "EmailOTP": null,
      "CreatedDate": null,
      "LastLoginDate": null,
      "LastPasswordUpdatedate": null,
      "IsActive": 0,
      "PaymentStatus": 0,
      "SField1": "",
      "SField2": "",
      "NField1": 0,
      "NField2": 0,
      "Pincode": "",
      "City": "",
      "State": "",
      "Country": "",
      "Occupation": "",
      "Industry": "",
      "AnnualIncome": "",
      "AlternateNumber": "",
      "BrokerName": "",
      "CountProfile": 0,
      "LoginType": "NoBroker"
    }
  ]
}
```

---

<a id="report-161"></a>

### SaveUserBillingDetails

#### 1. SaveUserBillingDetails

**Method:** `POST`  
**Endpoint:** `/api/Profile/SaveUserBillingDetailsData`  
**Description:** Executes the SaveUserBillingDetails action under the Profile module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ID | Integer | Yes |  | 4914 |
| MobileNo | String | Yes |  | string |
| EmailID | String | Yes |  | string |
| LoginID | String | Yes |  | string |
| Password | String | Yes |  | string |
| ConfirmPassword | String | Yes |  | string |
| FullName | String | Yes |  | string |
| Gender | String | Yes |  | string |
| DOB | String | Yes |  | string |
| MobileOTP | String | Yes |  | string |
| EmailOTP | String | Yes |  | string |
| CreatedDate | String | Yes |  | string |
| LastLoginDate | String | Yes |  | string |
| LastPasswordUpdatedate | String | Yes |  | string |
| IsActive | Integer | Yes |  | 2406 |
| PaymentStatus | Integer | Yes |  | 3361 |
| SField1 | String | Yes |  | string |
| SField2 | String | Yes |  | string |
| NField1 | Integer | Yes |  | 6638 |
| NField2 | Integer | Yes |  | 3102 |
| Pincode | String | Yes |  | string |
| City | String | Yes |  | string |
| State | String | Yes |  | string |
| Country | String | Yes |  | string |
| Occupation | String | Yes |  | string |
| Industry | String | Yes |  | string |
| AnnualIncome | String | Yes |  | string |
| AlternateNumber | String | Yes |  | string |
| BrokerName | String | Yes |  | string |
| CountProfile | Integer | Yes |  | 3414 |
| LoginType | String | Yes |  | string |

**Sample Request:**

```json
{
  "ID": 0,
  "MobileNo": "7030911706",
  "EmailID": "akshay.algoiq@gmail.com",
  "LoginID": "28037",
  "Password": "string",
  "ConfirmPassword": "string",
  "FullName": "string",
  "Gender": "string",
  "DOB": "string",
  "MobileOTP": "string",
  "EmailOTP": "string",
  "CreatedDate": "string",
  "LastLoginDate": "string",
  "LastPasswordUpdatedate": "string",
  "IsActive": 0,
  "PaymentStatus": 0,
  "SField1": "",
  "SField2": "",
  "NField1": 0,
  "NField2": 0,
  "Pincode": "",
  "City": "",
  "State": "",
  "Country": "string",
  "Occupation": "string",
  "Industry": "string",
  "AnnualIncome": "string",
  "AlternateNumber": "string",
  "BrokerName": "string",
  "CountProfile": 0,
  "LoginType": "string"
}
```

---

<a id="report-162"></a>

### BillingHistory

#### 1. BillingHistory

**Method:** `POST`  
**Endpoint:** `/api/Profile/BillingHistory`  
**Description:** The BillingHistory API retrieves the user's billing and subscription history, including plan names, amounts, start/end dates, and remaining days.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| EIDOrMNO | String | Yes |  | string |

**Sample Request:**

```json
{
  "EIDOrMNO": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "PurchesDate": "03/17/2025 00:00:00",
      "PlanName": "Professional Plan",
      "Amount": "0.0000",
      "StartDate": "03/17/2025 00:00:00",
      "EndDate": "03/24/2025 00:00:00",
      "RemainingDays": null
    }
  ]
}
```

---

<a id="report-163"></a>

### CheckProfileDetailsForInvoicing

#### 1. CheckProfileDetailsForInvoicing

**Method:** `GET`  
**Endpoint:** `/api/Profile/checkProfileDetailsForInvoicing`  
**Description:** Executes the CheckProfileDetailsForInvoicing action under the Profile module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "ID": 0,
    "MobileNo": "9326841557",
    "EmailID": "saurabhsagavekar.algoiq@gmail.com",
    "LoginID": null,
    "Password": null,
    "ConfirmPassword": null,
    "FullName": "Saurabh sagavekar",
    "Gender": null,
    "DOB": null,
    "MobileOTP": null,
    "EmailOTP": null,
    "CreatedDate": null,
    "LastLoginDate": null,
    "LastPasswordUpdatedate": null,
    "IsActive": 0,
    "PaymentStatus": 0,
    "SField1": "Failed",
    "SField2": "",
    "NField1": 0,
    "NField2": 0,
    "Pincode": "",
    "City": "",
    "State": "",
    "Country": "",
    "Occupation": null,
    "Industry": "",
    "AnnualIncome": null,
    "AlternateNumber": null,
    "BrokerName": null,
    "CountProfile": 0,
    "LoginType": null
  }
}
```

---

<a id="report-164"></a>

### checkLoginSession

#### 1. checkLoginSession

**Method:** `GET`  
**Endpoint:** `/api/Profile/checkLoginSession`  
**Description:** Check login session status.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-165"></a>

### ForceUpdateLoginSession

#### 1. ForceUpdateLoginSession

**Method:** `POST`  
**Endpoint:** `/api/Profile/ForceUpdateLoginSession`  
**Description:** Force update login session.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-166"></a>

### getMobileUpdateVersion

#### 1. getMobileUpdateVersion

**Method:** `GET`  
**Endpoint:** `/api/Profile/getMobileUpdateVersion`  
**Description:** Get mobile app update version.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| AppName | String | No |  | string |

---

<a id="report-167"></a>

### LogoutUser

#### 1. LogoutUser

**Method:** `GET`  
**Endpoint:** `/api/Profile/LogoutUser`  
**Description:** Logout the user.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-168"></a>

### saveProfileDetailsForInvoicing

#### 1. saveProfileDetailsForInvoicing

**Method:** `POST`  
**Endpoint:** `/api/Profile/saveProfileDetailsForInvoicing`  
**Description:** Save profile details for invoicing.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ID | Integer | Yes |  | 4914 |
| MobileNo | String | Yes |  | string |
| EmailID | String | Yes |  | string |
| LoginID | String | Yes |  | string |
| Password | String | Yes |  | string |
| ConfirmPassword | String | Yes |  | string |
| FullName | String | Yes |  | string |
| Gender | String | Yes |  | string |
| DOB | String | Yes |  | string |
| MobileOTP | String | Yes |  | string |
| EmailOTP | String | Yes |  | string |
| CreatedDate | String | Yes |  | string |
| LastLoginDate | String | Yes |  | string |
| LastPasswordUpdatedate | String | Yes |  | string |
| IsActive | Integer | Yes |  | 2406 |
| PaymentStatus | Integer | Yes |  | 3361 |
| SField1 | String | Yes |  | string |
| SField2 | String | Yes |  | string |
| NField1 | Integer | Yes |  | 6638 |
| NField2 | Integer | Yes |  | 3102 |
| Pincode | String | Yes |  | string |
| City | String | Yes |  | string |
| State | String | Yes |  | string |
| Country | String | Yes |  | string |
| Occupation | String | Yes |  | string |
| Industry | String | Yes |  | string |
| AnnualIncome | String | Yes |  | string |
| AlternateNumber | String | Yes |  | string |
| BrokerName | String | Yes |  | string |
| CountProfile | Integer | Yes |  | 3414 |
| LoginType | String | Yes |  | string |

**Sample Request:**

```json
{
  "ID": 4914,
  "MobileNo": "string",
  "EmailID": "string",
  "LoginID": "string",
  "Password": "string",
  "ConfirmPassword": "string",
  "FullName": "string",
  "Gender": "string",
  "DOB": "string",
  "MobileOTP": "string",
  "EmailOTP": "string",
  "CreatedDate": "string",
  "LastLoginDate": "string",
  "LastPasswordUpdatedate": "string",
  "IsActive": 2406,
  "PaymentStatus": 3361,
  "SField1": "string",
  "SField2": "string",
  "NField1": 6638,
  "NField2": 3102,
  "Pincode": "string",
  "City": "string",
  "State": "string",
  "Country": "string",
  "Occupation": "string",
  "Industry": "string",
  "AnnualIncome": "string",
  "AlternateNumber": "string",
  "BrokerName": "string",
  "CountProfile": 3414,
  "LoginType": "string"
}
```

---

<a id="report-169"></a>

### setMobileUpdateVersion

#### 1. setMobileUpdateVersion

**Method:** `POST`  
**Endpoint:** `/api/Profile/setMobileUpdateVersion`  
**Description:** Set mobile app update version.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| latestVersion | String | Yes |  | string |
| mandatoryUpdate | Boolean | Yes |  | false |
| changelog | String | Yes |  | string |
| AppName | String | Yes |  | string |

**Sample Request:**

```json
{
  "latestVersion": "string",
  "mandatoryUpdate": false,
  "changelog": "string",
  "AppName": "string"
}
```

---

<a id="report-170"></a>

### TerminateSession

#### 1. TerminateSession

**Method:** `GET`  
**Endpoint:** `/api/Profile/TerminateSession`  
**Description:** Terminate an active session.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-171"></a>

### UnlinkBrokerAccount

#### 1. UnlinkBrokerAccount

**Method:** `GET`  
**Endpoint:** `/api/Profile/UnlinkBrokerAccount`  
**Description:** Unlink broker account.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-172"></a>

### updateLoginSession

#### 1. updateLoginSession

**Method:** `POST`  
**Endpoint:** `/api/Profile/updateLoginSession`  
**Description:** Update login session.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Password | String | Yes |  | string |
| UserName | String | Yes |  | string |

**Sample Request:**

```json
{
  "Password": "string",
  "UserName": "string"
}
```

---

<a id="report-173"></a>

### UpdateProfile

#### 1. UpdateProfile

**Method:** `POST`  
**Endpoint:** `/api/UserProfile/UpdateProfile`  
**Description:** Update user profile.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | String | Yes |  | st |
| FullName | String | Yes |  | string |
| EmailID | String | Yes |  | string |
| Gender | String | Yes |  | string |
| DOB | String | Yes |  | string |
| Pincode | String | Yes |  | string |
| City | String | Yes |  | string |
| State | String | Yes |  | string |
| Country | String | Yes |  | string |
| Address | String | Yes |  | string |
| GSTNumber | String | Yes |  | string |

**Sample Request:**

```json
{
  "LoginID": "st",
  "FullName": "string",
  "EmailID": "string",
  "Gender": "string",
  "DOB": "string",
  "Pincode": "string",
  "City": "string",
  "State": "string",
  "Country": "string",
  "Address": "string",
  "GSTNumber": "string"
}
```

---

<a id="report-174"></a>

### Logout

#### 1. Logout

**Method:** `POST`  
**Endpoint:** `/api/UserProfile/Logout`  
**Description:** Logout user.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| SessionID | String | No |  | string |

---

<a id="report-175"></a>

### GetProfileDetails

#### 1. GetProfileDetails

**Method:** `GET`  
**Endpoint:** `/api/UserProfile/GetProfileDetails`  
**Description:** Get user profile details.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-176"></a>

### ChangePassword

#### 1. ChangePassword

**Method:** `POST`  
**Endpoint:** `/api/Profile/ChangePassword`  
**Description:** Executes the ChangePassword action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ID | Integer | Yes |  | 4914 |
| MobileNo | String | Yes |  | string |
| EmailID | String | Yes |  | string |
| LoginID | String | Yes |  | string |
| Password | String | Yes |  | string |
| ConfirmPassword | String | Yes |  | string |
| FullName | String | Yes |  | string |
| Gender | String | Yes |  | string |
| DOB | String | Yes |  | string |
| MobileOTP | String | Yes |  | string |
| EmailOTP | String | Yes |  | string |
| CreatedDate | String | Yes |  | string |
| LastLoginDate | String | Yes |  | string |
| LastPasswordUpdatedate | String | Yes |  | string |
| IsActive | Integer | Yes |  | 2406 |
| PaymentStatus | Integer | Yes |  | 3361 |
| SField1 | String | Yes |  | string |
| SField2 | String | Yes |  | string |
| NField1 | Integer | Yes |  | 6638 |
| NField2 | Integer | Yes |  | 3102 |
| Pincode | String | Yes |  | string |
| City | String | Yes |  | string |
| State | String | Yes |  | string |
| Country | String | Yes |  | string |
| Occupation | String | Yes |  | string |
| Industry | String | Yes |  | string |
| AnnualIncome | String | Yes |  | string |
| AlternateNumber | String | Yes |  | string |
| BrokerName | String | Yes |  | string |
| CountProfile | Integer | Yes |  | 3414 |
| LoginType | String | Yes |  | string |

**Sample Request:**

```json
{
  "ID": 4914,
  "MobileNo": "string",
  "EmailID": "string",
  "LoginID": "string",
  "Password": "string",
  "ConfirmPassword": "string",
  "FullName": "string",
  "Gender": "string",
  "DOB": "string",
  "MobileOTP": "string",
  "EmailOTP": "string",
  "CreatedDate": "string",
  "LastLoginDate": "string",
  "LastPasswordUpdatedate": "string",
  "IsActive": 2406,
  "PaymentStatus": 3361,
  "SField1": "string",
  "SField2": "string",
  "NField1": 6638,
  "NField2": 3102,
  "Pincode": "string",
  "City": "string",
  "State": "string",
  "Country": "string",
  "Occupation": "string",
  "Industry": "string",
  "AnnualIncome": "string",
  "AlternateNumber": "string",
  "BrokerName": "string",
  "CountProfile": 3414,
  "LoginType": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

## Billing & Payments

<a id="report-177"></a>

### 1. Aalap Payment Gateway

#### 1. strategies

**Method:** `GET`  
**Endpoint:** `/api/AlaapPaymentGatway/strategies`  
**Description:** Get available payment strategies.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 2. user-strategies

**Method:** `GET`  
**Endpoint:** `/api/AlaapPaymentGatway/user-strategies`  
**Description:** Get user payment strategies.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 3. create-request

**Method:** `POST`  
**Endpoint:** `/api/AlaapPaymentGatway/create-request`  
**Description:** Create a payment request.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 4. verify-request

**Method:** `POST`  
**Endpoint:** `/api/AlaapPaymentGatway/verify-request`  
**Description:** Verify a payment request.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 5. addupdate-strategy

**Method:** `POST`  
**Endpoint:** `/api/AlaapPaymentGatway/addupdate-strategy`  
**Description:** Add or update a payment strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 6. billing-summary

**Method:** `POST`  
**Endpoint:** `/api/AlaapPaymentGatway/billing-summary`  
**Description:** Get billing summary.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 7. failed-payments

**Method:** `POST`  
**Endpoint:** `/api/AlaapPaymentGatway/failed-payments`  
**Description:** Get failed payments data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-178"></a>

### 2. Payment Gateway

#### 1. create-request

**Method:** `POST`  
**Endpoint:** `/api/PaymentGateway/create-request`  
**Description:** Create a payment gateway request.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| plan | String | Yes |  | string |
| BPPlanType | String | Yes |  | string |
| CouponCode | String | Yes |  | string |

**Sample Request:**

```json
{
  "plan": "string",
  "BPPlanType": "string",
  "CouponCode": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4181,
  "Message": "string",
  "Result": {
    "orderid": "string",
    "amount": "string",
    "currency": "str",
    "key": "string",
    "clientname": "string",
    "clientemail": "string",
    "clientmobile": "string",
    "businessname": "string",
    "paymentdescription": "string"
  }
}
```

---

#### 2. verify-request

**Method:** `POST`  
**Endpoint:** `/api/PaymentGateway/verify-request`  
**Description:** Verify a payment gateway request.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| razorpay_payment_id | String | Yes |  | string |
| razorpay_order_id | String | Yes |  | string |
| razorpay_signature | String | Yes |  | string |
| CouponCode | String | Yes |  | string |
| BPPlanType | String | Yes |  | string |
| Amount | Number | Yes |  | 1311.4598562704293 |

**Sample Request:**

```json
{
  "razorpay_payment_id": "string",
  "razorpay_order_id": "string",
  "razorpay_signature": "string",
  "CouponCode": "string",
  "BPPlanType": "string",
  "Amount": 1311.4598562704293
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4314,
  "Message": "string",
  "Result": true
}
```

---

#### 3. failed

**Method:** `POST`  
**Endpoint:** `/api/PaymentGateway/failed`  
**Description:** Handle failed payment.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| paymentdescription | String | Yes |  | string |
| code | String | Yes |  | s |
| Source | String | Yes |  | string |
| Step | String | Yes |  | string |
| Reason | String | Yes |  | string |
| Metadata | Object | Yes |  | {"Payment_Id":"string","Order_Id":"string"} |

**Sample Request:**

```json
{
  "paymentdescription": "string",
  "code": "s",
  "Source": "string",
  "Step": "string",
  "Reason": "string",
  "Metadata": {
    "Payment_Id": "string",
    "Order_Id": "string"
  }
}
```

---

<a id="report-179"></a>

### 3. Payment Gateway V2

#### 1. pay_page

**Method:** `POST`  
**Endpoint:** `/PaymentGatewayV2/pay_page`  
**Description:** Create V2 payment page.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 2. validatePaymentGateway

**Method:** `POST`  
**Endpoint:** `/PaymentGatewayV2/validatePaymentGateway`  
**Description:** Validate V2 payment gateway response.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 3. paymentResponse

**Method:** `GET`  
**Endpoint:** `/PaymentGatewayV2/paymentResponse`  
**Description:** Get V2 payment response.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Plan | String | No |  | string |
| PlanType | String | No |  | string |
| amount | String | No |  | 5968.003287571597 |
| CouponCode | String | No |  | string |
| Loginid | String | No |  | string |
| LicenseKey | String | No |  | string |
| TransactionID | String | No |  | string |
| BPPlanType | String | No |  | string |
| MobileNo | String | No |  | string |
| RedirectInfo.isZeroPayment | String | No |  | string |
| RedirectInfo.RedirectUrl | String | No |  | string |
| RedirectInfo.completePaymentResponse | String | No |  | true |
| AccessToken | String | No |  | string |

---

## Coupons

<a id="report-180"></a>

### 1. Coupon Code

#### 1. getCouponDetails

**Method:** `GET`  
**Endpoint:** `/api/CouponCode/getCouponDetails`  
**Description:** Get coupon code details.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| CType | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 2733,
  "Message": "string",
  "Result": [
    {
      "CID": 9706,
      "Plan": "string",
      "CouponName": "string",
      "CouponDetail": "string",
      "CouponDescription": "string",
      "Amount": 9186.427214116733,
      "Discount": 3367.421062453433,
      "GSTAmount": 4501.2490864521105,
      "DiscountedAmount": 6010.254321433895,
      "TotalAmount": 4956.474498438488,
      "CValidity": "string",
      "DiscountPercent": 2036.2727726217722
    },
    {
      "CID": 6250,
      "Plan": "string",
      "CouponName": "str",
      "CouponDetail": "string",
      "CouponDescription": "string",
      "Amount": 5874.4014379679,
      "Discount": 2167.5508449956583,
      "GSTAmount": 6690.959991178364,
      "DiscountedAmount": 7252.952703249262,
      "TotalAmount": 7088.127721584896,
      "CValidity": "string",
      "DiscountPercent": 5493.227684227344
    }
  ]
}
```

---

#### 2. applyCoupon

**Method:** `GET`  
**Endpoint:** `/api/CouponCode/applyCoupon`  
**Description:** Apply a coupon code.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| CouponCode | String | No |  | string |
| Plan | String | No |  | string |
| PlanType | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 8371,
  "Message": "string",
  "Result": {
    "CID": 8977,
    "Plan": "string",
    "CouponName": "string",
    "CouponDetail": "string",
    "CouponDescription": "string",
    "Amount": 9575.619757725412,
    "Discount": 9739.696946087124,
    "GSTAmount": 7418.2656988659555,
    "DiscountedAmount": 3242.696994088521,
    "TotalAmount": 8378.173444307102,
    "CValidity": "string",
    "DiscountPercent": 6521.812589432083
  }
}
```

---

## License

<a id="report-181"></a>

### 1. License

#### 1. CheckShowFreeTrail

**Method:** `GET`  
**Endpoint:** `/api/License/CheckShowFreeTrail`  
**Description:** Check if free trail is available to show.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 2. ActivateFreeTrail

**Method:** `GET`  
**Endpoint:** `/api/License/ActivateFreeTrail`  
**Description:** Activate free trail.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4314,
  "Message": "string",
  "Result": true
}
```

---

## Plan Access

<a id="report-182"></a>

### 1. Plan Access

#### 1. DeletePlanAccess

**Method:** `DELETE`  
**Endpoint:** `/api/PlanAccess`  
**Description:** Delete plan access.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 2. GetEnvInfo

**Method:** `GET`  
**Endpoint:** `/api/PlanAccess/GetEnvInfo`  
**Description:** Get environment info for plan access.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

# Notification

## Notification

<a id="report-183"></a>

### GetNotificationList

#### 1. GetNotificationList

**Method:** `POST`  
**Endpoint:** `/api/Notification/GetNotificationList`  
**Description:** Executes the GetNotificationList action under the Notification module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
"Status": true,


"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"Id": 381,
"ToSMS": "BOD Data Uploaded",
"message": "The BOD data has been uploaded successfully.",
"currentdatetime": "20-03-2025 08:53 AM",
"ReportName": "",
"IsNew": "18",
"ReadStatus": "0"
},
{
"Id": 380,
"ToSMS": "BOD Data Uploaded",
"message": "The BOD data has been uploaded successfully.",
"currentdatetime": "19-03-2025 08:49 AM",
"ReportName": "",
"IsNew": "18",
"ReadStatus": "0"
},
{}}
```

---

<a id="report-184"></a>

### SaveUserNotification

#### 1. SaveUserNotification

**Method:** `POST`  
**Endpoint:** `/api/Notification/SaveUserNotification`  
**Description:** Executes the SaveUserNotification action under the Notification module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| NotiID | Integer | Yes |  | 7427 |

**Sample Request:**

```json
{
  "NotiID": 0
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6691,
  "Message": "string",
  "Result": 6350
}
```

---

<a id="report-185"></a>

### GetUserNotificationListRead

#### 1. GetUserNotificationListRead

**Method:** `POST`  
**Endpoint:** `/api/Notification/GetNotificationListRead`  
**Description:** Executes the GetUserNotificationListRead action under the Notification module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": 382
}
```

---

<a id="report-186"></a>

### CreateTicketsTalkOptions

#### 1. CreateTicketsTalkOptions

**Method:** `POST`  
**Endpoint:** `/api/Notification/CreateTicketsTalkOptions`  
**Description:** Create support tickets for TalkOptions.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| BugType | String | Yes |  | string |
| ReportName | String | Yes |  | string |
| Description | String | Yes |  | string |
| path | String | Yes |  | string |
| TicketId | String | Yes |  | string |

**Sample Request:**

```json
{
  "BugType": "string",
  "ReportName": "string",
  "Description": "string",
  "path": "string",
  "TicketId": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4314,
  "Message": "string",
  "Result": true
}
```

---

<a id="report-187"></a>

### GetUrlName

#### 1. GetUrlName

**Method:** `GET`  
**Endpoint:** `/api/Notification/GetUrlName`  
**Description:** Get URL name for notifications.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 1795,
  "Message": "string",
  "Result": [
    {
      "UrlName": "string",
      "UrlValue": "string"
    },
    {
      "UrlName": "string",
      "UrlValue": "string"
    }
  ]
}
```

---

<a id="report-188"></a>

### GetAlertOI

#### 1. GetAlertOI

**Method:** `GET`  
**Endpoint:** `/api/Notification/GetAlertOI`  
**Description:** Get alert OI data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4287,
  "Message": "string",
  "Result": [
    {
      "ScripName": "string",
      "CurrentOI": 5546.711294638778,
      "PreviousOI": 8448.725858988071,
      "Message": "string"
    },
    {
      "ScripName": "string",
      "CurrentOI": 7678.333629945493,
      "PreviousOI": 9365.668380164056,
      "Message": "string"
    }
  ]
}
```

---

<a id="report-189"></a>

### GetAlertsData

#### 1. GetAlertsData

**Method:** `GET`  
**Endpoint:** `/api/Notification/GetAlertsData`  
**Description:** Get all alerts data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 2088,
  "Message": "string",
  "Result": [
    {
      "Id": 6436,
      "ScripName": "string",
      "Value": "string",
      "Type": "string",
      "AlertDate": "1973-03-03T04:00:00.423Z",
      "Label": "string"
    },
    {
      "Id": 1789,
      "ScripName": "string",
      "Value": "string",
      "Type": "string",
      "AlertDate": "2017-07-21T14:40:25.704Z",
      "Label": "string"
    }
  ]
}
```

---

# Feeds

## Feeds

<a id="report-190"></a>

### GetSpotFuture

#### 1. GetSpotFuture

**Method:** `GET`  
**Endpoint:** `/api/Feeds/GetSpotFuture`  
**Description:** Executes the GetSpotFuture action under the Feeds module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | No |  | string |
| Expiry | String | No |  | string |

**Sample Response:**

```json
{
"Status": true,


"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"futures": [
{
"Token": 35001,
"LTP": "23085.70",
"Change": "112.75",
"ChangePercent": "0.49",
"MonthD": "Mar"
},
{
"Token": 54452,
"LTP": "23235.10",
"Change": "111.65",
"ChangePercent": "0.48",
"MonthD": "Apr"
}}}
```

---

<a id="report-191"></a>

### GetHeaderFeeds

#### 1. GetHeaderFeeds

**Method:** `GET`  
**Endpoint:** `/api/Feeds/GetHeaderFeeds`  
**Description:** Executes the GetHeaderFeeds action under the Feeds module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"contrct": {
"Scrip": "NIFTY 50",
"Expiry": null,
"Strike": 0,
"CP": null,
"Token": 4,
"Instrument": null,
"FeedSegment": "IX_CM"
},
"LTP": 23047.5,
"FeedTime": "2025-03-20T11:34:11",
"OI": 0,
"Volume": 0,
"ChangePrice": 139.9,
"ChangePercent": 0.61
}}
```

---

<a id="report-192"></a>

### GetMaxFeedTime

#### 1. GetMaxFeedTime

**Method:** `GET`  
**Endpoint:** `/api/Feeds/GetMaxfeedtime`  
**Description:** Executes the GetMaxFeedTime action under the Feeds module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
1971-12-09T08:07:35.450Z
```

---

<a id="report-193"></a>

### GetLastFeedTime

#### 1. GetLastFeedTime

**Method:** `GET`  
**Endpoint:** `/api/Feeds/getLastFeedTime`  
**Description:** Executes the GetLastFeedTime action under the Feeds module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "LastTime": "20 Mar 2025, 11:51 AM",
    "isShowSeconds": true
  }
}
```

---

<a id="report-194"></a>

### GetEnviroment

#### 1. GetEnviroment

**Method:** `GET`  
**Endpoint:** `/api/Feeds/GetEnvironment`  
**Description:** Executes the GetEnviroment action under the Feeds module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Environment": "Production"
}
```

---

<a id="report-195"></a>

### GetIPandUserAgent

#### 1. GetIPandUserAgent

**Method:** `GET`  
**Endpoint:** `/api/Feeds/getIPandUserAgent`  
**Description:** Executes the GetIPandUserAgent action under the Feeds module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "IP": "110.226.179.246",
  "UserAgent": "PostmanRuntime/7.43.2",
  "X_Forwarded_For": null
}
```

---

# NSE Contracts

## NSE Contracts

<a id="report-196"></a>

### GetScripName

#### 1. GetScripName

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetScripName`  
**Description:** Executes the GetScripName action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
"Status": true,


"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
"AARTIIND",
"ABB",
"ABCAPITAL",
"ABFRL",
"ACC",
"ADANIENSOL",
"ADANIENT",
"ADANIGREEN"}
```

---

<a id="report-197"></a>

### GetExpiries

#### 1. GetExpiries

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetExpiries`  
**Description:** Executes the GetExpiries action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    "20 Mar 2025",
    "27 Mar 2025",
    "03 Apr 2025",
    "09 Apr 2025",
    "17 Apr 2025",
    "24 Apr 2025",
    "29 May 2025",
    "26 Jun 2025",
    "25 Sep 2025",
    "24 Dec 2025",
    "25 Jun 2026",
    "31 Dec 2026"
  ]
}
```

---

<a id="report-198"></a>

### GetExpiriesMonthly

#### 1. GetExpiriesMonthly

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetExpiriesMonthly`  
**Description:** Executes the GetExpiriesMonthly action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    "27 Mar 2025",
    "24 Apr 2025",
    "29 May 2025"
  ]
}
```

---

<a id="report-199"></a>

### GetFOStocks

#### 1. GetFOStocks

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetFOStocks`  
**Description:** Executes the GetFOStocks action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{


"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
"AARTIIND",
"ABB",
"ABCAPITAL",
"ABFRL",
"ACC",
"ADANIENSOL",
"ADANIENT",
"ADANIGREEN",
"ADANIPORTS",
"ALKEM",
"AMBUJACEM",
"ANGELONE",
"APLAPOLLO",
"APOLLOHOSP",
"APOLLOTYRE",
"ASHOKLEY",
"ASIANPAINT",
"ASTRAL",
"ATGL"}
```

---

<a id="report-200"></a>

### StockListByIndices

#### 1. StockListByIndices

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/StockListByIndices`  
**Description:** Executes the StockListByIndices action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| SectorName | String | No |  | string |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
"ADANIENT",
"ADANIPORTS",
"APOLLOHOSP",
"ASIANPAINT",
"AXISBANK",
"BAJAJ-AUTO",
"BAJAJFINSV",
"BAJFINANCE",
"BEL",
"BHARTIARTL",
"BPCL",
"BRITANNIA",
"CIPLA",
"COALINDIA",
"DRREDDY",
"EICHERMOT}
```

---

<a id="report-201"></a>

### GetEqFODataFromToken

#### 1. GetEqFODataFromToken

**Method:** `POST`  
**Endpoint:** `/api/NSEContracts/GetEqFODataFromToken`  
**Description:** Executes the GetEqFODataFromToken action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| 0 | Object | Yes |  | {"Token":"string","Instrument":"string","BuySellType":"string","LotSize":3042} |
| 1 | Object | Yes |  | {"Token":"string","Instrument":"string","BuySellType":"string","LotSize":9419} |

**Sample Request:**

```json
[
  {
    "Token": "string",
    "Instrument": "string",
    "BuySellType": "string",
    "LotSize": 3042
  },
  {
    "Token": "string",
    "Instrument": "string",
    "BuySellType": "string",
    "LotSize": 9419
  }
]
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "Token": "21254",
      "ScripName": "LOWVOLIETF",
      "Expiry": "0",
      "Strike": "0",
      "SCP": "-",
      "LotSize": 0,
      "BuySellType": "string",
      "LTP": 20.01,
      "LTQ": 1,
      "ScriptDescription": "LOWVOLIETF-EQ",
      "sType": "STK",
      "Script": "LOWVOLIETF-EQ",
      "nExpiryDate": "0",
      "nMin_Lot_Size": 0,
      "PClose": 20,
      "LTPChange": 0,
      "Changeper": 2
    }
  ]
}
```

---

<a id="report-202"></a>

### GetScripExpiryStrikeData

#### 1. GetScripExpiryStrikeData

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetScripExpiryStrikeData`  
**Description:** Executes the GetScripExpiryStrikeData action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |
| Expiry | String | No |  | string |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"ScripName": [
"AARTIIND",
"ABB",
"ABCAPITAL",
"ABFRL",
"ACC",
"ADANIENSOL",
"ADANIENT",
}}
```

---

<a id="report-203"></a>

### GetFuturesExpiry

#### 1. GetFuturesExpiry

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetFuturesExpiry`  
**Description:** Executes the GetFuturesExpiry action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    "27 Mar 2025",
    "24 Apr 2025",
    "29 May 2025"
  ]
}
```

---

<a id="report-204"></a>

### SearchResults

#### 1. SearchResults

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/SearchResult`  
**Description:** Executes the SearchResults action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [


{
"token": 0,
"Symbol": "NIFTY",
"sType": "Underlying",
"order": 0
},
{
"token": 0,
"Symbol": "NIFTY1",
"sType": "Underlying",
"order": 0
},
{}}
```

---

<a id="report-205"></a>

### GetIndicesName

#### 1. GetIndicesName

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetIndicesName`  
**Description:** The FlushCache API is used to clear or invalidate cached data stored on the server. This API is primarily utilized for system maintenance, troubleshooting, or ensuring that the most up-to-date data is reflected in the application. By flushing the cache, any outdated or incorrect information is removed, and fresh data is fetched from the original data source. StartBackGroundService Description The StartBackgroundService API is used to initiate or restart background services within the system. Background services are responsible for executing tasks that run asynchronously, such as data processing, report generation, market data updates, notifications, or any other automated operations. This API is typically used for managing services that need to run continuously or on a scheduled basis without direct user interaction. StopBackGroundService Description The StopBackgroundService API is used to stop a running background service. Background services are typically used for tasks like data updates, report generation, or

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    "27 Mar 2025",
    "24 Apr 2025",
    "29 May 2025"
  ]
}
```

---

<a id="report-206"></a>

### GetToken

#### 1. GetToken

**Method:** `POST`  
**Endpoint:** `/api/NSEContracts/GetToken`  
**Description:** Executes the GetToken action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | Number | Yes |  | 6447.894436688708 |
| SCP | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "Strike": 6447.894436688708,
  "SCP": "string"
}
```

**Sample Response:**

```json
{
  "ScripName": "NIFTY",
  "Expiry": "27 FEB 2025",
  "Strike": 22800,
  "SCP": "CE"
}
```

---

<a id="report-207"></a>

### GetScripNameGroupWise

#### 1. GetScripNameGroupWise

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetScripNameGroupwise`  
**Description:** Executes the GetScripNameGroupWise action under the NSE Contract module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| GroupName | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    "ADANIENT",
    "ADANIPORTS",
    "APOLLOHOSP",
    "ASIANPAINT",
    "AXISBANK",
    "BAJAJ-AUTO",
    "BAJAJFINSV",
    "BAJFINANCE",
    "BEL",
    "BHARTIARTL",
    "BPCL",
    "BRITANNIA",
    "CIPLA",
    "COALINDIA",
    "DRREDDY",
    "EICHERMOT",
    "TATACONSUM",
    "TATAMOTORS",
    "TATASTEEL",
    "TCS",
    "TECHM",
    "TITAN",
    "TRENT",
    "ULTRACEMCO",
    "WIPRO"
  ]
}
```

---

<a id="report-208"></a>

### GetFutOptExpiries

#### 1. GetFutOptExpiries

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetFutOptExpiries`  
**Description:** The CheckSymbol API is used to verify whether a particular symbol exists in the system. It validates if the provided symbol is correct and available for trading or further operations. FEEDS GetSpotFuture

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |
| Instrument | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    "27 Mar 2025",
    "24 Apr 2025",
    "29 May 2025"
  ]
}
```

---

<a id="report-209"></a>

### GetScripNames

#### 1. GetScripNames

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetScripNames`  
**Description:** Get all scrip names.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 2094,
  "Message": "string",
  "Result": [
    "string",
    "string"
  ]
}
```

---

<a id="report-210"></a>

### GetExpiriesFuture

#### 1. GetExpiriesFuture

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetExpiriesFuture`  
**Description:** Get future expiries.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Authorization | Bearer {{token}} |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| Symbol | String | Yes | Stock or index symbol. | NIFTY |

---

<a id="report-211"></a>

### GetExpiryStrike

#### 1. GetExpiryStrike

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetExpiryStrike`  
**Description:** Get expiry and strike data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |
| Expiry | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 5348,
  "Message": "string",
  "Result": {
    "ListStike": [
      "string",
      "string"
    ],
    "ATMStike": 4396.9402089610485
  }
}
```

---

<a id="report-212"></a>

### GetFoIndexList

#### 1. GetFoIndexList

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetFoIndexList`  
**Description:** Get F&O index list.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 2094,
  "Message": "string",
  "Result": [
    "string",
    "string"
  ]
}
```

---

<a id="report-213"></a>

### GetLotSize

#### 1. GetLotSize

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetLotSize`  
**Description:** Get lot size for scrips.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6691,
  "Message": "string",
  "Result": 6350
}
```

---

<a id="report-214"></a>

### GetExpiryStrikeData

#### 1. GetExpiryStrikeData

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/GetExpiryStrikeData`  
**Description:** Get expiry strike data.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |
| Instrument | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 441,
  "Message": "string",
  "Result": {
    "Expiry": [
      "string",
      "string"
    ],
    "Strike": [
      "string",
      "string"
    ]
  }
}
```

---

<a id="report-215"></a>

### GetTokenWithLotSize

#### 1. GetTokenWithLotSize

**Method:** `POST`  
**Endpoint:** `/api/NSEContracts/GetTokenWithLotSize`  
**Description:** Get token with lot size information.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|---------|
| contractList | Array | Yes | Array of contracts with ScripName, Expiry, Strike and SCP. | [{"ScripName":"NIFTY","Expiry":"21 Jul 2026","Strike":23800,"SCP":"CE"}] |

**Sample Request:**

```json
{
  "contractList": [
    {
      "ScripName": "NIFTY",
      "Expiry": "21 Jul 2026",
      "Strike": 23800,
      "SCP": "CE"
    }
  ]
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-216"></a>

### FlushCache

#### 1. FlushCache

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/FlushCache`  
**Description:** Flush the cache.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-217"></a>

### StartBackgroundService

#### 1. StartBackgroundService

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/StartBackgroundService`  
**Description:** Start background service.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-218"></a>

### StopBackgroundService

#### 1. StopBackgroundService

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/StopBackgroundService`  
**Description:** Stop background service.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-219"></a>

### ChecsymbolinFnO

#### 1. ChecsymbolinFnO

**Method:** `GET`  
**Endpoint:** `/api/NSEContracts/ChecsymbolinFnO`  
**Description:** Check symbol in F&O segment.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Symbol | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 4314,
  "Message": "string",
  "Result": true
}
```

---

<a id="report-220"></a>

### GetIVScreenerYesterdayResponsesDown

#### 1. GetIVScreenerYesterdayResponsesDown

**Method:** `POST`  
**Endpoint:** `/api/NSEContracts/GetIVScreenerYesterdayResponsesDown`  
**Description:** Get IV screener yesterday responses download.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 5564 |
| PageSize | Integer | Yes |  | 2953 |
| Condition | Integer | Yes |  | 6187 |
| Sector | String | Yes |  | string |
| Script | String | Yes |  | str |
| VolAbove | String | Yes |  | string |
| VolBelow | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| columnName | String | Yes |  | string |
| Sort | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 5564,
  "PageSize": 2953,
  "Condition": 6187,
  "Sector": "string",
  "Script": "str",
  "VolAbove": "string",
  "VolBelow": "string",
  "Expiry": "string",
  "columnName": "string",
  "Sort": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

# Portfolio

## Portfolio

<a id="report-221"></a>

### GetEditPortfolioSpecific

#### 1. GetEditPortfolioSpecific

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/GetEditPortfolioSpecific`  
**Description:** Executes the GetEditPortfolioSpecific action under the Portfolio module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |
| SCP | String | Yes |  | string |
| BuySellType | String | Yes |  | string |
| ExitPrice | String | Yes |  | string |
| IDVal | String | Yes |  | string |
| LoginID | Integer | Yes |  | 4117 |

**Sample Request:**

```json
{
  "StrategyName": "A043",
  "ScripName": "string",
  "Expiry": "string",
  "Strike": "string",
  "SCP": "string",
  "BuySellType": "string",
  "ExitPrice": "string",
  "IDVal": "string",
  "LoginID": 8079
}
```

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": [
{
"LegsList": [
{
"StrategyName": "A043",
"BuySellType": null,
"LotSize": "1",
"nMinLotSize": null,
"EntryPrice": "0.95",
"ExitPrice": "-",
"CurrentPrice": null,
"Expiry": "30 Jan 2025",
"Strike": "135",
"ScripName": "TATASTEEL",


"SCP": "PE",
"UnderLyingPrice": null,
"ProfitLoss": null,
"PositionStatus": "Open",
"BuySellTypeShort": "S",
"ID": "10",
"Token": null,
"Segment": null,
"ScriptDescription": null
}}}
```

---

<a id="report-222"></a>

### DeletePortfolioAllPosition

#### 1. DeletePortfolioAllPosition

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/DeletePortfolioAllPosition`  
**Description:** Executes the DeletePortfolioAllPosition action under the Portfolio module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |
| SCP | String | Yes |  | string |
| BuySellType | String | Yes |  | string |
| ExitPrice | String | Yes |  | string |
| IDVal | String | Yes |  | string |
| LoginID | Integer | Yes |  | 4117 |

**Sample Request:**

```json
{
  "StrategyName": "A043",
  "ScripName": "TATASTEEL",
  "Expiry": "string",
  "Strike": "string",
  "SCP": "string",
  "BuySellType": "string",
  "ExitPrice": "string",
  "IDVal": "string",
  "LoginID": 8079
}
```

---

<a id="report-223"></a>

### CloseOneLegPositionEdit

#### 1. CloseOneLegPositionEdit

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/CloseOneLegPositionEdit`  
**Description:** Executes the CloseOneLegPositionEdit action under the Portfolio module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |
| SCP | String | Yes |  | string |
| BuySellType | String | Yes |  | string |
| ExitPrice | String | Yes |  | string |
| IDVal | String | Yes |  | string |
| LoginID | Integer | Yes |  | 4117 |

**Sample Request:**

```json
{
  "StrategyName": "FIN Strategy",
  "ScripName": "FINNIFTY",
  "Expiry": "27 FEB 2025",
  "Strike": "20500",
  "SCP": "CE",
  "BuySellType": "B",
  "ExitPrice": "-",
  "IDVal": "",
  "LoginID": 47
}
```

---

<a id="report-224"></a>

### CheckStrategyEON

#### 1. CheckStrategyEON

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/CheckStrategyEON`  
**Description:** Executes the CheckStrategyEON action under the Portfolio module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | Yes |  | string |
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |
| SCP | String | Yes |  | string |
| BuySellType | String | Yes |  | string |
| ExitPrice | String | Yes |  | string |
| IDVal | String | Yes |  | string |
| LoginID | Integer | Yes |  | 4117 |

**Sample Request:**

```json
{
  "StrategyName": "FIN Strategy",
  "ScripName": "FINNIFTY",
  "Expiry": "27 FEB 2025",
  "Strike": "20500",
  "SCP": "CE",
  "BuySellType": "B",
  "ExitPrice": "-",
  "IDVal": "",
  "LoginID": 47
}
```

---

<a id="report-225"></a>

### SaveMyStrategyPortfolio

#### 1. SaveMyStrategyPortfolio

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/SaveMyStrategyPortFolio`  
**Description:** Executes the SaveMyStrategyPortfolio action under the Portfolio module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyNameArr | Array | Yes |  | ["string","string"] |
| ScripNameArr | Array | Yes |  | ["string","string"] |
| BuySellArr | Array | Yes |  | ["string","string"] |
| ExpiryArr | Array | Yes |  | ["string","string"] |
| StrikeArr | Array | Yes |  | ["string","string"] |
| SCPArr | Array | Yes |  | ["string","string"] |
| LotArr | Array | Yes |  | ["string","string"] |
| EntryPriceArr | Array | Yes |  | ["string","string"] |
| OpenCloseArr | Array | Yes |  | ["string","string"] |
| ExitPriceArr | Array | Yes |  | ["string","string"] |
| IDValCArr | Array | Yes |  | ["string","string"] |
| DeleteLegArr | Array | Yes |  | ["string","string"] |
| LoginID | Integer | Yes |  | 4661 |

**Sample Request:**

```json
{
  "StrategyNameArr": [
    "FIN Strategy"
  ],
  "ScripNameArr": [
    "FINNIFTY"
  ],
  "BuySellArr": [
    "B"
  ],
  "ExpiryArr": [
    "27 FEB 2025"
  ],
  "StrikeArr": [
    "23800"
  ],
  "SCPArr": [
    "CE"
  ],
  "LotArr": [
    "1"
  ],
  "EntryPriceArr": [
    "1"
  ],
  "OpenCloseArr": [
    "1"
  ],
  "ExitPriceArr": [
    "1"
  ],
  "IDValCArr": [
    "1"
  ],
  "DeleteLegArr": [
    "1"
  ],
  "LoginID": 28037
}
```

---

<a id="report-226"></a>

### UpdateMyStrategyPortfolio

#### 1. UpdateMyStrategyPortfolio

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/UpdateMyStrategyPortFolio`  
**Description:** Executes the UpdateMyStrategyPortfolio action under the Portfolio module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyNameArr | Array | Yes |  | ["string","string"] |
| ScripNameArr | Array | Yes |  | ["string","string"] |
| BuySellArr | Array | Yes |  | ["string","string"] |
| ExpiryArr | Array | Yes |  | ["string","string"] |
| StrikeArr | Array | Yes |  | ["string","string"] |
| SCPArr | Array | Yes |  | ["string","string"] |
| LotArr | Array | Yes |  | ["string","string"] |
| EntryPriceArr | Array | Yes |  | ["string","string"] |
| OpenCloseArr | Array | Yes |  | ["string","string"] |
| ExitPriceArr | Array | Yes |  | ["string","string"] |
| IDValCArr | Array | Yes |  | ["string","string"] |
| DeleteLegArr | Array | Yes |  | ["string","string"] |
| LoginID | Integer | Yes |  | 4661 |

**Sample Request:**

```json
{
  "StrategyNameArr": [
    "FIN Strategy"
  ],
  "ScripNameArr": [
    "FINNIFTY"
  ],
  "BuySellArr": [
    "B"
  ],
  "ExpiryArr": [
    "27 FEB 2025"
  ],
  "StrikeArr": [
    "23800"
  ],
  "SCPArr": [
    "CE"
  ],
  "LotArr": [
    "1"
  ],
  "EntryPriceArr": [
    "1"
  ],
  "OpenCloseArr": [
    "1"
  ],
  "ExitPriceArr": [
    "1"
  ],
  "IDValCArr": [
    "1"
  ],
  "DeleteLegArr": [
    "1"
  ],
  "LoginID": 28037
}
```

---

<a id="report-227"></a>

### RefreshPriceCall

#### 1. RefreshPriceCall

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/refreshPriceCall`  
**Description:** Executes the RefreshPriceCall action under the Portfolio module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| TokensList | String | No |  | string |

---

<a id="report-228"></a>

### PracPortfolioAll

#### 1. PracPortfolioAll

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/PracPortfolioAll`  
**Description:** Get all practice portfolio data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| L | o | Yes |  | g |
| I | n | Yes |  | t |
| 2 | 8 | Yes |  | 0 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | String | No |  | 4213 |

---

<a id="report-229"></a>

### GetOneLegsPosition

#### 1. GetOneLegsPosition

**Method:** `GET`  
**Endpoint:** `/api/Portfolio/GetOneLegsPosition`  
**Description:** Get single leg position details.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripNameOLP | String | No |  | string |
| ExpiryOLP | String | No |  | string |
| StrikeOLP | String | No |  | string |
| SCPOLP | String | No |  | string |
| PMOLP | String | No |  | string |

---

<a id="report-230"></a>

### portfolioCheckCountandActive

#### 1. portfolioCheckCountandActive

**Method:** `POST`  
**Endpoint:** `/api/Portfolio/portfolioCheckCountandActive`  
**Description:** Check portfolio count and active status.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| L | o | Yes |  | g |
| I | n | Yes |  | t |
| 2 | 8 | Yes |  | 0 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | String | No |  | 4213 |

---

<a id="report-231"></a>

### SaveStrategiesInPortfolio

#### 1. SaveStrategiesInPortfolio

**Method:** `POST`  
**Endpoint:** `/api/PortfolioV2/SaveStrategiesInPortfolio`  
**Description:** Executes the SaveStrategiesInPortfolio action under the Portfolio V2 module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | String | Yes |  | string |
| StrategyName | String | Yes |  | string |
| PortfolioID | Array | Yes |  | ["string","string"] |
| BuySell | Array | Yes |  | ["string","string"] |
| ScripName | Array | Yes |  | ["string","string"] |
| Expiry | Array | Yes |  | ["string","string"] |
| Strike | Array | Yes |  | ["string","string"] |
| SCP | Array | Yes |  | ["string","string"] |
| LotSize | Array | Yes |  | ["string","string"] |
| EntryPrice | Array | Yes |  | ["string","string"] |
| ExitPrice | Array | Yes |  | ["string","string"] |
| Token | Array | Yes |  | ["string","string"] |

**Sample Request:**

```json
{
  "LoginID": "28037",
  "StrategyName": "AKKI112",
  "PortfolioID": [
    "2"
  ],
  "BuySell": [
    "B"
  ],
  "ScripName": [
    "NIFTY"
  ],
  "Expiry": [
    "27 FEB 2025"
  ],
  "Strike": [
    "23800"
  ],
  "SCP": [
    "CE"
  ],
  "LotSize": [
    "1"
  ],
  "EntryPrice": [
    "10.2"
  ],
  "ExitPrice": [
    "20"
  ],
  "Token": [
    "57593"
  ]
}
```

---

<a id="report-232"></a>

### CheckStrategyExists

#### 1. CheckStrategyExists

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/CheckStrategyExists`  
**Description:** Executes the CheckStrategyExists action under the Portfolio V2 module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyName | String | No |  | string |

---

<a id="report-233"></a>

### DeleteStrategyOrLeg

#### 1. DeleteStrategyOrLeg

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/DeleteStrategyORLeg`  
**Description:** The DeleteStrategyORLeg API allows users to delete an entire trading strategy or specific legs (individual positions) within a strategy from their portfolio. This ensures flexibility by letting users either remove a complete strategy or selectively delete specific legs. DeleteStrategyOrLeg

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ID | String | No |  | string |
| DeleteType | String | No |  | string |

---

<a id="report-234"></a>

### GetAllLogsData

#### 1. GetAllLogsData

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/GetAllLogsData`  
**Description:** Executes the GetAllLogsData action under the Portfolio V2 module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| SID | String | No |  | 7757 |
| SLegID | String | No |  | 7757 |

**Sample Response:**

```json
{
"Status": true,
"StatusCode": 200,
"Message": "Api Executed Successfully",
"Result": {
"LogList": [
{
"id": 3484,
"Token": 136839,
"BuySell": "B",
"ScripName": "PAGEIND",
"Expiry": "27 Mar 2025",
"Strike": "39500",
"SCP": "CE",
"CreateDate": "11 Mar 2025, 14:49",
"LotSize": 10,
"Price": 892.55,
"isMarketPrice": false
}}}
```

---

<a id="report-235"></a>

### ModifyLogData

#### 1. ModifyLogData

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/ModifyLogData`  
**Description:** The ModifyLogData API is used to trigger modifications or adjustments to trade log data stored in the system. Unlike other APIs, it does not require any input parameters in the request body or URL. Instead, it works on predefined logic or processes set within the backend. GetAddExitDataForLog

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ID | String | No |  | 7757 |
| BuySell | String | No |  | string |
| LotSize | String | No |  | 4213 |
| Price | String | No |  | 5968.003287571597 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "id": 874,
    "Token": 63551,
    "BuySell": "S",
    "ScripName": "NIFTY",
    "Expiry": "20 Feb 2025",
    "Strike": "23200",
    "SCP": "CE",
    "CreateDate": null,
    "LotSize": 0,
    "Price": 0.05,
    "isMarketPrice": false
  }
}
```

---

<a id="report-236"></a>

### GetExitAllLegPositions

#### 1. GetExitAllLegPositions

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/GetExitAllLegPositions`  
**Description:** Executes the GetExitAllLegPositions action under the Portfolio V2 module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| SID | String | No |  | 7757 |

---

<a id="report-237"></a>

### SaveExitAllLegPositions

#### 1. SaveExitAllLegPositions

**Method:** `POST`  
**Endpoint:** `/api/PortfolioV2/SaveExitAllLegPositions`  
**Description:** Executes the SaveExitAllLegPositions action under the Portfolio V2 module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| data | Array | Yes |  | [{"id":114,"Token":5476,"BuySell":"string","ScripName":"string","Expiry":"string","Strike":"string","SCP":"string","CreateDate":"string","LotSize":5645,"Price":6241.281176203534,"isMarketPrice":true},{"id":3146,"Token":9758,"BuySell":"str","ScripName":"string","Expiry":"string","Strike":"string","SCP":"string","CreateDate":"string","LotSize":8645,"Price":8967.4451703946,"isMarketPrice":true}] |

**Sample Request:**

```json
{
  "data": [
    {
      "id": 114,
      "Token": 5476,
      "BuySell": "string",
      "ScripName": "string",
      "Expiry": "string",
      "Strike": "string",
      "SCP": "string",
      "CreateDate": "string",
      "LotSize": 5645,
      "Price": 6241.281176203534,
      "isMarketPrice": true
    },
    {
      "id": 3146,
      "Token": 9758,
      "BuySell": "str",
      "ScripName": "string",
      "Expiry": "string",
      "Strike": "string",
      "SCP": "string",
      "CreateDate": "string",
      "LotSize": 8645,
      "Price": 8967.4451703946,
      "isMarketPrice": true
    }
  ]
}
```

**Sample Response:**

```json
{
  "data": [
    {
      "id": 2,
      "Token": 57593,
      "BuySell": "B",
      "ScripName": "NIFTY",
      "Expiry": "27 FEB 2025",
      "Strike": "23800",
      "SCP": "CE",
      "CreateDate": "",
      "LotSize": 1,
      "Price": 10,
      "isMarketPrice": true
    }
  ]
}
```

---

<a id="report-238"></a>

### GetPortfolioData

#### 1. GetPortfolioData

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/GetPortfolioData`  
**Description:** Executes the GetPortfolioData action under the Portfolio V2 module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "TotalRealisedPnl": -761.25,
    "TotalUnrealisedPnl": 0,
    "TotalPnl": -761.25,
    "StrategyListData": [
      {
        "ID": 521,
        "CreatedDate": "21 Feb 2025",
        "StrategyName": "AKKI112",
        "ScripName": "NIFTY",
        "StrategyStatus": "Close",
        "TotalSPnl": -761.25
      }
    ],
    "portfolioLegsMains": [
      {
        "SID": 521,
        "TotalRealisedLegPnl": -761.25,
        "TotalUnrealisedLegPnl": 0,
        "Delta": 0,
        "Theta": 0,
        "Gamma": 0,
        "Vega": 0,
        "DeltaRupees": 0,
        "ThetaRupees": 0,
        "GammaRupees": 0,
        "VegaRupees": 0,
        "LegsList": [
          {
            "SID": 521,
            "LegID": 1079,
            "BuySell": "B",
            "ScripName": "NIFTY 27 Feb 2025 23800 CE",
            "LotValue": 0,
            "NetQuantity": 0,
            "LiveLTP": 0.05,
            "AveragePrice": 0.05,
            "RealisedLegPnl": -761.25,
            "UnrealisedLegPnl": 0,
            "LegStatus": "Close",
            "isLegExpired": true,
            "Token": "57593",
            "ScripLotSize": "75"
          }
        ]
      }
    ]
  }
}
```

---

<a id="report-239"></a>

### GetAddLegsData

#### 1. GetAddLegsData

**Method:** `POST`  
**Endpoint:** `/api/PortfolioV2/getAddLegsData`  
**Description:** Executes the GetAddLegsData action under the Portfolio V2 module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Portfolios | Array | Yes |  | [{"Token":"string","ScripName":"string","BuySell":"string","Expiry":"string","Strike":1979.8408064870853,"SCP":"string","LotSize":"string","Price":7199.305722796396},{"Token":"string","ScripName":"string","BuySell":"string","Expiry":"string","Strike":9744.99264149558,"SCP":"string","LotSize":"string","Price":1588.5506888807654}] |

**Sample Request:**

```json
{
  "ScripName": "NIFTY",
  "Portfolios": [
    {
      "Token": "57593",
      "ScripName": "NIFTY",
      "BuySell": "B",
      "Expiry": "27 FEB 2025",
      "Strike": 23800,
      "SCP": "CE",
      "LotSize": "1",
      "Price": 12
    }
  ]
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "UnderlyingPrice": 22770.5,
    "UnderlyingChange": 261.75,
    "UnderlyingChangePer": 1.16,
    "ScripName": "NIFTY",
    "Expiries": [
      "20 Mar 2025",
      "27 Mar 2025",
      "03 Apr 2025",
      "09 Apr 2025",
      "17 Apr 2025",
      "24 Apr 2025",
      "29 May 2025",
      "26 Jun 2025",
      "25 Sep 2025",
      "24 Dec 2025",
      "25 Jun 2026",
      "31 Dec 2026"
    ],
    "Strikes": [
      "21300",
      "21350",
      "23950",
      "24000",
      "24050",
      "24100",
      "24150",
      "24200",
      "24250"
    ],
    "FutExpiries": [
      "27 Mar 2025",
      "24 Apr 2025",
      "29 May 2025"
    ],
    "DataResps": [
      {
        "Token": "57593",
        "ScripName": "",
        "BuySell": "B",
        "Expiry": "01 Jan 1980",
        "Strike": 0,
        "SCP": "FUT",
        "LotSize": "1",
        "Price": 0.05
      }
    ]
  }
}
```

---

<a id="report-240"></a>

### GetOneLegDetails

#### 1. GetOneLegDetails

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/getOneLegDetails`  
**Description:** The GetOneLegDetails API is used to fetch detailed information about a specific leg of a portfolio or trading position. This API provides insights into a single trade or contract, such as its current status, price, and other relevant data. AddNewLegInStrategy

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | No |  | string |
| Expiry | String | No |  | string |
| SCP | String | No |  | string |
| Strike | String | No |  | string |

---

<a id="report-241"></a>

### RenameStrategy

#### 1. RenameStrategy

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/RenameStrategy`  
**Description:** Rename a portfolio strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ID | String | No |  | 7757 |
| NewName | String | No |  | string |

---

<a id="report-242"></a>

### GetAddExitDataForLog

#### 1. GetAddExitDataForLog

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/GetAddExitDataForLog`  
**Description:** Get add and exit data for log entries.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Type | String | No |  | string |
| LogID | String | No |  | 7757 |

---

<a id="report-243"></a>

### GetPortfolioOpenCloseCount

#### 1. GetPortfolioOpenCloseCount

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/GetPortfolioOpenCloseCount`  
**Description:** Get open and close position counts.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-244"></a>

### ResetPrice

#### 1. ResetPrice

**Method:** `POST`  
**Endpoint:** `/api/PortfolioV2/ResetPrice`  
**Description:** Reset entry price for a position.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Token | Array | Yes |  | ["string","string"] |

**Sample Request:**

```json
{
  "Token": [
    "string",
    "string"
  ]
}
```

---

<a id="report-245"></a>

### AddNewLegInStrategy

#### 1. AddNewLegInStrategy

**Method:** `POST`  
**Endpoint:** `/api/PortfolioV2/AddNewLegInStrategy`  
**Description:** Add a new leg to an existing strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | String | Yes |  | string |
| StrategyName | String | Yes |  | string |
| PortfolioID | Array | Yes |  | ["string","string"] |
| BuySell | Array | Yes |  | ["string","string"] |
| ScripName | Array | Yes |  | ["string","string"] |
| Expiry | Array | Yes |  | ["string","string"] |
| Strike | Array | Yes |  | ["string","string"] |
| SCP | Array | Yes |  | ["string","string"] |
| LotSize | Array | Yes |  | ["string","string"] |
| EntryPrice | Array | Yes |  | ["string","string"] |
| ExitPrice | Array | Yes |  | ["string","string"] |
| Token | Array | Yes |  | ["string","string"] |

**Sample Request:**

```json
{
  "LoginID": "string",
  "StrategyName": "string",
  "PortfolioID": [
    "string",
    "string"
  ],
  "BuySell": [
    "string",
    "string"
  ],
  "ScripName": [
    "string",
    "string"
  ],
  "Expiry": [
    "string",
    "string"
  ],
  "Strike": [
    "string",
    "string"
  ],
  "SCP": [
    "string",
    "string"
  ],
  "LotSize": [
    "string",
    "string"
  ],
  "EntryPrice": [
    "string",
    "string"
  ],
  "ExitPrice": [
    "string",
    "string"
  ],
  "Token": [
    "string",
    "string"
  ]
}
```

---

<a id="report-246"></a>

### ModifyStrategy

#### 1. ModifyStrategy

**Method:** `POST`  
**Endpoint:** `/api/PortfolioV2/ModifyStrategy`  
**Description:** Modify an existing portfolio strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| LoginID | String | Yes |  | string |
| PortfolioID | Array | Yes |  | ["string","string"] |
| BuySell | Array | Yes |  | ["string","string"] |
| LotSize | Array | Yes |  | ["string","string"] |
| EntryExitPrice | Array | Yes |  | ["string","string"] |

**Sample Request:**

```json
{
  "LoginID": "string",
  "PortfolioID": [
    "string",
    "string"
  ],
  "BuySell": [
    "string",
    "string"
  ],
  "LotSize": [
    "string",
    "string"
  ],
  "EntryExitPrice": [
    "string",
    "string"
  ]
}
```

---

<a id="report-247"></a>

### SaveAddExitLogData

#### 1. SaveAddExitLogData

**Method:** `GET`  
**Endpoint:** `/api/PortfolioV2/SaveAddExitLogData`  
**Description:** Executes the SaveAddExitLogData action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ID | String | No |  | 7757 |
| BuySell | String | No |  | string |
| isMarket | String | No |  | false |
| LotSize | String | No |  | 4213 |
| Price | String | No |  | 5968.003287571597 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

## Aalap Reports

<a id="report-248"></a>

### 1. Trading Calls

#### 1. getTradingCalls

**Method:** `POST`  
**Endpoint:** `/api/AalapReports/getTradingCalls`  
**Description:** Get trading calls data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| tradeType | String | Yes |  | string |

**Sample Request:**

```json
{
  "tradeType": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1753,
  "Message": "string",
  "Result": {
    "ID": 296,
    "EQToken": 1411,
    "OToken": 1803,
    "FToken": 73,
    "StrategyName": "string",
    "OsScriptDescription": "string",
    "FsScriptDescription": "string",
    "Symbol": "string",
    "Expiry": "string",
    "FExpiry": "string",
    "Strike": 3746.736509639057,
    "SCP": "string",
    "OBuySell": "string",
    "FBuySell": "string",
    "OLotSize": 1220,
    "OQuantity": 7275,
    "FLotSize": 3540,
    "FQuantity": 6904,
    "UPremium": 9703.948946529563,
    "OPremium": 8006.857489681194,
    "FPremium": 8921.611657264699,
    "ULivePremium": 9117.437597239374,
    "OLivePremium": 2523.9276560110293,
    "FLivePremium": 6601.674113307534,
    "OTarget": 2383.927269648074,
    "FTarget": 7398.9288298526935,
    "CurrentIV": 35.249134720654055,
    "ForecastIV": 1122.3080500301076,
    "Delta": 2488.2030112329057,
    "Target": 2321.8251251425627,
    "StopLoss": 3137.065440276694,
    "M2M": 6895.404878805693,
    "CreatedDate": "string",
    "StrategyStatus": "string"
  }
}
```

---

<a id="report-249"></a>

### 2. Favourite Strategy

#### 1. AddFavouriteStrategy

**Method:** `POST`  
**Endpoint:** `/api/AalapReports/AddFavouriteStrategy`  
**Description:** Add a favourite strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StrategyId | Integer | Yes |  | 7455 |
| StrategyName | String | Yes |  | string |

**Sample Request:**

```json
{
  "StrategyId": 7455,
  "StrategyName": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1753,
  "Message": "string",
  "Result": {
    "ID": 296,
    "EQToken": 1411,
    "OToken": 1803,
    "FToken": 73,
    "StrategyName": "string",
    "OsScriptDescription": "string",
    "FsScriptDescription": "string",
    "Symbol": "string",
    "Expiry": "string",
    "FExpiry": "string",
    "Strike": 3746.736509639057,
    "SCP": "string",
    "OBuySell": "string",
    "FBuySell": "string",
    "OLotSize": 1220,
    "OQuantity": 7275,
    "FLotSize": 3540,
    "FQuantity": 6904,
    "UPremium": 9703.948946529563,
    "OPremium": 8006.857489681194,
    "FPremium": 8921.611657264699,
    "ULivePremium": 9117.437597239374,
    "OLivePremium": 2523.9276560110293,
    "FLivePremium": 6601.674113307534,
    "OTarget": 2383.927269648074,
    "FTarget": 7398.9288298526935,
    "CurrentIV": 35.249134720654055,
    "ForecastIV": 1122.3080500301076,
    "Delta": 2488.2030112329057,
    "Target": 2321.8251251425627,
    "StopLoss": 3137.065440276694,
    "M2M": 6895.404878805693,
    "CreatedDate": "string",
    "StrategyStatus": "string"
  }
}
```

---

#### 2. GetFavouriteStrategy

**Method:** `POST`  
**Endpoint:** `/api/AalapReports/GetFavouriteStrategy`  
**Description:** Get favourite strategies.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 1753,
  "Message": "string",
  "Result": {
    "ID": 296,
    "EQToken": 1411,
    "OToken": 1803,
    "FToken": 73,
    "StrategyName": "string",
    "OsScriptDescription": "string",
    "FsScriptDescription": "string",
    "Symbol": "string",
    "Expiry": "string",
    "FExpiry": "string",
    "Strike": 3746.736509639057,
    "SCP": "string",
    "OBuySell": "string",
    "FBuySell": "string",
    "OLotSize": 1220,
    "OQuantity": 7275,
    "FLotSize": 3540,
    "FQuantity": 6904,
    "UPremium": 9703.948946529563,
    "OPremium": 8006.857489681194,
    "FPremium": 8921.611657264699,
    "ULivePremium": 9117.437597239374,
    "OLivePremium": 2523.9276560110293,
    "FLivePremium": 6601.674113307534,
    "OTarget": 2383.927269648074,
    "FTarget": 7398.9288298526935,
    "CurrentIV": 35.249134720654055,
    "ForecastIV": 1122.3080500301076,
    "Delta": 2488.2030112329057,
    "Target": 2321.8251251425627,
    "StopLoss": 3137.065440276694,
    "M2M": 6895.404878805693,
    "CreatedDate": "string",
    "StrategyStatus": "string"
  }
}
```

---

#### 3. RemoveFavouriteStrategy

**Method:** `POST`  
**Endpoint:** `/api/AalapReports/RemoveFavouriteStrategy`  
**Description:** Remove a favourite strategy.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-250"></a>

### 3. Reports Data

#### 1. GetAalapReportsData

**Method:** `POST`  
**Endpoint:** `/api/AalapReports/GetAalapReportsData`  
**Description:** Get Aalap reports data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-251"></a>

### 4. Paper Trade

#### 1. GetPaperTradeData

**Method:** `POST`  
**Endpoint:** `/api/AalapReports/GetPaperTradeData`  
**Description:** Get paper trade data.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 2. DeleteStrategyPaperTrade

**Method:** `GET`  
**Endpoint:** `/api/AalapReports/DeleteStrategyPaperTrade`  
**Description:** Delete strategy paper trade.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

<a id="report-252"></a>

### 5. Portfolio Actions

#### 1. AddStrategyintoPortFolio

**Method:** `POST`  
**Endpoint:** `/api/AalapReports/AddStrategyintoPortFolio`  
**Description:** Add strategy into portfolio.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

#### 2. ExitPositionPortfolio

**Method:** `POST`  
**Endpoint:** `/api/AalapReports/ExitPositionPortfolio`  
**Description:** Exit position in portfolio.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

---

# Market Mood Index (MMI)

## Market Mood Index (MMI)

<a id="report-253"></a>

### GetOptionScans

#### 1. GetOptionScans

**Method:** `POST`  
**Endpoint:** `/api/MMI/GetOptionScans`  
**Description:** Executes the GetOptionScans action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| GroupName | String | Yes |  | string |
| toprow | String | Yes |  | string |

**Sample Request:**

```json
{
  "GroupName": "string",
  "toprow": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 3954,
  "Message": "string",
  "Result": {
    "PriceUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "PriceDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "NearHighList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "NearLowList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "OIUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "OIDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "RolloversList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "OILimitList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "ActiveFuturesList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "VolumeGainersList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "IVUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "IVDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "PCRUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "PCRDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "DeliveryHeavyList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "DeliveryUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "BasisUpList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "BasisDownList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "AboveVWapList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "BelowVWapList": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "LongBuildUp": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "ShortBuildUp": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "ShortCoveringUp": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "LongUnWanding": [
      {
        "ScripName": "string",
        "Value": "string"
      },
      {
        "ScripName": "string",
        "Value": "string"
      }
    ],
    "FeedTime": "1997-07-14T04:15:49.013Z"
  }
}
```

---

<a id="report-254"></a>

### ResultCalender

#### 1. ResultCalender

**Method:** `POST`  
**Endpoint:** `/api/MMI/ResultCalender`  
**Description:** Executes the ResultCalender action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| FilterType | String | Yes |  | string |
| FOType | String | Yes |  | string |
| Type | String | Yes |  | string |

**Sample Request:**

```json
{
  "FilterType": "string",
  "FOType": "string",
  "Type": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 8981,
  "Message": "string",
  "Result": {
    "PageNo": 364,
    "PageSize": 2037.9930800011525,
    "TotalRecords": 8967,
    "TotalPages": 4109.287426197055,
    "Data": [
      {
        "Symbol": "string",
        "Company": "string",
        "purpose": "string",
        "Details": "string",
        "Date": "string"
      },
      {
        "Symbol": "string",
        "Company": "string",
        "purpose": "string",
        "Details": "string",
        "Date": "string"
      }
    ]
  }
}
```

---

<a id="report-255"></a>

### FIIDIIActivity

#### 1. FIIDIIActivity

**Method:** `POST`  
**Endpoint:** `/api/MMI/FIIDIIActivity`  
**Description:** Executes the FIIDIIActivity action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| PageNo | Integer | Yes |  | 1512 |
| PageSize | Integer | Yes |  | 4539 |
| DMType | String | Yes |  | string |
| StocksName | String | Yes |  | strin |
| FOorCash | String | Yes |  | string |

**Sample Request:**

```json
{
  "PageNo": 1512,
  "PageSize": 4539,
  "DMType": "string",
  "StocksName": "strin",
  "FOorCash": "string"
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 9861,
  "Message": "s",
  "Result": {
    "PageNo": 2238,
    "PageSize": 6136.682937413387,
    "TotalRecords": 1751,
    "TotalPages": 9826.26320059071,
    "Data": [
      {
        "Date": "string",
        "FllBuyValue": 2522.1872888974085,
        "FllSellValue": 7667.503742157715,
        "FllNetValue": 7839.932553540531,
        "DllBuyValue": 316.13380236583,
        "DllSellValue": 7258.121678978924,
        "DllNetValue": 4365.8738077606695,
        "CashInOut": 737.368517431023,
        "TotalFllBuyValue1": 601.1928817995815,
        "TotalFllBuySellValue1": 6240.417023059974,
        "TotalFllBuyNetValue1": 6013.273464948068,
        "TotalDllBuyValue1": 6396.87256867727,
        "TotalDllBuySellValue1": 3446.763897259579,
        "TotalDllBuyNetValue1": 5075.793026499744,
        "TotalCashInOut1": 2279.882333101533
      },
      {
        "Date": "string",
        "FllBuyValue": 7629.749697050945,
        "FllSellValue": 642.4734356970552,
        "FllNetValue": 2790.229849441308,
        "DllBuyValue": 537.5542380461474,
        "DllSellValue": 804.4624948741119,
        "DllNetValue": 9037.922070555498,
        "CashInOut": 7643.3035263235215,
        "TotalFllBuyValue1": 4777.378011831366,
        "TotalFllBuySellValue1": 8922.066207569287,
        "TotalFllBuyNetValue1": 3127.3550194660406,
        "TotalDllBuyValue1": 3794.1816095131053,
        "TotalDllBuySellValue1": 9915.255510870125,
        "TotalDllBuyNetValue1": 9052.955442869286,
        "TotalCashInOut1": 6532.518936281606
      }
    ]
  }
}
```

---

<a id="report-256"></a>

### Getstraddlechain

#### 1. Getstraddlechain

**Method:** `POST`  
**Endpoint:** `/api/MMI/Getstraddlechain`  
**Description:** Executes the Getstraddlechain action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| NumberofStrikes | String | Yes |  | s |
| IsPerLot | Boolean | Yes |  | true |

**Sample Request:**

```json
{
  "StockName": "string",
  "Expiry": "string",
  "NumberofStrikes": "s",
  "IsPerLot": true
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 5382,
  "Message": "string",
  "Result": {
    "LivePrice": "string",
    "LivePriceChange": "string",
    "LivePriceChangePer": "string",
    "ButterflyCenter": "string",
    "LotSize": "string",
    "FuturePrice": "string",
    "FuturePriceChange": "string",
    "FuturePriceChangePer": "string",
    "SChain": [
      {
        "Strike": "string",
        "CallLTP": "string",
        "PutLTP": "string",
        "StraddlePrice": "string",
        "StraddlePriceChange": "string",
        "StraddleChange": "string",
        "Straddle5Change": "string",
        "AvgIV": "string",
        "CallOI": "string",
        "PutOI": "string",
        "NetDelta": "string",
        "NetTheta": "string",
        "NetGamma": "string",
        "NetVega": "string",
        "CEToken": "string",
        "PEToken": "string",
        "Segment": "string"
      },
      {
        "Strike": "string",
        "CallLTP": "string",
        "PutLTP": "string",
        "StraddlePrice": "string",
        "StraddlePriceChange": "string",
        "StraddleChange": "string",
        "Straddle5Change": "string",
        "AvgIV": "string",
        "CallOI": "string",
        "PutOI": "string",
        "NetDelta": "string",
        "NetTheta": "string",
        "NetGamma": "string",
        "NetVega": "string",
        "CEToken": "string",
        "PEToken": "string",
        "Segment": "string"
      }
    ],
    "Expiry": [
      "string",
      "string"
    ],
    "Token": 9199,
    "FoToken": 596
  }
}
```

---

<a id="report-257"></a>

### GetSpotFuture

#### 1. GetSpotFuture

**Method:** `GET`  
**Endpoint:** `/api/MMI/GetSpotFuture`  
**Description:** Executes the GetSpotFuture action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| IndexName | String | No |  | string |
| Expiry | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 6464,
  "Message": "string",
  "Result": {
    "futures": [
      {
        "Token": 6386,
        "LTP": "string",
        "Change": "string",
        "ChangePercent": "string",
        "MonthD": "string",
        "Segment": "string"
      },
      {
        "Token": 593,
        "LTP": "string",
        "Change": "string",
        "ChangePercent": "string",
        "MonthD": "string",
        "Segment": "string"
      }
    ],
    "syFutures": [
      {
        "Token": 4832,
        "LTP": "string",
        "Change": "str",
        "ChangePercent": "string",
        "MonthD": "string",
        "Segment": "string"
      },
      {
        "Token": 9669,
        "LTP": "string",
        "Change": "string",
        "ChangePercent": "string",
        "MonthD": "string",
        "Segment": "string"
      }
    ],
    "MaxPain": 3549.7916219982594,
    "LTP": "string",
    "Change": "string",
    "ChangePercent": "string",
    "LotSize": 166,
    "UnderLyingToken": 3884,
    "ATMStrike": 4292,
    "PCROI": 5443.403988061855,
    "PCRVolume": 5311.399114227577,
    "AvgIV": 5439.631958809666,
    "Expiry": "string"
  }
}
```

---

<a id="report-258"></a>

### OptionChain

#### 1. OptionChain

**Method:** `POST`  
**Endpoint:** `/api/MMI/OptionChain`  
**Description:** Executes the OptionChain action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Rowcount | Integer | Yes |  | 9824 |
| isLotSize | Boolean | Yes |  | true |
| isFullValue | Boolean | Yes |  | false |

**Sample Request:**

```json
{
  "ScripName": "string",
  "Expiry": "string",
  "Rowcount": 9824,
  "isLotSize": true,
  "isFullValue": false
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 5263,
  "Message": "string",
  "Result": {
    "OptionChain": [
      {
        "Script": "string",
        "Instrument": "string",
        "Strike": 555.2207033074752,
        "CallToken": 7127,
        "PutToken": 6400,
        "CallOI": "string",
        "PutOI": "string",
        "BroadcastConstant": 7701,
        "ExchangeID": 8526,
        "ExpiryDate": "string",
        "DbCallPrice": "st",
        "DbCallPriceChange": "string",
        "DbCallPriceChangePercent": "string",
        "DbCallOI": "string",
        "DbCallOIChange": "string",
        "DbPutPrice": "string",
        "DbPutPriceChange": "string",
        "DbPutPriceChangePercnet": "string",
        "DbPutOI": "string",
        "DbPutOIChange": "string",
        "CallIV": "string",
        "PutIV": "string",
        "CallVolume": "string",
        "PutVolume": "string",
        "CallOIChangePercent": "string",
        "PutOIChangePercent": "string",
        "CallDelta1": "string",
        "PutDelta1": "string",
        "CallTheta1": "string",
        "PutTheta1": "string",
        "CallGamma1": "string",
        "PutGamma1": "string",
        "PutVega1": "string",
        "CallVega1": "string",
        "CallRho1": "string",
        "PutRho1": "string",
        "PCR": "string",
        "PutIntrinsicValue": "string",
        "PutTimeValue": "string",
        "CallIntrinsicValue": "string",
        "CallTimeValue": "string",
        "PutIVChange": "string",
        "CallIVChange": "string",
        "CallBuiltUP": "string",
        "PutBuiltUp": "string",
        "PutOIProgress": "string",
        "CallOIProgress": "string"
      },
      {
        "Script": "string",
        "Instrument": "string",
        "Strike": 8208.292549043263,
        "CallToken": 7992,
        "PutToken": 4627,
        "CallOI": "string",
        "PutOI": "string",
        "BroadcastConstant": 9858,
        "ExchangeID": 3571,
        "ExpiryDate": "string",
        "DbCallPrice": "string",
        "DbCallPriceChange": "string",
        "DbCallPriceChangePercent": "string",
        "DbCallOI": "string",
        "DbCallOIChange": "string",
        "DbPutPrice": "string",
        "DbPutPriceChange": "string",
        "DbPutPriceChangePercnet": "string",
        "DbPutOI": "string",
        "DbPutOIChange": "string",
        "CallIV": "string",
        "PutIV": "string",
        "CallVolume": "string",
        "PutVolume": "string",
        "CallOIChangePercent": "string",
        "PutOIChangePercent": "string",
        "CallDelta1": "string",
        "PutDelta1": "string",
        "CallTheta1": "string",
        "PutTheta1": "string",
        "CallGamma1": "string",
        "PutGamma1": "string",
        "PutVega1": "string",
        "CallVega1": "string",
        "CallRho1": "string",
        "PutRho1": "string",
        "PCR": "string",
        "PutIntrinsicValue": "string",
        "PutTimeValue": "string",
        "CallIntrinsicValue": "string",
        "CallTimeValue": "string",
        "PutIVChange": "string",
        "CallIVChange": "string",
        "CallBuiltUP": "string",
        "PutBuiltUp": "string",
        "PutOIProgress": "string",
        "CallOIProgress": "str"
      }
    ],
    "Expiries": [
      "str",
      "string"
    ],
    "CurrentPrice": {
      "NearByStrike": 5654.433152620284,
      "LotSize": 9464,
      "SToken": 3564,
      "FoToken": 3285,
      "sFutureExpiry": "string"
    },
    "minmaxRes": [
      {
        "CStrike3": 6208.153362958333,
        "CStrikeValue3": 7948.349178754286,
        "CStrike2": 3940.167104453658,
        "CStrikeValue2": 6097.162345963452,
        "CStrike1": 6593.38287484571,
        "CStrikeValue1": 6225.720537049022,
        "Highs": "string",
        "PStrikeValue1": 6802.4163033089735,
        "PStrike1": 4446.882529262546,
        "PStrikeValue2": 2108.665525501279,
        "PStrike2": 8503.406147052987,
        "PStrikeValue3": 5706.160275812924,
        "PStrike3": 4838.834264707923
      },
      {
        "CStrike3": 156.05485567701248,
        "CStrikeValue3": 9567.938624367627,
        "CStrike2": 7399.2482367016455,
        "CStrikeValue2": 9052.764510963087,
        "CStrike1": 2285.0512162226178,
        "CStrikeValue1": 1355.3976848033233,
        "Highs": "string",
        "PStrikeValue1": 7155.673514746212,
        "PStrike1": 2325.0776919689174,
        "PStrikeValue2": 9052.582952812156,
        "PStrike2": 6840.660257593882,
        "PStrikeValue3": 4512.780338510436,
        "PStrike3": 6127.3057717626125
      }
    ],
    "TotalPutOI": "string",
    "TotalCallOI": "string",
    "TotalPCR": "string"
  }
}
```

---

<a id="report-259"></a>

### GetOpenInterest

#### 1. GetOpenInterest

**Method:** `POST`  
**Endpoint:** `/api/MMI/GetOpenInterest`  
**Description:** Executes the GetOpenInterest action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| ExpiryDate | String | Yes |  | string |
| NumberofStrikes | Integer | Yes |  | 2255 |

**Sample Request:**

```json
{
  "StockName": "string",
  "ExpiryDate": "string",
  "NumberofStrikes": 2255
}
```

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 7381,
  "Message": "strin",
  "Result": [
    {
      "Strike": "string",
      "CallOI": "string",
      "PutOI": "string",
      "LTP": "string",
      "Callltp": 5817.208516544605,
      "Putltp": 3096.556035929039,
      "Token": 7509,
      "FeedTime": "2014-05-04T02:24:41.990Z"
    },
    {
      "Strike": "string",
      "CallOI": "string",
      "PutOI": "string",
      "LTP": "string",
      "Callltp": 1654.5301111964038,
      "Putltp": 5139.698597117055,
      "Token": 7657,
      "FeedTime": "1989-05-10T07:07:17.281Z"
    }
  ]
}
```

---

<a id="report-260"></a>

### SectorialChartAnalysis

#### 1. SectorialChartAnalysis

**Method:** `GET`  
**Endpoint:** `/api/MMI/SectorialChartAnalysis`  
**Description:** Executes the SectorialChartAnalysis action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6116,
  "Message": "string",
  "Result": [
    {
      "Token": 1263,
      "ScripName": "string",
      "SpotPrice": 4429.245016668116,
      "SpotChange": 3000.5876554662314,
      "SpotChangePer": 1412.5715820222729,
      "Volume": 2322.571369138784,
      "Segment": "string"
    },
    {
      "Token": 4824,
      "ScripName": "string",
      "SpotPrice": 2447.3120288999507,
      "SpotChange": 9932.45524106709,
      "SpotChangePer": 9679.839393523727,
      "Volume": 1819.2243271454122,
      "Segment": "string"
    }
  ]
}
```

---

<a id="report-261"></a>

### UnderlyingSideBar

#### 1. UnderlyingSideBar

**Method:** `POST`  
**Endpoint:** `/api/MMI/UnderlyingSideBar`  
**Description:** Executes the UnderlyingSideBar action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Scriptname | String | Yes |  | string |

**Sample Request:**

```json
{
  "Scriptname": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

<a id="report-262"></a>

### UnderlyingMainChart

#### 1. UnderlyingMainChart

**Method:** `POST`  
**Endpoint:** `/api/MMI/UnderlyingMainChart`  
**Description:** Executes the UnderlyingMainChart action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| StockName | String | Yes |  | string |
| FilterForGraph | String | Yes |  | string |

**Sample Request:**

```json
{
  "StockName": "string",
  "FilterForGraph": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

<a id="report-263"></a>

### IndicesChartData

#### 1. IndicesChartData

**Method:** `GET`  
**Endpoint:** `/api/MMI/IndicesChartData`  
**Description:** Executes the IndicesChartData action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

<a id="report-264"></a>

### GetHeaderFeeds

#### 1. GetHeaderFeeds

**Method:** `GET`  
**Endpoint:** `/api/MMI/GetHeaderFeeds`  
**Description:** Executes the GetHeaderFeeds action.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 2706,
  "Message": "",
  "Result": [
    {
      "contrct": {
        "Scrip": "string",
        "Expiry": "string",
        "Strike": 3389.985912830109,
        "CP": "string",
        "Token": 9623,
        "Instrument": "string",
        "FeedSegment": "string"
      },
      "LTP": 6979.721461194501,
      "FeedTime": "1975-12-22T14:52:46.509Z",
      "OI": 4159.125508793877,
      "Volume": 9943,
      "ChangePrice": 7315.522868775952,
      "ChangePercent": 4164.095961078282
    },
    {
      "contrct": {
        "Scrip": "string",
        "Expiry": "string",
        "Strike": 8202.16373898133,
        "CP": "string",
        "Token": 4981,
        "Instrument": "string",
        "FeedSegment": "string"
      },
      "LTP": 821.7019275405479,
      "FeedTime": "2020-04-11T12:39:42.894Z",
      "OI": 1178.1097849320888,
      "Volume": 9899,
      "ChangePrice": 6555.642049568626,
      "ChangePercent": 2579.364177252521
    }
  ]
}
```

---

<a id="report-265"></a>

### MarketMoodIndex

#### 1. MarketMoodIndex

**Method:** `POST`  
**Endpoint:** `/api/MMI/MarketMoodIndex`  
**Description:** Executes the MarketMoodIndex action.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {}
}
```

---

# Summary

## General

<a id="report-266"></a>

### GetSummaryYesterdayClosing

#### 1. GetSummaryYesterdayClosing

**Method:** `GET`  
**Endpoint:** `/api/Summary/GetSummaryYesterdayClosing`  
**Description:** Get yesterday closing summary.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4287,
  "Message": "string",
  "Result": [
    {
      "ScripName": "string",
      "CurrentOI": 5546.711294638778,
      "PreviousOI": 8448.725858988071,
      "Message": "string"
    },
    {
      "ScripName": "string",
      "CurrentOI": 7678.333629945493,
      "PreviousOI": 9365.668380164056,
      "Message": "string"
    }
  ]
}
```

---

<a id="report-267"></a>

### GetSummaryYesterdayIVRank

#### 1. GetSummaryYesterdayIVRank

**Method:** `GET`  
**Endpoint:** `/api/Summary/GetSummaryYesterdayIVRank`  
**Description:** Get yesterday IV rank summary.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 4287,
  "Message": "string",
  "Result": [
    {
      "ScripName": "string",
      "CurrentOI": 5546.711294638778,
      "PreviousOI": 8448.725858988071,
      "Message": "string"
    },
    {
      "ScripName": "string",
      "CurrentOI": 7678.333629945493,
      "PreviousOI": 9365.668380164056,
      "Message": "string"
    }
  ]
}
```

---

<a id="report-268"></a>

### GetSummaryTodaysOpening

#### 1. GetSummaryTodaysOpening

**Method:** `GET`  
**Endpoint:** `/api/Summary/GetSummaryTodaysOpening`  
**Description:** Get today's opening summary.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 7342,
  "Message": "string",
  "Result": {
    "IndexSummaries": [
      {
        "ScripName": "string",
        "LTP": 2738.8616527656295,
        "LTPChange": 6860.232097976799,
        "LTPPercent": 4599.37164002302
      },
      {
        "ScripName": "string",
        "LTP": 3517.4366307593764,
        "LTPChange": 9266.658690406346,
        "LTPPercent": 8684.828800699916
      }
    ],
    "StockSummaries": [
      {
        "Token": 3708,
        "ScripName": "string",
        "TChangePer": 5883.156684443254
      },
      {
        "Token": 6242,
        "ScripName": "string",
        "TChangePer": 4088.820455089324
      }
    ]
  }
}
```

---

# Watchlist

## Watchlist

<a id="report-269"></a>

### SaveWatchlistSymbol

#### 1. SaveWatchlistSymbol

**Method:** `POST`  
**Endpoint:** `/api/WatchList/Savewatchlistsymbol`  
**Description:** Executes the SaveWatchlistSymbol action under the Watchlist module.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| ScripName | String | Yes |  | string |
| WatchID | String | Yes |  | string |
| Expiry | String | Yes |  | string |
| Strike | String | Yes |  | string |
| SCP | String | Yes |  | string |
| Token | String | Yes |  | string |
| Instrument | String | Yes |  | string |
| Loginid | Integer | Yes |  | 8953 |
| WatchlistName | String | Yes |  | string |

**Sample Request:**

```json
{
  "ScripName": "string",
  "WatchID": "string",
  "Expiry": "string",
  "Strike": "string",
  "SCP": "string",
  "Token": "string",
  "Instrument": "string",
  "Loginid": 8953,
  "WatchlistName": "string"
}
```

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": "Already Added"
}
```

---

<a id="report-270"></a>

### RemoveWatchlistSymbol

#### 1. RemoveWatchlistSymbol

**Method:** `POST`  
**Endpoint:** `/api/WatchList/Removewatchlistsymbol`  
**Description:** The UpdateWatchList API allows users to update an existing watchlist. Users can rename the watchlist, modify watchlist details, or update specific properties associated with the watchlist. GetWatchlistSymbol Description The GetWatchlistSymbol API retrieves the list of symbols (instruments) associated with a specific watchlist for a user. This helps users view the symbols they are tracking within their customized watchlists. GetWatchlistNames

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Request Body Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| WatchNameId | String | Yes |  | string |
| WatchSymbol | String | Yes |  | string |
| StreamSym | String | Yes |  | string |
| DispSym | String | Yes |  | string |
| Exchange | String | Yes |  | string |
| UserId | String | Yes |  | strin |
| Loginid | Integer | Yes |  | 1681 |

**Sample Request:**

```json
{
  "WatchNameId": "1",
  "WatchSymbol": "CallOptions",
  "StreamSym": "",
  "DispSym": "",
  "Exchange": "",
  "UserId": "string",
  "Loginid": 28037
}
```

---

<a id="report-271"></a>

### GetWatchlistNames

#### 1. GetWatchlistNames

**Method:** `GET`  
**Endpoint:** `/api/WatchList/GetwatchlistNames`  
**Description:** Executes the GetWatchlistNames action under the Watchlist module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Loginid | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": [
    {
      "WatchlistId": "454",
      "WatchlistName": "CallOptions",
      "WatchlistNamecount": "0",
      "Token": ""
    }
  ]
}
```

---

<a id="report-272"></a>

### SaveWatchListNames

#### 1. SaveWatchListNames

**Method:** `GET`  
**Endpoint:** `/api/WatchList/Savewatchlistname`  
**Description:** Executes the SaveWatchListNames action under the Watchlist module.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| WatchlistName | String | No |  | string |
| Loginid | String | No |  | 32823 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": "Success"
}
```

---

<a id="report-273"></a>

### DeleteWatchlistNames

#### 1. DeleteWatchlistNames

**Method:** `GET`  
**Endpoint:** `/api/WatchList/Deletewatchlistname`  
**Description:** The CheckSymbolInWatchlist API is used to check if a specific symbol is present in a user's watchlist. This API is helpful for verifying symbol existence before adding or performing other operations on the watchlist. PROFILE ChangePasswordProfile

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| WatchNameId | String | No |  | string |
| UserID | String | No |  | string |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": "Success"
}
```

---

<a id="report-274"></a>

### Updatewatchlistsymbol

#### 1. Updatewatchlistsymbol

**Method:** `GET`  
**Endpoint:** `/api/WatchList/Updatewatchlistsymbol`  
**Description:** Update a symbol in the watchlist.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| WatchlistName | String | No |  | string |
| WatchlistId | String | No |  | string |
| Loginid | String | No |  | 4213 |

---

<a id="report-275"></a>

### GetwatchlistSymbol

#### 1. GetwatchlistSymbol

**Method:** `GET`  
**Endpoint:** `/api/WatchList/GetwatchlistSymbol`  
**Description:** Get all symbols in a watchlist.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| watchlistid | String | No |  | string |
| Loginid | String | No |  | string |

---

<a id="report-276"></a>

### CheckSymbolInWatchlist

#### 1. CheckSymbolInWatchlist

**Method:** `GET`  
**Endpoint:** `/api/WatchList/CheckSymbolInWatchlist`  
**Description:** Check if a symbol exists in the watchlist.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| Loginid | String | No |  | 4213 |
| Token | String | No |  | string |

---

# AI Analysis

## General

<a id="report-277"></a>

### 1. Analyze Image

#### 1. AnalyzeImage

**Method:** `POST`  
**Endpoint:** `/api/AIAnalysis/AnalyzeImage`  
**Description:** Analyze an image using AI.

**Headers:**

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Query Parameters:**

| Name | Type | Required | Description | Example |
|------|------|----------|-------------|--------|
| prompt | String | No |  | string |
| page | String | No |  | string |

**Sample Response:**

```json
{
  "Status": false,
  "StatusCode": 6405,
  "Message": "string",
  "Result": "string"
}
```

---

<a id="report-278"></a>

### 2. OpenAI History

#### 1. GetOpenAIHistroy

**Method:** `GET`  
**Endpoint:** `/api/AIAnalysis/GetOpenAIHistroy`  
**Description:** Get OpenAI analysis history.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 6864,
  "Message": "string",
  "Result": [
    {
      "id": 6178,
      "loginid": 6441,
      "prompt": "string",
      "page": "string",
      "response": "string",
      "created_at": "1973-03-12T05:33:51.102Z",
      "history_date": "string"
    },
    {
      "id": 2917,
      "loginid": 8125,
      "prompt": "string",
      "page": "string",
      "response": "string",
      "created_at": "1947-01-12T21:35:13.299Z",
      "history_date": "string"
    }
  ]
}
```

---

<a id="report-279"></a>

### 3. Token & Cleanup

#### 1. GetTokenDetails

**Method:** `GET`  
**Endpoint:** `/api/AIAnalysis/GetTokenDetails`  
**Description:** Get token details for AI analysis.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 6864,
  "Message": "string",
  "Result": [
    {
      "id": 6178,
      "loginid": 6441,
      "prompt": "string",
      "page": "string",
      "response": "string",
      "created_at": "1973-03-12T05:33:51.102Z",
      "history_date": "string"
    },
    {
      "id": 2917,
      "loginid": 8125,
      "prompt": "string",
      "page": "string",
      "response": "string",
      "created_at": "1947-01-12T21:35:13.299Z",
      "history_date": "string"
    }
  ]
}
```

---

#### 2. DeleteOldRecordsForAllUsers

**Method:** `GET`  
**Endpoint:** `/api/AIAnalysis/DeleteOldRecordsForAllUsers`  
**Description:** Delete old AI records for all users.

**Headers:**

| Header | Value |
|--------|-------|
| Accept | text/plain |
| x-bypass | 34f38c9f-a786-4fc4-81e1-b1f1c378d512 |

**Sample Response:**

```json
{
  "Status": true,
  "StatusCode": 6864,
  "Message": "string",
  "Result": [
    {
      "id": 6178,
      "loginid": 6441,
      "prompt": "string",
      "page": "string",
      "response": "string",
      "created_at": "1973-03-12T05:33:51.102Z",
      "history_date": "string"
    },
    {
      "id": 2917,
      "loginid": 8125,
      "prompt": "string",
      "page": "string",
      "response": "string",
      "created_at": "1947-01-12T21:35:13.299Z",
      "history_date": "string"
    }
  ]
}
```

---

