import { type AuthOptions, type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session extends DefaultSession {
    id: string;
    meta?: {
      provider?: string;
      sub?: string;
    };
  }
}

export const CONFIG: AuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      token.session = crypto.randomUUID();
      const provider = account?.provider;
      if (provider) {
        token.provider = provider;
      }
      return token;
    },
    session({ session, token }) {
      session.id =
        (token?.session as string | undefined) || crypto.randomUUID();
      const provider = token?.provider as string | undefined;
      if (provider) {
        session.meta = {
          provider,
          sub: token?.sub,
        };
      }
      return session;
    },
  },
};
