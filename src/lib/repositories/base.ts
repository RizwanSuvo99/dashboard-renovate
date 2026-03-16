import { v4 as uuid } from 'uuid';
import { getDb, type DbSchema } from '../db';

/**
 * Generic repository contract — every domain repo conforms to this so the
 * underlying storage (lowdb today; pg/Mongo tomorrow) can be swapped without
 * touching call sites. To swap: re-implement against your real DB while
 * preserving these method signatures.
 */
export interface Repository<T extends { id: string }> {
  list(opts?: ListOptions): Promise<T[]>;
  count(): Promise<number>;
  findById(id: string): Promise<T | null>;
  create(input: Omit<T, 'id'> & Partial<Pick<T, 'id'>>): Promise<T>;
  update(id: string, patch: Partial<Omit<T, 'id'>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface ListOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: { field: string; dir: 'asc' | 'desc' };
}

/**
 * Concrete lowdb-backed implementation. Subclass and pass the collection key.
 */
export class LowdbRepository<K extends keyof DbSchema, T extends { id: string }>
  implements Repository<T>
{
  constructor(
    protected key: K,
    protected searchFields: Array<keyof T> = [],
  ) {}

  async list(opts: ListOptions = {}): Promise<T[]> {
    const db = await getDb();
    let rows = (db.data[this.key] as unknown as T[]).slice();
    if (opts.search) {
      const q = opts.search.toLowerCase();
      rows = rows.filter((row) =>
        this.searchFields.some((f) => String((row as Record<string, unknown>)[f as string] ?? '').toLowerCase().includes(q)),
      );
    }
    if (opts.sort) {
      const { field, dir } = opts.sort;
      rows.sort((a, b) => {
        const av = (a as Record<string, unknown>)[field];
        const bv = (b as Record<string, unknown>)[field];
        if (av === bv) return 0;
        const cmp = (av as number | string) > (bv as number | string) ? 1 : -1;
        return dir === 'asc' ? cmp : -cmp;
      });
    }
    if (opts.pageSize !== undefined) {
      const page = Math.max(1, opts.page ?? 1);
      const start = (page - 1) * opts.pageSize;
      rows = rows.slice(start, start + opts.pageSize);
    }
    return rows;
  }

  async count(): Promise<number> {
    const db = await getDb();
    return (db.data[this.key] as unknown as T[]).length;
  }

  async findById(id: string): Promise<T | null> {
    const db = await getDb();
    return ((db.data[this.key] as unknown as T[]).find((r) => r.id === id) as T) ?? null;
  }

  async create(input: Omit<T, 'id'> & Partial<Pick<T, 'id'>>): Promise<T> {
    const db = await getDb();
    const row = { id: input.id ?? uuid(), ...input } as T;
    (db.data[this.key] as unknown as T[]).push(row);
    await db.write();
    return row;
  }

  async update(id: string, patch: Partial<Omit<T, 'id'>>): Promise<T | null> {
    const db = await getDb();
    const arr = db.data[this.key] as unknown as T[];
    const i = arr.findIndex((r) => r.id === id);
    if (i < 0) return null;
    arr[i] = { ...arr[i], ...patch } as T;
    await db.write();
    return arr[i] as T;
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDb();
    const arr = db.data[this.key] as unknown as T[];
    const before = arr.length;
    db.data[this.key] = arr.filter((r) => r.id !== id) as unknown as DbSchema[K];
    await db.write();
    return arr.length !== before;
  }
}
