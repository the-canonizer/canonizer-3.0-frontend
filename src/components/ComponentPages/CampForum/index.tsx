import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../store";
import useIsUserAuthenticated from "../../../hooks/isUserAuthenticated";
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
import CampInfoBar from "../TopicDetails/CampInfoBar";

const ForumComponent = ({}) => {
  const auth = useIsUserAuthenticated();

  const [paramsList, setParamsList] = useState({});
  const [threadList, setThreadList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [postList, setPostList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(auth);
  const [ppage, setPpage] = useState(1);
  const [pTotalRecords, setPtotalRecords] = useState(0);
  const [quillContent, setQuillContent] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoggedIn(auth);
  }, [auth]);

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

  async function getThreads(
    camp,
    topic,
    type = "all",
    page = 1,
    like = "",
    per_page = 10
  ) {
    let res = null;

    if (isLoggedIn && type !== "all") {
      let q = `?camp_num=${camp}&topic_num=${topic}&type=${type}&page=${page}&per_page=${per_page}&like=${like}`;

      res = await getThreadsList(q);
    } else {
      let q = `?camp_num=${camp}&topic_num=${topic}&type=all&page=${page}&per_page=${per_page}&like=${like}`;

      res = await getThreadsList(q);
    }

    if (res && res.status_code === 200) {
      setThreadList(res.data?.items);
      setTotalRecords(res.data?.total_rows);
      setPage(res.data?.current_page);
    }
  }

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
    if (router && router?.query) {
      const queries = router?.query;
      const campArr = (queries.camp as string).split("-");
      const camp_num = campArr.shift();
      getSelectedNode(camp_num);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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
      camp_name: camp,
    };

    setParamsList(paramsLists);
  }, [campRecord, router]);

  // start thread List section

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
    if (isLoggedIn) {
      router.push({
        pathname: `/forum/${encodeURIComponent(
          queries?.topic as string
        )}/${encodeURIComponent(queries?.camp as string)}/threads/create`,
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
      pathname: `/forum/${encodeURIComponent(
        queries.topic as string
      )}/${encodeURIComponent(queries.camp as string)}/threads/${data.id}`,
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
      pathname: `/forum/${encodeURIComponent(
        queries.topic as string
      )}/${encodeURIComponent(queries.camp as string)}/threads/edit/${item.id}`,
    });
  };

  // end thread list section

  // create thread start

  const [form] = Form.useForm();

  async function fetchNickNameList(topic_num) {
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
    const queries = router?.query;
    const campArr = (queries.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (queries?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();
    const type = queries["by"] as string;

    getThreads(camp_num, topic_num, type, page, searchQuery);

    if (
      router?.pathname === "/forum/[topic]/[camp]/threads/create" ||
      router?.pathname === "/forum/[topic]/[camp]/threads/edit/[tId]" ||
      router?.pathname === "/forum/[topic]/[camp]/threads/[id]"
    ) {
      fetchNickNameList(topic_num);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, page, searchQuery, isLoggedIn]);

  const onCancelCreateThread = () => {
    const queries = router?.query;
    if (queries.tId) {
      const queries = router?.query;
      router.push({
        pathname: `/forum/${encodeURIComponent(
          queries.topic as string
        )}/${encodeURIComponent(queries.camp as string)}/threads`,
        query: { by: "my" },
      });
    } else {
      const queries = router?.query;
      router.push({
        pathname: `/forum/${encodeURIComponent(
          queries.topic as string
        )}/${encodeURIComponent(queries.camp as string)}/threads`,
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
    setLoading(true);
    const q = router.query;
    let res = null;

    if (values.thread_title.trim()) {
      if (q.tId) {
        const body = {
          title: values.thread_title?.trim(),
          topic_num: paramsList["topic_num"],
          camp_num: paramsList["camp_num"],
          camp_name: paramsList["camp_name"],
        };
        res = await updateThread(body, +q.tId);
      } else {
        const body = {
          title: values.thread_title?.trim(),
          nick_name: values.nick_name,
          camp_num: paramsList["camp_num"],
          topic_num: paramsList["topic_num"],
          topic_name: paramsList["topic"],
          camp_name: paramsList["camp_name"],
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
          pathname: `/forum/${encodeURIComponent(
            queries.topic as string
          )}/${encodeURIComponent(queries.camp as string)}/threads`,
          query: { by: "my" },
        });
      } else {
        const queries = router?.query;
        router.push({
          pathname: `/forum/${encodeURIComponent(
            queries.topic as string
          )}/${encodeURIComponent(queries.camp as string)}/threads`,
        });
      }
    }
    setLoading(false);
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
    // v = v.replace(/(^|>)\s+|\s+(?=<|$)/g, "$1");

    setQuillContent(v);
    setIsError(false);
  };

  const isEmpty = (txt) => {
    const commentText = txt.trim();
    const re = /^<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>$/gm;
    return re.test(commentText);
  };

  const onFinishPost = async (values) => {
    setPostLoading(true);
    const q = router.query;

    if (quillContent.trim() === "" || isEmpty(quillContent)) {
      setIsError(true);
      setPostLoading(false);
      return true;
    }

    setIsError(false);

    const campArr = (q.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (q?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();

    const body = {
      body: quillContent?.replace(/(^|>)\s+|\s+(?=<|$)/g, "$1"),
      nick_name: values.nick_name,
      thread_id: +q.id,
      camp_num: +camp_num,
      topic_num: +topic_num,
      topic_name: topicArr.join(" "),
      camp_name: campArr.join(" "),
    };

    let res = null;

    if (currentPost && currentPost["id"]) {
      res = await updatePost(body, currentPost["id"]);
      setCurrentPost({});
    } else {
      res = await createPost(body);
    }

    if (res && res.status_code === 200) {
      message.success(res.message);
      getPosts(q.id, ppage);
      setQuillContent("");

      const queries = router?.query;
      const topicArr = (queries?.topic as string)?.split("-");
      const topic_num = topicArr?.shift();

      fetchNickNameList(topic_num);
    }
    setPostLoading(false);
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
      if (id === +currentPost["id"]) {
        setCurrentPost({});
      }
    }
  };

  const onCancel = () => {
    onCancelCreateThread();
    setQuillContent("");
    setCurrentPost({});
  };

  const pOnChange = (p, size) => {
    setPpage(p);
  };

  //  post section end
  let payload = {
    camp_num: (router?.query?.camp as string)?.split("-")[0],
    topic_num: (router?.query?.topic as string)?.split("-")[0],
    topic_name: (router?.query?.topic as string)?.split("-").slice(1).join(" "),
  };

  return (
    <Fragment>
      <CampInfoBar payload={payload} />
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
          isLoading={loading}
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
          isLoading={loading}
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
          isLog={isLoggedIn}
          isLoading={postLoading}
        />
      ) : null}
    </Fragment>
  );
};

export default ForumComponent;
