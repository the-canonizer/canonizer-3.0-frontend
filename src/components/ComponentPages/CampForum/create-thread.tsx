import { Fragment, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Form, message } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
import ForumUICreate from "./Create";
import { createThread } from "src/network/api/campForumApi";
import {
  getAllUsedNickNames,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import CampInfoBar from "../TopicDetails/CampInfoBar/index-app";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

const ForumComponent = () => {
  const router = useRouter(),
    params = useParams(),
    searchParams = useSearchParams();

  const { isUserAuthenticated } = useIsUserAuthenticated();

  const [paramsList, setParamsList] = useState({});
  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [loading, setLoading] = useState(false);

  useEffect(() => setIsLoggedIn(isUserAuthenticated), [isUserAuthenticated]);

  const { campRecord, asof, asofdate, algorithm }: any = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      asof: state?.filters?.filterObject?.asof,
      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,
    })
  );

  const getSelectedNode = async (nodeKey: string | number | undefined) => {
    if (params && params.topic) {
      const topicArr = (params.topic as string).split("-");
      const topic_num = topicArr.shift();
      const reqBody = {
        topic_num: topic_num !== undefined ? +topic_num : 0,
        camp_num: nodeKey !== undefined ? +nodeKey : 0,
        as_of: asof,
        as_of_date: asofdate || Date.now() / 1000,
        algorithm: algorithm,
        update_all: 1,
      };

      await getCurrentCampRecordApi(reqBody);
    }
  };

  useEffect(() => {
    if (params) {
      const campArr = (params.camp as string).split("-");
      const camp_num = campArr.shift();
      getSelectedNode(camp_num);
    }
  }, [router]);

  useEffect(() => {
    let p_camps = "";

    const topicArr = (params?.topic as string)?.split("-");
    const campArr = (params?.camp as string)?.split("-");
    const topic_num = topicArr?.shift();
    const camp_num = campArr?.shift();
    const topic = topicArr?.join(" ");
    const camp = campArr?.join(" ");
    if (campRecord && campRecord?.parentCamps) {
      campRecord?.parentCamps?.map((camp, index) => {
        p_camps += index !== 0 ? " / " : "";
        p_camps += `${camp?.camp_name}`;
      });
    }

    const paramsLists = {
      topic,
      camp: p_camps,
      camp_num,
      topic_num,
      by: searchParams?.get("by"),
      camp_name: camp,
    };

    setParamsList(paramsLists);
  }, [campRecord, router]);

  const [form] = Form.useForm();

  async function fetchNickNameList(topic_num: string | undefined) {
    setLoading(false);

    if (isLoggedIn && topic_num) {
      const body = { topic_num };
      let response = await getAllUsedNickNames(body);
      if (response && response.status_code === 200) {
        setNickNameList(response.data);
        setInitialValues({ nick_name: response.data[0]?.id });
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    const topicArr = (params?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();

    fetchNickNameList(topic_num);
  }, [router, isLoggedIn]);

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

  const onFinish = async (values: { thread_title: string; nick_name: any }) => {
    setLoading(true);
    let res: any;

    if (values.thread_title.trim()) {
      const body = {
        title: values.thread_title?.trim(),
        nick_name: values.nick_name,
        camp_num: paramsList["camp_num"],
        topic_num: paramsList["topic_num"],
        topic_name: paramsList["topic"],
        camp_name: paramsList["camp_name"],
      };
      res = await createThread(body);
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
        )}/${replaceSpecialCharacters(params?.camp as string, "-")}/threads`
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
        isThreadUpdate={false}
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
