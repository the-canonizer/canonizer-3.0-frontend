import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
import { createPost, updatePost } from "src/network/api/campForumApi";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import { setIsPostDrawerOpen, setPost } from "src/store/slices/campForumSlice";
import PostFormPopup from "./UI/PostForm";
import { useIsMobile } from "src/hooks/useIsMobile";
import { RootState } from "src/store";

const CreatePostPopup = ({ onSubmittedSucess = null }) => {
  const { campRecord, currentPost, topicRecord, isOpen }: any = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      currentPost: state?.forum?.currentPost,
      isOpen: state?.forum?.isPostDrawerOpen,
    })
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const isMobile = useIsMobile();
  const { isUserAuthenticated } = useIsUserAuthenticated();

  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [quillContent, setQuillContent] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPostUpdate, setIsPostUpdate] = useState(false);
  const [isUpdateSubmit, serIsUpdateSubmit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        if (quillContent) {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
      })
      .catch(() => {
        setIsDisabled(false);
      });
  }, [form, values, quillContent]);

  const setCurrentPost = (data) => dispatch(setPost(data));

  useEffect(() => {
    if (isPostUpdate) {
      if (JSON.stringify(currentPost?.body) !== JSON.stringify(quillContent)) {
        serIsUpdateSubmit(true);
      } else {
        serIsUpdateSubmit(false);
      }
    }
  }, [isPostUpdate, currentPost?.body, quillContent]);

  useEffect(() => {
    if (currentPost?.body) {
      setQuillContent(currentPost?.body);
      setIsPostUpdate(true);
    } else {
      setIsPostUpdate(false);
    }
  }, [currentPost?.body]);

  const onCancel = () => {
    dispatch(setIsPostDrawerOpen(false));
    setQuillContent("");
    setCurrentPost(null);
    form?.resetFields();
  };

  const fetchNickNameList = async (topic_num) => {
    if (isUserAuthenticated && topic_num) {
      const body = { topic_num };
      let response = await getAllUsedNickNames(body);
      if (response && response.status_code === 200) {
        setNickNameList(response.data);
        setInitialValues({ nick_name: response.data[0]?.id });
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const queries = router?.query;
    const topicArr = (queries?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();

    if (topic_num) fetchNickNameList(topic_num);
  }, [router?.query, isUserAuthenticated]);

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
    setIsLoading(true);
    const q = router?.query;

    if (quillContent.trim() === "" || isEmpty(quillContent)) {
      setIsError(true);
      setIsLoading(false);
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
      topic_name: topicRecord?.topic_name,
      camp_name: campRecord?.camp_name,
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
      onSubmittedSucess();

      const queries = router?.query;
      const topicArr = (queries?.topic as string)?.split("-");
      const topic_num = topicArr?.shift();

      setQuillContent("");

      fetchNickNameList(topic_num);

      onCancel();
    }
    setIsLoading(false);
  };

  return (
    <PostFormPopup
      onFinish={onFinishPost}
      onCancel={onCancel}
      form={form}
      initialValue={initialValue}
      nickNameList={nickNameList}
      quillContent={quillContent}
      onContentChange={onContentChange}
      isLoading={isLoading}
      isMobile={isMobile}
      isPostUpdate={isPostUpdate}
      onClose={onCancel}
      isOpen={isOpen}
      topicRecord={topicRecord}
      campRecord={campRecord}
      isDisabled={isDisabled}
      isUpdateSubmit={isUpdateSubmit}
      isError={isError}
    />
  );
};

export default CreatePostPopup;
