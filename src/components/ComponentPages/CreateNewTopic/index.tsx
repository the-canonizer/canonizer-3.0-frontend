import { Fragment, useState, useEffect } from "react";
import { Form, message } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { createTopic } from "../../../network/api/topicAPI";
import { getNickNameList } from "../../../network/api/userApi";
import { RootState } from "../../../store";
import { setCurrentTopic } from "../../../store/slices/topicSlice";
import CreateNewTopicUI from "./UI/TopicUI";
import isAuth from "../../../hooks/isUserAuthenticated";
import { setFilterCanonizedTopics } from "../../../store/slices/filtersSlice";
import messages from "../../../messages";

const CreateNewTopic = ({
  testNickName = [],
  testNamespace = [],
  testInitialValue = {},
}) => {
  const [nickNameList, setNickNameList] = useState(testNickName);
  const [initialValue, setInitialValues] = useState(testInitialValue);
  const [options, setOptions] = useState([...messages.preventCampLabel]);

  const nameSpaces =
    useSelector((state: RootState) => state.homePage.nameSpaces) ||
    testNamespace;

  const router = useRouter();
  const dispatch = useDispatch();
  const isLogIn = isAuth();

  const [form] = Form.useForm();

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
    }
  };

  useEffect(() => {
    if (isLogIn) {
      fetchNickNameList();
    }
  }, [isLogIn]);

  const onFinish = async (values: any) => {
    if (!values.topic_name?.trim()) {
      form.setFields([
        {
          name: "topic_name",
          value: "",
        },
      ]);
      form.validateFields(["topic_name"]);
      return true;
    }

    const body = {
      topic_name: values.topic_name?.trim(),
      namespace: values.namespace,
      nick_name: values.nick_name,
      note: values.edit_summary?.trim(),
    };

    options.map((op) => (body[op.id] = op.checked ? 1 : 0));

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
      router.push({
        pathname: `/topic/${res.data.topic_num}-${encodeURIComponent(
          res.data.topic_name?.split(" ").join("-")
        )}/1-Agreement`,
      });

      const oldOptions = [...options];
      await oldOptions.map((op) => (op.checked = false));
      setOptions(oldOptions);
    }

    if (res && res.status_code === 400) {
      if (res?.error) {
        const errors_key = Object.keys(res.error);

        if (errors_key.length) {
          errors_key.forEach((key) => {
            form.setFields([
              {
                name: key,
                value: values[key],
                errors: [res.error[key]],
              },
            ]);
          });
        }
      }
    }
  };

  const storeFilterClear = () => {
    dispatch(
      setFilterCanonizedTopics({
        filterByScore: "",
      })
    );
  };

  const onCancel = () => {
    router.push({ pathname: "/" });
  };

  // checkbox
  const onCheckboxChange = async (e: CheckboxChangeEvent) => {
    const oldOptions = [...options];
    await oldOptions.map((op) =>
      op.id === e.target.value ? (op.checked = e.target.checked) : ""
    );
    setOptions(oldOptions);
  };

  return (
    <Fragment>
      <CreateNewTopicUI
        onFinish={onFinish}
        form={form}
        initialValue={initialValue}
        nameSpaces={nameSpaces}
        nickNameList={nickNameList}
        onCancel={onCancel}
        options={options}
        onCheckboxChange={onCheckboxChange}
      />
    </Fragment>
  );
};

export default CreateNewTopic;
