'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ModalProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-fg/30 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2',
            'rounded-xl border border-border bg-surface shadow-lg',
            'data-[state=open]:animate-slide-up',
            sizes[size],
          )}
        >
          {(title || description) && (
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
          )}
          <div className="p-5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
