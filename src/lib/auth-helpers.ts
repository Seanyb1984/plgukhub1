import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Ensures a user is logged in. 
 * If not, it sends them to the login page.
 */
export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Specifically ensures the user has the ADMIN role.
 */
export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}
