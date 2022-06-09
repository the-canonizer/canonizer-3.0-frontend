import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

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
  createPost,
  updatePost,
  getPostsList,
  deletePost,
} from "../../../network/api/campForumApi";
import {
  getAllUsedNickNames,
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
} from "../../../network/api/campDetailApi";
import { setThread, setPost } from "../../../store/slices/campForumSlice";

const ForumComponent = ({}) => {
  const [paramsList, setParamsList] = useState({});
  const [threadList, setThreadList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [postList, setPostList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ppage, setPpage] = useState(1);
  const [pTotalRecords, setPtotalRecords] = useState(0);
  const [quillContent, setQuillContent] = useState("");
  const [isError, setIsError] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const isLog = isUserAuthenticated();

  const {
    topicRecord,
    campRecord,
    asof,
    asofdate,
    algorithm,
    currentThread,
    currentPost,
  } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    asof: state?.filters?.filterObject?.asof,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    currentThread: state.forum.currentThread,
    currentPost: state.forum.currentPost,
  }));

  const setCurrentThread = (data) => dispatch(setThread(data));

  const setCurrentPost = (data) => dispatch(setPost(data));

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

  const getPosts = async (id, page = 1, like = "", per_page = 10) => {
    const q = `?page=${page}&per_page=${per_page}&like=${like}`;

    const res = await getPostsList(id, q);
    if (res && res.status_code === 200) {
      setPostList(res.data?.items);
      setPtotalRecords(res.data?.total_rows);
      setPpage(res.data?.current_page);
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
    if (isLog) {
      router.push({
        pathname: `/forum/${queries.topic}/${queries.camp}/threads/create`,
      });
    } else {
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    }
  };

  const onThreadClick = (e, data) => {
    setCurrentThread(data);

    const queries = router?.query;

    e.preventDefault();
    e.stopPropagation();

    router.push({
      pathname: `/forum/${queries.topic}/${queries.camp}/threads/${data.id}`,
    });
  };

  const filterThread = (type) => {
    const queries = router?.query;

    if (type !== queries.by) {
      setTotalRecords(0);
      setThreadList([]);
      setPage(1);
      queries.by = type;
      router.push(router, undefined, { shallow: true });
    }
  };

  const onEditClick = (e, item) => {
    const queries = router?.query;

    e.preventDefault();
    e.stopPropagation();

    router.push({
      pathname: `/forum/${queries.topic}/${queries.camp}/threads/edit/${item.id}`,
    });
  };

  // end thread list section

  // create thread start

  const [form] = Form.useForm();

  const fetchNickNameList = async () => {
    const body = {
      topic_num: paramsList["topic_num"],
    };
    if (isLog) {
      let response = await getAllUsedNickNames(body);
      if (response && response.status_code === 200) {
        setNickNameList(response.data);
        setInitialValues({ nick_name: response.data[0]?.id });
      }
    }
  };

  useEffect(() => {
    if (paramsList["topic_num"]) {
      fetchNickNameList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsList, isLog]);

  const onCancelCreateThread = () => {
    const queries = router?.query;
    if (queries.tId) {
      const queries = router?.query;
      router.push({
        pathname: `/forum/${queries.topic}/${queries.camp}/threads`,
        query: { by: "my" },
      });
    } else {
      const queries = router?.query;
      router.push({
        pathname: `/forum/${queries.topic}/${queries.camp}/threads`,
      });
    }
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

    if (values.thread_title.trim()) {
      if (q.tId) {
        const body = {
          title: values.thread_title?.trim(),
          topic_num: paramsList["topic_num"],
          camp_num: paramsList["camp_num"],
        };
        res = await updateThread(body, +q.tId);
      } else {
        const body = {
          title: values.thread_title?.trim(),
          nick_name: values.nick_name,
          camp_num: paramsList["camp_num"],
          topic_num: paramsList["topic_num"],
          topic_name: paramsList["topic"],
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

    if (res && res.status_code === 200) {
      message.success(res.message);
      form.resetFields();
      if (q.tId) {
        const queries = router?.query;
        router.push({
          pathname: `/forum/${queries.topic}/${queries.camp}/threads`,
          query: { by: "my" },
        });
      } else {
        const queries = router?.query;
        router.push({
          pathname: `/forum/${queries.topic}/${queries.camp}/threads`,
        });
      }
    }
  };

  // create thread start

  //  post section start

  const [formPost] = Form.useForm();

  useEffect(() => {
    const q = router?.query;

    if (q.id) {
      getPosts(q.id, ppage);
    }
  }, [router, router?.query, ppage]);

  const onContentChange = (v) => {
    setQuillContent(v);
    setIsError(false);
  };

  const onFinishPost = async (values) => {
    const q = router.query;
    if (
      quillContent.trim() === "" ||
      quillContent === "<p><br></p>" ||
      quillContent === "<p> </p>"
    ) {
      setIsError(true);
      return;
    }

    setIsError(false);

    const campArr = (q.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (q?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();

    const body = {
      body: quillContent,
      nick_name: values.nick_name,
      thread_id: +q.id,
      camp_num: +camp_num,
      topic_num: +topic_num,
      topic_name: topicArr.join(" "),
    };

    let res = null;

    if (currentPost && currentPost["id"]) {
      res = await updatePost(body, currentPost["id"]);
      setCurrentPost({});
    } else {
      res = await createPost(body);
    }

    if (res && res.status_code === 200) {
      console.log("post created");
      message.success(res.message);
      getPosts(q.id, ppage);
      setQuillContent("");
    }
  };

  const onPostEditClick = (post) => {
    const element = document.querySelector("#new_post");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    setQuillContent(post.body);
    setCurrentPost(post);
  };

  const onDeleteClick = async (id) => {
    const q = router.query;

    const res = await deletePost(+id);
    if (res && res.status_code === 200) {
      message.success(res.message);
      getPosts(q.id, ppage);
    }
  };

  const onCancel = () => {
    onCancelCreateThread();
  };

  const pOnChange = (p, size) => {
    setPpage(p);
  };

  //  post section end

  return (
    <Fragment>
      <TopBar topicRecord={topicRecord} campRecord={campRecord} />
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
        />
      ) : null}
      {router?.pathname === "/forum/[topic]/[camp]/threads/[id]" ? (
        <ForumUIPost
          nickNameList={nickNameList}
          onCancel={onCancel}
          onFinishPost={onFinishPost}
          formPost={formPost}
          postList={postList}
          initialValue={initialValue}
          currentThread={currentThread}
          pCurrent={ppage}
          pTotal={pTotalRecords}
          pOnChange={pOnChange}
          quillContent={quillContent}
          onContentChange={onContentChange}
          isError={isError}
          onPostEditClick={onPostEditClick}
          onDeleteClick={onDeleteClick}
          isLog={isLog}
        />
      ) : null}
    </Fragment>
  );
};

export default ForumComponent;
