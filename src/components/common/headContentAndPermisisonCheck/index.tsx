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
      router.push("/login");
    }

    //redirect if user doesn't have specific permission to view that page
    if (requiredPermission && !isAllowed(permission.permissionName)) {
      router.push("/required-permission");
    }

    // set default meta tags
    if (!meta || Object.keys(meta).length === 0) {
      setMeta(MetaTags["default"]);
      console.log("Default Meta tags added");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentName]);

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
