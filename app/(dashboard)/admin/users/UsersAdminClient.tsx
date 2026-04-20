'use client';
import * as React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, ShieldCheck, Trash2, Users, UserCog } from 'lucide-react';
import type { Role, User } from '@/types';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Switch } from '@/components/atoms/Switch';
import { DataTable } from '@/components/organisms/DataTable';
import { Modal } from '@/components/organisms/Modal';
import { ConfirmDialog } from '@/components/organisms/ConfirmDialog';
import { FormField } from '@/components/molecules/FormField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatRelative } from '@/lib/utils/format';

type UserRow = Omit<User, 'passwordHash'>;

const helper = createColumnHelper<UserRow>();

const roleTone: Record<Role, Parameters<typeof Badge>[0]['tone']> = {
  admin: 'primary',
  editor: 'accent',
  viewer: 'neutral',
};

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'editor', 'viewer']),
});
type Values = z.infer<typeof Schema>;

export function UsersAdminClient({ initial }: { initial: UserRow[] }) {
  const [users, setUsers] = React.useState(initial);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<UserRow | null>(null);
  const [deleting, setDeleting] = React.useState<UserRow | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { name: '', email: '', password: '', role: 'viewer' },
  });

  const create = async (values: Values) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      form.setError('email', { message: data.error ?? 'Could not create user' });
      return;
    }
    const created = await res.json();
    // Need to set role after self-create defaulted it.
    if (values.role !== created.role) {
      await fetch(`/api/users/${created.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: values.role }),
      });
      created.role = values.role;
    }
    setUsers([{ ...created, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as UserRow, ...users]);
    setOpen(false);
    form.reset();
  };

  const updateRole = async (user: UserRow, role: Role) => {
    await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    setUsers(users.map((u) => (u.id === user.id ? { ...u, role } : u)));
    setEditing(null);
  };

  const toggleActive = async (user: UserRow) => {
    const next = !user.active;
    await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: next }),
    });
    setUsers(users.map((u) => (u.id === user.id ? { ...u, active: next } : u)));
  };

  const remove = async (user: UserRow) => {
    await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const columns = React.useMemo(
    () => [
      helper.accessor('name', {
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.original.name} size="sm" />
            <div>
              <p className="font-medium text-fg">{row.original.name}</p>
              <p className="text-xs text-fg-subtle">{row.original.email}</p>
            </div>
          </div>
        ),
      }),
      helper.accessor('role', {
        header: 'Role',
        cell: ({ getValue }) => <Badge tone={roleTone[getValue()]} size="sm" className="capitalize">{getValue()}</Badge>,
      }),
      helper.accessor('active', {
        header: 'Active',
        cell: ({ row }) => (
          <Switch
            checked={row.original.active}
            onCheckedChange={() => toggleActive(row.original)}
            aria-label={`Toggle active for ${row.original.name}`}
          />
        ),
      }),
      helper.accessor('createdAt', {
        header: 'Joined',
        cell: ({ getValue }) => <span className="text-fg-subtle">{formatRelative(getValue())}</span>,
      }),
      helper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button size="xs" variant="ghost" onClick={() => setEditing(row.original)} leftIcon={<UserCog size={12} />}>
              Role
            </Button>
            <Button size="xs" variant="ghost" className="text-danger" onClick={() => setDeleting(row.original)}>
              <Trash2 size={12} />
            </Button>
          </div>
        ),
      }),
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Users & roles</h1>
          <p className="text-sm text-fg-muted">{users.length} accounts · RBAC enforced server-side</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus size={14} />}>Invite user</Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(['admin', 'editor', 'viewer'] as const).map((r) => (
          <div key={r} className="surface flex items-center gap-3 px-4 py-3">
            <span className="grid h-8 w-8 place-items-center rounded bg-primary-soft text-primary">
              <ShieldCheck size={14} />
            </span>
            <div>
              <p className="text-2xs uppercase tracking-wide text-fg-subtle">{r}</p>
              <p className="font-display text-md font-semibold">{users.filter((u) => u.role === r).length}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable<UserRow>
        columns={columns}
        data={users}
        searchableFields={['name', 'email']}
        pageSize={10}
        emptyTitle="No users"
        emptyIcon={<Users size={20} />}
        emptyAction={<Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus size={14} />}>Invite user</Button>}
      />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Invite user"
        description="Newly created users can sign in immediately with the password you set."
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" loading={form.formState.isSubmitting} onClick={form.handleSubmit(create)}>Create</Button>
          </>
        }
      >
        <form onSubmit={form.handleSubmit(create)} className="flex flex-col gap-3">
          <FormField label="Name" error={form.formState.errors.name?.message} required>
            <Input {...form.register('name')} />
          </FormField>
          <FormField label="Email" error={form.formState.errors.email?.message} required>
            <Input type="email" {...form.register('email')} />
          </FormField>
          <FormField label="Temporary password" error={form.formState.errors.password?.message} required>
            <Input type="password" {...form.register('password')} />
          </FormField>
          <FormField label="Role">
            <Select {...form.register('role')}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </Select>
          </FormField>
        </form>
      </Modal>

      <Modal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title={editing ? `Update role: ${editing.name}` : ''}
      >
        {editing && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-fg-muted">Current role: <span className="capitalize font-medium text-fg">{editing.role}</span></p>
            <div className="grid grid-cols-3 gap-2">
              {(['admin', 'editor', 'viewer'] as const).map((r) => (
                <Button
                  key={r}
                  variant={editing.role === r ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => updateRole(editing, r)}
                  className="capitalize"
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Delete ${deleting?.name}?`}
        description="This account will lose access immediately. You can't undo this."
        danger
        confirmLabel="Delete user"
        onConfirm={async () => {
          if (deleting) await remove(deleting);
        }}
      />
    </div>
  );
}
