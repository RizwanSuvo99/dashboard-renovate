import type { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { userRepo } from './repositories';
import type { Role, User } from '@/types';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const all = await userRepo.list();
        const user = all.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
        if (!user || !user.active) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; role: Role; avatarUrl?: string | null };
        token.id = u.id;
        token.role = u.role;
        token.avatarUrl = u.avatarUrl ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Session['user'] & { id: string; role: Role; avatarUrl?: string | null }).id = token.id as string;
        (session.user as Session['user'] & { id: string; role: Role }).role = token.role as Role;
        (session.user as Session['user'] & { avatarUrl?: string | null }).avatarUrl = (token.avatarUrl as string | null) ?? null;
      }
      return session;
    },
  },
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
};

/** Server-side session helper. Returns null when not authenticated. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as AuthUser;
}

/**
 * Server-side guard. Redirects to /login if no session, or to /403 if the
 * user lacks the required role.
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(roles: Role | Role[]): Promise<AuthUser> {
  const user = await requireUser();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) redirect('/403');
  return user;
}

export async function lookupUserById(id: string): Promise<User | null> {
  return userRepo.findById(id);
}
