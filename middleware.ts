// allows other users to access data from api


import { authMiddleware } from "@clerk/nextjs";


export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});


export const config = {

  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],

};

