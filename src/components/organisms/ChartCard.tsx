'use client';
import * as React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';

export interface ChartCardProps {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  height?: number;
  children: React.ReactNode;
  className?: string;
}

/** Wraps a chart with a consistent header and body. Pass any Recharts component as children. */
export function ChartCard({ title, description, toolbar, height = 280, children, className }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <p className="mt-0.5 text-sm text-fg-muted">{description}</p>}
        </div>
        {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
      </CardHeader>
      <CardBody>
        <div style={{ height }}>{children}</div>
      </CardBody>
    </Card>
  );
}
