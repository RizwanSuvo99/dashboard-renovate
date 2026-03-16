/**
 * Populates /data/db.json with realistic seed data and the default admin
 * account. Idempotent — re-running rewrites the file.
 *
 *   npm run seed
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { defaultTheme } from '../src/design-system/theme';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const NOW = new Date();
const iso = (offsetDays = 0, hour = 9, minute = 0): string => {
  const d = new Date(NOW);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const FIRST = ['Aria', 'Theo', 'Noor', 'Lior', 'Mira', 'Kenji', 'Sana', 'Wren', 'Ines', 'Cyrus', 'Maya', 'Otto', 'Yara', 'Felix', 'Zoya', 'Hana', 'Rafa', 'Pia'];
const LAST = ['Soto', 'Park', 'Mehta', 'Albright', 'Ozdemir', 'Khan', 'Lambert', 'Holm', 'Vargas', 'Caruso', 'Iversen', 'Kapoor', 'Becker', 'Rios'];
const COMPANIES = ['Aperture', 'Northwind', 'Helix Labs', 'Foundry', 'Lumen Co', 'Cascade', 'Ironwood', 'Briar & Co', 'Stagehand', 'Polaris', 'Tellus', 'Arclight', 'Hearth', 'Veld'];
const COUNTRIES = ['United States', 'Germany', 'Japan', 'Brazil', 'Canada', 'India', 'Spain', 'United Kingdom', 'France'];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function makeCustomers(n: number) {
  return Array.from({ length: n }).map((_, i) => {
    const first = pick(FIRST);
    const last = pick(LAST);
    const name = `${first} ${last}`;
    const company = pick(COMPANIES);
    const status = pick(['active', 'active', 'active', 'pending', 'lead', 'churned'] as const);
    const plan = pick(['free', 'pro', 'pro', 'enterprise'] as const);
    return {
      id: `cust_${i + 1}`,
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${company.toLowerCase().replace(/\W+/g, '')}.com`,
      company,
      status,
      plan,
      mrr: plan === 'free' ? 0 : plan === 'pro' ? 49 + Math.floor(Math.random() * 30) : 499 + Math.floor(Math.random() * 800),
      joinedAt: iso(-Math.floor(Math.random() * 540), 10),
      lastActiveAt: iso(-Math.floor(Math.random() * 30), 14),
      country: pick(COUNTRIES),
      tags: Math.random() > 0.5 ? ['priority'] : [],
      avatarUrl: null,
      notes: Math.random() > 0.7 ? [
        { id: uuid(), body: 'Onboarding call scheduled for next Tuesday.', authorId: 'admin', createdAt: iso(-3, 11) },
      ] : [],
    };
  });
}

function makeProducts() {
  const cats = ['Subscription', 'Hardware', 'Service', 'Add-on'];
  const names = [
    'Pulse Starter', 'Pulse Pro', 'Pulse Scale', 'Insight Add-on', 'Audit Bundle',
    'White Glove Onboarding', 'Edge Connector', 'Vault Encryption', 'API Premium',
    'Reporting Pack', 'SSO Module', 'Priority Support',
  ];
  return names.map((n, i) => {
    const stock = Math.floor(Math.random() * 200);
    const status = stock === 0 ? 'out' : stock < 20 ? 'low' : 'in_stock';
    return {
      id: `prod_${i + 1}`,
      name: n,
      sku: `SKU-${(1000 + i).toString()}`,
      category: pick(cats),
      price: 19 + Math.floor(Math.random() * 480),
      stock,
      status,
      createdAt: iso(-180 + i * 4, 9),
    };
  });
}

function makeOrders(customerNames: { id: string; name: string }[]) {
  const statuses = ['new', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
  return Array.from({ length: 32 }).map((_, i) => {
    const c = pick(customerNames);
    return {
      id: `ord_${i + 1}`,
      reference: `ORD-${(1040 + i).toString()}`,
      customerId: c.id,
      customerName: c.name,
      total: 80 + Math.floor(Math.random() * 4000),
      status: pick(statuses),
      items: 1 + Math.floor(Math.random() * 7),
      createdAt: iso(-Math.floor(Math.random() * 60), 11 + Math.floor(Math.random() * 6)),
    };
  });
}

function makeInvoices(customerNames: { id: string; name: string }[]) {
  const statuses = ['paid', 'paid', 'paid', 'open', 'overdue', 'void'] as const;
  return Array.from({ length: 28 }).map((_, i) => {
    const c = pick(customerNames);
    const issued = iso(-Math.floor(Math.random() * 90), 9);
    return {
      id: `inv_${i + 1}`,
      number: `INV-2025-${(100 + i).toString()}`,
      customerId: c.id,
      customerName: c.name,
      amount: 200 + Math.floor(Math.random() * 5000),
      status: pick(statuses),
      issuedAt: issued,
      dueAt: iso(-Math.floor(Math.random() * 90) + 30, 9),
    };
  });
}

function makeEvents() {
  const cats = ['meeting', 'release', 'review', 'personal'] as const;
  const titles = [
    'Weekly product sync', 'Customer call: Aperture', 'Marketing review',
    'Q3 release', 'Design crit', 'Ops review', 'Personal: dentist',
    'Stand-up', '1:1 with Mira', 'Investor update',
  ];
  return Array.from({ length: 18 }).map((_, i) => {
    const offset = -3 + Math.floor(Math.random() * 21);
    const start = iso(offset, 9 + Math.floor(Math.random() * 8));
    const end = new Date(new Date(start).getTime() + (30 + Math.random() * 90) * 60_000).toISOString();
    return {
      id: `evt_${i + 1}`,
      title: pick(titles),
      startsAt: start,
      endsAt: end,
      category: pick(cats),
      attendees: ['admin@example.com', 'mira@example.com'],
    };
  });
}

function makeTasks() {
  const statuses = ['backlog', 'todo', 'doing', 'review', 'done'] as const;
  const priorities = ['low', 'normal', 'high', 'urgent'] as const;
  const titles = [
    'Refactor auth middleware', 'Ship new pricing page', 'Investigate latency spike',
    'Add CSV export to Reports', 'Migrate billing to v2', 'Write onboarding email sequence',
    'Audit color contrast across nav', 'Set up usage alerts', 'Compose Q3 retrospective',
    'Pair on the data layer', 'Integrate calendar webhook', 'Document widget plugin API',
    'Backfill missing customer notes', 'Triage GitHub issues', 'Prep board deck',
  ];
  return titles.map((t, i) => ({
    id: `task_${i + 1}`,
    title: t,
    status: pick(statuses),
    priority: pick(priorities),
    assigneeId: null,
    tags: Math.random() > 0.6 ? ['frontend'] : [],
    dueAt: iso(Math.floor(Math.random() * 14), 17),
    order: i,
  }));
}

function makeThreads() {
  const subjects = [
    'Re: Q3 launch readiness',
    'Welcome to Renovate!',
    'Invoice INV-2025-104 reminder',
    'Feedback on the new dashboard',
    'Roadmap thoughts',
    'Re: Calendar sync issue',
    'Holiday hours notice',
    'Quick intro?',
  ];
  return subjects.map((s, i) => ({
    id: `thr_${i + 1}`,
    subject: s,
    participants: ['admin@example.com', `${pick(FIRST).toLowerCase()}@example.com`],
    preview: 'Thanks for the update — taking a look this afternoon.',
    lastMessageAt: iso(-i, 10 + i),
    unread: i < 3,
    folder: 'inbox' as const,
    starred: i === 1,
  }));
}

function makeNotifications() {
  return [
    { id: 'n1', title: 'New invoice paid', body: 'INV-2025-101 was paid by Aperture.', type: 'success' as const, read: false, createdAt: iso(-0, 9) },
    { id: 'n2', title: 'Stock low on Pulse Pro', body: 'Stock fell below threshold.', type: 'warning' as const, read: false, createdAt: iso(-1, 14) },
    { id: 'n3', title: 'Customer churned', body: 'Northwind cancelled their plan.', type: 'error' as const, read: false, createdAt: iso(-2, 16) },
    { id: 'n4', title: 'New feature available', body: 'Custom widgets are live in admin.', type: 'info' as const, read: true, createdAt: iso(-4, 11) },
    { id: 'n5', title: 'Backup completed', body: 'Nightly backup completed successfully.', type: 'success' as const, read: true, createdAt: iso(-5, 3) },
  ];
}

function makeNavigation() {
  return [
    { id: 'n_overview', label: 'Overview', href: '/', icon: 'LayoutDashboard', order: 1, group: 'main' as const, parentId: null },
    { id: 'n_analytics', label: 'Analytics', href: '/analytics', icon: 'BarChart3', order: 2, group: 'main' as const, parentId: null },
    { id: 'n_customers', label: 'Customers', href: '/customers', icon: 'Users', order: 3, group: 'main' as const, parentId: null },
    { id: 'n_products', label: 'Products', href: '/products', icon: 'Package', order: 4, group: 'main' as const, parentId: null },
    { id: 'n_orders', label: 'Orders', href: '/orders', icon: 'ShoppingBag', order: 5, group: 'main' as const, parentId: null },
    { id: 'n_invoices', label: 'Invoices', href: '/invoices', icon: 'Receipt', order: 6, group: 'main' as const, parentId: null },
    { id: 'n_calendar', label: 'Calendar', href: '/calendar', icon: 'Calendar', order: 7, group: 'workspace' as const, parentId: null },
    { id: 'n_kanban', label: 'Kanban', href: '/kanban', icon: 'KanbanSquare', order: 8, group: 'workspace' as const, parentId: null },
    { id: 'n_messages', label: 'Messages', href: '/messages', icon: 'MessageSquare', order: 9, group: 'workspace' as const, parentId: null },
    { id: 'n_reports', label: 'Reports', href: '/reports', icon: 'FileBarChart', order: 10, group: 'workspace' as const, parentId: null },
    { id: 'n_admin_theme', label: 'Theme', href: '/admin/theme', icon: 'Palette', order: 1, group: 'admin' as const, parentId: null },
    { id: 'n_admin_pages', label: 'Pages', href: '/admin/pages', icon: 'FileEdit', order: 2, group: 'admin' as const, parentId: null },
    { id: 'n_admin_nav', label: 'Navigation', href: '/admin/navigation', icon: 'List', order: 3, group: 'admin' as const, parentId: null },
    { id: 'n_admin_users', label: 'Users & Roles', href: '/admin/users', icon: 'Shield', order: 4, group: 'admin' as const, parentId: null },
    { id: 'n_admin_settings', label: 'Settings', href: '/admin/settings', icon: 'Settings', order: 5, group: 'admin' as const, parentId: null },
    { id: 'n_admin_activity', label: 'Activity', href: '/admin/activity', icon: 'History', order: 6, group: 'admin' as const, parentId: null },
  ];
}

async function makeUsers() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const editorHash = await bcrypt.hash('editor123', 10);
  const viewerHash = await bcrypt.hash('viewer123', 10);
  return [
    {
      id: 'u_admin',
      email: 'admin@example.com',
      name: 'Ada Lovelace',
      role: 'admin' as const,
      passwordHash: adminHash,
      avatarUrl: null,
      active: true,
      createdAt: iso(-180),
      updatedAt: iso(-1),
    },
    {
      id: 'u_editor',
      email: 'editor@example.com',
      name: 'Mira Park',
      role: 'editor' as const,
      passwordHash: editorHash,
      avatarUrl: null,
      active: true,
      createdAt: iso(-160),
      updatedAt: iso(-3),
    },
    {
      id: 'u_viewer',
      email: 'viewer@example.com',
      name: 'Theo Soto',
      role: 'viewer' as const,
      passwordHash: viewerHash,
      avatarUrl: null,
      active: true,
      createdAt: iso(-120),
      updatedAt: iso(-7),
    },
  ];
}

function makeActivity() {
  return [
    { id: 'a1', userId: 'u_admin', userName: 'Ada Lovelace', action: 'updated_theme', target: 'theme', createdAt: iso(-1, 10) },
    { id: 'a2', userId: 'u_editor', userName: 'Mira Park', action: 'created_page', target: 'Team dashboard', createdAt: iso(-2, 14) },
    { id: 'a3', userId: 'u_admin', userName: 'Ada Lovelace', action: 'created_user', target: 'editor@example.com', createdAt: iso(-15, 11) },
    { id: 'a4', userId: 'u_admin', userName: 'Ada Lovelace', action: 'updated_navigation', target: 'sidebar', createdAt: iso(-3, 9) },
  ];
}

async function main() {
  await fs.mkdir(DB_DIR, { recursive: true });
  const customers = makeCustomers(48);
  const data = {
    users: await makeUsers(),
    customers,
    products: makeProducts(),
    orders: makeOrders(customers.map((c) => ({ id: c.id, name: c.name }))),
    invoices: makeInvoices(customers.map((c) => ({ id: c.id, name: c.name }))),
    events: makeEvents(),
    tasks: makeTasks(),
    threads: makeThreads(),
    replies: [],
    notifications: makeNotifications(),
    activity: makeActivity(),
    pages: [],
    navigation: makeNavigation(),
    theme: defaultTheme,
  };
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  // eslint-disable-next-line no-console
  console.log(`Seeded ${DB_FILE}\n  ${data.customers.length} customers, ${data.products.length} products, ${data.orders.length} orders.`);
  // eslint-disable-next-line no-console
  console.log('  Default admin: admin@example.com / admin123');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
