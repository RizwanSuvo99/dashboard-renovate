import { requireUser } from '@/lib/auth';
import { navigationRepo, notificationRepo } from '@/lib/repositories';
import { DashboardShell } from './DashboardShell';

export default async function DashboardSegmentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [navigation, notifications] = await Promise.all([
    navigationRepo.list(),
    notificationRepo.list(),
  ]);
  const unread = notifications.filter((n) => !n.read).length;

  // Filter out admin items for non-admin users.
  const visibleNav =
    user.role === 'admin' ? navigation : navigation.filter((n) => n.group !== 'admin');

  return (
    <DashboardShell user={user} navigation={visibleNav} unreadNotifications={unread}>
      {children}
    </DashboardShell>
  );
}
