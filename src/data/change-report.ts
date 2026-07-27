export const changeReport = {
  generatedAt: new Date().toISOString(),
  summary: 'Comprehensive ecosystem-wide architecture update based on today\'s architectural decisions',
  changes: [
    {
      component: 'Vega Engine',
      type: 'restructured',
      description: 'Redefined as combination of 4 integrated components: Order Processor, Broker Integration, TalkStrategy App (middleware), and TalkStrategy API',
      impact: ['Topology', 'Architecture Explorer', 'Product Documentation', 'API Documentation', 'Dependency Graph', 'Knowledge Base'],
      status: 'applied'
    },
    {
      component: 'Surya',
      type: 'enhanced',
      description: 'Became Enterprise Exchange File Acquisition & Distribution Platform. Single source of truth for all exchange files. No engine or product downloads directly. Supports 18+ file types.',
      impact: ['Topology connections added to all engines/products', 'Knowledge Base', 'File catalogue documentation'],
      status: 'applied'
    },
    {
      component: 'Narad',
      type: 'enhanced',
      description: 'Expanded to Universal Connectivity & Infrastructure Management Platform with service registry, tunnel management, port registry, deployment management, configuration management, remote commands, log collection, and version management',
      impact: ['Topology', 'Knowledge Base', 'Architecture Explorer'],
      status: 'applied'
    },
    {
      component: 'Suraksha',
      type: 'enhanced',
      description: 'Expanded to Universal Security Layer with secrets management, certificate management, threat detection, security monitoring, and compliance enforcement',
      impact: ['Topology', 'Knowledge Base', 'Security documentation'],
      status: 'applied'
    },
    {
      component: 'TalkOffice',
      type: 'modified',
      description: 'Removed all direct TalkDelta dependencies. Now communicates only with Vega Engine for trade confirmations and position data',
      impact: ['Dependency Matrix', 'Topology connections removed', 'Architecture Explorer', 'Knowledge Base'],
      status: 'applied'
    },
    {
      component: 'TalkDelta',
      type: 'enhanced',
      description: 'Now receives trade/order/position updates only from Vega. Publishes APIs for delta calculations and portfolio analytics to Kavach, Rakshak, Strategy Factory, Kuber Alpha, Delta XI, VYUH, SpreadWatch, and TalkDelta AI',
      impact: ['API Documentation', 'Knowledge Base', 'Dependency Graph'],
      status: 'applied'
    },
    {
      component: 'Parikshak',
      type: 'enhanced',
      description: 'Expanded to Enterprise Testing Platform covering all products, engines, APIs, deployments, and releases. Generates test reports, checklists, regression, readiness, performance, and security reports',
      impact: ['Topology connections added', 'Knowledge Base', 'Testing documentation'],
      status: 'applied'
    },
    {
      component: 'Topology Diagram',
      type: 'updated',
      description: 'Type filter bar added allowing users to show/hide Products, Engines, APIs, Infrastructure, Strategies, Exchange, and Broker categories. All node data, connections, and server zones updated to reflect new architecture.',
      impact: ['Home page', 'Interactive topology'],
      status: 'applied'
    },
    {
      component: 'Documentation',
      type: 'expanded',
      description: '35+ new KB documents added across Surya (4), Narad (5), Suraksha (3), TalkDelta (3), Parikshak (3), Vega (11), TalkStrategy API (2), TalkStrategy App (3), TalkOffice (2). All existing documents updated to reflect current architecture.',
      impact: ['Knowledge Base Explorer', 'Documentation Explorer'],
      status: 'applied'
    }
  ],
  connectionChanges: {
    added: 'Surya→all engines/products (28 connections), Narad→all components (30+), Suraksha→all components (30+), Parikshak→all products/engines (22+), TalkDelta→downstream engines (5 new API routes)',
    removed: 'TalkOffice→TalkDelta, TalkDelta→TalkOffice, bypass connections from strategies directly to Vega',
    modified: 'TalkStrategy API→TalkStrategy App→Vega (new middleware path)'
  },
  topologyStats: {
    totalNodes: 33,
    totalConnections: 130,
    servers: 5,
    activeVersions: 4
  }
};
