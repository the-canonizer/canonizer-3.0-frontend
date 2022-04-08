import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import isUserAuthenticated from "../../../hooks/isUserAuthenticated";
import TopBar from "./UI/TopBar";
import ForumUI from "./UI";

const data = [
  {
    key: "101",
    name: "Can we unify “Integrated Information” and “Global Workspace” with “Representational Qualia Theory”?",
    replies: 32,
    recent_post: "Brent_Allsop replied 3 years ago (Mar 18, 2019, 10:54:32 PM)",
  },
  {
    key: "102",
    name: "Moving “Mind Brain Identity” above “Dualism” in the camp structure.",
    replies: 3,
    recent_post: "Brent_Allsop replied 3 years ago (Sep 19, 2018, 3:48:20 AM)",
  },
];

const ForumComponent = ({
  testParamsList = {},
  testIsScreen = 0,
  testNickName = [],
  testInitialValue = {},
  testPostList = [],
  testIsLoggedIn = false,
  testCardTitle = null,
}) => {
  const [paramsList, setParamsList] = useState(testParamsList);
  const [isScreen, setIsScreen] = useState(testIsScreen);
  const [threadList, setThreadList] = useState(data);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [nickNameList, setNickNameList] = useState(testNickName);
  const [initialValue, setInitialValues] = useState(testInitialValue);
  const [postList, setPostList] = useState(testPostList);
  const [isLoggedIn, setIsLoggedIn] = useState(testIsLoggedIn);
  const [cardTitle, setCardTitle] = useState(testCardTitle);

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
    }
  }, [router, router?.query]);

  // start thread List section

  const onSearch = (...rest) => {
    console.log("onSearch rest", rest);
  };

  const onChange = (page, size) => {
    console.log("onChange", page, size);
  };

  const onCreateThread = () => {
    setIsScreen(1);
  };

  const onThreadClick = () => {
    setIsScreen(2);
  };

  const filterThread = (type) => {
    console.log(type);
  };

  // end thread list section

  // create thread start

  const [form] = Form.useForm();
  const onCancelCreateThread = () => {
    setIsScreen(0);
  };
  const onCancel = () => {};
  const onFinish = (values) => {
    console.log(values);
  };

  // create thread start

  //  post section start

  const [formPost] = Form.useForm();
  const onFinishPost = (values) => {
    console.log(values);
  };

  //  post section end

  return (
    <Fragment>
      <TopBar paramsList={paramsList} />
      <ForumUI
        isScreen={isScreen}
        onSearch={onSearch}
        onChange={onChange}
        onCreateThread={onCreateThread}
        threadList={threadList}
        onThreadClick={onThreadClick}
        current={page}
        total={totalRecords}
        filterThread={filterThread}
        isLoggedIn={isLoggedIn}
        nickNameList={nickNameList}
        onCancelCreateThread={onCancelCreateThread}
        onCancel={onCancel}
        onFinish={onFinish}
        form={form}
        onFinishPost={onFinishPost}
        formPost={formPost}
        startedBy={"startedBy"}
        postCount={0}
        postList={postList}
        threadStamps={"threadStamps"}
        initialValue={initialValue}
        cardTitle={cardTitle}
      />
    </Fragment>
  );
};

export default ForumComponent;
