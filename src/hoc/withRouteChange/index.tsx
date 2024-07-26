import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCurrentReturnUrl } from "src/store/slices/authSlice";

const withRouteChange = (WrappedComponent) => {
  // eslint-disable-next-line
  return (props) => {
    const router = useRouter(),
      dispatch = useDispatch();

    useEffect(() => {
      const handleRouteChange = (url) => {
        const currentUrl = router?.asPath;

        if (
          currentUrl !== "/login" &&
          currentUrl !== "/registration" &&
          currentUrl !== "/login/otp" &&
          currentUrl !== "/registration/otp" &&
          currentUrl !== "/category-preference" &&
          currentUrl !== "/forgot-password" &&
          currentUrl !== "/forgot-password/otp" &&
          currentUrl !== "/reset-password"
        ) {
          if (url === "/registration" || url === "/login") {
            dispatch(setCurrentReturnUrl(router?.asPath));
          }
        }
      };

      const handleRouteComplete = (url) => {
        // console.log("App has changed to: ", url);
        // console.log("Current app url after completed: ", router?.asPath);
      };

      router.events.on("routeChangeStart", handleRouteChange);
      router.events.on("routeChangeComplete", handleRouteComplete);

      return () => {
        router.events.off("routeChangeStart", handleRouteChange);
        router.events.off("routeChangeComplete", handleRouteComplete);
      };
    }, [router.events]);

    return <WrappedComponent {...props} router={router} />;
  };
};

export default withRouteChange;
