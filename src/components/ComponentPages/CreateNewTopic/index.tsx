import { Fragment, useState, useEffect } from "react";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { createTopic } from "../../../network/api/topicAPI";
import { getNickNameList } from "../../../network/api/userApi";
import { RootState } from "../../../store";
import { setCurrentTopic } from "../../../store/slices/topicSlice";
import CreateNewTopicUI from "./UI/TopicUI";
import isAuth from "../../../hooks/isUserAuthenticated";
import {
  setFilterCanonizedTopics,
  setShowDrawer,
} from "../../../store/slices/filtersSlice";
import messages from "../../../messages";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

const CreateNewTopic = ({
  testNickName = [],
  testNamespace = [],
  testInitialValue = {},
}: any) => {
  const { nameSpaces, filterByScore, filterObject, viewThisVersion } =
    useSelector((state: RootState) => ({
      filterByScore: state.filters?.filterObject?.filterByScore,
      filterObject: state?.filters?.filterObject,
      viewThisVersion: state?.filters?.viewThisVersionCheck,
      nameSpaces: state.homePage.nameSpaces || testNamespace,
    }));

  const [nickNameList, setNickNameList] = useState(testNickName);
  const [initialValue, setInitialValues] = useState(testInitialValue);
  const [options, setOptions] = useState([...messages.preventCampLabel]);
  const [isLoading, setIsLoading] = useState(false);
  const [existedTopic, setExistedTopic] = useState({
    data: null,
    status: false,
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isUserAuthenticated } = isAuth();

  const [form] = Form.useForm();

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
    }
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchNickNameList();
    }
  }, [isUserAuthenticated]);

  const onFinish = async (values: any) => {
    setIsFormSubmitted(true);
    setIsLoading(true);
    // if (!values.topic_name?.trim()) {
    //   form.setFields([
    //     {
    //       name: "topic_name",
    //       value: "",
    //     },
    //   ]);
    //   form.validateFields(["topic_name"]);
    //   setIsLoading(false);
    //   return true;
    // }

    const body = {
      topic_name: values.topic_name?.trim(),
      namespace: values.namespace,
      nick_name: values.nick_name,
      note: values.edit_summary?.trim(),
    };

    const res = await createTopic(body);

    if (res && res.status_code === 200) {
      message.success(res.message);
      storeFilterClear();
      const data = {
        submitter_nick_id: res.data.submitter_nick_id,
        message: res.message,
        topic_num: res.data.topic_num,
        topic_name: res.data.topic_name,
      };
      dispatch(setCurrentTopic(data));
      router?.push(
        `/topic/${res.data.topic_num}-${replaceSpecialCharacters(
          res.data.topic_name,
          "-"
        )}/1-Agreement/?score=${filterByScore}&algo=${filterObject?.algorithm}${
          filterObject?.asof == "bydate"
            ? "&asofdate=" + filterObject?.asofdate
            : ""
        }&asof=${filterObject?.asof}&canon=${filterObject?.namespace_id}${
          viewThisVersion ? "&viewversion=1" : ""
        }`
      );

      const oldOptions = [...options];
      await oldOptions.map((op) => {
        op.checked = false;
        op.disable = false;
      });
      setOptions(oldOptions);

      dispatch(setShowDrawer(true));
      return;
    }

    if (res && res.status_code === 400) {
      let url = null;
      if (res?.error) {
        const errors_key = Object.keys(res.error);

        if (errors_key.length) {
          if ("existed_topic_reference" in res.error) {
            let topicId = res?.error?.existed_topic_reference?.topic_num;
            let topicName = replaceSpecialCharacters(
              res?.error?.existed_topic_reference?.topic_name,
              "_"
            );
            url = `/topic/${topicId}-${topicName}/1-Agreement`;

            setExistedTopic({
              status: true,
              data: url,
            });
          }

          errors_key.forEach((key) => {
            if (key !== "topic_name") {
              form.setFields([
                {
                  name: key,
                  value: values[key],
                  errors: [res.error[key]],
                },
              ]);
            }
          });
        }
      }
    }
    setIsLoading(false);
  };

  const storeFilterClear = () => {
    dispatch(
      setFilterCanonizedTopics({
        filterByScore: "",
      })
    );
  };

  const onCancel = () => {
    router?.push({ pathname: "/" });
  };

  // checkbox
  useEffect(() => {
    return () => {
      const oldOptions = [...options];
      oldOptions.map((op) => {
        op.checked = false;
      });

      setOptions(oldOptions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <CreateNewTopicUI
        onFinish={onFinish}
        form={form}
        initialValue={initialValue}
        nameSpaces={nameSpaces}
        nickNameList={nickNameList}
        onCancel={onCancel}
        isLoading={isLoading}
        existedTopic={existedTopic}
        isFormSubmitted={isFormSubmitted}
        setIsFormSubmitted={setIsFormSubmitted}
        setExistedTopic={setExistedTopic}
      />
    </Fragment>
  );
};

export default CreateNewTopic;
