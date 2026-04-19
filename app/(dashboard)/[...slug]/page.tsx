import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageRepo } from '@/lib/repositories';
import { WidgetGrid } from '@/components/organisms/WidgetRenderer';

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const slug = params.slug.join('/');
  const all = await pageRepo.list();
  const page = all.find((p) => p.slug === slug);
  return { title: page?.title ?? 'Not found' };
}

export default async function DynamicPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const all = await pageRepo.list();
  const page = all.find((p) => p.slug === slug);
  if (!page) notFound();
  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{page.title}</h1>
        {page.description && <p className="text-sm text-fg-muted">{page.description}</p>}
      </header>
      <WidgetGrid widgets={page.widgets} />
    </div>
  );
}
