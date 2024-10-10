import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { message, Modal, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";

import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
import {
  getPostsList,
  deletePost,
  getThreadData,
} from "src/network/api/campForumApi";
import {
  setThread,
  setPost,
  setIsPostDrawerOpen,
} from "src/store/slices/campForumSlice";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import Layout from "src/hoc/layout";
import CustomSpinner from "components/shared/CustomSpinner";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Post from "./UI/PostList";
import CreatePostPopup from "./CreatePostPopup";
import {
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
} from "src/network/api/campDetailApi";
import { RootState } from "src/store";

const { Text } = Typography;

const CommentsList = () => {
  const { currentThread, currentPost, asof, asofdate, algorithm }: any =
    useSelector((state: RootState) => ({
      currentThread: state.forum.currentThread,
      currentPost: state.forum.currentPost,
      campRecord: state?.topicDetails?.currentCampRecord,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      asof: state?.filters?.filterObject?.asof,
      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,
    }));

  const router = useRouter();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = useIsUserAuthenticated();

  const [postList, setPostList] = useState([]);
  const [ppage, setPpage] = useState(1);
  const [pTotalRecords, setPtotalRecords] = useState(0);
  const [postLoading, setPostLoading] = useState(false);
  const [threadDetailsLoading, setthreadDetailsLoading] = useState(false);
  const [createdAt, setCreatedAt] = useState(null);
  const [postperPage] = useState(10);

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

  useEffect(() => {
    if (router && router?.query) {
      const queries = router?.query;
      const campArr = (queries.camp as string).split("-");
      const camp_num = campArr.shift();
      getSelectedNode(camp_num);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query]);

  const getPosts = async (id, page = 1, like = "", per_page = postperPage) => {
    setPostLoading(true);
    const q = `?page=${page}&per_page=${per_page}&like=${like}`;

    const res = await getPostsList(id, q);

    if (res && res.status_code === 200) {
      setPostList(res.data?.items);
      setPtotalRecords(res.data?.total_rows);
    }

    setPostLoading(false);
  };

  useEffect(() => {
    const threadId = router?.query?.id;
    if (threadId) getPosts(threadId, ppage);
  }, [router?.query?.id, ppage, isUserAuthenticated]);

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
    const threadId = router?.query?.id;
    if (threadId) threadDetails();
  }, [router?.query?.id, isUserAuthenticated]);

  const onCreatePost = () => {
    const queries = router?.query,
      create_path = `/forum/${replaceSpecialCharacters(
        queries?.topic as string,
        "-"
      )}/${replaceSpecialCharacters(
        queries?.camp as string,
        "-"
      )}/threads/create`;

    if (isUserAuthenticated) {
      dispatch(setIsPostDrawerOpen(true));
    } else {
      router?.push({
        pathname: "/login",
        query: { returnUrl: create_path },
      });
    }
  };

  const onPostEditClick = (post) => {
    setCurrentPost(post);
    dispatch(setIsPostDrawerOpen(true));
  };

  const onDeleteClick = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete your comment?",
      okText: (
        <Fragment>
          Delete <DeleteOutlined />
        </Fragment>
      ),
      cancelText: (
        <Fragment>
          Cancel <CloseOutlined />
        </Fragment>
      ),
      icon: false,
      className:
        "[&_.ant-modal-content]:rounded-xl [&_.ant-modal-confirm-title]:text-center [&_.ant-modal-confirm-title]:font-medium [&_.ant-modal-confirm-title]:text-canBlack [&_.ant-modal-confirm-btns]:flex [&_.ant-modal-confirm-btns]:justify-center",
      cancelButtonProps: {
        className:
          "text-sm font-medium px-6 hover:!border-canHoverBlue hover:!text-canHoverBlue rounded-lg",
      },
      okButtonProps: {
        className:
          "text-sm font-medium px-6 !bg-canBlue hover:!bg-canHoverBlue hover:!border-canHoverBlue !text-white rounded-lg",
      },
      centered: true,
      onOk: async () => {
        setPostLoading(true);
        const q = router?.query;
        const res = await deletePost(+id);
        if (res && res.status_code === 200) {
          message.success(res.message);
          getPosts(q.id, ppage);

          if (currentPost) {
            if (id === +currentPost?.id) {
              setCurrentPost(null);
            }
          }
          Modal.destroyAll();
          const threadId = router?.query?.id;
          if (threadId) threadDetails();
        }
        setPostLoading(false);
      },
    });
  };

  const pOnChange = (p) => {
    setPostLoading(true);
    setPpage(p);
  };

  const payload = {
    camp_num: (router?.query?.camp as string)?.split("-")[0] ?? "1",
    topic_num: (router?.query?.topic as string)?.split("-")[0],
  };

  const onBackClick = () => {
    router?.back();
  };

  const onSubmittedSucess = async () => {
    setPostLoading(true);

    const threadId = router?.query?.id;

    await getPosts(threadId, 1);
    await threadDetails();
  };

  return (
    <CustomSpinner key="post-spinner" spinning={postLoading}>
      <Layout
        routeName={"forum"}
        afterHeader={
          <CampInfoBar
            payload={payload}
            isForumPage={false}
            isHtmlContent={
              !isUserAuthenticated ? (
                <Text id="sign-in-msg" data-testid="logincheck">
                  Please <Link href={{ pathname: "/login" }}>Sign In</Link> to
                  comment on this Thread
                </Text>
              ) : (
                <PrimaryButton
                  className="flex justify-center items-center h-auto py-2 px-7"
                  onClick={onCreatePost}
                >
                  Comment in This Thread <PlusOutlined />
                </PrimaryButton>
              )
            }
          />
        }
      >
        <Post
          postList={postList}
          pCurrent={ppage}
          pTotal={pTotalRecords}
          pOnChange={pOnChange}
          onEditClick={onPostEditClick}
          onDeleteClick={onDeleteClick}
          currentThread={currentThread}
          isLoading={postLoading}
          postperPage={postperPage}
          threadDetailsLoading={threadDetailsLoading}
          createdAt={createdAt}
          onBackClick={onBackClick}
        />
      </Layout>

      <CreatePostPopup onSubmittedSucess={onSubmittedSucess} />
    </CustomSpinner>
  );
};

export default CommentsList;
