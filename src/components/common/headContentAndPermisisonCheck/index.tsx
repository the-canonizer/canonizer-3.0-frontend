import { useEffect, useState } from "react";
import HeadContent from "./headContent";
import { useRouter } from "next/router";
import PermissionsForPages from "../../../permissions";
import usePermission from "../../../hooks/usePermissions";
import useAuthentication from "../../../hooks/isUserAuthenticated";
import { metaTagsApi } from "src/network/api/metaTagsAPI";

type HeadContentComponentProps = {
  componentName: string;
};

const HeadContentAndPermissionComponent = ({
  componentName,
}: HeadContentComponentProps) => {
  const router = useRouter();
  const pageRoute = process.env.NEXT_PUBLIC_SITE_NAME + router?.asPath;

  const { isAllowed } = usePermission();
  const { isUserAuthenticated } = useAuthentication();
  const [metaContent, setMetaContent] = useState(null);

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
  }, [componentName, isUserAuthenticated, isAllowed, router]);

  useEffect(() => {
    const req = {
      page_name: componentName,
      keys: {
        topic_num: router.asPath.includes("forum")
          ? router?.query?.topic?.toLocaleString().split("-")[0]
          : router?.query?.camp?.length && router.query.camp[0].split("-")[0],
        camp_num: router.asPath.includes("forum")
          ? router.query.camp?.toLocaleString().split("-")[0]
          : router?.query?.camp?.length > 1
          ? router.query.camp[1].split("-")[0]
          : "1",
        forum_num:
          router?.query?.camp?.length > 2
            ? router.query.camp[2].split("-")[0]
            : null,
      },
    };
    const defaultTags = {
      page_name: "Home",
      title: "Build consensus by canonizing what you believe is right",
      description:
        "Bringing the world together by canonizing what you believe is right. Your thoughts are processed through our pattented algorithims in a qualified & quantified camp where others can see, join & together change the world.",
      author: "",
    };
    async function apiCall() {
      const result = await metaTagsApi(req);
      result?.status_code == 200
        ? setMetaContent(result?.data)
        : setMetaContent(defaultTags);
    }
    apiCall();
  }, [componentName]);

  return (
    <HeadContent
      title={metaContent?.title}
      description={metaContent?.description}
      route={pageRoute}
      author={metaContent?.author}
    />
  );
};

export default HeadContentAndPermissionComponent;
