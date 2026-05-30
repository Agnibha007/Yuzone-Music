import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

process.env.AUTH_TRUST_HOST = process.env.AUTH_TRUST_HOST ?? "true";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
