import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Skeleton, message } from "antd";

import { socialLoginCallback } from "../../../network/api/userApi";
import { getSearchedParams } from "../../../utils/generalUtility";
import { showMultiUserModal } from "../../../store/slices/uiSlice";
import Spinner from "../../common/spinner/spinner";

function SocialLoginCallback() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const showModal = () => dispatch(showMultiUserModal());

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
      localStorage.removeItem("redirectTab");
      message.error(response.message);
      router.push("/settings?tab=social&status=403");
      showModal();
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
