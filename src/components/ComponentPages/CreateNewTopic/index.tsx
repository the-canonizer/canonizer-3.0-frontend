import { Fragment, useState, useEffect } from "react";
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { createTopic } from "../../../network/api/topicAPI";
import { getNickNameList } from "../../../network/api/userApi";
import { RootState } from "../../../store";
import { setCurrentTopic } from "../../../store/slices/topicSlice";
import CreateNewTopicUI from "./TopicUI";

const CreateNewTopic = ({
  testNickName = [],
  testNamespace = [],
  testInitialValue = {},
}) => {
  const [nickNameList, setNickNameList] = useState(testNickName);
  const [initialValue, setInitialValues] = useState(testInitialValue);

  const nameSpaces =
    useSelector((state: RootState) => state.homePage.nameSpaces) ||
    testNamespace;

  const router = useRouter();
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
    }
  };

  useEffect(() => {
    fetchNickNameList();
  }, []);

  const onFinish = async (values: any) => {
    const body = {
      topic_name: values.topic_name,
      namespace: values.namespace,
      nick_name: values.nick_name,
      note: values.edit_summary,
    };

    const res = await createTopic(body);

    if (res && res.status_code === 200) {
      dispatch(setCurrentTopic({ message: res.message, ...res.data }));
      router.push(`/topic-history/${res.data.topic_num}`);
    }
  };

  const onCancel = () => {
    router.push("/");
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
      />
    </Fragment>
  );
};

export default CreateNewTopic;
