import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import isUserAuthenticated from "../../../hooks/isUserAuthenticated";
import TopBar from "./UI/TopBar";
import ForumUIList from "./List";
import ForumUICreate from "./Create";
import ForumUIPost from "./Post";

import { createThread } from "../../../network/api/campForumApi";

const data = [
  {
    id: 1,
    key: "101",
    name: "Can we unify “Integrated Information” and “Global Workspace” with “Representational Qualia Theory”?",
    replies: 32,
    recent_post: "Brent_Allsop replied 3 years ago (Mar 18, 2019, 10:54:32 PM)",
  },
  {
    id: 2,
    key: "102",
    name: "Moving “Mind Brain Identity” above “Dualism” in the camp structure.",
    replies: 3,
    recent_post: "Brent_Allsop replied 3 years ago (Sep 19, 2018, 3:48:20 AM)",
  },
];

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

const ForumComponent = ({
  testParamsList = {},
  testIsScreen = 0,
  testNickName = [],
  testInitialValue = {},
  testPostList = [...postData],
  testIsLoggedIn = false,
  testCardTitle = null,
}) => {
  const [paramsList, setParamsList] = useState(testParamsList);
  const [isScreen, setIsScreen] = useState(testIsScreen);
  const [threadList, setThreadList] = useState(data);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(30);
  const [nickNameList, setNickNameList] = useState(testNickName);
  const [initialValue, setInitialValues] = useState(testInitialValue);
  const [postList, setPostList] = useState(testPostList);
  const [isLoggedIn, setIsLoggedIn] = useState(testIsLoggedIn);
  const [cardTitle, setCardTitle] = useState(testCardTitle);
  const [isThreadUpdate, setIsThreadUpdate] = useState(false);
  const [ppage, setPpage] = useState(1);
  const [pTotalRecords, setPtotalRecords] = useState(50);
  // const [queries, setQueries] = useState({});

  const router = useRouter();

  const isLog = isUserAuthenticated();

  useEffect(() => {
    if (isLog) {
      setIsLoggedIn(isLog);
    }
  }, [isLog]);

  useEffect(() => {
    if (router && router.query) {
      setParamsList(router.query);
      console.log(router.query, "router.query");
    }
  }, [router, router?.query]);

  // start thread List section

  const onSearch = (...rest) => {
    console.log("onSearch rest", rest);
  };

  const onChange = (p, size) => {
    setPage(p);
    console.log("onChange", p, size);
  };

  const onCreateThread = () => {
    const queries = router.query;
    router.push(`/forum/${queries.topic}/${queries.camp}/threads/create`);
  };

  const onThreadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("thred", e);
    setIsScreen(2);
  };

  const filterThread = (type) => {
    console.log("type", type, router.query);
    const queries = router.query;

    router.push(
      `/forum/${queries.topic}/${queries.camp}/threads?by=${type}`,
      undefined,
      { shallow: true }
    );
  };

  const onEditClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const queries = router.query;
    console.log("edit", e, queries, id);
    router.push(`/forum/${queries.topic}/${queries.camp}/threads/edit/${id}`);
    // setIsScreen(1);
    // setIsThreadUpdate(true);
  };

  // end thread list section

  // create thread start

  const [form] = Form.useForm();
  const onCancelCreateThread = () => {
    console.log("onCancelCreateThread");
    const queries = router.query;
    router.push(`/forum/${queries.topic}/${queries.camp}/threads`);
    // setIsScreen(0);
  };

  const onFinish = (values) => {
    console.log(values);
  };

  // create thread start

  //  post section start

  const [formPost] = Form.useForm();

  const onFinishPost = (values) => {
    console.log(values);
  };

  const onCancel = () => {
    console.log("onCancel");
    setIsScreen(0);
  };

  const pOnChange = (p, size) => {
    setPpage(p);
    console.log("pOnChange", p, size);
  };

  //  post section end

  return (
    <Fragment>
      <TopBar paramsList={paramsList} />
      {router.pathname === "/forum/[topic]/[camp]/threads" ? (
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
      {router.pathname === "/forum/[topic]/[camp]/threads/create" ||
      router.pathname === "/forum/[topic]/[camp]/threads/edit/[tId]" ? (
        <ForumUICreate
          isThreadUpdate={isThreadUpdate}
          nickNameList={nickNameList}
          onCancelCreateThread={onCancelCreateThread}
          onFinish={onFinish}
          form={form}
          initialValue={initialValue}
          paramsList={paramsList}
        />
      ) : null}
      {router.pathname === "/forum/[topic]/[camp]/threads/[id]" ? (
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
