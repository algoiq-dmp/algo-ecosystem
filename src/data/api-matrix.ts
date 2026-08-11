export interface ApiMatrixEntry {
  sr: number;
  name: string;
  status: 'Required' | 'In Progress' | 'Pending';
  priority: 'Go-Live Critical' | 'High Priority' | 'Pending / Next Release';
  primaryPurpose: string;
  consumedBy: string[];
  sendsDataTo: string[];
  communicationType: string;
  keyDataExchanged: string;
  businessUse: string;
  authMethod: string;
  baseUrl: string;
  version: string;
}

export interface ApiFlowEdge {
  source: string;
  target: string;
  label: string;
  type: 'push' | 'pull' | 'two-way' | 'pub-sub';
}

export const apiMatrix: ApiMatrixEntry[] = [
  {
    sr: 1,
    name: 'Surya Engine API',
    status: 'Required',
    priority: 'Go-Live Critical',
    primaryPurpose: 'Exchange file distribution & BOD/EOD services',
    consumedBy: ['Lakshmi', 'Vega', 'Suchak', 'Garuda', 'Kavach', 'Manthan', 'Chitragupta', 'Simulator', 'DXCC', 'Kuber Alpha', 'TalkDelta AI'],
    sendsDataTo: ['All dependent engines'],
    communicationType: 'Pull + Push',
    keyDataExchanged: 'Contract master, token files, span files, exposure files, bhavcopy, holiday files',
    businessUse: 'Single source of exchange reference data',
    authMethod: 'API Key',
    baseUrl: '/api/v1/surya',
    version: '3.5.0',
  },
  {
    sr: 2,
    name: 'Ganesh Engine API',
    status: 'Required',
    priority: 'Go-Live Critical',
    primaryPurpose: 'Historical OHLC data provider',
    consumedBy: ['Simulator', 'Suchak', 'Delta XI', 'VYUH', 'SpreadWatch', 'TalkDelta AI', 'AALAP Calls'],
    sendsDataTo: ['Analytics engines'],
    communicationType: 'Pull',
    keyDataExchanged: '1 sec, 1 min, 5 min, 15 min, daily OHLC',
    businessUse: 'Backtesting, analytics, signal generation',
    authMethod: 'API Key',
    baseUrl: '/api/v1/ganesh',
    version: '2.6.1',
  },
  {
    sr: 3,
    name: 'TalkOptions API',
    status: 'Required',
    priority: 'High Priority',
    primaryPurpose: 'Options analytics platform',
    consumedBy: ['Delta XI', 'VYUH', 'SpreadWatch', 'TalkDelta AI', 'AALAP Calls', 'Garuda', 'Kuber Alpha'],
    sendsDataTo: ['Strategy engines'],
    communicationType: 'Pull',
    keyDataExchanged: 'IV, Greeks, OI, PCR, IV Rank, IV Percentile',
    businessUse: 'Options intelligence and signal generation',
    authMethod: 'API Key',
    baseUrl: '/api/v1/talkoptions',
    version: '4.7.2',
  },
  {
    sr: 4,
    name: 'Suchak ↔ Kuber Alpha API',
    status: 'Required',
    priority: 'High Priority',
    primaryPurpose: 'Technical intelligence engine (two-way)',
    consumedBy: ['Kuber Alpha'],
    sendsDataTo: ['Suchak'],
    communicationType: 'Two-way',
    keyDataExchanged: 'Technical signals, indicators, trend state, strategy feedback',
    businessUse: 'Technical signal orchestration',
    authMethod: 'API Key + JWT',
    baseUrl: '/api/v1/suchak',
    version: '5.0.0',
  },
  {
    sr: 5,
    name: 'Garuda Margin API',
    status: 'Required',
    priority: 'High Priority',
    primaryPurpose: 'Strategy-wise margin calculation',
    consumedBy: ['Vega', 'Kuber Alpha', 'TradePilot', 'DXCC'],
    sendsDataTo: ['Requesting applications'],
    communicationType: 'Request/Response',
    keyDataExchanged: 'Required margin, available margin, basket margin',
    businessUse: 'Pre-trade margin validation',
    authMethod: 'API Key',
    baseUrl: '/api/v1/garuda/margin',
    version: '5.0.0',
  },
  {
    sr: 6,
    name: 'Garuda Margin Intelligence API',
    status: 'Required',
    priority: 'Pending / Next Release',
    primaryPurpose: 'Margin optimization intelligence',
    consumedBy: ['Kuber Alpha', 'Vega', 'DXCC'],
    sendsDataTo: ['Strategy engines'],
    communicationType: 'Request/Response',
    keyDataExchanged: 'Margin efficiency score, hedge suggestions, optimization hints',
    businessUse: 'Capital efficiency',
    authMethod: 'API Key',
    baseUrl: '/api/v1/garuda/intelligence',
    version: '5.0.0',
  },
  {
    sr: 7,
    name: 'TalkDelta API',
    status: 'Required',
    priority: 'High Priority',
    primaryPurpose: 'Trade analytics & position intelligence',
    consumedBy: ['Vega', 'Simulator', 'Kavach', 'Kuber Alpha', 'DXCC'],
    sendsDataTo: ['Analytics consumers'],
    communicationType: 'Two-way',
    keyDataExchanged: 'Executed trades, positions, Greeks, MTM, strategy analytics',
    businessUse: 'Post-trade intelligence',
    authMethod: 'API Key',
    baseUrl: '/api/v1/talkdelta',
    version: '6.0.0-beta',
  },
  {
    sr: 8,
    name: 'Vega TalkStrategy API',
    status: 'Required',
    priority: 'Go-Live Critical',
    primaryPurpose: 'Receive trade signals from strategies',
    consumedBy: ['Kuber Alpha', 'Delta XI', 'VYUH', 'SpreadWatch', 'TalkDelta AI', 'AALAP Calls', 'External strategies'],
    sendsDataTo: ['Vega Engine'],
    communicationType: 'Push',
    keyDataExchanged: 'Strategy ID, symbol, side, qty, SL, target, execution parameters',
    businessUse: 'Standardized order entry API',
    authMethod: 'API Key + JWT',
    baseUrl: '/api/v1/vega/talkstrategy',
    version: '6.3.0',
  },
  {
    sr: 9,
    name: 'Vega Order Processor API',
    status: 'Required',
    priority: 'Go-Live Critical',
    primaryPurpose: 'Execution status & trade distribution',
    consumedBy: ['Broker APIs'],
    sendsDataTo: ['TalkDelta', 'DXCC', 'Kuber Alpha', 'TalkOffice'],
    communicationType: 'Two-way',
    keyDataExchanged: 'Order status, trade confirmation, net positions, trade files',
    businessUse: 'Execution lifecycle management',
    authMethod: 'API Key',
    baseUrl: '/api/v1/vega/orderprocessor',
    version: '6.3.0',
  },
  {
    sr: 10,
    name: 'MQ API',
    status: 'Required',
    priority: 'Go-Live Critical',
    primaryPurpose: 'Internal low-latency message bus',
    consumedBy: ['Lakshmi'],
    sendsDataTo: ['All engines & strategies'],
    communicationType: 'Publish/Subscribe',
    keyDataExchanged: 'Tick data, market depth, execution events, alerts',
    businessUse: 'Real-time internal broadcasting',
    authMethod: 'Internal (no external auth)',
    baseUrl: 'amqp://mq.internal',
    version: '1.8.4',
  },
  {
    sr: 11,
    name: 'WebSocket API',
    status: 'Required',
    priority: 'Go-Live Critical',
    primaryPurpose: 'Real-time web streaming',
    consumedBy: ['Lakshmi'],
    sendsDataTo: ['Web applications'],
    communicationType: 'Publish',
    keyDataExchanged: 'Live prices, positions, alerts, analytics',
    businessUse: 'UI real-time updates',
    authMethod: 'JWT',
    baseUrl: 'wss://ws.algoiq.internal',
    version: '2.3.2',
  },
  {
    sr: 12,
    name: 'Lakshmi Engine API',
    status: 'In Progress',
    priority: 'Go-Live Critical',
    primaryPurpose: 'Enterprise live market data platform',
    consumedBy: ['All current & future strategies'],
    sendsDataTo: ['Strategy ecosystem'],
    communicationType: 'Publish + Pull',
    keyDataExchanged: 'Tick data, LTP, bid/ask, market depth, status',
    businessUse: 'Standard live market data layer',
    authMethod: 'API Key',
    baseUrl: '/api/v1/lakshmi',
    version: '3.0.0',
  },
  {
    sr: 13,
    name: 'Kavach ↔ Kuber Alpha API',
    status: 'Pending',
    priority: 'Pending / Next Release',
    primaryPurpose: 'Risk management orchestration (two-way)',
    consumedBy: ['Kuber Alpha'],
    sendsDataTo: ['Kavach'],
    communicationType: 'Two-way',
    keyDataExchanged: 'Risk alerts, hedge actions, exposure limits, square-off commands',
    businessUse: 'Real-time risk control',
    authMethod: 'API Key + JWT',
    baseUrl: '/api/v1/kavach',
    version: '3.5.0',
  },
  {
    sr: 14,
    name: 'Manthan API',
    status: 'Pending',
    priority: 'Pending / Next Release',
    primaryPurpose: 'Portfolio & strategy intelligence',
    consumedBy: ['Kuber Alpha', 'DXCC'],
    sendsDataTo: ['Analytics consumers'],
    communicationType: 'Two-way',
    keyDataExchanged: 'Portfolio analytics, churn metrics, optimization insights',
    businessUse: 'Portfolio intelligence',
    authMethod: 'API Key',
    baseUrl: '/api/v1/manthan',
    version: '2.8.1',
  },
];

export const apiFlows: ApiFlowEdge[] = [
  { source: 'Exchange', target: 'Lakshmi', label: 'Market Feed', type: 'push' },
  { source: 'Lakshmi', target: 'MQ', label: 'Tick Broadcast', type: 'pub-sub' },
  { source: 'MQ', target: 'Strategies & Engines', label: 'Real-time Data', type: 'pub-sub' },
  { source: 'Lakshmi', target: 'WebSocket', label: 'Stream', type: 'push' },
  { source: 'WebSocket', target: 'Web Applications', label: 'UI Updates', type: 'push' },
  { source: 'Surya', target: 'All Engines', label: 'BOD/EOD Files', type: 'push' },
  { source: 'Ganesh', target: 'Analytics Engines', label: 'OHLC Data', type: 'pull' },
  { source: 'TalkOptions', target: 'Signal Generators', label: 'Options Analytics', type: 'pull' },
  { source: 'Signal Generators', target: 'Kuber Alpha', label: 'Strategy Signals', type: 'push' },
  { source: 'Kuber Alpha', target: 'Suchak', label: 'Tech Intelligence (2-way)', type: 'two-way' },
  { source: 'Kuber Alpha', target: 'Kavach', label: 'Risk Mgmt (2-way)', type: 'two-way' },
  { source: 'Kuber Alpha', target: 'Garuda', label: 'Margin', type: 'pull' },
  { source: 'Kuber Alpha', target: 'Vega TalkStrategy', label: 'Trade Signals', type: 'push' },
  { source: 'Vega', target: 'Broker APIs', label: 'Orders', type: 'push' },
  { source: 'Broker APIs', target: 'Exchange', label: 'Execution', type: 'push' },
  { source: 'Vega Order Processor', target: 'TalkDelta', label: 'Trade Data', type: 'push' },
  { source: 'Vega Order Processor', target: 'DXCC', label: 'Monitoring', type: 'push' },
  { source: 'Vega Order Processor', target: 'TalkOffice', label: 'Positions', type: 'push' },
  { source: 'Vega Order Processor', target: 'Kuber Alpha', label: 'Confirmations', type: 'push' },
];

export const apiPriorities = ['Go-Live Critical', 'High Priority', 'Pending / Next Release'] as const;
export const apiStatuses = ['Required', 'In Progress', 'Pending'] as const;

export const apiGovernanceFields = [
  'Overview', 'Purpose', 'Authentication', 'Base URL', 'Headers',
  'Request format', 'Response format', 'Error codes', 'Retry policy',
  'Rate limits', 'Timeout values', 'Webhook events', 'Sample requests',
  'Sample responses', 'Sequence diagrams', 'Dependency matrix',
  'Versioning policy', 'Changelog', 'Testing checklist',
  'Security considerations', 'Production readiness checklist',
] as const;

export interface ApiPricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  currency: string;
  includedApiCalls: number;
  additionalCallPrice: number;
  includedApis: string[];
  features: string[];
  targetAudience: string;
  status: 'active' | 'planned';
}

export const apiPricingPlans: ApiPricingPlan[] = [
  {
    id: 'trader-basic',
    name: 'Trader Basic',
    monthlyPrice: 499,
    currency: 'INR',
    includedApiCalls: 500,
    additionalCallPrice: 0.75,
    includedApis: ['Ganesh Engine API', 'Surya Engine API', 'Garuda Margin API'],
    features: [
      'Historical OHLC data from Ganesh',
      'BOD/EOD exchange files from Surya',
      'Pre-trade margin calculation via Garuda',
      'API Key authentication',
      '500 free API calls per month',
      '₹0.75 per additional API call',
      'Email support (24hr response)',
    ],
    targetAudience: 'External Traders, Retail Algo Developers, Independent Strategists',
    status: 'active',
  },
];
