import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
import { Spin } from "antd";

import PermissionsForPages from "src/permissions";
import usePermission from "src/hooks/usePermissions";
import useAuthentication from "src/hooks/isUserAuthenticated";
// import { RootState, store } from "src/store";
// import { setLogOutType } from "src/store/slices/authSlice";

const WithAuthCheck = ({ componentName, children }) => {
  const router = useRouter();

  const { isAllowed } = usePermission();
  const { isUserAuthenticated, logOutType } = useAuthentication();

  // const logOutType = useSelector((state: RootState) => state.auth.logOutType);

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
    return (
      <div className="flex justify-center items-center w-full h-full min-h-screen">
        <Spin />
      </div>
    );
  }

  // Redirect based on authentication
  if (requiresAuth && !isUserAuthenticated && logOutType === "user") {
    router.push("/");
    // store.dispatch(setLogOutType(null));
    return (
      <div className="flex justify-center items-center w-full h-full min-h-screen">
        <Spin />
      </div>
    );
  }

  if (requiresAuth && !isUserAuthenticated && !logOutType) {
    router.push({
      pathname: "/login",
      query: { returnUrl: router.asPath },
    });
    return (
      <div className="flex justify-center items-center w-full h-full min-h-screen">
        <Spin />
      </div>
    );
  }

  if (requiresPermission && !isAllowed(permission.permissionName)) {
    // Redirect based on permission
    router.push("/required-permission");
    return (
      <div className="flex justify-center items-center w-full h-full min-h-screen">
        <Spin />
      </div>
    );
  }

  return children;
};

// const WithAuthCheck = ({
//   componentName,
//   children,
// }: {
//   componentName: string;
//   children: React.ReactNode;
// }) => {
//   const router = useRouter();

//   const { isAllowed } = usePermission();
//   const { isUserAuthenticated } = useAuthentication();

//   const logOutType = useSelector((state: RootState) => state.auth.logOutType);

//   const permission = PermissionsForPages[componentName];

//   const requiresAuth = permission?.isAuthenticationRequired;
//   const requiresPermission = permission?.isPermissionRequired;

//   console.log(
//     "Checking permissions for component:",
//     componentName,
//     logOutType,
//     isUserAuthenticated,
//     requiresAuth
//   );

//   // Redirect based on authentication
//   if (logOutType == "user") {
//     router.push("/");

//     store.dispatch(setLogOutType(null));
//     return (
//       <div className="flex justify-center items-center w-full h-full min-h-screen">
//         <Spin />
//       </div>
//     );
//   } else if (requiresAuth && !isUserAuthenticated && !logOutType) {
//     router.push({
//       pathname: "/login",
//       query: { returnUrl: router.asPath },
//     });

//     return (
//       <div className="flex justify-center items-center w-full h-full min-h-screen">
//         <Spin />
//       </div>
//     );
//   } else if (requiresPermission && !isAllowed(permission.permissionName)) {
//     // Redirect based on permission
//     router.push("/required-permission");

//     return (
//       <div className="flex justify-center items-center w-full h-full min-h-screen">
//         <Spin />
//       </div>
//     );
//   }

//   return children;
// };

export default WithAuthCheck;
