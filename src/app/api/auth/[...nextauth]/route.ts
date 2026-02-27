import NextAuth from "next-auth";
import { prisma } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Auth failed: Missing email or password in request");
          return null;
        }
        
        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() }
        });

        // 1. Check if user exists
        if (!user) {
          console.log("Auth failed: User not found in DB ->", credentials.email);
          return null;
        }

        // 2. Map to the correct database column 'passwordHash'
        // Note: Your DB column is passwordHash, but your code was looking for .password
        if (!user.passwordHash) {
          console.log("Auth failed: No password hash found for user:", user.email);
          return null;
        }

        // 3. Verify password against stored hash
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordCorrect) {
          console.log("Auth failed: Invalid password for:", user.email);
          return null;
        }

        console.log("Auth success: Logging in as", user.email, "with role", user.role);

        // 4. Return the session data
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          brand: user.brand
        };
      }
    })
  ],
  session: { 
    strategy: "jwt" as const 
  },
  pages: { 
    signIn: "/login" 
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.brand = user.brand;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.brand = token.brand;
        session.user.id = token.id;
      }
      return session;
    }
  }
};

const authData = NextAuth(authOptions);
export const GET = authData.handlers.GET;
export const POST = authData.handlers.POST;