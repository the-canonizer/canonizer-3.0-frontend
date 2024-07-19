import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Card, message } from "antd";
import { useSelector } from "react-redux";

import PreferencesUI from "./UI/preferences";
import { AppDispatch } from "src/store";
import Spinner from "src/components/common/spinner/spinner";
import { getAllTags, savePrefTags } from "src/network/api/tagsApi";
import { RootState } from "src/store";
import { setTags } from "src/store/slices/tagsSlice";

const Preferences = () => {
  const dispatch = useDispatch<AppDispatch>(),
    router = useRouter();

  const { tags, currentReturnUrl } = useSelector((state: RootState) => ({
    tags: state?.tag?.tags,
    currentReturnUrl: state?.auth?.currentReturnUrl,
  }));

  const onFinish = async (e) => {
    e?.preventDefault();

    const userTags = [];
    tags?.forEach((ch) => {
      if (ch?.checked) {
        userTags?.push(ch?.id);
      }
    });

    const res = await savePrefTags(userTags);

    if (res && res.status_code === 200) {
      message.success(res.message);

      if (router?.query.returnUrl) {
        router?.push(`${router?.query.returnUrl}`);
      } else if (currentReturnUrl) {
        router?.push({ pathname: currentReturnUrl });
      } else {
        router?.push({ pathname: "/" });
      }
    }
  };

  const getTags = async () => {
    await getAllTags();
  };

  useEffect(() => {
    getTags();
  }, []);

  const onChange = (data) => {
    const OldTags = [...tags],
      newTags = [];
    OldTags?.forEach((ch) => {
      if (data?.id === ch?.id) {
        newTags?.push({ ...ch, checked: !ch.checked });
      } else {
        newTags?.push(ch);
      }
    });

    dispatch(setTags(newTags));
  };

  const onSkip = (e) => {
    e?.preventDefault();
    if (router?.query.returnUrl) {
      router?.push(`${router?.query.returnUrl}`);
    } else if (currentReturnUrl) {
      router?.push({ pathname: currentReturnUrl });
    } else {
      router?.push({ pathname: "/" });
    }
    // router?.push({ pathname: "/" });
    // router?.push({ pathname: "/settings" });
  };

  return (
    <Spinner>
      <Card bordered={false}>
        <PreferencesUI
          onFinish={onFinish}
          onChange={onChange}
          tags={tags}
          onSkip={onSkip}
        />
      </Card>
    </Spinner>
  );
};

export default Preferences;
