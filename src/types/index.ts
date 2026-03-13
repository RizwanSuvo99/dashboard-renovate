/** Shared domain types. */

export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  avatarUrl?: string | null;
  active: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'pending' | 'churned' | 'lead';
  plan: 'free' | 'pro' | 'enterprise';
  mrr: number;          // USD per month
  joinedAt: string;
  lastActiveAt: string;
  notes?: Note[];
  avatarUrl?: string | null;
  country?: string;
  tags?: string[];
}

export interface Note {
  id: string;
  body: string;
  authorId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'low' | 'out';
  imageUrl?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  reference: string;     // e.g. "ORD-1042"
  customerId: string;
  customerName: string;
  total: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  number: string;        // "INV-202401-001"
  customerId: string;
  customerName: string;
  amount: number;
  status: 'paid' | 'open' | 'overdue' | 'void';
  issuedAt: string;
  dueAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  category: 'meeting' | 'release' | 'review' | 'personal';
  attendees?: string[];
  location?: string;
  description?: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'doing' | 'review' | 'done';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigneeId?: string | null;
  tags?: string[];
  dueAt?: string | null;
  order: number;
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: string[];
  preview: string;
  lastMessageAt: string;
  unread: boolean;
  starred?: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive';
}

export interface MessageReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body?: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  parentId?: string | null;
  order: number;
  group?: 'main' | 'admin' | 'workspace';
}

export interface Page {
  id: string;
  slug: string;          // e.g., "team-dashboard" → /team-dashboard
  title: string;
  icon?: string;
  description?: string;
  layout: 'standard' | 'wide' | 'split';
  widgets: WidgetInstance[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export interface WidgetInstance {
  id: string;
  type: string;          // resolved via WidgetRegistry
  config: Record<string, unknown>;
  span?: 1 | 2 | 3 | 4 | 6 | 12;
}
