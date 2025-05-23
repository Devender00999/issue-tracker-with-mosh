import { prisma } from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      Google({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
   ],
   secret: process.env.NEXTAUTH_SECRET,
   session: {
      strategy: "jwt",
   },
};

export { authOptions };
