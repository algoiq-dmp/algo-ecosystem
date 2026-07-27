export interface KnowledgeDocument {
  title: string;
  type: 'BRS' | 'SRS' | 'HLD' | 'LLD' | 'API_DOC' | 'DB_DOC' | 'DEPLOY' | 'DEVOPS' | 'INSTALL' | 'USER' | 'ADMIN' | 'TROUBLESHOOT' | 'FAQ' | 'RELEASE' | 'KB' | 'TEST' | 'AUDIT' | 'LICENSE';
  status: 'complete' | 'in-progress' | 'draft' | 'planned';
  url: string;
}

export interface KnowledgeBaseEntry {
  id: string;
  entityId: string;
  entityName: string;
  documents: KnowledgeDocument[];
}

export const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: 'KB-001',
    entityId: 'ENT-GANESH',
    entityName: 'Ganesh',
    documents: [
      { title: 'Ganesh OHLC Engine - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/brs-ohlc-engine' },
      { title: 'Ganesh OHLC Engine - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/srs-ohlc-engine' },
      { title: 'Ganesh OHLC Engine - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/hld-ohlc-engine' },
      { title: 'Ganesh Tick Processing Pipeline - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/lld-tick-pipeline' },
      { title: 'Ganesh REST API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/api-reference' },
      { title: 'Ganesh Database Schema', type: 'DB_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/db-schema' },
      { title: 'Ganesh Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/deployment-guide' },
      { title: 'Ganesh Operations & DevOps Manual', type: 'DEVOPS', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/devops-manual' },
      { title: 'Ganesh Troubleshooting Guide', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/troubleshooting' },
      { title: 'Ganesh FAQ', type: 'FAQ', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/faq' },
      { title: 'Ganesh v2.1.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/ganesh/release-2.1.0' },
      { title: 'Ganesh Pre-Production Validation Test Plan', type: 'TEST', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/ganesh/test-plan' }
    ]
  },
  {
    id: 'KB-002',
    entityId: 'ENT-SURYA',
    entityName: 'Surya',
    documents: [
      { title: 'Surya BOD/EOD File Processor - Business Requirements', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/brs-bod-eod' },
      { title: 'Surya Exchange File Distribution - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/srs-file-distribution' },
      { title: 'Surya Single-Source Exchange File Architecture - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/hld-single-source' },
      { title: 'Surya File Customization Per Engine - LLD', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/lld-file-customization' },
      { title: 'Surya File Distribution API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/api-reference' },
      { title: 'Surya Database Schema for File Processing', type: 'DB_DOC', status: 'draft', url: 'https://docs.algoiq.internal/kb/surya/db-schema' },
      { title: 'Surya Security Token File Processing Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/kb-security-tokens' },
      { title: 'Surya Contract File Processing Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/kb-contracts' },
      { title: 'Surya Span & Exposure Margin Calculation', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/kb-margin' },
      { title: 'Surya File Ingestion from Exchange Extranet', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/deploy-exchange-ingestion' },
      { title: 'Surya Configuration Guide per Engine', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/admin-config' },
      { title: 'Surya v2.4.1 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/release-2.4.1' },
      { title: 'Surya File Catalogue - All Supported Exchange Files', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/kb-file-catalogue' },
      { title: 'Surya File Acquisition & Distribution Architecture', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/hld-file-acquisition' },
      { title: 'Surya Single Source Policy - No Direct Downloads', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/kb-single-source-policy' },
      { title: 'Surya File Validation & Normalization Pipeline', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/surya/lld-validation' },
    ]
  },
  {
    id: 'KB-003',
    entityId: 'ENT-VEGA',
    entityName: 'Vega',
    documents: [
      { title: 'Vega Engine - 4-Component Architecture Overview', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/hld-architecture' },
      { title: 'Vega Order Processor - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/srs-order-processor' },
      { title: 'Vega Broker Integration - XTS & Greeksoft Credential Management', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/lld-broker-integration' },
      { title: 'Vega Fund Allocation Engine - Multi-Broker Distribution', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/lld-fund-allocation' },
      { title: 'Vega Order Processing Pipeline - LLD', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/lld-order-pipeline' },
      { title: 'Vega Trade Confirmation API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/api-confirmation' },
      { title: 'Vega Order Flow: API→Middleware→Processor→Broker Integration→Exchange', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/kb-order-flow' },
      { title: 'Vega Broker Credential Setup Guide (XTS/Greeksoft)', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/admin-broker-credentials' },
      { title: 'Vega Deployment Guide - All 4 Components', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/deploy-all-components' },
      { title: 'Vega v6.3.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/release-6.3.0' },
      { title: 'Vega Security Requirements', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/vega/hld-security' }
    ]
  },
  {
    id: 'KB-004',
    entityId: 'ENT-TALKDELTA',
    entityName: 'TalkDelta AI',
    documents: [
      { title: 'TalkDelta AI ML Strategy Engine - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/brs-ml-engine' },
      { title: 'TalkDelta AI ML Infrastructure - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/srs-ml-infra' },
      { title: 'TalkDelta AI Infrastructure - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/hld-ml-infra' },
      { title: 'TalkDelta AI Model Serving - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/lld-model-serving' },
      { title: 'TalkDelta AI Regime Detection Model - Low-Level Design', type: 'LLD', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/talkdelta/lld-regime-detection' },
      { title: 'TalkDelta AI Strategy API Reference v2', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/api-reference-v2' },
      { title: 'TalkDelta AI Feature Store Schema', type: 'DB_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/feature-store-schema' },
      { title: 'TalkDelta AI GPU Cluster Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/gpu-deployment' },
      { title: 'TalkDelta AI Model Training Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/model-training-guide' },
      { title: 'TalkDelta AI v1.2.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/release-1.2.0' },
      { title: 'TalkDelta AI Model Performance Validation Tests', type: 'TEST', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/talkdelta/model-validation-tests' },
      { title: 'TalkDelta Strategy API Integration Guide', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/api-strategy-integration' },
      { title: 'TalkDelta Delta Calculation Signal Output', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/hld-delta-signals' },
      { title: 'TalkDelta Vega Trade Data Processing', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/lld-vega-processing' },
      { title: 'TalkDelta Delta Calculation API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/api-delta-calculations' },
      { title: 'TalkDelta Portfolio Analytics API for Downstream Engines', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/api-portfolio-analytics' },
      { title: 'TalkDelta Strategy Synchronization Architecture', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/hld-strategy-sync' },
    ]
  },
  {
    id: 'KB-005',
    entityId: 'ENT-TALKOPTIONS',
    entityName: 'TalkOptions',
    documents: [
      { title: 'TalkOptions API Gateway - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/brs-api-gateway' },
      { title: 'TalkOptions 150+ API Platform - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/srs-api-platform' },
      { title: 'TalkOptions API Gateway - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/hld-api-gateway' },
      { title: 'TalkOptions Market Data API v3 - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/market-data-api-v3' },
      { title: 'TalkOptions Options Chain API - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/options-chain-api' },
      { title: 'TalkOptions Greeks & Analytics API - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/greeks-api' },
      { title: 'TalkOptions Margin Calculator API - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/margin-api' },
      { title: 'TalkOptions Historical Data API - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/historical-api' },
      { title: 'TalkOptions WebSocket Streaming Guide', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/websocket-guide' },
      { title: 'TalkOptions Deployment & Scaling Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/deployment-guide' },
      { title: 'TalkOptions Developer Portal & SDK Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoptions/developer-portal' },
      { title: 'TalkOptions v3.0.0 API Migration Guide', type: 'RELEASE', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/talkoptions/migration-v3' }
    ]
  },
  {
    id: 'KB-006',
    entityId: 'ENT-TALKOFFICE',
    entityName: 'TalkOffice',
    documents: [
      { title: 'TalkOffice RMS (Vega Sole Trade Confirmation) - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/brs-rms' },
      { title: 'TalkOffice RMS (Vega Sole Trade Confirmation) - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/srs-rms' },
      { title: 'TalkOffice RMS - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/hld-rms' },
      { title: 'TalkOffice Trader Dashboard - User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/user-guide-trader' },
      { title: 'TalkOffice Risk Manager Console - User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/user-guide-risk' },
      { title: 'TalkOffice Administrator Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/admin-guide' },
      { title: 'TalkOffice Compliance & Regulatory Reporting Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/compliance-guide' },
      { title: 'TalkOffice Database Schema', type: 'DB_DOC', status: 'draft', url: 'https://docs.algoiq.internal/kb/talkoffice/db-schema' },
      { title: 'TalkOffice Deployment & Configuration Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/deployment-guide' },
      { title: 'TalkOffice v2.5.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/release-2.5.0' },
      { title: 'TalkOffice Vega-Only Integration Architecture', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/hld-vega-only' },
      { title: 'TalkOffice OMS-RMS Configuration for Vega', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkoffice/admin-vega-config' }
    ]
  },
  {
    id: 'KB-007',
    entityId: 'ENT-SUCHAK',
    entityName: 'Suchak',
    documents: [
      { title: 'Suchak Event Detection Engine - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/suchak/brs-event-engine' },
      { title: 'Suchak Event Detection Engine - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/suchak/srs-event-engine' },
      { title: 'Suchak NLP Pipeline - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/suchak/hld-nlp-pipeline' },
      { title: 'Suchak Event API Reference v2', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/suchak/api-reference-v2' },
      { title: 'Suchak Corporate Action Processor - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/suchak/lld-corporate-actions' },
      { title: 'Suchak News Source Integration Guide', type: 'INSTALL', status: 'complete', url: 'https://docs.algoiq.internal/kb/suchak/news-source-integration' },
      { title: 'Suchak Troubleshooting Guide', type: 'TROUBLESHOOT', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/suchak/troubleshooting' },
      { title: 'Suchak v2.3.1 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/suchak/release-2.3.1' }
    ]
  },
  {
    id: 'KB-008',
    entityId: 'ENT-KAVACH',
    entityName: 'Kavach',
    documents: [
      { title: 'Kavach Circuit Breaker & Kill Switch - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/kavach/brs-circuit-breaker' },
      { title: 'Kavach System Health Monitor - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/kavach/srs-health-monitor' },
      { title: 'Kavach Health Monitoring - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/kavach/hld-health-monitor' },
      { title: 'Kavach Kill Switch Architecture - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/kavach/lld-kill-switch' },
      { title: 'Kavach Health Check API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/kavach/api-reference' },
      { title: 'Kavach Alert Configuration Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/kavach/alert-config' },
      { title: 'Kavach Emergency Procedures Manual', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/kavach/emergency-procedures' },
      { title: 'Kavach v1.8.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/kavach/release-1.8.0' }
    ]
  },
  {
    id: 'KB-009',
    entityId: 'ENT-RAKSHAK',
    entityName: 'Rakshak',
    documents: [
      { title: 'Rakshak Identity & Access Management - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/brs-iam' },
      { title: 'Rakshak Security Architecture - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/srs-security' },
      { title: 'Rakshak Authentication Service - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/hld-auth-service' },
      { title: 'Rakshak mTLS Certificate Authority - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/lld-mtls-ca' },
      { title: 'Rakshak RBAC Authorization Model', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/lld-rbac' },
      { title: 'Rakshak API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/api-reference' },
      { title: 'Rakshak Security Audit Log Reference', type: 'AUDIT', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/audit-log' },
      { title: 'Rakshak Administrator Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/admin-guide' },
      { title: 'Rakshak v2.0.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/rakshak/release-2.0.0' },
      { title: 'Rakshak Penetration Test Report Q4 2025', type: 'TEST', status: 'planned', url: 'https://docs.algoiq.internal/kb/rakshak/pentest-q4-2025' }
    ]
  },
  {
    id: 'KB-010',
    entityId: 'ENT-CHITRAGUPTA',
    entityName: 'Chitragupta',
    documents: [
      { title: 'Chitragupta Accounting & P&L - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/chitragupta/brs-accounting' },
      { title: 'Chitragupta Audit Trail - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/chitragupta/srs-audit' },
      { title: 'Chitragupta Trade Recording Engine - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/chitragupta/hld-trade-recording' },
      { title: 'Chitragupta P&L Calculation - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/chitragupta/lld-pnl-calc' },
      { title: 'Chitragupta Reporting API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/chitragupta/api-reference' },
      { title: 'Chitragupta Database Schema & Partitioning', type: 'DB_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/chitragupta/db-schema' },
      { title: 'Chitragupta Regulatory Audit Export Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/chitragupta/audit-export' },
      { title: 'Chitragupta SEBI Trade Log Format Reference', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/chitragupta/sebi-trade-log' },
      { title: 'Chitragupta v3.0.0 Release Notes', type: 'RELEASE', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/chitragupta/release-3.0.0' }
    ]
  },
  {
    id: 'KB-011',
    entityId: 'ENT-NARAD',
    entityName: 'Narad',
    documents: [
      { title: 'Narad Connectivity Hub - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/brs-connectivity-hub' },
      { title: 'Narad Connectivity Hub - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/srs-connectivity-hub' },
      { title: 'Narad Connectivity Hub - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/hld-connectivity-hub' },
      { title: 'Narad FIX Protocol Adapter - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/lld-fix-adapter' },
      { title: 'Narad WebSocket Protocol Adapter - Low-Level Design', type: 'LLD', status: 'draft', url: 'https://docs.algoiq.internal/kb/narad/lld-websocket-adapter' },
      { title: 'Narad Connection Management Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/connection-management' },
      { title: 'Narad Broker Integration Guide', type: 'INSTALL', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/broker-integration' },
      { title: 'Narad Troubleshooting Guide', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/troubleshooting' },
      { title: 'Narad v2.0.2 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/release-2.0.2' },
      { title: 'Narad Network Latency SLA Compliance Report', type: 'KB', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/narad/latency-sla-report' },
      { title: 'Narad Universal Connectivity Architecture', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/hld-universal-connectivity' },
      { title: 'Narad Health Monitoring - All Components', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/kb-health-monitoring' },
      { title: 'Narad Deployment Guide - All Servers', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/deploy-all-servers' },
      { title: 'Narad Service Registry Architecture', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/hld-service-registry' },
      { title: 'Narad Tunnel & Port Management Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/admin-tunnels' },
      { title: 'Narad Remote Command & Configuration Management', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/kb-remote-commands' },
      { title: 'Narad Log Collection & Aggregation', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/lld-log-collection' },
      { title: 'Narad Deployment Orchestrator Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/narad/deploy-orchestrator' },
    ]
  },
  {
    id: 'KB-012',
    entityId: 'ENT-SURAKSHA',
    entityName: 'Suraksha',
    documents: [
      { title: 'Suraksha Risk Management - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/brs-risk-mgmt' },
      { title: 'Suraksha Risk Management - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/srs-risk-mgmt' },
      { title: 'Suraksha Risk Engine - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/hld-risk-engine' },
      { title: 'Suraksha Pre-Trade Risk Check - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/lld-pre-trade-risk' },
      { title: 'Suraksha Risk Rule Configuration - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/lld-risk-rules' },
      { title: 'Suraksha Risk API Reference v2', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/api-reference-v2' },
      { title: 'Suraksha Risk Rule Configuration Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/risk-rule-config' },
      { title: 'Suraksha What-If Analysis User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/what-if-guide' },
      { title: 'Suraksha v3.1.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/release-3.1.0' },
      { title: 'Suraksha SEBI Regulatory Compliance Checklist', type: 'AUDIT', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/sebi-compliance' },
      { title: 'Suraksha Risk Limit Stress Testing Framework', type: 'TEST', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/suraksha/stress-test-framework' },
      { title: 'Suraksha Enterprise Security Architecture', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/hld-enterprise-security' },
      { title: 'Suraksha RBAC Configuration Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/admin-rbac-guide' },
      { title: 'Suraksha Secrets & Certificate Management', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/lld-secrets' },
      { title: 'Suraksha Threat Detection & Security Monitoring', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/kb-threat-detection' },
      { title: 'Suraksha Compliance Framework Documentation', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/suraksha/kb-compliance' },
    ]
  },
  {
    id: 'KB-013',
    entityId: 'ENT-KUBERALPHA',
    entityName: 'Kuber Alpha',
    documents: [
      { title: 'Kuber Alpha Order Flow Engine - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/kuber-alpha/brs-order-flow' },
      { title: 'Kuber Alpha Sentiment Engine - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/kuber-alpha/srs-sentiment' },
      { title: 'Kuber Alpha Macro Model - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/kuber-alpha/hld-macro-model' },
      { title: 'Kuber Alpha Order Flow Imbalance - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/kuber-alpha/lld-order-flow-imbalance' },
      { title: 'Kuber Alpha API Reference v3', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/kuber-alpha/api-reference-v3' },
      { title: 'Kuber Alpha Database Schema', type: 'DB_DOC', status: 'draft', url: 'https://docs.algoiq.internal/kb/kuber-alpha/db-schema' },
      { title: 'Kuber Alpha Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/kuber-alpha/deployment-guide' },
      { title: 'Kuber Alpha v2.4.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/kuber-alpha/release-2.4.0' },
      { title: 'Kuber Alpha Institutionals Flow Dashboard User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/kuber-alpha/insti-flow-guide' }
    ]
  },
  {
    id: 'KB-014',
    entityId: 'ENT-STRATEGYFACTORY',
    entityName: 'Strategy Factory',
    documents: [
      { title: 'Strategy Factory Platform - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-factory/brs-platform' },
      { title: 'Strategy Factory Creator Studio - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-factory/srs-creator' },
      { title: 'Strategy Factory - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-factory/hld-platform' },
      { title: 'Strategy Factory Backtest Engine - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-factory/lld-backtest-engine' },
      { title: 'Strategy Factory Strategy Creator Studio - User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-factory/user-guide-creator' },
      { title: 'Strategy Factory Backtest Configuration Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-factory/backtest-config' },
      { title: 'Strategy Factory API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-factory/api-reference' },
      { title: 'Strategy Factory Deployment & Approval Workflow', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-factory/deployment-workflow' },
      { title: 'Strategy Factory v4.0.0 Release Notes', type: 'RELEASE', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/strategy-factory/release-4.0.0' }
    ]
  },
  {
    id: 'KB-015',
    entityId: 'ENT-DXCC',
    entityName: 'DXCC',
    documents: [
      { title: 'DXCC Command Center - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/brs-command-center' },
      { title: 'DXCC Command Center - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/srs-command-center' },
      { title: 'DXCC Command Center - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/hld-command-center' },
      { title: 'DXCC Operator Dashboard - User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/user-guide-operator' },
      { title: 'DXCC Strategy Control Panel - User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/user-guide-strategy-control' },
      { title: 'DXCC Alert Management - Administrator Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/admin-alert-mgmt' },
      { title: 'DXCC Incident Response Playbook', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/incident-playbook' },
      { title: 'DXCC Dashboard Customization Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/dashboard-customization' },
      { title: 'DXCC v3.2.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/dxcc/release-3.2.0' }
    ]
  },
  {
    id: 'KB-016',
    entityId: 'ENT-SIMULATOR',
    entityName: 'Simulator',
    documents: [
      { title: 'Simulator Platform - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/simulator/brs-platform' },
      { title: 'Simulator Testing Environment - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/simulator/srs-testing-env' },
      { title: 'Simulator Architecture - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/simulator/hld-architecture' },
      { title: 'Simulator Market Data Replay - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/simulator/lld-market-replay' },
      { title: 'Simulator User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/simulator/user-guide' },
      { title: 'Simulator Backtest Configuration Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/simulator/backtest-config' },
      { title: 'Simulator Deployment Guide (Air-Gapped)', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/simulator/deployment-guide' },
      { title: 'Simulator Troubleshooting & Known Issues', type: 'TROUBLESHOOT', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/simulator/troubleshooting' },
      { title: 'Simulator v2.0.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/simulator/release-2.0.0' }
    ]
  },
  {
    id: 'KB-017',
    entityId: 'ENT-TRADEPILOT',
    entityName: 'TradePilot',
    documents: [
      { title: 'TradePilot Trading Terminal - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/tradepilot/brs-terminal' },
      { title: 'TradePilot Multi-Platform - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/tradepilot/srs-multi-platform' },
      { title: 'TradePilot Desktop Application - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/tradepilot/hld-desktop' },
      { title: 'TradePilot Mobile Application - Low-Level Design', type: 'LLD', status: 'draft', url: 'https://docs.algoiq.internal/kb/tradepilot/lld-mobile' },
      { title: 'TradePilot Desktop - User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/tradepilot/user-guide-desktop' },
      { title: 'TradePilot Mobile - User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/tradepilot/user-guide-mobile' },
      { title: 'TradePilot Installation Guide', type: 'INSTALL', status: 'complete', url: 'https://docs.algoiq.internal/kb/tradepilot/install-guide' },
      { title: 'TradePilot Troubleshooting & FAQ', type: 'FAQ', status: 'complete', url: 'https://docs.algoiq.internal/kb/tradepilot/faq' },
      { title: 'TradePilot v5.1.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/tradepilot/release-5.1.0' },
      { title: 'TradePilot End-to-End Integration Test Suite', type: 'TEST', status: 'planned', url: 'https://docs.algoiq.internal/kb/tradepilot/e2e-test-suite' }
    ]
  },
  {
    id: 'KB-018',
    entityId: 'ENT-PARIKSHAK',
    entityName: 'Parikshak',
    documents: [
      { title: 'Parikshak Validation Framework - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/brs-validation' },
      { title: 'Parikshak Certification Engine - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/srs-certification' },
      { title: 'Parikshak Certification Engine - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/hld-certification' },
      { title: 'Parikshak Test Scenario Runner - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/lld-test-runner' },
      { title: 'Parikshak Strategy Certification Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/certification-guide' },
      { title: 'Parikshak Test Scenario Authoring Guide', type: 'ADMIN', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/scenario-authoring' },
      { title: 'Parikshak v1.3.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/release-1.3.0' },
      { title: 'Parikshak Universal Test Framework', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/srs-universal-test' },
      { title: 'Parikshak Test Reports - All Products', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/kb-all-products' },
      { title: 'Parikshak Engine Certification Checklist', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/kb-engine-checklist' },
      { title: 'Parikshak Tool Validation Reports', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/kb-tool-reports' },
      { title: 'Parikshak Release Certification Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/user-release-certification' },
      { title: 'Parikshak Performance Testing Report Template', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/kb-performance-template' },
      { title: 'Parikshak Security Vulnerability Assessment Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/kb-security-assessment' },
      { title: 'Parikshak Release Readiness Checklist', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/parikshak/kb-readiness-checklist' },
    ]
  },
  {
    id: 'KB-019',
    entityId: 'ENT-DELTAXI',
    entityName: 'Delta XI',
    documents: [
      { title: 'Delta XI Analytics Engine - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/brs-analytics' },
      { title: 'Delta XI Greeks & Volatility - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/srs-greeks' },
      { title: 'Delta XI Analytics Engine - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/hld-analytics' },
      { title: 'Delta XI Options Greeks Calculator - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/lld-greeks-calc' },
      { title: 'Delta XI IV Surface Builder - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/lld-iv-surface' },
      { title: 'Delta XI Cointegration Engine - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/lld-cointegration' },
      { title: 'Delta XI Analytics API Reference v2', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/api-reference-v2' },
      { title: 'Delta XI Technical Indicators Library Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/technical-indicators' },
      { title: 'Delta XI Database Schema', type: 'DB_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/db-schema' },
      { title: 'Delta XI Deployment & Tuning Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/deployment-guide' },
      { title: 'Delta XI v4.0.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/release-4.0.0' },
      { title: 'Delta XI Performance Benchmark Report', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/delta-xi/benchmark-report' }
    ]
  },
  {
    id: 'KB-020',
    entityId: 'ENT-VYUH',
    entityName: 'VYUH',
    documents: [
      { title: 'VYUH Strategy Orchestrator - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/brs-orchestrator' },
      { title: 'VYUH Strategy Orchestrator - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/srs-orchestrator' },
      { title: 'VYUH Strategy Orchestrator - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/hld-orchestrator' },
      { title: 'VYUH Strategy State Machine - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/lld-strategy-state-machine' },
      { title: 'VYUH Signal Aggregation Engine - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/lld-signal-aggregation' },
      { title: 'VYUH Strategy API Reference v2', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/api-reference-v2' },
      { title: 'VYUH Strategy Developer Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/strategy-dev-guide' },
      { title: 'VYUH Deployment & Scaling Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/deployment-guide' },
      { title: 'VYUH Troubleshooting Guide', type: 'TROUBLESHOOT', status: 'in-progress', url: 'https://docs.algoiq.internal/kb/vyuh/troubleshooting' },
      { title: 'VYUH v3.0.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/release-3.0.0' },
      { title: 'VYUH Strategy Migration Guide v2 to v3', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/vyuh/migration-v2-v3' }
    ]
  },
  {
    id: 'KB-021',
    entityId: 'ENT-SPREADWATCH',
    entityName: 'SpreadWatch',
    documents: [
      { title: 'SpreadWatch Arbitrage Detection - Business Requirements Specification', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/spreadwatch/brs-arbitrage' },
      { title: 'SpreadWatch Spread Engine - System Requirements Specification', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/spreadwatch/srs-spread' },
      { title: 'SpreadWatch Arbitrage Engine - High-Level Design', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/spreadwatch/hld-arb-engine' },
      { title: 'SpreadWatch Spread Deviation Detector - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/spreadwatch/lld-spread-deviation' },
      { title: 'SpreadWatch Arb Detection API Reference v1', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/spreadwatch/api-reference-v1' },
      { title: 'SpreadWatch Database Schema', type: 'DB_DOC', status: 'draft', url: 'https://docs.algoiq.internal/kb/spreadwatch/db-schema' },
      { title: 'SpreadWatch Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/spreadwatch/deployment-guide' },
      { title: 'SpreadWatch v1.0.0 Release Notes', type: 'RELEASE', status: 'complete', url: 'https://docs.algoiq.internal/kb/spreadwatch/release-1.0.0' },
      { title: 'SpreadWatch Correlation Matrix Configuration', type: 'KB', status: 'planned', url: 'https://docs.algoiq.internal/kb/spreadwatch/correlation-config' }
    ]
  },
  {
    id: 'KB-022',
    entityId: 'ENT-TALKSTRATEGYAPI',
    entityName: 'TalkStrategy API',
    documents: [
      { title: 'TalkStrategy API - Trade Firing Interface from Strategies', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/hld-trade-firing' },
      { title: 'TalkStrategy API - Strategy & Engine Integration Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/kb-strategy-integration' },
      { title: 'TalkStrategy API - Business Requirements', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/brs' },
      { title: 'TalkStrategy API - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/srs' },
      { title: 'TalkStrategy API - Low-Level Design', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/lld' },
      { title: 'TalkStrategy API - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/api' },
      { title: 'TalkStrategy API - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/deploy' },
      { title: 'TalkStrategy API - Troubleshooting & FAQ', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/troubleshoot' },
      { title: 'TalkStrategy API - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-api/license' },
    ]
  },
  {
    id: 'KB-023',
    entityId: 'ENT-TALKSTRATEGYAPP',
    entityName: 'TalkStrategy App',
    documents: [
      { title: 'TalkStrategy App - Middleware Architecture Connecting API to Vega', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-app/hld-middleware' },
      { title: 'TalkStrategy App - Order Routing Between API and Order Processor', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-app/lld-routing' },
      { title: 'TalkStrategy App - Business Requirements', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-app/brs-middleware' },
      { title: 'TalkStrategy App - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-app/srs' },
      { title: 'TalkStrategy App - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-app/api' },
      { title: 'TalkStrategy App - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-app/deploy' },
      { title: 'TalkStrategy App - Troubleshooting & FAQ', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-app/troubleshoot' },
      { title: 'TalkStrategy App - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkstrategy-app/license' },
    ]
  },
  {
    id: 'KB-024',
    entityId: 'ENT-PRINCIPLES',
    entityName: 'Ecosystem Principles',
    documents: [
      { title: '100 Most Important Points of the Algo IQ Ecosystem', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/100-points' },
      { title: 'Ecosystem Architecture Governance Standards', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/governance-standards' },
      { title: 'Single Source of Truth Policy', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/single-source-policy' },
      { title: 'Modular Architecture Guidelines', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/modular-guidelines' },
      { title: 'New Component Integration Checklist', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/integration-checklist' },
      { title: 'Security & Compliance Standards', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/security-standards' },
      { title: 'Deployment & Operations Standards', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/deployment-standards' },
      { title: 'Documentation & Versioning Policy', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/documentation-policy' },
      { title: 'Ecosystem Scalability & Monitoring Standards', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/principles/scalability-standards' },
    ]
  },
  {
    id: 'KB-025',
    entityId: 'ENT-ENGINE-REF',
    entityName: 'Engine Reference',
    documents: [
      { title: 'Complete Engine Reference Guide - 34 Engines, APIs & Products', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/reference/engine-guide' },
      { title: 'Strategy Lifecycle: Build → Test → Simulate → Deploy → Go-Live', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/reference/strategy-lifecycle' },
      { title: 'Critical Engines Quick Reference', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/reference/critical-engines' },
    ]
  },
  {
    id: 'KB-026',
    entityId: 'ENT-STRATEGY-LIFECYCLE',
    entityName: 'Strategy Lifecycle',
    documents: [
      { title: 'Strategy Development & Deployment Pipeline - Complete Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-lifecycle/complete-pipeline' },
      { title: 'Phase 1 - Strategy Builder: Modular Strategy Creation', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-lifecycle/phase1-builder' },
      { title: 'Phase 2 - Parikshak: Testing & Validation', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-lifecycle/phase2-parikshak' },
      { title: 'Phase 3 - Simulator: Replay & Paper Trading', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-lifecycle/phase3-simulator' },
      { title: 'Phase 4 - DXCC: Release Governance & Go-Live', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-lifecycle/phase4-dxcc' },
      { title: 'Phase 5 - Kuber Alpha: Production Deployment', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-lifecycle/phase5-kuber-alpha' },
      { title: 'Execution Flow: TalkStrategy API → App → Vega → Broker → Exchange', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-lifecycle/execution-flow' },
      { title: 'Strategy Lifecycle Architecture Rules', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/strategy-lifecycle/rules' },
    ]
  },
  {
    id: 'KB-027',
    entityId: 'ENT-KILL-SWITCH',
    entityName: 'Kill Switch Architecture',
    documents: [
      { title: 'Three-Layer Emergency Risk Protection System', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/three-layer-system' },
      { title: 'Layer 1 - Kuber Alpha: Strategy Risk Protection (1.01%)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/layer1-kuber-alpha' },
      { title: 'Layer 2 - DXCC: Production Governance Protection (1.05%)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/layer2-dxcc' },
      { title: 'Layer 3 - Vega: Execution Protection (1.50%)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/layer3-vega' },
      { title: 'Emergency Square-Off Workflow', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/square-off-workflow' },
      { title: 'Kill Switch Order Cancellation Process', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/cancellation-process' },
      { title: 'Position Liquidation Logic', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/liquidation-logic' },
      { title: 'Audit & Compliance Logging for Kill Events', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/audit-logging' },
      { title: 'Recovery Procedures After Kill Switch', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/recovery' },
      { title: 'Kill Switch Testing & Validation', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/kill-switch/testing' },
    ]
  },
  {
    id: 'KB-028',
    entityId: 'ENT-LAYERED-ARCH',
    entityName: 'Layered Architecture',
    documents: [
      { title: 'Trading Signal & Strategy Execution Architecture - Complete Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/complete-guide' },
      { title: 'Layer 1 - Core Data Foundation (Lakshmi, Surya, Ganesh, TalkOptions)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/layer1-data' },
      { title: 'Layer 2 - Real-Time Opportunity Generation (Aalap, Delta XI, VYUH, TalkDelta AI)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/layer2-opportunity' },
      { title: 'Layer 3 - Strategy Management (Kuber Alpha - Strategy Hub)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/layer3-strategy' },
      { title: 'Layer 4 - Order Execution (Vega Engine)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/layer4-execution' },
      { title: 'Layer 5 - Trade Governance (DXCC - Operations Manager)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/layer5-governance' },
      { title: 'Development & Testing Layer (Strategy Factory, Simulator, Parikshak)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/dev-test-layer' },
      { title: 'Business & Client Management Layer (TradePilot)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/business-layer' },
      { title: 'End-to-End Trading Flow Diagram', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/e2e-flow' },
      { title: 'Simple Ecosystem Summary - 12 Steps', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/layered-arch/summary' },
    ]
  },
  {
    id: 'KB-029',
    entityId: 'ENT-ECO-SUMMARY',
    entityName: 'Ecosystem Summary',
    documents: [
      { title: 'How the Algo IQ Ecosystem Works - Complete Overview', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/summary/overview' },
      { title: 'The 12-Step Trading Workflow', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/summary/12-step-workflow' },
      { title: 'Engine Roles at a Glance', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/summary/engine-roles' },
      { title: 'Development to Production: Strategy Lifecycle', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/summary/dev-to-prod' },
    ]
  },
  {
    id: 'KB-030',
    entityId: 'ENT-AI-ASSISTANT',
    entityName: 'AI Assistant',
    documents: [
      { title: 'Ask Algo IQ AI - Knowledge Assistant Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/ai-assistant/guide' },
      { title: 'AI Response Format - Executive Summary + Bullet Points + Follow-ups', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/ai-assistant/response-format' },
      { title: 'AI Knowledge Base Integration Architecture', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/ai-assistant/integration' },
    ]
  },
  {
    id: 'KB-031',
    entityId: 'ENT-LAKSHMI',
    entityName: 'Lakshmi',
    documents: [
      { title: 'Lakshmi Engine - Enterprise Real-Time Data Distribution', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/brs-real-time-distribution' },
      { title: 'Lakshmi Engine - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/srs-real-time' },
      { title: 'Lakshmi 4-Component Architecture - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/hld-4-component' },
      { title: 'Lakshmi Feed Server Ingestion Pipeline - LLD', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/lld-feed-pipeline' },
      { title: 'Lakshmi API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/api-reference' },
      { title: 'Lakshmi Database Schema', type: 'DB_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/db-schema' },
      { title: 'Lakshmi Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/deploy-guide' },
      { title: 'Lakshmi User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/user-guide' },
      { title: 'Lakshmi Fault Tolerance & Failover', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/kb-failover' },
      { title: 'Lakshmi License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/lakshmi/license' },
    ]
  },
  {
    id: 'KB-032',
    entityId: 'ENT-FEED-SERVER',
    entityName: 'Feed Server',
    documents: [
      { title: 'Feed Server - Exchange Lease Line Ingestion', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/feed-server/brs-lease-line' },
      { title: 'Feed Server - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/feed-server/srs' },
      { title: 'Feed Server - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/feed-server/hld' },
      { title: 'Feed Server - LLD (Exchange Lease Line Ingestion)', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/feed-server/lld' },
      { title: 'Feed Server - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/feed-server/api' },
      { title: 'Feed Server - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/feed-server/license' },
      { title: 'Feed Server - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/feed-server/deploy' },
      { title: 'Feed Server - Troubleshooting & FAQ', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/feed-server/troubleshoot' },
    ]
  },
  {
    id: 'KB-033',
    entityId: 'ENT-MQ',
    entityName: 'MQ',
    documents: [
      { title: 'MQ - Central Pub/Sub Message Broker', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/mq/brs' },
      { title: 'MQ - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/mq/srs' },
      { title: 'MQ - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/mq/hld' },
      { title: 'MQ - LLD', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/mq/lld' },
      { title: 'MQ - API & Topic Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/mq/api' },
      { title: 'MQ - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/mq/license' },
      { title: 'MQ - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/mq/deploy' },
      { title: 'MQ - Monitoring & Operations', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/mq/kb-monitoring' },
    ]
  },
  {
    id: 'KB-034',
    entityId: 'ENT-MANTHAN',
    entityName: 'Manthan',
    documents: [
      { title: 'Manthan - Market Churning Intelligence Engine', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/manthan/brs' },
      { title: 'Manthan - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/manthan/srs' },
      { title: 'Manthan - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/manthan/hld' },
      { title: 'Manthan - LLD', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/manthan/lld' },
      { title: 'Manthan - Market Regime Classification', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/manthan/kb-regime' },
      { title: 'Manthan - Confidence Scoring Engine', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/manthan/kb-confidence' },
      { title: 'Manthan - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/manthan/license' },
      { title: 'Manthan - Deployment & Operations Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/manthan/deploy' },
    ]
  },
  {
    id: 'KB-035',
    entityId: 'ENT-AALAP',
    entityName: 'AALAP Calls',
    documents: [
      { title: 'AALAP Calls - 15 External Signal Generating Strategies', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/aalap/brs' },
      { title: 'AALAP Calls - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/aalap/srs' },
      { title: 'AALAP Calls - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/aalap/hld' },
      { title: 'AALAP Calls - Signal Generation Architecture', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/aalap/lld' },
      { title: 'AALAP Calls - Signal API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/aalap/api' },
      { title: 'AALAP Calls - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/aalap/license' },
      { title: 'AALAP Calls - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/aalap/deploy' },
      { title: 'AALAP Calls - Signal Quality & Performance', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/aalap/kb-signal-quality' },
    ]
  },
  {
    id: 'KB-036',
    entityId: 'ENT-TALKDELTA',
    entityName: 'TalkDelta',
    documents: [
      { title: 'TalkDelta - Strategy Dashboard & Post-Trade Analytics', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/brs' },
      { title: 'TalkDelta - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/srs' },
      { title: 'TalkDelta - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/hld' },
      { title: 'TalkDelta - Vega Integration & Trade Processing', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/lld-vega' },
      { title: 'TalkDelta - API Reference (Delta Calc, Portfolio Analytics)', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/api' },
      { title: 'TalkDelta - Database Schema', type: 'DB_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/db' },
      { title: 'TalkDelta - User Guide', type: 'USER', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/user' },
      { title: 'TalkDelta - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/talkdelta/license' },
    ]
  },
  {
    id: 'KB-037',
    entityId: 'ENT-LOCAL-WS',
    entityName: 'Local WebSocket',
    documents: [
      { title: 'Local WebSocket - Real-Time Web Streaming Server', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/local-ws/brs' },
      { title: 'Local WebSocket - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/local-ws/srs' },
      { title: 'Local WebSocket - HLD (Lakshmi Sub-Component)', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/local-ws/hld' },
      { title: 'Local WebSocket - LLD', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/local-ws/lld' },
      { title: 'Local WebSocket - API & Stream Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/local-ws/api' },
      { title: 'Local WebSocket - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/local-ws/license' },
      { title: 'Local WebSocket - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/local-ws/deploy' },
      { title: 'Local WebSocket - Troubleshooting', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/local-ws/troubleshoot' },
    ]
  },
  {
    id: 'KB-038',
    entityId: 'ENT-GARUDA',
    entityName: 'Garuda',
    documents: [
      { title: 'Garuda Margin Engine - BRS (Business Requirements)', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/brs' },
      { title: 'Garuda Margin Engine - SRS (System Requirements)', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/srs' },
      { title: 'Garuda Margin Engine - FRD (Functional Requirements)', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/frd' },
      { title: 'Garuda Margin Engine - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/hld' },
      { title: 'Garuda Margin Engine - LLD', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/lld' },
      { title: 'Garuda Margin Engine - Database Schema', type: 'DB_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/db' },
      { title: 'Garuda Margin Engine - Margin Calculation API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/api-margin-calc' },
      { title: 'Garuda Margin Engine - Margin Intelligence API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/api-margin-intel' },
      { title: 'Garuda Margin Engine - WebSocket API', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/api-websocket' },
      { title: 'Garuda Margin Engine - Webhook Specification', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/api-webhook' },
      { title: 'Garuda Margin Engine - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/deploy' },
      { title: 'Garuda Margin Engine - Authentication & Security', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/kb-auth' },
      { title: 'Garuda Margin Engine - Hedge Intelligence Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/kb-hedge' },
      { title: 'Garuda Margin Engine - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda/license' },
    ]
  },
  {
    id: 'KB-039',
    entityId: 'ENT-HANUMAN',
    entityName: 'Hanuman',
    documents: [
      { title: 'Hanuman - 2-Leg Algorithmic Execution Engine', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/hanuman/brs' },
      { title: 'Hanuman - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/hanuman/srs' },
      { title: 'Hanuman - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/hanuman/hld' },
      { title: 'Hanuman - LLD (2-Leg Sync)', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/hanuman/lld' },
      { title: 'Hanuman - Vega Integration API', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/hanuman/api' },
      { title: 'Hanuman - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/hanuman/license' },
      { title: 'Hanuman - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/hanuman/deploy' },
      { title: 'Hanuman - Troubleshooting', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/hanuman/troubleshoot' },
    ]
  },
  {
    id: 'KB-040',
    entityId: 'ENT-THETA-YANTRA',
    entityName: 'Theta Yantra',
    documents: [
      { title: 'Theta Yantra - Advanced Options Analytics Engine', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/theta-yantra/brs' },
      { title: 'Theta Yantra - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/theta-yantra/srs' },
      { title: 'Theta Yantra - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/theta-yantra/hld' },
      { title: 'Theta Yantra - LLD (Greeks & Volatility)', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/theta-yantra/lld' },
      { title: 'Theta Yantra - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/theta-yantra/api' },
      { title: 'Theta Yantra - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/theta-yantra/license' },
      { title: 'Theta Yantra - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/theta-yantra/deploy' },
      { title: 'Theta Yantra - Troubleshooting', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/theta-yantra/troubleshoot' },
    ]
  },
  {
    id: 'KB-041',
    entityId: 'ENT-ODIN',
    entityName: 'ODIN',
    documents: [
      { title: 'ODIN - Order Management & Dealer Terminal', type: 'BRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/odin/brs' },
      { title: 'ODIN - System Requirements', type: 'SRS', status: 'complete', url: 'https://docs.algoiq.internal/kb/odin/srs' },
      { title: 'ODIN - HLD', type: 'HLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/odin/hld' },
      { title: 'ODIN - LLD (FIX Connectivity)', type: 'LLD', status: 'complete', url: 'https://docs.algoiq.internal/kb/odin/lld' },
      { title: 'ODIN - API Reference', type: 'API_DOC', status: 'complete', url: 'https://docs.algoiq.internal/kb/odin/api' },
      { title: 'ODIN - License', type: 'LICENSE', status: 'complete', url: 'https://docs.algoiq.internal/kb/odin/license' },
      { title: 'ODIN - Deployment Guide', type: 'DEPLOY', status: 'complete', url: 'https://docs.algoiq.internal/kb/odin/deploy' },
      { title: 'ODIN - Troubleshooting', type: 'TROUBLESHOOT', status: 'complete', url: 'https://docs.algoiq.internal/kb/odin/troubleshoot' },
    ]
  },
  {
    id: 'KB-042',
    entityId: 'ENT-GARUDA-INTEL',
    entityName: 'Garuda Margin Intelligence',
    documents: [
      { title: 'Margin Intelligence Engine - Architecture Overview', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda-intel/architecture' },
      { title: 'Hedge Optimizer - Technical Specification', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda-intel/hedge-spec' },
      { title: 'Strategy Margin Library - Complete Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda-intel/strategy-library' },
      { title: 'Portfolio Margin Engine - Design Document', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda-intel/portfolio-design' },
      { title: 'Real-Time Margin Engine - Performance Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda-intel/realtime-perf' },
      { title: 'Exchange File Processing - SPAN & Exposure Guide', type: 'KB', status: 'complete', url: 'https://docs.algoiq.internal/kb/garuda-intel/exchange-files' },
    ]
  },
];
