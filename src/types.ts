export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Tenant = {
  id: string;
  name: string;
  logo?: string;
  permissions: string[]; // List of menu item IDs allowed for this tenant
};

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tenantIds: string[]; // Projects can be associated with multiple tenants
};

export type System = {
  id: string;
  projectId: string;
  name: string;
  description: string;
};

export type Codebase = {
  id: string;
  systemId: string;
  name: string;
  repoUrl: string;
  language: string;
};

export type Requirement = {
  id: string;
  projectId: string;
  title: string;
  status: 'draft' | 'designing' | 'completed';
  chatHistory: ChatMessage[];
  prototype?: string;
  artifact?: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type Artifact = {
  id: string;
  type: 'requirement' | 'code';
  name: string;
  content: string;
  version: string;
  createdAt: string;
};

export type Deployment = {
  id: string;
  artifactId: string;
  environment: 'test' | 'production';
  status: 'pending' | 'success' | 'failed';
  url?: string;
  deployedAt: string;
};
