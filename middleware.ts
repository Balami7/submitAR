import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/admin/login' },
  callbacks: {
    authorized: ({ req, token }) => {
      // Public order submission: allow POST /api/orders without auth
      if (req.nextUrl.pathname.startsWith('/api/orders') && req.method === 'POST') {
        return true;
      }
      // Everything else under the matcher requires a session
      return !!token;
    },
  },
});

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/orders/:path*', '/api/orders/:path*'],
};
