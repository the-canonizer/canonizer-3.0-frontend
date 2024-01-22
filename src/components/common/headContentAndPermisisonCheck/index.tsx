import { useEffect } from "react";
import { useRouter } from "next/router";

import HeadContent from "./headContent";
import PermissionsForPages from "../../../permissions";
import usePermission from "../../../hooks/usePermissions";
import useAuthentication from "../../../hooks/isUserAuthenticated";

type HeadContentComponentProps = {
  componentName: string;
  metaContent: any;
  canonical: string;
};

const HeadContentAndPermissionComponent = ({
  componentName,
  metaContent,
  canonical,
  ...rest
}: HeadContentComponentProps) => {
  const router = useRouter();
  const pageRoute = process.env.NEXT_PUBLIC_BASE_URL + router?.asPath;

  const { isAllowed } = usePermission();
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    //Check permission
    let permission = PermissionsForPages[componentName];
    const requiredAuthentication =
      permission && permission.isAuthenticationRequired ? true : false;
    const requiredPermission =
      permission && permission.isPermissionRequired ? true : false;

    //redirect if authentication is required and user is not loggedIn
    if (requiredAuthentication && !isUserAuthenticated) {
      router?.push({
        pathname: "/login",
        query: { returnUrl: router?.asPath },
      });
    }

    //redirect if user doesn't have specific permission to view that page
    if (requiredPermission && !isAllowed(permission.permissionName)) {
      router?.push("/required-permission");
    }
  }, [componentName, isUserAuthenticated, isAllowed, router]);

  useEffect(() => {
    //redirect if authentication is required and user is not loggedIn
    const lgt = localStorage.getItem("logout_type");
    if (lgt == "true") {
      localStorage.removeItem("logout_type");
      router?.push("/");
    }
  }, [isUserAuthenticated]);

  return (
    <HeadContent
      title={metaContent?.title}
      description={metaContent?.description}
      route={pageRoute}
      author={metaContent?.author}
      componentName={componentName}
      canonical={canonical}
      {...rest}
    />
  );
};

export default HeadContentAndPermissionComponent;
