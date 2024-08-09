import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import useAuthentication from "src/hooks/isUserAuthenticated";
import { useIsMobile } from "src/hooks/useIsMobile";
import CreateEditThreadPopup from "./UI/CreateThreadUI";
import { RootState } from "src/store";
import { createThread, updateThread } from "src/network/api/campForumApi";
import {
  setIsThreadDrawerOpen,
  setThread,
} from "src/store/slices/campForumSlice";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";

const ManageThread = ({ onSubmittedSucess = null }) => {
  const { campRecord, currentThread, topicRecord, isOpen }: any = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      currentThread: state?.forum?.currentThread,
      isOpen: state?.forum?.isThreadDrawerOpen,
    })
  );

  const { isUserAuthenticated } = useAuthentication();
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [isThreadUpdate, setIsThreadUpdate] = useState(false);
  const [isUpdateSubmit, serIsUpdateSubmit] = useState(false);

  const [form] = Form.useForm();

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  useEffect(() => {
    if (currentThread?.text) {
      form.setFieldValue("thread_title", currentThread?.text);
      form.validateFields();
      setIsThreadUpdate(true);
    } else {
      setIsThreadUpdate(false);
    }
  }, [currentThread?.text]);

  useEffect(() => {
    if (isThreadUpdate) {
      if (currentThread?.text !== values?.thread_title) {
        serIsUpdateSubmit(true);
      } else {
        serIsUpdateSubmit(false);
      }
    }
  }, [isThreadUpdate, currentThread?.text, values?.thread_title]);

  const getQueries = () => {
    const queries = router?.query;
    let p_camps = "";

    const topicArr = (queries?.topic as string)?.split("-");
    const campArr = (queries?.camp as string)?.split("-");
    const topic_num = topicArr?.shift();
    const camp_num = campArr?.shift();
    const topic = topicArr?.join(" ");
    const camp = campArr?.join(" ");
    if (campRecord && campRecord.parentCamps) {
      campRecord.parentCamps?.map((camp, index) => {
        p_camps += index !== 0 ? " / " : "";
        p_camps += `${camp?.camp_name}`;
      });
    }

    const paramsLists = {
      topic,
      camp: p_camps,
      camp_num,
      topic_num,
      by: queries.by,
      camp_name: camp,
    };

    return paramsLists;
  };

  const fetchNickNameList = async (topic_num: string) => {
    setIsLoading(false);

    if (isUserAuthenticated && topic_num) {
      const body = { topic_num };
      let response = await getAllUsedNickNames(body);
      if (response && response.status_code === 200) {
        setNickNameList(response.data);
        setInitialValues({ nick_name: response.data[0]?.id });
      }
    }
  };

  useEffect(() => {
    fetchNickNameList(getQueries()?.topic_num);
  }, [router?.query]);

  const closeDrawer = () => {
    form.resetFields();
    dispatch(setIsThreadDrawerOpen(false));
    if (currentThread) dispatch(setThread(null));
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    const q = router?.query;
    let res = null;

    if (values.thread_title.trim()) {
      if (isThreadUpdate && currentThread?.others?.id) {
        const body = {
          title: values.thread_title?.trim(),
          topic_num: getQueries()["topic_num"] || topicRecord?.topic_num,
          camp_num: getQueries()["camp_num"] || campRecord?.camp_num,
          camp_name: getQueries()["camp_name"] || campRecord?.camp_name,
        };
        res = await updateThread(body, +currentThread?.others?.id);
      } else {
        const body = {
          title: values.thread_title?.trim(),
          nick_name: values.nick_name,
          camp_num: getQueries()["camp_num"] || campRecord?.camp_num,
          camp_name: getQueries()["camp_name"] || campRecord?.camp_name,
          topic_num: getQueries()["topic_num"] || topicRecord?.topic_num,
          topic_name: getQueries()["topic"] || topicRecord?.topic_name,
        };
        res = await createThread(body);
      }
    } else {
      form.setFields([
        {
          name: "thread_title",
          value: "",
        },
      ]);
      form.validateFields(["thread_title"]);
    }

    if (res?.status_code === 400) {
      form?.setFields([
        {
          name: "thread_title",
          value: values?.thread_title,
          errors: [res?.message],
        },
      ]);
    }

    if (res && res?.status_code === 200) {
      message.success(res.message);
      closeDrawer();
      onSubmittedSucess();
    }
    setIsLoading(false);
  };

  return (
    <CreateEditThreadPopup
      onFinish={onFinish}
      form={form}
      onClose={closeDrawer}
      isOpen={isOpen}
      isMobile={isMobile}
      initialValue={initialValue}
      isThreadUpdate={isThreadUpdate}
      nickNameList={nickNameList}
      onCancel={closeDrawer}
      isLoading={isLoading}
      isDisabled={isDisabled}
      topicRecord={topicRecord}
      campRecord={campRecord}
      isUpdateSubmit={isUpdateSubmit}
    />
  );
};

export default ManageThread;
