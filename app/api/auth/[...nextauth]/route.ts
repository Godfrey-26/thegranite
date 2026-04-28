import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import API_Caller from "../../src/api_caller";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await API_Caller(
            "POST",
            null,
            "/accounts/login/",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          console.log("LOGIN RESPONSE:", res);

          // 🚨 Handle backend error response
          if (!res || res.status === "error") {
            throw new Error(res?.message || "Invalid login credentials");
          }

          // 🚨 Django may return different shapes
          const user = res.user ?? res;

          if (!user || !user.email) {
            throw new Error("Invalid user response from server");
          }

          // ✅ Return NextAuth user object
          return {
            id: user.id || user.email,
            email: user.email,
            name: user.name || "",
            role: user.role || "user",
            subscription: user.subscription || null,
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          throw error; // IMPORTANT: DO NOT return null silently
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscription = user.subscription;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.subscription = token.subscription;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  debug: true, // 🔥 helps you see real errors in dev
});

export { handler as GET, handler as POST };