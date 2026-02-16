import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Auth: Missing email or password in request");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email.toLowerCase() 
          },
          include: { 
            site: true 
          }
        });

        // The field in the database is 'passwordHash', not 'password'
        if (!user || !user.passwordHash) {
          console.log(`❌ Auth: User ${credentials.email} not found or has no password hash`);
          return null;
        }

        // Compare the plain text password from the form with the hashed version in Supabase
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        
        if (!isValid) {
          console.log(`❌ Auth: Invalid password for ${credentials.email}`);
          return null;
        }

        console.log(`✅ Auth: Login successful for ${user.email}`);

        // This object becomes the session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          brand: user.brand,
          site: user.site
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.brand = (user as any).brand;
        token.site = (user as any).site;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).brand = token.brand;
        (session.user as any).site = token.site; 
      }
      return session;
    }
  },
  pages: { 
    signIn: "/login",
    error: "/login"
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
