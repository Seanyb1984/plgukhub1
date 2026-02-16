import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import type { Brand, Role } from "@prisma/client";

/* -----------------------------
   NextAuth Config
--------------------------------*/

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { site: true },
        });

        if (!user || !user.isActive) return null;

        const valid = await compare(
          credentials.password,
          user.passwordHash
        );

        if (!valid) return null;

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
          siteId: user.siteId,
          siteName: user.site.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

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
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.brand = token.brand as Brand;
        session.user.siteId = token.siteId as string;
        session.user.siteName = token.siteName as string;
      }
      return session;
    },
  },
};

/* -----------------------------
   API Route Handler
--------------------------------*/

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

/* -----------------------------
   Types
--------------------------------*/

declare module "next-auth" {
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
}
