import { useEffect } from "react";
import { useRouter } from "next/router";

import HeadContent from "./headContent";
import PermissionsForPages from "../../../permissions";
import usePermission from "../../../hooks/usePermissions";
import useAuthentication from "../../../hooks/isUserAuthenticated";
import { createToken } from "src/network/api/userApi";
import { getCookies } from "src/utils/generalUtility";

type HeadContentComponentProps = {
  componentName: string;
  metaContent: any;
  canonical: string;
};

const HeadContentAndPermissionComponent = ({
  componentName,
  metaContent,
  canonical,
}: HeadContentComponentProps) => {
  const router = useRouter();
  const pageRoute = process.env.NEXT_PUBLIC_BASE_URL + router?.asPath;

  const { isAllowed } = usePermission();
  const { isUserAuthenticated } = useAuthentication();

  // const getToken = async () => {
  //   const cc: any = getCookies();
  //   if (!cc?.loginToken) await createToken();
  // };

  // useEffect(() => {
  //   getToken();
  // }, [router]);

  useEffect(() => {
    //Check permission
    let permission = PermissionsForPages[componentName];
    const requiredAuthentication =
      permission && permission.isAuthenticationRequired ? true : false;
    const requiredPermission =
      permission && permission.isPermissionRequired ? true : false;

    //redirect if authentication is required and user is not loggedIn

    if (requiredAuthentication && !isUserAuthenticated) {
      const lgt = localStorage.getItem("logout_type");
      if (lgt == "true") {
        router?.push("/");
      } else {
        router?.push({
          pathname: "/login",
          query: { returnUrl: router?.asPath },
        });
      }
      localStorage.removeItem("logout_type");
    }

    //redirect if user doesn't have specific permission to view that page
    if (requiredPermission && !isAllowed(permission.permissionName)) {
      router?.push("/required-permission");
    }
  }, [componentName, isUserAuthenticated, isAllowed, router]);

  return (
    <HeadContent
      title={metaContent?.title}
      description={metaContent?.description}
      route={pageRoute}
      author={metaContent?.author}
      componentName={componentName}
      canonical={canonical}
    />
  );
};

export default HeadContentAndPermissionComponent;
