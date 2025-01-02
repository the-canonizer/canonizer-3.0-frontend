import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

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
import ThreadListUI from "./UI/ThreadListUI";
import Layout from "src/hoc/layout";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import ManageThread from "./CreateThreadPopup";
import { RootState } from "src/store";
import CommonBreadcrumbs from "../Breadcrumbs/commonBreadcrumbs";
import { useIsMobile } from "src/hooks/useIsMobile";

export const getSelectedNode = async (
  topic_num,
  camp_num,
  as_of,
  as_of_date,
  algorithm
) => {
  const reqBody = {
    topic_num,
    camp_num,
    as_of,
    as_of_date:
      moment.utc(as_of_date * 1000).format("DD-MM-YYYY H:mm:ss") ||
      Date.now() / 1000,
    algorithm: algorithm,
    update_all: 1,
  };

  let campRecord = null,
    topicRecord = null;

  setTimeout(async () => {
    topicRecord = await getCurrentTopicRecordApi(reqBody);
    const res = await getCurrentCampRecordApi(reqBody);

    if (res?.status_code === 200) {
      campRecord = res?.campData;
    }
  }, 300);

  return { campRecord, topicRecord };
};

const ForumComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = useIsUserAuthenticated();
  const isMobile = useIsMobile();

  const [paramsList, setParamsList] = useState({});
  const [threadList, setThreadList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(+router?.query?.page || 1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [loading, setLoading] = useState(false);
  const [perPage] = useState(10);

  useEffect(() => {
    setIsLoggedIn(isUserAuthenticated);
  }, [isUserAuthenticated]);

  const { campRecord, asof, asofdate, algorithm } = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      asof: state?.filters?.filterObject?.asof,
      asofdate: state?.filters?.filterObject?.asofdate,
      algorithm: state?.filters?.filterObject?.algorithm,
    })
  );

  const setCurrentThread = (data) => dispatch(setThread(data));

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
    if (router && router?.query) {
      const queries = router?.query;
      const campArr = (queries.camp as string).split("-");
      const camp_num = campArr.shift();

      const topicArr = (queries.topic as string).split("-");
      const topic_num = topicArr.shift();

      if (camp_num && topic_num)
        getSelectedNode(topic_num, camp_num, asof, asofdate, algorithm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.asPath]);

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

  useEffect(() => {
    setLoading(true);
    const queries = router?.query;
    const campArr = (queries.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (queries?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();
    const type = queries["by"] as string;

    getThreads(camp_num, topic_num, type, page, searchQuery);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query, page, searchQuery, isLoggedIn]);

  const onThreadEdit = ({ text, others }) => {
    setCurrentThread({ text, others });
    dispatch(setIsThreadDrawerOpen(true));
  };

  //  post section end
  const payload = {
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

    await getThreads(camp_num, topic_num, "all", 1, "");
  };

  const onBackClick = () => {
    const queries = router?.query;

    router.push({
      pathname: `/topic/${replaceSpecialCharacters(
        queries.topic as string,
        "-"
      )}/${replaceSpecialCharacters(queries.camp as string, "-")}`,
    });
  };

  return (
    <CustomSpinner key="thread-spinner" spinning={loading}>
      <Layout
        routeName={"forum"}
        className="[&_.inforBarClass]:mb-0 [&_.afterHeaderClass]:mb-5"
        afterHeader={
          <div className={`badNav ${isMobile ? "[&_.bdNav]:mb-2" : ""}`}>
            <CommonBreadcrumbs
              key="common-breadcrumbs"
              payload={payload}
              isForumPage={false}
              isHtmlContent={
                !isMobile ? (
                  <PrimaryButton
                    key="create-thread-button"
                    id="create-thread-button"
                    className="flex justify-center items-center h-auto py-2 px-7 createBtn"
                    onClick={onCreateThread}
                  >
                    Create a Thread <PlusOutlined />
                  </PrimaryButton>
                ) : null
              }
            />
          </div>
        }
      >
        {isMobile ? (
          <PrimaryButton
            key="mobile-create-thread-button"
            id="mobile-create-thread-button"
            className="flex justify-center items-center h-auto py-2 px-7 createBtn mb-3 ml-auto"
            onClick={onCreateThread}
          >
            Create a Thread <PlusOutlined />
          </PrimaryButton>
        ) : null}

        <ThreadListUI
          key="thread-list-ui"
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
          onBackClick={onBackClick}
        />
      </Layout>

      <ManageThread key="manage-thread" onSubmittedSucess={onSubmittedSucess} />
    </CustomSpinner>
  );
};

export default ForumComponent;
