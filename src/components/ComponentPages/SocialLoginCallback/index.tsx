import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Skeleton, message } from "antd";
import { useDispatch } from "react-redux";

import {
  socialLoginCallback,
  socialLoginLinkUser,
} from "../../../network/api/userApi";
import { getSearchedParams } from "../../../utils/generalUtility";
import Spinner from "../../common/spinner/spinner";
import {
  showSocialEmailPopup,
  showSocialNamePopup,
} from "../../../store/slices/uiSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

function SocialLoginCallback() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const openModal = () => dispatch(showSocialEmailPopup());
  const openNameModal = () => dispatch(showSocialNamePopup());

  const sendData = async (data) => {
    const redirectTab = localStorage.getItem("redirectTab");
    const redirectSocial = localStorage.getItem("rd_s");

    if (!redirectTab) {
      const response = await socialLoginCallback(data, router);
      if (response && response.status_code === 200) {
        dispatch(
          setFilterCanonizedTopics({
            algorithm: response?.data?.user?.default_algo,
          })
        );
      }
      console.log("[response]", response);
      if (
        (response && response.status_code === 200) ||
        (response && response.status_code === 400)
      ) {
        if (redirectSocial) {
          localStorage.removeItem("rd_s");
          router.push("/settings?tab=profile");
        } else {
          router.push("/");
        }
      }

      if (response && response.status_code === 422) {
        openModal();
        localStorage.setItem("s_l", JSON.stringify(data));
      }

      if (response && response.status_code === 423) {
        openNameModal();
        localStorage.setItem(
          "s_l",
          JSON.stringify({ email: response.data.email, ...data })
        );
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
      const redirectTab = localStorage.getItem("redirectTab");

      let body = {
        code: params.code,
        provider: queryParams.provider,
      };

      if (queryParams.provider && params.code) {
        sendData(body);
      } else {
        localStorage.removeItem("rd_s");
        if (!redirectTab) {
          router.push("/");
        } else {
          router.push("/settings?tab=social");
        }
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <Fragment>
      <Spinner>
        <Skeleton active={isLoading} />
      </Spinner>
    </Fragment>
  );
}

export default SocialLoginCallback;
