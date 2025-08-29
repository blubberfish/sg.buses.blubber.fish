import { CONFIG } from "@/lib/auth"
import NextAuth from "next-auth";

const handler = NextAuth(CONFIG);

export { handler as GET, handler as POST };
