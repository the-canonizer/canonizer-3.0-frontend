import { Skeleton, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import GetStartedLayout from "../../hoc/getStartedLayout";
import { socialLoginCallback } from "../../network/api/userApi";
import { AppDispatch } from "../../store";
import { getSearchedParams } from "../../utils/generalUtility";

function SocialLoginCallback() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const sendData = async (data) => {
    let response = await socialLoginCallback(data);

    const redirectTab = localStorage.getItem("redirectTab");

    if (response && response.status_code === 200) {
      if (
        response.data.type === "social_link" &&
        redirectTab === "tab=social"
      ) {
        message.success(response.message);
        localStorage.removeItem("redirectTab");
        router.push("/settings?tab=social");
      } else {
        router.push("/");
      }
    }

    if (
      response &&
      response.status_code === 403 &&
      redirectTab === "tab=social"
    ) {
      message.error(response.message);
      router.push("/settings?tab=social");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      const queryParams = router.query;
      const params = getSearchedParams();

      let body = {
        code: params.code,
        provider: queryParams.provider,
      };

      if (queryParams.provider) {
        sendData(body);
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query]);

  const routeProps = {
    routeName: router.pathname,
  };

  return (
    <GetStartedLayout initialProps={undefined} initialState={undefined}>
      <Skeleton active={isLoading} />
    </GetStartedLayout>
  );
}

export default SocialLoginCallback;
