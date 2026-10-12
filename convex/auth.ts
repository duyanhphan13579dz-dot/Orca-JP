import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Google],
  callbacks: {
    async redirect({ redirectTo }) {
      if (
        redirectTo.startsWith("http://localhost:") ||
        redirectTo.startsWith("http://127.0.0.1:")
      ) {
        return redirectTo;
      }
      return redirectTo;
    },
  },
});
