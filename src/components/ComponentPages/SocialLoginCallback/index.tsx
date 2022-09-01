import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Skeleton, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

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
import { setValue } from "src/store/slices/utilsSlice";
import { RootState } from "src/store";

function SocialLoginCallback() {
  const { rdType, rdSlTab } = useSelector((state: RootState) => ({
    rdType: state.utils.redirect_type,
    rdSlTab: state.utils.redirect_tab_setting,
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [redirectType, setRedirectType] = useState(rdType);
  // const [redirectSocialTab, setRedirectSocialTab] = useState(rdSlTab);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => setRedirectType(rdType), [rdType]);
  // useEffect(() => setRedirectSocialTab(rdSlTab), [rdSlTab]);

  const openModal = () => dispatch(showSocialEmailPopup());
  const openNameModal = () => dispatch(showSocialNamePopup());

  const sendData = async (data) => {
    const redirectTab = localStorage.getItem("redirectTab");

    if (!redirectTab) {
      const response = await socialLoginCallback(data, router);

      if (
        (response && response.status_code === 200) ||
        (response && response.status_code === 400)
      ) {
        if (redirectType) {
          dispatch(setValue({ label: "redirect_type", value: false }));

          router.push("/settings?tab=profile");
        } else {
          router.push("/");
        }
      }

      if (response && response.status_code === 422) {
        openModal();
        dispatch(setValue({ label: "social_login_keys", value: data }));
      }

      if (response && response.status_code === 423) {
        openNameModal();

        dispatch(
          setValue({
            label: "social_login_keys",
            value: { email: response.data.email, ...data },
          })
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
        dispatch(setValue({ label: "redirect_type", value: false }));

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
