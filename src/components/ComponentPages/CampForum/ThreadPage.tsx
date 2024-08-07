import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
import CustomSpinner from "components/shared/CustomSpinner";
import { getThreadsList } from "src/network/api/campForumApi";
import {
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
} from "src/network/api/campDetailApi";
import {
  setThread,
  setIsThreadDrawerOpen,
} from "src/store/slices/campForumSlice";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import ThreadListUI from "./UI/ThreadListUI";
import Layout from "src/hoc/layout";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import ManageThread from "./CreateThreadPopup";
import { RootState } from "src/store";

const ForumComponent = () => {
  const router = useRouter();

  const { isUserAuthenticated } = useIsUserAuthenticated();
  const didMount = useRef(false);
  const reRenderRef = useRef(0);

  const [paramsList, setParamsList] = useState({});
  const [threadList, setThreadList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(+router?.query?.page || 1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [loading, setLoading] = useState(false);
  const [perPage] = useState(10);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoggedIn(isUserAuthenticated);
  }, [isUserAuthenticated]);

  const { campRecord, asof, asofdate, algorithm } = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      asof: state?.filters?.filterObject?.asof,
      asofdate: state?.filters?.filterObject?.asofdate,
      algorithm: state?.filters?.filterObject?.algorithm,
    })
  );

  const setCurrentThread = (data) => dispatch(setThread(data));

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
    if (isLoggedIn) {
      dispatch(setIsThreadDrawerOpen(true));
    } else {
      router?.push({
        pathname: "/login",
        query: { returnUrl: router?.asPath },
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

  // create thread start

  useEffect(() => {
    setLoading(true);
    const queries = router?.query;
    const campArr = (queries.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (queries?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();
    const type = queries["by"] as string;

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

  const onThreadEdit = ({ text, others }) => {
    setCurrentThread({ text, others });
    dispatch(setIsThreadDrawerOpen(true));
  };

  //  post section end
  let payload = {
    camp_num: (router?.query?.camp as string)?.split("-")[0] ?? "1",
    topic_num: (router?.query?.topic as string)?.split("-")[0],
  };

  const onSubmittedSucess = async () => {
    setLoading(true);
    const queries = router?.query;
    const campArr = (queries.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (queries?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();
    const type = queries["by"] as string;

    await getThreads(camp_num, topic_num, type, page, searchQuery);
  };

  return (
    <CustomSpinner key="registration-spinner" spinning={loading}>
      <Layout
        routeName={"forum"}
        afterHeader={
          <CampInfoBar
            payload={payload}
            isForumPage={false}
            isHtmlContent={
              <PrimaryButton
                className="flex justify-center items-center h-auto py-2 px-7"
                onClick={onCreateThread}
              >
                Create a Thread <PlusOutlined />
              </PrimaryButton>
            }
          />
        }
      >
        <ThreadListUI
          onSearch={onSearch}
          onChange={onChange}
          threadList={threadList}
          onThreadClick={onThreadClick}
          current={page}
          total={totalRecords}
          filterThread={filterThread}
          paramsList={paramsList}
          isLoading={loading}
          onThreadEdit={onThreadEdit}
        />
      </Layout>

      <ManageThread onSubmittedSucess={onSubmittedSucess} />
    </CustomSpinner>
  );
};

export default ForumComponent;
