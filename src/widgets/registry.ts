import * as React from 'react';
import { z } from 'zod';

/**
 * Widget plugin API. Built-in widgets register on import (see widgets/builtins).
 * To add a 3rd-party widget, call `registerWidget(...)` from a module imported
 * by `app/layout.tsx` (or a plugin entry point) — the registry is module-level
 * so all renders see the same map.
 */
export interface WidgetDef<TConfig extends Record<string, unknown> = Record<string, unknown>> {
  type: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  /** Zod schema for the widget's `config` blob — used by the builder UI. */
  schema: z.ZodType<TConfig>;
  /** Default config used when adding a fresh widget instance. */
  defaultConfig: TConfig;
  /** Renderer; receives the validated config. */
  Component: React.ComponentType<{ config: TConfig }>;
  /** Default grid span (1–12). */
  defaultSpan?: 1 | 2 | 3 | 4 | 6 | 12;
}

const registry = new Map<string, WidgetDef<Record<string, unknown>>>();

export function registerWidget<TConfig extends Record<string, unknown>>(def: WidgetDef<TConfig>) {
  registry.set(def.type, def as unknown as WidgetDef<Record<string, unknown>>);
}

export function getWidget(type: string): WidgetDef<Record<string, unknown>> | undefined {
  return registry.get(type);
}

export function listWidgets(): WidgetDef<Record<string, unknown>>[] {
  return [...registry.values()];
}
