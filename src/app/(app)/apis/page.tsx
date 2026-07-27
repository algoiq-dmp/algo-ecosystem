'use client';

import { useState, useMemo } from 'react';
import { nodes } from '@/data/ecosystem';
import {
  FiActivity, FiShield, FiDatabase,
  FiArrowRight, FiCheck, FiAlertCircle,
  FiExternalLink, FiChevronRight, FiChevronDown,
  FiSearch, FiSliders, FiCopy, FiDownload, FiZap,
  FiRadio, FiWifi, FiTarget,
} from 'react-icons/fi';

interface HardcodedApi {
  id: string;
  name: string;
  type: string;
  description: string;
  purpose: string;
  authMethod: string;
  baseUrl: string;
  version: string;
  status: string;
  protocols: string[];
  consumers: string[];
  producers: string[];
  rateLimit: string;
  retryPolicy: string;
  timeout: string;
  endpoints: HardcodedEndpoint[];
}

interface HardcodedEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  exampleRequest: string;
  exampleResponse: string;
  errorCodes: string[];
}

const hardcodedApis: HardcodedApi[] = [
  {
    id: 'websocket-api',
    name: 'WebSocket API',
    type: 'WebSocket Streaming',
    description: 'Real-time streaming API for market data, trades, and alerts over WebSocket connections.',
    purpose: 'Provides low-latency real-time data streams for all frontend applications and trading systems.',
    authMethod: 'JWT Token in connection query params',
    baseUrl: 'wss://ws.algoiq.local/stream',
    version: '3.1.0',
    status: 'online',
    protocols: ['WebSocket', 'WSS'],
    consumers: ['TalkDelta', 'TalkOffice', 'DXCC', 'TalkStrategy App'],
    producers: ['MQ', 'Local WebSocket', 'Feed Server'],
    rateLimit: '100 msg/sec per connection',
    retryPolicy: 'Exponential backoff, max 5 retries',
    timeout: '30s connection timeout',
    endpoints: [
      {
        method: 'GET',
        path: '/ws/connect?token={jwt}&channels=market,order,signal',
        description: 'Establish WebSocket connection and subscribe to data channels.',
        exampleRequest: JSON.stringify({ action: 'subscribe', channels: ['market', 'order', 'signal'], symbols: ['NIFTY', 'BANKNIFTY'] }, null, 2),
        exampleResponse: JSON.stringify({ status: 'connected', clientId: 'ws_abc123', subscribedChannels: ['market', 'order', 'signal'], heartbeat: 30000 }, null, 2),
        errorCodes: ['4001 - Invalid token', '4002 - Channel not available', '4003 - Rate limit exceeded'],
      },
      {
        method: 'GET',
        path: '/ws/subscribe',
        description: 'Subscribe to additional data channels on an active connection.',
        exampleRequest: JSON.stringify({ action: 'subscribe', channels: ['ohlc', 'risk'], symbols: ['NIFTY'] }, null, 2),
        exampleResponse: JSON.stringify({ status: 'ok', addedChannels: ['ohlc', 'risk'] }, null, 2),
        errorCodes: ['4002 - Channel not available', '4004 - Max channels exceeded'],
      },
      {
        method: 'GET',
        path: '/ws/unsubscribe',
        description: 'Unsubscribe from specific data channels.',
        exampleRequest: JSON.stringify({ action: 'unsubscribe', channels: ['risk'] }, null, 2),
        exampleResponse: JSON.stringify({ status: 'ok', removedChannels: ['risk'] }, null, 2),
        errorCodes: ['4005 - Channel not subscribed'],
      },
    ],
  },
  {
    id: 'mq-topics',
    name: 'MQ Topics',
    type: 'Message Queue',
    description: 'RabbitMQ-based pub/sub message broker topics for inter-service communication.',
    purpose: 'Central message bus for all ecosystem components to publish and subscribe to data streams.',
    authMethod: 'Username/Password + VHost',
    baseUrl: 'amqp://mq.algoiq.local:5672',
    version: '5.1.3',
    status: 'online',
    protocols: ['AMQP', 'MQ'],
    consumers: ['All Engines', 'All Products', 'Local WebSocket'],
    producers: ['Feed Server', 'Vega', 'Ganesh', 'Suchak', 'Kavach'],
    rateLimit: '10,000 msg/sec per queue',
    retryPolicy: 'DLQ with 3 retries, 5s interval',
    timeout: '10s message TTL',
    endpoints: [
      {
        method: 'POST',
        path: '/exchange/market.data/publish',
        description: 'Publish market data to the market data exchange.',
        exampleRequest: JSON.stringify({ exchange: 'market.data', routingKey: 'nifty.spot', payload: { symbol: 'NIFTY', ltp: 22450.25, volume: 125000 }, timestamp: '2026-07-22T10:15:00Z' }, null, 2),
        exampleResponse: JSON.stringify({ status: 'published', messageId: 'msg_789xyz', timestamp: '2026-07-22T10:15:00.123Z' }, null, 2),
        errorCodes: ['5001 - Exchange not found', '5002 - Routing error', '5003 - Payload too large'],
      },
      {
        method: 'GET',
        path: '/queue/market.data.nifty/consume',
        description: 'Consume messages from a specific queue.',
        exampleRequest: JSON.stringify({ queue: 'market.data.nifty', prefetch: 100, ackMode: 'auto' }, null, 2),
        exampleResponse: JSON.stringify({ status: 'consuming', queue: 'market.data.nifty', messageCount: 50 }, null, 2),
        errorCodes: ['5004 - Queue not found', '5005 - Consumer limit reached'],
      },
      {
        method: 'POST',
        path: '/queue/{queueName}/ack',
        description: 'Acknowledge message processing.',
        exampleRequest: JSON.stringify({ messageIds: ['msg_789xyz', 'msg_790abc'], status: 'processed' }, null, 2),
        exampleResponse: JSON.stringify({ status: 'acknowledged', count: 2 }, null, 2),
        errorCodes: ['5006 - Invalid message ID', '5007 - Already acknowledged'],
      },
    ],
  },
  {
    id: 'broker-apis-hc',
    name: 'Broker APIs',
    type: 'External REST',
    description: 'External broker APIs for order routing, position fetching, and trade execution.',
    purpose: 'Connect to multiple brokers for order execution and position management.',
    authMethod: 'API Key + Access Token',
    baseUrl: 'https://api.{broker}.com/v2',
    version: 'Multi-version',
    status: 'online',
    protocols: ['REST', 'FIX'],
    consumers: ['Vega', 'TalkOffice', 'DXCC'],
    producers: ['Broker Systems'],
    rateLimit: '10 req/sec per API key',
    retryPolicy: '2 retries with 1s delay',
    timeout: '15s',
    endpoints: [
      {
        method: 'POST',
        path: '/order/place',
        description: 'Place a new order with the broker.',
        exampleRequest: JSON.stringify({ symbol: 'NIFTY2472422500CE', exchange: 'NFO', transactionType: 'BUY', quantity: 50, productType: 'MIS', orderType: 'LIMIT', price: 245.50, triggerPrice: 0 }, null, 2),
        exampleResponse: JSON.stringify({ status: 'success', orderId: 'ORD2026072210145', message: 'Order placed successfully', brokerOrderId: 'ZER_ORD_123456' }, null, 2),
        errorCodes: ['1001 - Invalid symbol', '1002 - Insufficient margin', '1003 - Market closed', '1004 - Position limit exceeded'],
      },
      {
        method: 'GET',
        path: '/order/status/{orderId}',
        description: 'Get the status of a placed order.',
        exampleRequest: JSON.stringify({ orderId: 'ORD2026072210145' }, null, 2),
        exampleResponse: JSON.stringify({ orderId: 'ORD2026072210145', status: 'COMPLETE', filledQuantity: 50, averagePrice: 245.40, pendingQuantity: 0, exchangeOrderId: 'NSE_ORD_789' }, null, 2),
        errorCodes: ['1005 - Order not found', '1006 - Unauthorized'],
      },
      {
        method: 'GET',
        path: '/positions',
        description: 'Fetch current positions across all segments.',
        exampleRequest: JSON.stringify({ segments: ['NFO', 'EQ'] }, null, 2),
        exampleResponse: JSON.stringify({ positions: [{ symbol: 'NIFTY2472422500CE', quantity: 50, averagePrice: 245.40, ltp: 248.00, pnl: 130, segment: 'NFO' }], totalPnL: 130 }, null, 2),
        errorCodes: ['1006 - Unauthorized', '1007 - Session expired'],
      },
      {
        method: 'POST',
        path: '/order/modify',
        description: 'Modify an existing pending order.',
        exampleRequest: JSON.stringify({ orderId: 'ORD2026072210145', quantity: 75, price: 246.00, orderType: 'LIMIT' }, null, 2),
        exampleResponse: JSON.stringify({ status: 'success', orderId: 'ORD2026072210145', message: 'Order modified successfully' }, null, 2),
        errorCodes: ['1008 - Order already executed', '1009 - Modification not allowed'],
      },
      {
        method: 'DELETE',
        path: '/order/cancel/{orderId}',
        description: 'Cancel a pending order.',
        exampleRequest: JSON.stringify({ orderId: 'ORD2026072210145' }, null, 2),
        exampleResponse: JSON.stringify({ status: 'success', orderId: 'ORD2026072210145', message: 'Order cancelled' }, null, 2),
        errorCodes: ['1008 - Order already executed', '1010 - Cancel rejected by exchange'],
      },
    ],
  },
  {
    id: 'xts-apis',
    name: 'XTS APIs',
    type: 'Trading Platform REST',
    description: 'XTS trading platform APIs for advanced order types, basket orders, and DMA execution.',
    purpose: 'Provides direct market access and advanced order capabilities via XTS platform.',
    authMethod: 'App Key + Secret Key HMAC',
    baseUrl: 'https://xts-api.algoiq.local/api',
    version: '4.2.0',
    status: 'online',
    protocols: ['REST', 'WebSocket'],
    consumers: ['Vega', 'ODIN', 'Hanuman'],
    producers: ['XTS Platform'],
    rateLimit: '50 req/sec',
    retryPolicy: '3 retries with exponential backoff',
    timeout: '20s',
    endpoints: [
      {
        method: 'POST',
        path: '/api/order/place',
        description: 'Place an order through XTS platform with advanced order types.',
        exampleRequest: JSON.stringify({ exchangeSegment: 'NSEFO', exchangeInstrumentId: 47211, orderType: 'LIMIT', productType: 'NRML', orderSide: 'BUY', quantity: 50, limitPrice: 245.50, disclosedQuantity: 0, timeInForce: 'DAY' }, null, 2),
        exampleResponse: JSON.stringify({ type: 'success', result: { appOrderId: 1234567890, orderUniqueIdentifier: 'XTSUID_abc123', clientId: 'CLIENT001' } }, null, 2),
        errorCodes: ['201 - Invalid instrument', '202 - Order rejected', '203 - Rate limited'],
      },
      {
        method: 'POST',
        path: '/api/order/basket',
        description: 'Place a basket/multi-leg order.',
        exampleRequest: JSON.stringify({ basketName: 'Straddle_Nifty_Aug', orders: [{ exchangeSegment: 'NSEFO', exchangeInstrumentId: 47211, orderSide: 'BUY', quantity: 50 }, { exchangeSegment: 'NSEFO', exchangeInstrumentId: 47212, orderSide: 'SELL', quantity: 50 }], executionStrategy: 'ALL_OR_NONE' }, null, 2),
        exampleResponse: JSON.stringify({ type: 'success', result: { basketId: 'BASKET_456', orders: [{ appOrderId: 1, status: 'PENDING' }, { appOrderId: 2, status: 'PENDING' }] } }, null, 2),
        errorCodes: ['204 - Basket validation failed', '205 - Incomplete order details'],
      },
      {
        method: 'GET',
        path: '/api/order/history',
        description: 'Get order history with filters.',
        exampleRequest: JSON.stringify({ from: '2026-07-01T00:00:00Z', to: '2026-07-22T23:59:59Z', status: 'FILLED', limit: 100 }, null, 2),
        exampleResponse: JSON.stringify({ type: 'success', result: { orders: [{ appOrderId: 123456, status: 'FILLED', filledQuantity: 50, averagePrice: 245.40, exchangeTransactTime: '2026-07-22T10:15:00Z' }], total: 1 } }, null, 2),
        errorCodes: ['206 - Invalid date range', '207 - Too many results'],
      },
    ],
  },
  {
    id: 'margin-calculator-apis',
    name: 'Margin Calculator APIs',
    type: 'Calculation Service REST',
    description: 'APIs for calculating SPAN and exposure margins for options, futures, and multi-leg strategies.',
    purpose: 'Provides pre-trade margin estimation for risk management and position sizing.',
    authMethod: 'API Key in Header',
    baseUrl: 'https://margin.algoiq.local/api',
    version: '2.5.0',
    status: 'online',
    protocols: ['REST'],
    consumers: ['TalkOffice', 'Kavach', 'Rakshak', 'Strategy Factory'],
    producers: ['Surya', 'Exchange'],
    rateLimit: '30 req/sec',
    retryPolicy: '2 retries',
    timeout: '10s',
    endpoints: [
      {
        method: 'POST',
        path: '/api/margin/calculate',
        description: 'Calculate margin requirement for a given position or strategy.',
        exampleRequest: JSON.stringify({ segment: 'NFO', positions: [{ symbol: 'NIFTY2472422500CE', quantity: 50, side: 'SELL', productType: 'NRML' }, { symbol: 'NIFTY2472422600CE', quantity: 50, side: 'BUY', productType: 'NRML' }], spanFileName: 'NFO_22072026.spn' }, null, 2),
        exampleResponse: JSON.stringify({ status: 'success', margin: { span: 85000, exposure: 12000, total: 97000, benefit: 30000, netMargin: 67000 }, calculationTime: '0.12s', timestamp: '2026-07-22T10:15:00Z' }, null, 2),
        errorCodes: ['3001 - Invalid symbol', '3002 - SPAN file not found', '3003 - Position limit exceeded'],
      },
      {
        method: 'POST',
        path: '/api/margin/portfolio',
        description: 'Calculate total portfolio margin across all positions.',
        exampleRequest: JSON.stringify({ positions: [{ symbol: 'NIFTY2472422500CE', quantity: -50, productType: 'NRML' }, { symbol: 'NIFTY2472422600PE', quantity: -50, productType: 'NRML' }, { symbol: 'BANKNIFTY247245000CE', quantity: -25, productType: 'NRML' }], spanFileName: 'NFO_22072026.spn' }, null, 2),
        exampleResponse: JSON.stringify({ status: 'success', totalMargin: 215000, breakdown: { span: 180000, exposure: 35000, netPremium: 0, additionalMargin: 0 }, utilizedCapital: '43%', timestamp: '2026-07-22T10:15:00Z' }, null, 2),
        errorCodes: ['3004 - Portfolio too large', '3005 - Invalid segment combination'],
      },
      {
        method: 'GET',
        path: '/api/margin/span-files',
        description: 'List available SPAN margin files.',
        exampleRequest: JSON.stringify({ segment: 'NFO', date: '2026-07-22' }, null, 2),
        exampleResponse: JSON.stringify({ status: 'success', files: [{ name: 'NFO_22072026.spn', date: '2026-07-22', uploadedAt: '2026-07-22T08:30:00Z' }, { name: 'CDS_22072026.spn', date: '2026-07-22', uploadedAt: '2026-07-22T08:30:00Z' }] }, null, 2),
        errorCodes: ['3006 - No files found for date'],
      },
      {
        method: 'POST',
        path: '/api/margin/strategy-optimizer',
        description: 'Find optimal strike selection to minimize margin requirement.',
        exampleRequest: JSON.stringify({ strategy: 'IRON_CONDOR', underlying: 'NIFTY', expiryDate: '2026-08-27', targetReturn: 2.5, maxMargin: 100000 }, null, 2),
        exampleResponse: JSON.stringify({ status: 'success', optimalStrikes: { shortCall: 22800, longCall: 22850, shortPut: 22200, longPut: 22150 }, estimatedMargin: 72000, creditReceived: 1850, maxRisk: 3150, recommendations: ['Wider wings reduce margin', 'Consider weekly expiry for lower margin'] }, null, 2),
        errorCodes: ['3007 - Unsupported strategy', '3008 - No valid strikes found'],
      },
    ],
  },
];

const apiNodes = nodes.filter((n) => n.type === 'api');

const methodColors: Record<string, string> = {
  GET: 'bg-green-500',
  POST: 'bg-blue-500',
  PUT: 'bg-yellow-500',
  DELETE: 'bg-red-500',
  PATCH: 'bg-purple-500',
};

export default function ApisPage() {
  const [search, setSearch] = useState('');
  const [selectedApi, setSelectedApi] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const allApis = useMemo(() => {
    const fromNodes = apiNodes.map((n) => ({
      id: n.id,
      name: n.name,
      type: 'REST API',
      description: n.description,
      purpose: n.purpose,
      authMethod: 'API Key / JWT',
      baseUrl: `https://${n.id}.algoiq.local/api`,
      version: n.version,
      status: n.status,
      protocols: Object.entries(n.communication)
        .filter(([, v]) => v)
        .map(([k]) => k.toUpperCase()),
      consumers: n.consumers,
      producers: n.receivesFrom,
      rateLimit: '50 req/sec',
      retryPolicy: '3 retries with exponential backoff',
      timeout: '15s',
      endpoints: [
        {
          method: 'GET' as const,
          path: `/api/${n.id}/status`,
          description: `Get ${n.name} service health and status.`,
          exampleRequest: JSON.stringify({}, null, 2),
          exampleResponse: JSON.stringify({ status: 'healthy', version: n.version, uptime: '45d 12h 33m', health: n.health }, null, 2),
          errorCodes: ['503 - Service Unavailable', '500 - Internal Error'],
        },
        {
          method: 'GET' as const,
          path: `/api/${n.id}/data`,
          description: `Fetch data from ${n.name} service.`,
          exampleRequest: JSON.stringify({ symbols: ['NIFTY'], from: '2026-07-01', to: '2026-07-22' }, null, 2),
          exampleResponse: JSON.stringify({ status: 'success', data: [{ symbol: 'NIFTY', value: 22450.25, timestamp: '2026-07-22T10:15:00Z' }], count: 1 }, null, 2),
          errorCodes: ['400 - Bad Request', '401 - Unauthorized', '404 - Not Found'],
        },
        {
          method: 'POST' as const,
          path: `/api/${n.id}/query`,
          description: `Submit a query to ${n.name} service.`,
          exampleRequest: JSON.stringify({ query: 'latest', params: { limit: 10 } }, null, 2),
          exampleResponse: JSON.stringify({ status: 'success', results: [], total: 0, processedAt: '2026-07-22T10:15:00Z' }, null, 2),
          errorCodes: ['400 - Invalid query', '429 - Rate limited'],
        },
      ],
    }));
    return [...fromNodes, ...hardcodedApis];
  }, []);

  const filtered = useMemo(() => {
    return allApis.filter((api) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        api.name.toLowerCase().includes(q) ||
        api.description.toLowerCase().includes(q) ||
        api.type.toLowerCase().includes(q);
      const matchType = typeFilter === 'all' || api.type.toLowerCase().includes(typeFilter.toLowerCase());
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  const apiDetail = selectedApi
    ? allApis.find((a) => a.id === selectedApi)
    : null;

  const types = useMemo(() => [...new Set(allApis.map((a) => a.type))], [allApis]);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FiActivity className="text-2xl text-cyan-400" />
          <h1 className="text-3xl font-bold">API Explorer</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Explore all REST APIs, WebSocket streams, and messaging endpoints in the ecosystem
        </p>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[280px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search APIs by name, type, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}
            >
              All
            </button>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === t ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* API Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((api) => (
            <div
              key={api.id}
              onClick={() => setSelectedApi(api.id)}
              className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 cursor-pointer hover:border-cyan-500/50 hover:bg-gray-800 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors">
                    {api.name}
                  </h3>
                  <p className="text-xs text-gray-500">{api.type}</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-700 rounded-full">
                  <span className="text-xs text-cyan-400 font-mono">{api.endpoints.length} endpoints</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {api.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {api.protocols.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 bg-cyan-900/30 text-cyan-300 rounded text-xs"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Consumers</p>
                <div className="flex flex-wrap gap-1">
                  {api.consumers.slice(0, 4).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300">
                      {c}
                    </span>
                  ))}
                  {api.consumers.length > 4 && (
                    <span className="text-xs text-gray-500">+{api.consumers.length - 4}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <span className="text-xs text-gray-500">v{api.version}</span>
                <span className="inline-flex items-center gap-1 text-cyan-400 text-sm group-hover:gap-2 transition-all">
                  Explore <FiChevronRight />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {apiDetail && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedApi(null);
          }}
        >
          <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl my-8">
            <button
              onClick={() => setSelectedApi(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl z-10"
            >
              &times;
            </button>

            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">{apiDetail.name}</h2>
                  <p className="text-sm text-gray-400">{apiDetail.type} &middot; v{apiDetail.version}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors">
                  <FiDownload /> Download Postman Collection
                </button>
              </div>

              {/* Purpose & Auth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Purpose</p>
                  <p className="text-sm text-gray-300">{apiDetail.purpose}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Authentication</p>
                  <p className="text-sm text-gray-300">{apiDetail.authMethod}</p>
                </div>
              </div>

              {/* Base URL */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <p className="text-xs font-medium text-gray-500 mb-1">Base URL</p>
                <code className="text-green-400 text-sm font-mono">{apiDetail.baseUrl}</code>
              </div>

              {/* Consumers / Producers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-xs font-medium text-green-400 mb-2">PRODUCERS</p>
                  <div className="flex flex-wrap gap-1">
                    {apiDetail.producers.map((p, i) => (
                      <span key={i} className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-xs font-medium text-blue-400 mb-2">CONSUMERS</p>
                  <div className="flex flex-wrap gap-1">
                    {apiDetail.consumers.map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rate Limits & Policies */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500">Rate Limit</p>
                  <p className="text-sm text-gray-300">{apiDetail.rateLimit}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500">Retry Policy</p>
                  <p className="text-sm text-gray-300">{apiDetail.retryPolicy}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500">Timeout</p>
                  <p className="text-sm text-gray-300">{apiDetail.timeout}</p>
                </div>
              </div>

              {/* Communication Protocols */}
              <div className="mb-8">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Communication Protocols</p>
                <div className="flex flex-wrap gap-2">
                  {apiDetail.protocols.map((p) => (
                    <span key={p} className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded text-sm">{p}</span>
                  ))}
                </div>
              </div>

              {/* Endpoints */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Endpoints ({apiDetail.endpoints.length})
                </h3>
                <div className="space-y-6">
                  {apiDetail.endpoints.map((ep, i) => (
                    <EndpointDetail key={i} endpoint={ep} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EndpointDetail({ endpoint }: { endpoint: HardcodedEndpoint }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-800 transition-colors"
      >
        <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${methodColors[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <code className="text-green-400 text-sm font-mono flex-1">{endpoint.path}</code>
        <span className="text-gray-400">
          {open ? <FiChevronDown /> : <FiChevronRight />}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-gray-300">{endpoint.description}</p>

          <div>
            <p className="text-xs font-medium text-blue-400 mb-2">Example Request</p>
            <pre className="bg-gray-950 border border-gray-700 rounded-lg p-4 overflow-x-auto">
              <code className="text-green-400 text-sm font-mono whitespace-pre">{endpoint.exampleRequest}</code>
            </pre>
          </div>

          <div>
            <p className="text-xs font-medium text-yellow-400 mb-2">Example Response</p>
            <pre className="bg-gray-950 border border-gray-700 rounded-lg p-4 overflow-x-auto">
              <code className="text-green-400 text-sm font-mono whitespace-pre">{endpoint.exampleResponse}</code>
            </pre>
          </div>

          <div>
            <p className="text-xs font-medium text-red-400 mb-2">Error Codes</p>
            <div className="space-y-1">
              {endpoint.errorCodes.map((ec, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <FiAlertCircle className="text-red-400 flex-shrink-0" size={14} />
                  <span className="text-red-300">{ec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
