import { Fragment, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
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
  getThreadData,
} from "src/network/api/campForumApi";
import {
  getAllUsedNickNames,
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
} from "src/network/api/campDetailApi";
import { setThread, setPost } from "src/store/slices/campForumSlice";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

const ForumComponent = ({
  threadlist = [],
  postlist = { items: [], total_rows: 0 },
}: any) => {
  const router = useRouter();

  const { isUserAuthenticated } = useIsUserAuthenticated();
  const didMount = useRef(false);
  const didMountList = useRef(false);
  const didMountPost = useRef(false),
    reRenderRef = useRef(0);

  const [paramsList, setParamsList] = useState({});
  const [threadList, setThreadList] = useState(threadlist || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(+router?.query?.page || 1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [postList, setPostList] = useState(postlist?.items || []);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [ppage, setPpage] = useState(1);
  const [pTotalRecords, setPtotalRecords] = useState(postlist?.total_rows || 0);
  const [quillContent, setQuillContent] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [threadDetailsLoading, setthreadDetailsLoading] = useState(false);
  const [createdAt, setCreatedAt] = useState(null);
  const [perPage] = useState(10);
  const [postperPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [threadUpdateOthers, setThreadUpdateOthers] = useState({ id: null });

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoggedIn(isUserAuthenticated);
  }, [isUserAuthenticated]);

  const {
    campRecord,
    asof,
    asofdate,
    algorithm,
    currentThread,
    currentPost,
    topicRecord,
  } = useSelector((state: any) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    asof: state?.filters?.filterObject?.asof,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    currentThread: state.forum.currentThread,
    currentPost: state.forum.currentPost,
  }));

  console.log("topicRecord-----", topicRecord);

  const setCurrentThread = (data) => dispatch(setThread(data));

  const setCurrentPost = (data) => dispatch(setPost(data));

  const getSelectedNode = async (nodeKey) => {
    const queries = router?.query;
    const topicArr = (queries.topic as string).split("-");
    const topic_num = topicArr.shift();

    const reqBody = {
      topic_num: +topic_num,
      camp_num: +nodeKey,
      as_of: asof,
      as_of_date: asofdate || Date.now() / 1000,
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
    pp = 1,
    like = "",
    per_page = perPage
  ) {
    setLoading(true);
    let res = null;

    if (isLoggedIn && type !== "all") {
      let q = `?camp_num=${camp}&topic_num=${topic}&type=${type}&page=${pp}&per_page=${per_page}&like=${like}`;

      res = await getThreadsList(q);
    } else {
      let q = `?camp_num=${camp}&topic_num=${topic}&type=all&page=${pp}&per_page=${per_page}&like=${like}`;

      res = await getThreadsList(q);
    }

    setLoading(false);

    if (res && res.status_code === 200) {
      setThreadList(res.data?.items);
      setTotalRecords(res.data?.total_rows);
    }
  }

  const getPosts = async (id, pp = 1, like = "", per_page = postperPage) => {
    setPostLoading(true);
    const q = `?page=${pp}&per_page=${per_page}&like=${like}`;

    const res = await getPostsList(id, q);
    setPostLoading(false);
    if (res && res.status_code === 200) {
      setPostList(res.data?.items);
      setPtotalRecords(res.data?.total_rows);
    }
  };

  const threadDetails = async () => {
    const queries = router?.query;
    const campArr = (queries.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (queries?.topic as string)?.split("-");
    const topic_num = topicArr?.shift(),
      q = router?.query,
      id = q?.id as string;

    try {
      setthreadDetailsLoading(true);
      setPostLoading(true);

      const res = await getThreadData(id, topic_num, camp_num);

      setCreatedAt(res.data.created_at);

      if (res?.data?.status_code === 404) {
        message?.error(
          res?.data?.error?.thread_id?.at(0) || "Something went wrong"
        );
        setCurrentThread({});
      }

      if (res && res?.status_code === 200) {
        const data = res.data;
        setCurrentThread(data);
      }
    } catch (error) {
      // handle errors
    } finally {
      setPostLoading(false);
      setthreadDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (router && router?.query && didMount.current) {
      const queries = router?.query;
      const campArr = (queries.camp as string).split("-");
      const camp_num = campArr.shift();
      getSelectedNode(camp_num);
    } else didMount.current = true;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campRecord]);

  // start thread List section
  const onSearch = (v: string) => {
    setSearchQuery(v.trim());
  };

  const onChange = (p) => {
    setLoading(true);
    setPage(p);
    const queries = router?.query;
    queries.page = p;
    router?.push(router, undefined, { shallow: true });
  };

  const onCreateThread = () => {
    const queries = router?.query,
      create_path = `/forum/${replaceSpecialCharacters(
        queries?.topic as string,
        "-"
      )}/${replaceSpecialCharacters(
        queries?.camp as string,
        "-"
      )}/threads/create`;

    if (isLoggedIn) {
      router?.push({ pathname: create_path });
    } else {
      router?.push({
        pathname: "/login",
        query: { returnUrl: create_path },
      });
    }
  };

  const onThreadClick = (e, data) => {
    const queries = router?.query;

    e.preventDefault();
    e.stopPropagation();

    router?.push({
      pathname: `/forum/${replaceSpecialCharacters(
        queries.topic as string,
        "-"
      )}/${replaceSpecialCharacters(queries.camp as string, "-")}/threads/${
        data.id
      }`,
    });
  };

  const filterThread = (type) => {
    const queries = router?.query;

    if (type !== queries.by) {
      setLoading(true);
      setPage(1);
      queries.by = type;
      router?.push(router, undefined, { shallow: true });
    }
    setLoading(false);
  };

  const onEditClick = (e, item) => {
    const queries = router?.query;

    e.preventDefault();
    e.stopPropagation();

    router?.push({
      pathname: `/forum/${replaceSpecialCharacters(
        queries.topic as string,
        "-"
      )}/${replaceSpecialCharacters(
        queries.camp as string,
        "-"
      )}/threads/edit/${item.id}`,
    });
  };
  // end thread list section

  // create thread start
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen((prev) => {
      if (prev) {
        setCurrentPost({});
        setQuillContent("");
      }
      return !prev;
    });
  };

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
    setLoading(true);
    const queries = router?.query;
    const campArr = (queries.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (queries?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();
    const type = queries["by"] as string;

    if (
      router?.pathname === "/forum/[topic]/[camp]/threads/create" ||
      router?.pathname === "/forum/[topic]/[camp]/threads/edit/[tId]" ||
      router?.pathname === "/forum/[topic]/[camp]/threads/[id]"
    ) {
      fetchNickNameList(topic_num);
    }

    if (
      router?.pathname === "/forum/[topic]/[camp]/threads" &&
      router?.isReady
    ) {
      if (reRenderRef?.current) {
        clearTimeout(reRenderRef?.current);
        reRenderRef.current = 0;
      }

      if (!reRenderRef?.current) {
        reRenderRef.current = window.setTimeout(async () => {
          getThreads(camp_num, topic_num, type, page, searchQuery);
        }, 950);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query, page, searchQuery, isLoggedIn]);

  const onCancelCreateThread = () => {
    const queries = router?.query;
    if (queries?.tId) {
      const queries = router?.query;
      router?.push({
        pathname: `/forum/${replaceSpecialCharacters(
          queries.topic as string,
          "-"
        )}/${replaceSpecialCharacters(queries.camp as string, "-")}/threads`,
        query: { by: "my" },
      });
    } else if (queries?.from) {
      const redirects = queries?.from as string;
      router?.push({ pathname: redirects });
    } else {
      const queries = router?.query;
      router?.push({
        pathname: `/forum/${replaceSpecialCharacters(
          queries.topic as string,
          "-"
        )}/${replaceSpecialCharacters(queries.camp as string, "-")}/threads`,
      });
    }
  };

  useEffect(() => {
    const q = router?.query;
    const cI = threadList.filter((it) => +it.id === +q.tId);
    if (q.tId && cI[0]) {
      form.setFieldsValue({ thread_title: cI[0]?.title });
    }
  }, [form, router?.query, threadList]);

  const onFinish = async (values) => {
    setLoading(true);
    const q = router?.query;
    let res = null;

    if (values.thread_title.trim()) {
      if (q.tId) {
        const body = {
          title: values.thread_title?.trim(),
          topic_num: paramsList["topic_num"] || topicRecord?.topic_num,
          camp_num: paramsList["camp_num"] || campRecord?.camp_num,
          camp_name: paramsList["camp_name"] || campRecord?.camp_name,
        };
        res = await updateThread(body, +q.tId);
      } else {
        const body = {
          title: values.thread_title?.trim(),
          nick_name: values.nick_name,
          camp_num: paramsList["camp_num"] || campRecord?.camp_num,
          camp_name: paramsList["camp_name"] || campRecord?.camp_name,
          topic_num: paramsList["topic_num"] || topicRecord?.topic_num,
          topic_name: paramsList["topic"] || topicRecord?.topic_name,
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
        router?.push({
          pathname: `/forum/${replaceSpecialCharacters(
            queries.topic as string,
            "-"
          )}/${replaceSpecialCharacters(queries.camp as string, "-")}/threads`,
          query: { by: "my" },
        });
      } else {
        const queries = router?.query;
        router?.push({
          pathname: `/forum/${replaceSpecialCharacters(
            queries.topic as string,
            "-"
          )}/${replaceSpecialCharacters(queries.camp as string, "-")}/threads`,
        });
      }
      return;
    }
    setLoading(false);
  };

  const onFinishThreadUpdate = async (values) => {
    setLoading(true);
    let res = null;
    if (values?.threadName?.trim()) {
      if (threadUpdateOthers?.id) {
        const body = {
          title: values?.threadName?.trim(),
          topic_num: paramsList["topic_num"] || topicRecord?.topic_num,
          camp_num: paramsList["camp_num"] || campRecord?.camp_num,
          camp_name: paramsList["camp_name"] || campRecord?.camp_name,
        };
        res = await updateThread(body, +threadUpdateOthers?.id);

        if (res && res.status_code === 200) {
          const queries = router?.query;
          const campArr = (queries.camp as string).split("-");
          const camp_num = campArr.shift();
          const topicArr = (queries?.topic as string)?.split("-");
          const topic_num = topicArr?.shift();
          const type = queries["by"] as string;

          getThreads(camp_num, topic_num, type, page, searchQuery);
        }
      }
    }
    setIsModalOpen(false);
    setLoading(false);
  };
  // create thread start

  //  post section start
  const [formPost] = Form.useForm();

  useEffect(() => {
    const q = router?.query,
      threadId = q?.id;

    if (threadId && didMountList.current) {
      threadDetails();
    } else didMountList.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    const q = router?.query,
      threadId = q?.id;

    if (threadId && didMountPost?.current) {
      getPosts(threadId, ppage);
    } else {
      didMountPost.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.id, ppage, isLoggedIn]);

  const onContentChange = (v) => {
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
    const q = router?.query;

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

      const queries = router?.query;
      const topicArr = (queries?.topic as string)?.split("-");
      const topic_num = topicArr?.shift();

      setQuillContent("");

      fetchNickNameList(topic_num);
      showModal();
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
    showModal();
  };

  const onThreadEdit = ({ text, others }) => {
    setThreadUpdateOthers(others);
    form.setFieldsValue({ threadName: text });
    showModal();
  };

  const onDeleteClick = async (id) => {
    const q = router?.query;

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
    showModal();
    setQuillContent("");
    setCurrentPost({});
  };

  const pOnChange = (p) => {
    setPostLoading(true);
    setPpage(p);
  };

  //  post section end
  let payload = {
    camp_num: (router?.query?.camp as string)?.split("-")[0] ?? "1",
    topic_num: (router?.query?.topic as string)?.split("-")[0],
  };

  return (
    <Fragment>
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
          paramsList={paramsList}
          isLoading={loading}
          payload={payload}
          isModalOpen={isModalOpen}
          showModal={showModal}
          onFinish={onFinishThreadUpdate}
          onCancelThreadUpdateForm={onCancel}
          onThreadEdit={onThreadEdit}
          initialValue={initialValue}
          form={form}
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
          payload={payload}
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
          payload={payload}
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
          postperPage={postperPage}
          threadDetailsLoading={threadDetailsLoading}
          payload={payload}
          showModal={showModal}
          isModalOpen={isModalOpen}
          createdAt={createdAt}
        />
      ) : null}
    </Fragment>
  );
};

export default ForumComponent;
