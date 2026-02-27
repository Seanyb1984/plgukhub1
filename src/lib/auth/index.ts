import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/db';
import type { Brand, Role } from '@prisma/client';

// ============================================
// Auth.js v5 — Credentials Provider
// Roles: ADMIN, PRESCRIBER, PRACTITIONER, STAFF
// ============================================

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      brand: Brand;
      siteId: string;
      siteName: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    brand: Brand;
    siteId: string;
    siteName: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    brand: Brand;
    siteId: string;
    siteName: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase().trim() },
          include: { site: true },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        // Update last login timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          brand: user.brand,
          siteId: user.siteId ?? '',
          siteName: user.site?.name ?? '',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.brand = user.brand;
        token.siteId = user.siteId;
        token.siteName = user.siteName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.brand = token.brand;
        session.user.siteId = token.siteId;
        session.user.siteName = token.siteName;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
});

// ============================================
// Role-based permission helpers
// ============================================

/** PLG_UK brand admins can access all brands */
export function canAccessBrand(userBrand: Brand, targetBrand: Brand): boolean {
  if (userBrand === 'PLG_UK') return true;
  return userBrand === targetBrand;
}

/** Only ADMIN can manage users */
export function canManageUsers(role: Role): boolean {
  return role === 'ADMIN';
}

/** ADMIN and PRACTITIONER can view all submissions */
export function canViewAllSubmissions(role: Role): boolean {
  return role === 'ADMIN' || role === 'PRACTITIONER';
}

/** Only ADMIN can export data */
export function canExportData(role: Role): boolean {
  return role === 'ADMIN';
}

/** ADMIN and PRACTITIONER can amend submissions */
export function canAmendSubmission(role: Role): boolean {
  return role === 'ADMIN' || role === 'PRACTITIONER';
}

/** Check if role can access /admin routes */
export function canAccessAdmin(role: Role): boolean {
  return role === 'ADMIN' || role === 'PRESCRIBER';
}
