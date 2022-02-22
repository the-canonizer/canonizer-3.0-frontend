import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { isServer, redirectToUrl } from "../../utils/generalUtility";
import { RootState } from "../../store/index";

function RouteGuard({ children }) {
  const token = useSelector<RootState>((state) => state.auth.token);
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {
    const publicPaths = ["/login", "/registration", "/forgot-password", "/"];

    const path = url.split("?")[0];
    if (!token && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }

    if (
      token &&
      (path === "/login" ||
        path === "/registration" ||
        path === "/forgot-password")
    ) {
      redirectToUrl("", "/");
    }
  }

  if (!isServer) {
    return authorized && children;
  }

  return children;
}

export default RouteGuard;
