'use client';
import { Card, CardBody } from '@/components/molecules/Card';

export function RichTextWidget({ config }: { config: Record<string, unknown> }) {
  const c = config as { heading?: string; body?: string };
  return (
    <Card>
      <CardBody>
        <h3 className="font-display text-md font-semibold tracking-tight text-fg">{c.heading ?? 'Section'}</h3>
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{c.body ?? ''}</p>
      </CardBody>
    </Card>
  );
}
