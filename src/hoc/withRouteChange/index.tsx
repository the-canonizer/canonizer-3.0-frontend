import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCurrentReturnUrl } from "src/store/slices/authSlice";

const WithRouteChange = (pageProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleRouteChange = (url) => {
      const currentUrl = router.asPath;

      const excludedPaths = [
        "/login",
        "/registration",
        "/login/otp",
        "/registration/otp",
        "/category-preference",
        "/forgot-password",
        "/forgot-password/otp",
        "/reset-password",
      ];

      if (!excludedPaths.includes(currentUrl)) {
        if (url === "/registration" || url === "/login") {
          dispatch(setCurrentReturnUrl(currentUrl));
        }
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.asPath, dispatch]);

  return pageProps.children;
};

export default WithRouteChange;
