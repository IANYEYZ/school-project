import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { users } from "@/lib/users";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;

        const user = users.find((u) => u.username === credentials.username);
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return { id: user.username, username: user.username, role: user.role };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // JWT callback: attach role into token
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User & { role?: string };
    }): Promise<JWT> {
      if (user) {
        (token as any).role = user.role;
        (token as any).username = user.username;
      }
      return token;
    },

    // Session callback: attach role from token
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { role?: string };
    }): Promise<Session> {
      if (token.role) {
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
