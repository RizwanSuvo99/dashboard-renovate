import { JSONFilePreset } from 'lowdb/node';
import path from 'node:path';
import fs from 'node:fs';
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

export interface DbSchema {
  users: User[];
  customers: Customer[];
  products: Product[];
  orders: Order[];
  invoices: Invoice[];
  events: CalendarEvent[];
  tasks: KanbanTask[];
  threads: MessageThread[];
  replies: MessageReply[];
  notifications: Notification[];
  activity: ActivityEntry[];
  pages: Page[];
  navigation: NavItem[];
  theme: ThemeConfig;
}

const defaultData: DbSchema = {
  users: [],
  customers: [],
  products: [],
  orders: [],
  invoices: [],
  events: [],
  tasks: [],
  threads: [],
  replies: [],
  notifications: [],
  activity: [],
  pages: [],
  navigation: [],
  theme: {
    mode: 'system',
    presetId: 'emerald',
    radius: 'md',
    fontFamilyId: 'inter',
    sidebar: 'expanded',
    brandName: 'Renovate',
  },
};

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

let dbPromise: ReturnType<typeof JSONFilePreset<DbSchema>> | null = null;

/** Returns the memoized lowdb instance. Auto-creates the file on first call. */
export function getDb() {
  if (!dbPromise) {
    ensureDir();
    dbPromise = JSONFilePreset<DbSchema>(DB_FILE, defaultData);
  }
  return dbPromise;
}

/** For tests/seed only — drop the in-memory cache. */
export function _resetDbForTests() {
  dbPromise = null;
}
