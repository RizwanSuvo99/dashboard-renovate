import type { Metadata } from 'next';
import { themeRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { ThemeCustomizerClient } from './ThemeCustomizerClient';

export const metadata: Metadata = { title: 'Theme customizer' };

export default async function ThemeCustomizerPage() {
  await requireRole('admin');
  const theme = await themeRepo.get();
  return <ThemeCustomizerClient initialTheme={theme} />;
}
