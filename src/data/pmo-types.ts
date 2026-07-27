export interface ProductEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  status: 'planning' | 'development' | 'testing' | 'security-review' | 'uat' | 'production' | 'archived';
  owner: string;
  server: string;
  progress: number;
  documentationProgress: number;
  testingProgress: number;
  securityProgress: number;
  devopsProgress: number;
  readiness: 'red' | 'amber' | 'green';
  dependencies: string[];
  features: string[];
  lastUpdated: string;
  releaseTarget: string;
}

export interface DocumentationItem {
  id: string;
  productId: string;
  type: 'architecture' | 'brs' | 'srs' | 'hld' | 'lld' | 'api-docs' | 'db-design' | 'ui-ux' | 'frontend' | 'backend' | 'engine' | 'testing' | 'devops' | 'security' | 'deployment' | 'kb' | 'user-manual' | 'admin-guide' | 'release-notes' | 'license';
  title: string;
  status: 'not-started' | 'in-progress' | 'review' | 'approved' | 'published';
  owner: string;
  completion: number;
  lastUpdated: string;
  reviewer: string;
  comments: string;
}

export interface ReleaseEntry {
  id: string;
  name: string;
  version: string;
  status: 'planned' | 'in-progress' | 'rc' | 'deployed' | 'rolled-back';
  releaseDate: string;
  products: string[];
  description: string;
  releaseNotes: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  rollbackPlan: string;
}

export interface SprintEntry {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  storyPoints: number;
  completedPoints: number;
  tasks: SprintTask[];
}

export interface SprintTask {
  id: string;
  sprintId: string;
  title: string;
  type: 'epic' | 'feature' | 'story' | 'task' | 'subtask' | 'bug' | 'enhancement' | 'tech-debt';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee: string;
  storyPoints: number;
  productId: string;
}

export interface ProductVersion {
  productId: string;
  version: string;
  label: string;
  releaseDate: string;
  changes: string[];
  addedFeatures: string[];
  removedFeatures: string[];
  changedApis: string[];
  changedDependencies: string[];
  changedServers: string[];
  topologySnapshot: string[];
}

export interface VersionDefinition {
  id: string;
  name: string;
  label: string;
  status: 'active' | 'archived' | 'draft';
  releaseDate: string;
  description: string;
  order: number;
}

export interface ProductVersionAssignment {
  productId: string;
  versionId: string;
  active: boolean;
}

export interface ConnectionVersion {
  connectionId: string;
  versionId: string;
  active: boolean;
}

export interface ServerVersion {
  serverId: string;
  versionId: string;
  active: boolean;
}

export interface VersionChange {
  type: 'added' | 'removed' | 'modified' | 'moved';
  productId?: string;
  connectionId?: string;
  serverId?: string;
  description: string;
}
