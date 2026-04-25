export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isSystemAdmin?: boolean;
};

export type Role = {
  id: string;
  name: string;
  permissions: string[]; // Menu IDs
  agentId?: string; // Associated AI agent
};

export type Member = {
  userId: string;
  roleId: string;
  status: 'pending' | 'active';
  isTeamAdmin?: boolean;
};

export type Agent = {
  id: string;
  name: string;
  model: 'claudecode' | 'codex';
  description: string;
};

export type Tenant = {
  id: string;
  name: string;
  logo?: string;
  roles: Role[];
  members: Member[];
  agents: Agent[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tenantIds: string[];
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

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type Comment = {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  attachments: string[]; // List of asset IDs
};

export type Asset = {
  id: string;
  name: string;
  type: string;
  path: string;
  creatorId: string; // User ID or Agent ID
  timestamp: string;
};

export type Requirement = {
  id: string;
  projectId: string;
  title: string;
  status: 'draft' | 'designing' | 'completed';
  chatHistory: ChatMessage[];
  comments: Comment[];
  assets: Asset[];
  prototype?: string;
  artifact?: string;
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
