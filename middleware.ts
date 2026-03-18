import { withAuth } from 'next-auth/middleware';

/**
 * Anything outside `/login`, `/register`, `/forgot-password`, `/api/auth`,
 * `/_next`, `/favicon`, `/403`, `/design-system`, `/api/theme` (GET) requires a session.
 * Specific role checks happen server-side in pages/route handlers.
 */
export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: [
    '/((?!api/auth|api/theme|_next/static|_next/image|favicon|login|register|forgot-password|403|design-system).*)',
  ],
};
