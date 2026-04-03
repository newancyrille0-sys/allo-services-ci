import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// ============================================
// Configuration des Providers OAuth
// Les clés sont lues depuis le fichier .env
// ============================================

// Extend types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      phone?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    phone?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    // ============================================
    // GOOGLE OAUTH PROVIDER
    // Variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
    // Configurer sur: https://console.cloud.google.com/apis/credentials
    // ============================================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    
    // ============================================
    // CREDENTIALS PROVIDER (Email/Téléphone + Mot de passe)
    // ============================================
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrPhone: { label: "Email ou Téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) {
          throw new Error("Identifiants requis");
        }

        const { emailOrPhone, password } = credentials;

        // Find user by email or phone
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: emailOrPhone },
              { phone: emailOrPhone.replace(/\s/g, "") },
            ],
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Utilisateur non trouvé");
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatarUrl,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // If signing in with Google
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email || "" },
        });

        if (!existingUser) {
          // Create new user from Google account
          await db.user.create({
            data: {
              email: user.email,
              fullName: user.name,
              avatarUrl: user.image,
              role: "CLIENT",
              status: "ACTIVE",
              otpVerified: true,
              emailVerified: new Date(),
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`[Auth] User ${user.email} signed in via ${account?.provider}`);
    },
  },
  // Active le mode debug en développement
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
