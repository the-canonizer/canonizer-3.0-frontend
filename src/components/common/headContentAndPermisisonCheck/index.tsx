import { useEffect, useState } from "react";
import HeadContent from "./headContent";
import MetaTags from "../../../metaTags";
import { useRouter } from "next/router";
import PermissionsForPages from "../../../permissions";
import usePermission from "../../../hooks/usePermissions";
import useAuthentication from "../../../hooks/isUserAuthenticated";

type HeadContentComponentProps = {
  componentName: string;
};

const HeadContentAndPermissionComponent = ({
  componentName,
}: HeadContentComponentProps) => {
  const router = useRouter();
  const [meta, setMeta] = useState(MetaTags[componentName]);
  const { isAllowed } = usePermission();
  const isUserAuthenticated = useAuthentication();

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
      if (lgt) {
        router.push("/");
      } else {
        router.push({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
      }
      localStorage.removeItem("logout_type");
    }

    //redirect if user doesn't have specific permission to view that page
    if (requiredPermission && !isAllowed(permission.permissionName)) {
      router.push("/required-permission");
    }

    // set default meta tags if page meta data not added
    const metaKeys = Object.keys(MetaTags);

    metaKeys.includes(componentName)
      ? setMeta(MetaTags[componentName])
      : setMeta(MetaTags["default"]);
  }, [componentName, isUserAuthenticated, isAllowed, router]);

  return (
    <HeadContent
      title={meta?.title}
      description={meta?.description}
      route={meta?.route}
      image_url={meta?.image_url}
    />
  );
};

export default HeadContentAndPermissionComponent;
