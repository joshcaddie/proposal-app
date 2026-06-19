import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/", "/p/(.*)", "/sign-in(.*)", "/sign-up(.*)"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
