import type {
  ActivityEntry,
  CalendarEvent,
  Customer,
  Invoice,
  KanbanTask,
  MessageReply,
  MessageThread,
  NavItem,
  Notification,
  Order,
  Page,
  Product,
  User,
} from '@/types';
import type { ThemeConfig } from '@/design-system/theme';
import { getDb } from '../db';
import { LowdbRepository } from './base';

export const userRepo = new LowdbRepository<'users', User>('users', ['name', 'email']);
export const customerRepo = new LowdbRepository<'customers', Customer>('customers', [
  'name',
  'email',
  'company',
]);
export const productRepo = new LowdbRepository<'products', Product>('products', ['name', 'sku', 'category']);
export const orderRepo = new LowdbRepository<'orders', Order>('orders', ['reference', 'customerName']);
export const invoiceRepo = new LowdbRepository<'invoices', Invoice>('invoices', ['number', 'customerName']);
export const eventRepo = new LowdbRepository<'events', CalendarEvent>('events', ['title']);
export const taskRepo = new LowdbRepository<'tasks', KanbanTask>('tasks', ['title']);
export const threadRepo = new LowdbRepository<'threads', MessageThread>('threads', ['subject', 'preview']);
export const replyRepo = new LowdbRepository<'replies', MessageReply>('replies', []);
export const notificationRepo = new LowdbRepository<'notifications', Notification>('notifications', ['title']);
export const activityRepo = new LowdbRepository<'activity', ActivityEntry>('activity', ['action', 'target', 'userName']);
export const pageRepo = new LowdbRepository<'pages', Page>('pages', ['title', 'slug']);
export const navigationRepo = new LowdbRepository<'navigation', NavItem>('navigation', ['label']);

/** Theme is a single record, not a collection — bespoke helpers. */
export const themeRepo = {
  async get(): Promise<ThemeConfig> {
    const db = await getDb();
    return db.data.theme;
  },
  async set(next: ThemeConfig): Promise<ThemeConfig> {
    const db = await getDb();
    db.data.theme = next;
    await db.write();
    return next;
  },
};
