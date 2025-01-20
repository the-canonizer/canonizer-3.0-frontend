import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";

import PermissionsForPages from "src/permissions";
import usePermission from "src/hooks/usePermissions";
import useAuthentication from "src/hooks/isUserAuthenticated";

const Loading = () => (
  <div className="flex justify-center items-center w-full h-full min-h-screen">
    <Spin className="mr-2" /> Loading...
  </div>
);

const WithAuthCheck = ({ componentName, children }) => {
  const router = useRouter();

  const { isAllowed } = usePermission();
  const { isUserAuthenticated, logOutType } = useAuthentication();

  const permission = PermissionsForPages[componentName];

  const requiresAuth = permission?.isAuthenticationRequired;
  const requiresPermission = permission?.isPermissionRequired;

  // State to ensure we only check on the client side
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    // Set client-side flag to true when component mounts on the client
    setIsClientSide(true);
  }, []);

  if (!isClientSide) {
    // Render nothing or loading state until client-side
    return <Loading />;
  }

  // Redirect based on authentication
  if (requiresAuth && !isUserAuthenticated && logOutType === "user") {
    router.push("/");
    return <Loading />;
  }

  if (requiresAuth && !isUserAuthenticated && !logOutType) {
    router.push({
      pathname: "/login",
      query: { returnUrl: router.asPath },
    });
    return <Loading />;
  }

  if (requiresPermission && !isAllowed(permission.permissionName)) {
    // Redirect based on permission
    router.push("/required-permission");

    return <Loading />;
  }

  return children;
};

export default WithAuthCheck;
