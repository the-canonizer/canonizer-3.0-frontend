import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import {
  setTree,
  setNewsFeed,
  setCampStatement,
  setCurrentTopicRecord,
  setCurrentCampRecord,
} from "../../store/slices/campDetailSlice";
import {
  formatTheDate,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import { setHistory } from "../../store/slices/campDetailSlice";
import Layout from "src/hoc/layout";

import { getHistoryApi } from "../../network/api/history";

import TopicDetails from "src/components/ComponentPages/TopicDetails";
import { setCurrentDate } from "src/store/slices/filtersSlice";
import { useEffect, useRef } from "react";
import DataNotFound from "@/components/ComponentPages/DataNotFound/dataNotFound";
import { createToken } from "src/network/api/userApi";
import { useRouter } from "next/router";

const TopicDetailsPage = ({
  current_date,
  // newsFeed,
  topicRecord,
  campRecord,
  campStatement,
  // statementHistory,
  // tree,
  serverCall,
}: any) => {
  const [treeState, setTreeState] = useState<any>();
  const dispatch = useDispatch();
  const serverSideCall = useRef(serverCall || false);
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    let topicNum = query?.camp[0]?.split("-")[0];
    let campNum = query?.camp[1]?.split("-")[0] || 1;
    const reqBodyForService = {
      topic_num: topicNum,
      camp_num: campNum,
      asOf: query?.asof ?? "default",
      asofdate:
        query?.asofdate && query?.asof == "bydate"
          ? parseFloat(query?.asofdate)
          : Date.now() / 1000,
      algorithm: query?.algo || "blind_popularity",
      update_all: 1,
      fetch_topic_history: query?.viewversion == "1" ? 1 : null,
    };
    (async () => {
      const res = await getTreesApi(reqBodyForService);
      setTreeState(res);
      dispatch(setTree(res?.status_code == 200 ? [res?.treeData] : []));
    })();
    // dispatch(setNewsFeed(newsFeed));
    dispatch(setCurrentTopicRecord(topicRecord));
    dispatch(setCurrentCampRecord(campRecord?.campData));
    dispatch(setCampStatement(campStatement));
    // dispatch(setHistory(statementHistory));
    dispatch(setCurrentDate(current_date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let ErrorStatus =
    treeState?.status_code == 404 ||
    (treeState?.status_code == 422 &&
      (!treeState?.error?.camp_num ||
        (treeState?.error?.camp_num && treeState?.error?.topic_num)))
      ? "Topic"
      : "Camp";

  return (
    <Layout>
      {treeState?.status_code == 404 ||
      campRecord?.status_code == 404 ||
      campRecord?.status_code == 400 ? (
        <DataNotFound
          name={ErrorStatus}
          message={`${ErrorStatus} not found`}
          backURL={"/"}
          goBack={true}
        />
      ) : (
        <TopicDetails serverSideCall={serverSideCall} />
      )}
    </Layout>
  );
};

function buildSearchQuery(query) {
  let queryStr: any = {};

  if (query?.algo) {
    queryStr.algo = query.algo;
  }
  if (query?.asof) {
    queryStr.asof = query.asof;
  }
  if (query?.asofdate && query?.asof === "bydate") {
    queryStr.asof = query.asof;
    queryStr.asofdate = query.asofdate;
  }
  if (query?.viewversion) {
    queryStr.viewversion = query.viewversion;
  }
  if (query?.is_tree_open) {
    queryStr.is_tree_open = query.is_tree_open;
  }

  const searchParams = new URLSearchParams(queryStr);
  return searchParams.toString();
}

export async function getServerSideProps({ req, query }) {
  let topicNum = query?.camp[0]?.split("-")[0];
  let campNum = query?.camp[1]?.split("-")[0] || 1;
  let topicName = query?.camp[0];
  let campName = query?.camp[1];
  let token = null;

  const currentDate = new Date().valueOf();
  const reqBodyForService = {
    topic_num: topicNum,
    camp_num: campNum,
    asOf: query?.asof ?? "default",
    asofdate:
      query?.asofdate && query?.asof == "bydate"
        ? parseFloat(query?.asofdate)
        : Date.now() / 1000,
    algorithm: query?.algo || "blind_popularity",
    update_all: 1,
    fetch_topic_history: query?.viewversion == "1" ? 1 : null,
  };

  const reqBody = {
    topic_num: topicNum,
    camp_num: campNum,
    as_of: query?.asof ?? "default",
    as_of_date:
      query?.asofdate && query?.asof == "bydate"
        ? formatTheDate(query?.asofdate * 1000, "DD-MM-YYYY H:mm:ss")
        : Date.now() / 1000,
  };

  const reqBodyForCampData = {
    topic_num: topicNum,
    camp_num: campNum,
    type: "all",
    per_page: 4,
    page: 1,
  };

  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const [
    // newsFeed,
    topicRecord,
    campRecord,
    campStatement,
    // statementHistory,
    // tree,
  ] = await Promise.all([
    // getNewsFeedApi(reqBody, token),
    getCurrentTopicRecordApi(reqBody, token),
    getCurrentCampRecordApi(reqBody, token),
    getCanonizedCampStatementApi(reqBody, token),
    // getHistoryApi(reqBodyForCampData, "1", "statement", token),
    // getTreesApi(reqBodyForService),
  ]);

  const resTopicName = topicRecord?.topic_name?.replaceAll(" ", "-");
  const resCampName = campRecord?.campData?.camp_name?.replaceAll(" ", "-");

  const currentUrl = "/topic/" + topicName + "/" + campName;
  let resUrl = `/topic/${topicRecord?.topic_num}-${replaceSpecialCharacters(
    resTopicName,
    "-"
  )}/${campRecord?.campData?.camp_num}-${replaceSpecialCharacters(
    resCampName,
    "-"
  )}`;

  if (topicRecord && campRecord?.status_code == 200 && currentUrl !== resUrl) {
    let queryStr: any = buildSearchQuery(query);

    return {
      redirect: {
        permanent: false,
        destination: `${resUrl}${queryStr ? "?" + queryStr : ""}`,
      },
      props: {
        current_date: currentDate,
        // newsFeed: newsFeed || [],
        topicRecord: topicRecord || {},
        campRecord: campRecord || {},
        campStatement: campStatement || [],
        // statementHistory: statementHistory?.data || {},
        // tree: tree || [],
        serverCall: true,
      },
    };
  }

  return {
    props: {
      current_date: currentDate,
      // newsFeed: newsFeed || [],
      topicRecord: topicRecord || {},
      campRecord: campRecord || {},
      campStatement: campStatement || [],
      // statementHistory: statementHistory?.data || {},
      // tree: tree || [],
      serverCall: true,
    },
  };
}

TopicDetailsPage.displayName = "TopicDetailsPage";

export default TopicDetailsPage;
