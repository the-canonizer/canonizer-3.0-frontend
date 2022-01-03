import { useEffect, useState } from "react";
import HeadContent from "./headContent";
import MetaTags from "../../../MetaTags";
import { useRouter } from "next/router";
import PermissionsForPages from "../../../permissions";
import usePermission from "../../../hooks/usePermissions";
import useAuthentication from "../../../hooks/isUserAuthenticated";

const HeadContentComponent = ({ componentName }) => {
  debugger;
  const router = useRouter();
  const [meta, setMeta] = useState(MetaTags[componentName]);
  const [permission] = useState(PermissionsForPages[componentName]);
  const { isAllowed } = usePermission();
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    //Check permission

    const requiredAuthentication =
      permission && permission.isAuthenticationRequired ? true : false;

    const requiredPermission =
      permission && permission.isPermissionRequired ? true : false;

    if (requiredAuthentication && !isUserAuthenticated) {
      router.push("/login");
    }

    if (requiredPermission && !isAllowed(permission.permissionName)) {
      debugger;
      router.push("/required-permission");
    }

    // set default meta tags

    if (!meta || Object.keys(meta).length === 0) {
      setMeta(MetaTags["default"]);
      console.log("Default Meta tags added");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HeadContent
      title={meta?.title}
      description={meta?.description}
      route={meta?.route}
      image_url={meta?.image_url}
    />
  );
};

export default HeadContentComponent;
