import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Skeleton, message } from "antd";

import {
  socialLoginCallback,
  socialLoginLinkUser,
} from "../../../network/api/userApi";
import { getSearchedParams } from "../../../utils/generalUtility";
import Spinner from "../../common/spinner/spinner";

function SocialLoginCallback() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const sendData = async (data) => {
    const redirectTab = localStorage.getItem("redirectTab");

    if (!redirectTab) {
      const response = await socialLoginCallback(data, router);

      if (response && response.status_code === 200) {
        router.push("/");
      }
      if (response && response.status_code === 400) {
        router.push("/");
      }
    } else {
      const response = await socialLoginLinkUser(data);

      if (response && response.status_code === 200) {
        message.success(response.message);
        localStorage.removeItem("redirectTab");
        router.push("/settings?tab=social");
      }

      if (response && response.status_code === 403) {
        localStorage.removeItem("redirectTab");
        message.error(response.message);
        router.push("/settings?tab=social&status=403");
      }
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
  }, [router.query]);

  return (
    <Spinner>
      <Skeleton active={isLoading} />
    </Spinner>
  );
}

export default SocialLoginCallback;
