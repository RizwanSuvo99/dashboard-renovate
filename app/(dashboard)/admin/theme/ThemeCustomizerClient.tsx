'use client';
import * as React from 'react';
import { Save, Sparkles, Sun, Moon, Monitor, RotateCcw } from 'lucide-react';
import type { ThemeConfig, RadiusScale, ThemeMode, SidebarStyle } from '@/design-system/theme';
import { defaultTheme } from '@/design-system/theme';
import { tokens } from '@/design-system/tokens';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/molecules/Card';
import { ColorPicker } from '@/components/molecules/ColorPicker';
import { FormField } from '@/components/molecules/FormField';
import { SegmentedControl } from '@/components/molecules/SegmentedControl';
import { Badge } from '@/components/atoms/Badge';
import { StatCard } from '@/components/molecules/StatCard';

export function ThemeCustomizerClient({ initialTheme }: { initialTheme: ThemeConfig }) {
  const { theme, setTheme } = useTheme();
  const [draft, setDraft] = React.useState<ThemeConfig>(theme ?? initialTheme);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  // Apply draft to document for live preview without persisting.
  React.useEffect(() => {
    setTheme(draft, { persist: false });
  }, [draft, setTheme]);

  const save = async () => {
    setSaving(true);
    try {
      setTheme(draft, { persist: true });
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  };

  const reset = () => setDraft(defaultTheme);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Theme customizer</h1>
          <p className="text-sm text-fg-muted">Live-preview changes — they apply instantly to every page.</p>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && <Badge tone="success" size="sm">Saved at {savedAt}</Badge>}
          <Button size="sm" variant="ghost" onClick={reset} leftIcon={<RotateCcw size={14} />}>
            Reset
          </Button>
          <Button size="sm" loading={saving} onClick={save} leftIcon={<Save size={14} />}>
            Save changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_1fr]">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Brand</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <FormField label="Brand name">
                <Input value={draft.brandName} onChange={(e) => setDraft({ ...draft, brandName: e.target.value })} />
              </FormField>

              <FormField label="Color preset">
                <ColorPicker
                  value={draft.presetId}
                  onChange={(presetId) => setDraft({ ...draft, presetId })}
                />
              </FormField>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Surface</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <FormField label="Mode">
                <SegmentedControl<ThemeMode>
                  size="sm"
                  value={draft.mode}
                  onChange={(mode) => setDraft({ ...draft, mode })}
                  options={[
                    { value: 'light', label: 'Light', icon: <Sun size={13} /> },
                    { value: 'dark', label: 'Dark', icon: <Moon size={13} /> },
                    { value: 'system', label: 'Auto', icon: <Monitor size={13} /> },
                  ]}
                />
              </FormField>
              <FormField label="Border radius">
                <SegmentedControl<RadiusScale>
                  size="sm"
                  value={draft.radius}
                  onChange={(radius) => setDraft({ ...draft, radius })}
                  options={[
                    { value: 'sm', label: 'Sharp' },
                    { value: 'md', label: 'Balanced' },
                    { value: 'lg', label: 'Soft' },
                  ]}
                />
              </FormField>
              <FormField label="Sidebar">
                <SegmentedControl<SidebarStyle>
                  size="sm"
                  value={draft.sidebar}
                  onChange={(sidebar) => setDraft({ ...draft, sidebar })}
                  options={[
                    { value: 'compact', label: 'Compact' },
                    { value: 'expanded', label: 'Expanded' },
                    { value: 'floating', label: 'Floating' },
                  ]}
                />
              </FormField>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Typography</CardTitle></CardHeader>
            <CardBody>
              <FormField label="Font family">
                <div className="grid grid-cols-2 gap-2">
                  {tokens.fontFamilies.map((f) => {
                    const active = draft.fontFamilyId === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setDraft({ ...draft, fontFamilyId: f.id })}
                        style={{ fontFamily: f.value }}
                        className={
                          'flex flex-col items-start gap-0.5 rounded-md border bg-surface px-3 py-2 text-left transition-all hover:shadow-xs ' +
                          (active ? 'border-primary shadow-ring' : 'border-border')
                        }
                      >
                        <span className="text-md font-semibold">{f.label}</span>
                        <span className="text-2xs text-fg-subtle">The quick brown fox</span>
                      </button>
                    );
                  })}
                </div>
              </FormField>
            </CardBody>
          </Card>
        </div>

        {/* Preview */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <Badge tone="primary" size="sm" className="capitalize">{draft.presetId}</Badge>
          </CardHeader>
          <CardBody className="space-y-5 bg-bg/40">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard label="Revenue" value="$48,920" delta={12.4} caption="vs last month" />
              <StatCard label="Active users" value="2,408" delta={3.2} caption="this week" />
              <StatCard label="Tickets" value="14" delta={-2.1} caption="open" />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Card>
                <CardBody className="space-y-2">
                  <p className="font-display text-md font-semibold">Buttons</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Primary</Button>
                    <Button size="sm" variant="secondary">Secondary</Button>
                    <Button size="sm" variant="outline">Outline</Button>
                    <Button size="sm" variant="ghost">Ghost</Button>
                    <Button size="sm" variant="subtle">Subtle</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge tone="primary">primary</Badge>
                    <Badge tone="success">success</Badge>
                    <Badge tone="warning">warning</Badge>
                    <Badge tone="danger">danger</Badge>
                    <Badge tone="info">info</Badge>
                    <Badge tone="accent">accent</Badge>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="space-y-2">
                  <p className="font-display text-md font-semibold">Form sample</p>
                  <FormField label="Email">
                    <Input placeholder="you@example.com" />
                  </FormField>
                  <FormField label="With error" error="Required field">
                    <Input invalid />
                  </FormField>
                </CardBody>
              </Card>
            </div>

            <Card>
              <CardBody className="prose-sm space-y-2">
                <p className="font-display text-lg font-semibold tracking-tight">A note on the palette</p>
                <p className="text-sm leading-relaxed text-fg-muted">
                  Renovate's defaults aim for a restrained, professional feel — slate neutrals paired with a
                  single saturated accent. Picking <span className="font-medium text-primary capitalize">{draft.presetId}</span> tints both the
                  primary action color and the semantic accents like links and dots.
                </p>
                <p className="text-sm text-fg-muted">
                  <Sparkles size={14} className="inline align-text-top text-accent" /> Tip: changes save to
                  <code className="font-mono mx-1 rounded bg-surface-2 px-1">/data/theme.json</code>
                  and apply across all sessions on next request.
                </p>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
