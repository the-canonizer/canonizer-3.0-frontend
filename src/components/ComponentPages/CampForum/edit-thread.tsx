import { Fragment, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "src/store";
import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
import ForumUICreate from "./Create";
import { getThreadData, updateThread } from "src/network/api/campForumApi";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import CampInfoBar from "../TopicDetails/CampInfoBar/index-app";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { setThread } from "src/store/slices/campForumSlice";

const ForumComponent = () => {
  const { currentThread }: any = useSelector((state: RootState) => ({
    currentThread: state.forum.currentThread,
  }));

  const router = useRouter(),
    params = useParams(),
    searchParams = useSearchParams();

  const { isUserAuthenticated } = useIsUserAuthenticated();

  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [loading, setLoading] = useState(false);
  const [threadData, setThreadData] = useState({});

  useEffect(() => setIsLoggedIn(isUserAuthenticated), [isUserAuthenticated]);
  useEffect(() => setThreadData(currentThread), [currentThread]);

  const [form] = Form.useForm();

  async function fetchNickNameList() {
    setLoading(true);
    const topicArr = (params?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();

    if (isLoggedIn && topic_num) {
      const body = { topic_num };
      let response = await getAllUsedNickNames(body);
      if (response && response.status_code === 200) {
        setNickNameList(response.data);
        setInitialValues({ nick_name: response.data[0]?.id });
      }
    }
    setLoading(false);
  }

  const threadDetails = async () => {
    const res = await getThreadData(params?.tId);

    if (res && res.status_code === 200) {
      const data = res.data;
      setThreadData(data);
      form.setFieldsValue({ thread_title: data?.title });
    }
  };

  useEffect(() => {
    fetchNickNameList();
  }, [isLoggedIn]);

  useEffect(() => {
    if (params?.tId) threadDetails();
  }, []);

  const onCancelCreateThread = () => {
    const topic = params?.topic as string;
    const camp = params?.camp as string;
    const tId = params?.tId;

    const topicSlug = replaceSpecialCharacters(topic, "-");
    const campSlug = replaceSpecialCharacters(camp, "-");

    if (tId) {
      router.push(`/forum/${topicSlug}/${campSlug}/threads?by=me`);
    } else if (searchParams?.get("from")) {
      const redirectPath = searchParams?.get("from") as string;
      router.push(redirectPath);
    } else {
      router.push(`/forum/${topicSlug}/${campSlug}/threads`);
    }
  };

  const onFinish = async (values: { thread_title: string }) => {
    setLoading(true);
    let res: any;
    const ids = params?.tId,
      topicArr = (params?.topic as string)?.split("-"),
      campArr = (params?.camp as string)?.split("-"),
      topic_num = topicArr?.shift(),
      camp_num = campArr?.shift(),
      camp_name = campArr?.shift();

    if (values.thread_title.trim()) {
      const body = {
        title: values.thread_title?.trim(),
        topic_num: topic_num,
        camp_num: camp_num,
        camp_name: camp_name,
      };
      res = await updateThread(body, ids);
    } else {
      form.setFields([
        {
          name: "thread_title",
          value: "",
        },
      ]);
      form.validateFields(["thread_title"]);
    }

    if (res && res?.status_code === 200) {
      message.success(res?.message);
      form.resetFields();
      router.push(
        `/forum/${replaceSpecialCharacters(
          params?.topic as string,
          "-"
        )}/${replaceSpecialCharacters(
          params?.camp as string,
          "-"
        )}/threads?by=my`
      );
    }
    setLoading(false);
  };

  let payload = {
    camp_num: (params?.camp as string)?.split("-")[0] ?? "1",
    topic_num: (params?.topic as string)?.split("-")[0],
  };

  return (
    <Fragment>
      <CampInfoBar payload={payload} />
      <ForumUICreate
        isThreadUpdate={true}
        nickNameList={nickNameList}
        onCancelCreateThread={onCancelCreateThread}
        onFinish={onFinish}
        form={form}
        initialValue={initialValue}
        isLoading={loading}
      />
    </Fragment>
  );
};

export default ForumComponent;
