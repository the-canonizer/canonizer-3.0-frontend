import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, message } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import isUserAuthenticated from "../../../hooks/isUserAuthenticated";
import TopBar from "./UI/TopBar";
import ForumUIList from "./List";
import ForumUICreate from "./Create";
import ForumUIPost from "./Post";

import {
  createThread,
  getThreadsList,
  updateThread,
} from "../../../network/api/campForumApi";
import {
  getAllUsedNickNames,
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
} from "../../../network/api/campDetailApi";

const postData = [
  {
    id: 1,
    post_by: "Multisense Realism",
    time: "replied 8 years ago (Dec 1, 2013, 11:44:56 PM)",
    content:
      "Rich, I do think that the astonishing hypothesis is half wrong (well, half wrong for human beings, completely wrong for matter in general, in that matter is a sensory experience, not the other way around.) but yes it sounds like we agree on the non-computational, or trans-computational nature of qualia.",
  },
  {
    id: 2,
    post_by: "richwil",
    time: "replied 8 years ago (Dec 1, 2013, 11:01:34 PM)",
    content:
      "Something like a brain scanner is only giving us a view of certain conditions, like magnetic resonance and blood oxygen levels, through which we can infer the brain or conscious experience.",
    title: "test",
  },
];

const ForumComponent = ({}) => {
  const [paramsList, setParamsList] = useState({});
  const [threadList, setThreadList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(30);
  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [postList, setPostList] = useState(postData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cardTitle, setCardTitle] = useState(null);
  const [ppage, setPpage] = useState(1);
  const [pTotalRecords, setPtotalRecords] = useState(50);

  const router = useRouter();

  const isLog = isUserAuthenticated();

  const { topicRecord, campRecord, asof, asofdate, algorithm } = useSelector(
    (state: RootState) => ({
      topicRecord: state?.topicDetails?.currentTopicRecord,
      campRecord: state?.topicDetails?.currentCampRecord,
      asof: state?.filters?.filterObject?.asof,
      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,
    })
  );

  const getSelectedNode = async (nodeKey) => {
    const queries = router?.query;
    const topicArr = (queries.topic as string).split("-");
    const topic_num = topicArr.shift();
    const campArr = (queries.camp as string).split("-");
    const camp_num = campArr.shift();

    const reqBody = {
      topic_num: +topic_num,
      camp_num: +nodeKey,
      as_of: asof,
      asofdate: asofdate || Date.now() / 1000,
      algorithm: algorithm,
      update_all: 1,
    };

    await Promise.all([
      getCurrentTopicRecordApi(reqBody),
      getCurrentCampRecordApi(reqBody),
    ]);
  };

  const getThreads = async (
    camp,
    topic,
    type = "all",
    page = 1,
    like = "",
    per_page = 10
  ) => {
    const q = `?camp_num=${camp}&topic_num=${topic}&type=${type}&page=${page}&per_page=${per_page}&like=${like}`;

    const res = await getThreadsList(q);
    if (res && res.status_code === 200) {
      setThreadList(res.data?.items);
      setTotalRecords(res.data?.total_rows);
      setPage(res.data?.current_page);
    }
  };

  useEffect(() => {
    if (isLog) {
      setIsLoggedIn(isLog);
    }
  }, [isLog]);

  useEffect(() => {
    if (router && router?.query) {
      const queries = router?.query;
      const campArr = (queries.camp as string).split("-");
      const camp_num = campArr.shift();
      getSelectedNode(camp_num);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, router?.query]);

  useEffect(() => {
    const queries = router?.query;
    let p_camps = "";

    const topicArr = (queries?.topic as string)?.split("-");
    const campArr = (queries?.camp as string)?.split("-");
    const topic_num = topicArr?.shift();
    const camp_num = campArr?.shift();
    const topic = topicArr?.join(" ");
    const camp = campArr?.join(" ");
    if (campRecord && campRecord.length) {
      campRecord[0].parentCamps?.map((camp, index) => {
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
    };

    setParamsList(paramsLists);
  }, [campRecord, router?.query]);

  // start thread List section

  useEffect(() => {
    const queries = router?.query;
    const campArr = (queries.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (queries?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();
    const type = queries["by"] as string;

    getThreads(camp_num, topic_num, type, page, searchQuery);
  }, [router, router?.query, page, searchQuery]);

  const onSearch = (v) => {
    setSearchQuery(v.trim());
  };

  const onChange = (p, size) => {
    setPage(p);
    const queries = router?.query;
    queries.page = p;
    router.push(router, undefined, { shallow: true });
  };

  const onCreateThread = () => {
    const queries = router?.query;
    router.push(`/forum/${queries.topic}/${queries.camp}/threads/create`);
  };

  const onThreadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("thred", e);
  };

  const filterThread = (type) => {
    const queries = router?.query;
    queries.by = type;
    router.push(router, undefined, { shallow: true });
  };

  const onEditClick = (e, item) => {
    const queries = router?.query;

    e.preventDefault();
    e.stopPropagation();

    router.push(
      `/forum/${queries.topic}/${queries.camp}/threads/edit/${item.id}`
    );
  };

  // end thread list section

  // create thread start

  const [form] = Form.useForm();

  const fetchNickNameList = async () => {
    const body = {
      topic_num: paramsList["topic_num"],
    };
    let response = await getAllUsedNickNames(body);
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
    }
  };

  useEffect(() => {
    if (paramsList["topic_num"]) {
      fetchNickNameList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsList]);

  const onCancelCreateThread = () => {
    const queries = router?.query;
    router.push(`/forum/${queries.topic}/${queries.camp}/threads`);
  };

  useEffect(() => {
    const q = router.query;
    const cI = threadList.filter((it) => +it.id === +q.tId);
    if (q.tId && cI[0]) {
      form.setFieldsValue({ thread_title: cI[0]?.title });
    }
  }, [form, router.query, threadList]);

  const onFinish = async (values) => {
    const q = router.query;
    let res = null;

    console.log(values, "submit");

    if (q.tId) {
      const body = {
        title: values.thread_title,
      };
      res = await updateThread(body, +q.tId);
    } else {
      const body = {
        title: values.thread_title,
        nick_name: values.nick_name,
        camp_num: paramsList["camp_num"],
        topic_num: paramsList["topic_num"],
        topic_name: paramsList["topic"],
      };
      res = await createThread(body);
    }

    if (res && res.status_code === 200) {
      message.success(res.message);
      form.resetFields();
      onCancelCreateThread();
    }
  };

  // create thread start

  //  post section start

  const [formPost] = Form.useForm();

  const onFinishPost = (values) => {
    console.log(values);
  };

  const onCancel = () => {
    console.log("onCancel");
  };

  const pOnChange = (p, size) => {
    setPpage(p);
    console.log("pOnChange", p, size);
  };

  //  post section end

  return (
    <Fragment>
      <TopBar paramsList={paramsList} />
      {router?.pathname === "/forum/[topic]/[camp]/threads" ? (
        <ForumUIList
          onSearch={onSearch}
          onChange={onChange}
          onCreateThread={onCreateThread}
          threadList={threadList}
          onThreadClick={onThreadClick}
          onEditClick={onEditClick}
          current={page}
          total={totalRecords}
          filterThread={filterThread}
          isLoggedIn={isLoggedIn}
          paramsList={paramsList}
        />
      ) : null}
      {router?.pathname === "/forum/[topic]/[camp]/threads/create" ? (
        <ForumUICreate
          isThreadUpdate={false}
          nickNameList={nickNameList}
          onCancelCreateThread={onCancelCreateThread}
          onFinish={onFinish}
          form={form}
          initialValue={initialValue}
          paramsList={paramsList}
        />
      ) : null}
      {router?.pathname === "/forum/[topic]/[camp]/threads/edit/[tId]" ? (
        <ForumUICreate
          isThreadUpdate={true}
          nickNameList={nickNameList}
          onCancelCreateThread={onCancelCreateThread}
          onFinish={onFinish}
          form={form}
          initialValue={initialValue}
          paramsList={paramsList}
        />
      ) : null}
      {router?.pathname === "/forum/[topic]/[camp]/threads/[id]" ? (
        <ForumUIPost
          nickNameList={nickNameList}
          onCancel={onCancel}
          onFinishPost={onFinishPost}
          formPost={formPost}
          startedBy={"startedBy"}
          postCount={0}
          postList={postList}
          threadStamps={"threadStamps"}
          initialValue={initialValue}
          cardTitle={cardTitle}
          pCurrent={ppage}
          pTotal={pTotalRecords}
          pOnChange={pOnChange}
          paramsList={paramsList}
        />
      ) : null}
    </Fragment>
  );
};

export default ForumComponent;
