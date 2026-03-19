'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  side?: 'right' | 'left';
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widths = {
  sm: 'w-[420px]',
  md: 'w-[520px]',
  lg: 'w-[640px]',
  xl: 'w-[820px]',
};

/** Side-sheet — used by customer detail, edit forms, etc. */
export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  title,
  description,
  children,
  footer,
  width = 'md',
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-fg/30 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed bottom-0 top-0 z-50 flex max-w-full flex-col border-border bg-surface shadow-lg',
            side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
            widths[width],
            'data-[state=open]:animate-slide-up',
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              {title && <Dialog.Title className="text-md font-semibold text-fg">{title}</Dialog.Title>}
              {description && <Dialog.Description className="mt-0.5 text-sm text-fg-muted">{description}</Dialog.Description>}
            </div>
            <Dialog.Close
              aria-label="Close"
              className="rounded p-1 text-fg-subtle hover:bg-surface-2 hover:text-fg"
            >
              <X size={16} />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
