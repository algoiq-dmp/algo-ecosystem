export interface EcosystemNode {
  id: string;
  name: string;
  alias?: string;
  type: 'product' | 'server' | 'engine' | 'api' | 'database' | 'broker' | 'exchange' | 'infrastructure' | 'strategy';
  server: string;
  ip: string;
  environment: string;
  description: string;
  purpose: string;
  businessValue: string;
  color: string;
  responsibilities: string[];
  sendsTo: string[];
  receivesFrom: string[];
  dataProduced: string[];
  dataConsumed: string[];
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  consumers: string[];
  connectedApplications: string[];
  connectedEngines: string[];
  connectedApis: string[];
  communication: { rest?: boolean; mq?: boolean; websocket?: boolean; tcp?: boolean; fix?: boolean; database?: boolean; internalApi?: boolean };
  databases: string[];
  sourceModules: string[];
  x: number;
  y: number;
  status: 'online' | 'degraded' | 'offline';
  version: string;
  owner: string;
  health: number;
  ports: string;
  readiness: string;
  deploymentStatus: string;
  failureImpact: string;
  futureEnhancements: string;
  documentationUrl: string;
  features: string[];
  category?: string;
  criticality?: 'critical' | 'normal';
  layer?: string;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'market-data' | 'order' | 'trade-confirmation' | 'ohlc' | 'signal' | 'risk' | 'ai' | 'audit' | 'monitoring' | 'api-call' | 'mq-broadcast';
  protocol: 'REST' | 'WebSocket' | 'MQ' | 'TCP' | 'UDP' | 'FIX';
  bidirectional: boolean;
}

export interface ServerGroup {
  id: string;
  name: string;
  ip: string;
  color: string;
  nodes: string[];
}
