import { Fragment, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

import { RootState } from "src/store";
import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
import {
  createPost,
  updatePost,
  getPostsList,
  deletePost,
  getThreadData,
} from "src/network/api/campForumApi";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import CampInfoBar from "../TopicDetails/CampInfoBar/index-app";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { setPost, setThread } from "src/store/slices/campForumSlice";

const ForumUIPost = dynamic(() => import("./Post-app"), { ssr: false });

const ForumComponent = () => {
  const { currentThread, currentPost } = useSelector((state: RootState) => ({
    currentThread: state.forum.currentThread,
    currentPost: state.forum.currentPost,
  }));

  const router = useRouter(),
    params = useParams(),
    searchParams = useSearchParams();

  const { isUserAuthenticated } = useIsUserAuthenticated();

  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [postList, setPostList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [ppage, setPpage] = useState(1);
  const [pTotalRecords, setPtotalRecords] = useState(0);
  const [quillContent, setQuillContent] = useState("");
  const [isError, setIsError] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [threadDetailsLoading, setthreadDetailsLoading] = useState(false);
  const [postperPage] = useState(10);

  const dispatch = useDispatch();

  useEffect(() => setIsLoggedIn(isUserAuthenticated), [isUserAuthenticated]);

  const setCurrentThread = (data: any) => dispatch(setThread(data));

  const setCurrentPost = (data: {}) => dispatch(setPost(data));

  const getPosts = async (
    id: any,
    pp = 1,
    like = "",
    per_page = postperPage
  ) => {
    setPostLoading(true);

    try {
      const q = `?page=${pp}&per_page=${per_page}&like=${like}`;
      const res = await getPostsList(id, q);

      if (res.status_code === 200) {
        setPostList(res.data?.items);
        setPtotalRecords(res.data?.total_rows);
      }
    } catch (error) {
      // Handle error or show appropriate feedback to the user
    } finally {
      setPostLoading(false);
    }
  };

  const threadDetails = async (id: string | string[]) => {
    setthreadDetailsLoading(true);
    setPostLoading(true);

    const res = await getThreadData(id);

    if (res && res.status_code === 200) {
      const data = res.data;
      setCurrentThread(data);
    }

    setPostLoading(false);
    setthreadDetailsLoading(false);
  };

  async function fetchNickNameList(topic_num: string | undefined) {
    setPostLoading(false);

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
    setPostLoading(true);
    const topicArr = (params?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();

    fetchNickNameList(topic_num);
  }, [isLoggedIn]);

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

  const [formPost] = Form.useForm();

  useEffect(() => {
    const threadId = params?.id;

    if (threadId) {
      threadDetails(threadId);
    }
  }, []);

  useEffect(() => {
    const threadId = params?.id;

    if (threadId) {
      getPosts(threadId, ppage);
    }
  }, [params?.id, ppage]);

  const onContentChange = (v: any) => {
    setQuillContent(v);
    setIsError(false);
  };

  const isEmpty = (txt) => {
    const commentText = txt.trim();
    const re = /^<p>(<br>|<br\/>|<br\s\/>|\s+|)<\/p>$/gm;
    return re.test(commentText);
  };

  const onFinishPost = async (values: { nick_name: any }) => {
    setPostLoading(true);

    if (quillContent.trim() === "" || isEmpty(quillContent)) {
      setIsError(true);
      setPostLoading(false);
      return true;
    }

    setIsError(false);

    const campArr = (params?.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (params?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();

    const body = {
      body: quillContent?.replace(/(^|>)\s+|\s+(?=<|$)/g, "$1"),
      nick_name: values.nick_name,
      thread_id: params?.id,
      camp_num: camp_num,
      topic_num: topic_num,
      topic_name: topicArr.join(" "),
      camp_name: campArr.join(" "),
    };

    let res: any;

    if (currentPost && currentPost["id"]) {
      res = await updatePost(body, currentPost["id"]);
      setCurrentPost({});
    } else {
      res = await createPost(body);
    }

    if (res && res.status_code === 200) {
      message.success(res.message);
      getPosts(params?.id, ppage);
      setQuillContent("");

      const queries = params;
      const topicArr = (queries?.topic as string)?.split("-");
      const topic_num = topicArr?.shift();

      fetchNickNameList(topic_num);
    }
    setPostLoading(false);
  };

  const onPostEditClick = (post: { body?: any }) => {
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
    const q = params;

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

  const pOnChange = (p: any) => {
    setPostLoading(true);
    setPpage(p);
  };

  //  post section end
  let payload = {
    camp_num: (params?.camp as string)?.split("-")[0] ?? "1",
    topic_num: (params?.topic as string)?.split("-")[0],
  };

  return (
    <Fragment>
      <CampInfoBar payload={payload} />
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
      />
    </Fragment>
  );
};

export default ForumComponent;
