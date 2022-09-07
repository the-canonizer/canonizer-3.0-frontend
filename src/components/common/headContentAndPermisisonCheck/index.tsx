import { useEffect, useState } from "react";
import HeadContent from "./headContent";
import MetaTags from "../../../metaTags";
import { useRouter } from "next/router";
import PermissionsForPages from "../../../permissions";
import usePermission from "../../../hooks/usePermissions";
import useAuthentication from "../../../hooks/isUserAuthenticated";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { setValue } from "src/store/slices/utilsSlice";

type HeadContentComponentProps = {
  componentName: string;
};

const HeadContentAndPermissionComponent = ({
  componentName,
}: HeadContentComponentProps) => {
  const router = useRouter();
  const [meta, setMeta] = useState(MetaTags[componentName]);
  const { isAllowed } = usePermission();
  const { isUserAuthenticated } = useAuthentication();

  const lg_type = useSelector((state: RootState) => state.utils.logout_type);

  const dispatch = useDispatch();

  const [logType, setLogType] = useState(lg_type);

  useEffect(() => setLogType(lg_type), [lg_type]);

  useEffect(() => {
    //Check permission
    let permission = PermissionsForPages[componentName];
    const requiredAuthentication =
      permission && permission.isAuthenticationRequired ? true : false;
    const requiredPermission =
      permission && permission.isPermissionRequired ? true : false;

    //redirect if authentication is required and user is not loggedIn

    if (requiredAuthentication && !isUserAuthenticated) {
      if (logType) {
        router.push("/");
      } else {
        router.push({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
      }
      dispatch(setValue({ label: "logout_type", value: false }));
    }

    //redirect if user doesn't have specific permission to view that page
    if (requiredPermission && !isAllowed(permission.permissionName)) {
      router.push("/required-permission");
    }

    // set default meta tags if page meta data not added
    const metaKeys = Object.keys(MetaTags);

    if (metaKeys.includes(componentName)) {
      setMeta(MetaTags[componentName]);
    } else {
      setMeta(MetaTags["default"]);
    }
  }, [
    componentName,
    isUserAuthenticated,
    isAllowed,
    router,
    logType,
    dispatch,
  ]);

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
