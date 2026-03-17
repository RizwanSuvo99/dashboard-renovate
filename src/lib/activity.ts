import { activityRepo } from './repositories';

/**
 * Audit-log helper. Call from any admin route handler that performs a write.
 * Read by the Activity Log page.
 */
export async function logActivity(
  user: { id: string; name: string },
  action: string,
  target: string,
  meta?: Record<string, unknown>,
) {
  await activityRepo.create({
    userId: user.id,
    userName: user.name,
    action,
    target,
    createdAt: new Date().toISOString(),
    meta,
  });
}
