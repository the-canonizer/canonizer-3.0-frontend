import React from "react";
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
import { setHistory } from "../../store/slices/campDetailSlice";
import Layout from "src/hoc/layout";

import { getHistoryApi } from "../../network/api/history";

import TopicDetails from "src/components/ComponentPages/TopicDetails";
import { setCurrentDate } from "src/store/slices/filtersSlice";
import { useEffect, useRef } from "react";
import { formatTheDate } from "src/utils/generalUtility";
import DataNotFound from "@/components/ComponentPages/DataNotFound";

// import { wrapper } from "src/store";

const TopicDetailsPage = ({
  current_date,
  newsFeed,
  topicRecord,
  campRecord,
  campStatement,
  statementHistory,
  tree,
  serverCall,
}: any) => {
  const serverSideCall = useRef(serverCall || false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNewsFeed(newsFeed));
    dispatch(setCurrentTopicRecord(topicRecord));
    dispatch(setCurrentCampRecord(campRecord));
    dispatch(setCampStatement(campStatement));
    dispatch(setHistory(statementHistory));
    // dispatch(setCanonizedAlgorithms(canonizedAlgorithms));
    dispatch(setTree(tree?.status_code == 200 ? [tree?.treeData] : []));
    dispatch(setCurrentDate(current_date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("campRecord", campRecord);

  return (
    <Layout>
      {tree?.status_code == 404 || campRecord?.status_code == 404 ? (
        <DataNotFound isTopic={tree?.status_code == 404 ? true : false} />
      ) : (
        <TopicDetails serverSideCall={serverSideCall} />
      )}
    </Layout>
  );
};

export async function getServerSideProps({ req, query }) {
  let topicNum = +query?.camp[0]?.split("-")[0];
  let campNum = +(query?.camp[1]?.split("-")[0] ?? 1);

  const currentDate = new Date().valueOf();
  const reqBodyForService = {
    topic_num: topicNum,
    camp_num: campNum,
    asOf: query?.asof ?? "default",
    asofdate:
      query?.asofdate && query?.asof == "bydate"
        ? parseFloat(query?.asofdate)
        : Date.now() / 1000,
    algorithm: query?.algo || req.cookies["canAlgo"] || "blind_popularity",
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

  const [
    newsFeed,
    topicRecord,
    campRecord,
    campStatement,
    statementHistory,
    tree,
  ] = await Promise.all([
    getNewsFeedApi(reqBody, req.cookies["loginToken"]),
    getCurrentTopicRecordApi(reqBody, req.cookies["loginToken"]),
    getCurrentCampRecordApi(reqBody, req.cookies["loginToken"]),
    getCanonizedCampStatementApi(reqBody, req.cookies["loginToken"]),
    getHistoryApi(
      reqBodyForCampData,
      "1",
      "statement",
      req.cookies["loginToken"]
    ),
    getTreesApi(reqBodyForService),
  ]);

  return {
    props: {
      current_date: currentDate,
      newsFeed: newsFeed || [],
      topicRecord: topicRecord || {},
      campRecord: campRecord || {},
      campStatement: campStatement || [],
      statementHistory: statementHistory?.data || {},
      tree: tree || [],
      serverCall: true,
    },
  };
}

//////////////////////////////////////////////
// Bellow commented code will be used later//
////////////////////////////////////////////

// export const getServerSideProps = wrapper.getServerSideProps(({ store }) => {
//   const reqBody = {
//     topic_num: 88,
//     asofdate: 1644323333,
//     algorithm: "mind_experts",
//     update_all: 0,
//   };
//   let camps, algorithms;
//   async function apiCalls() {
//     const [canonizedAlgorithms, canonizedCampTrees] = await Promise.all([
//       getCanonizedAlgorithmsApi(),
//       getTreesApi(reqBody),
//     ]);
//     camps = canonizedCampTrees || [];
//     algorithms = canonizedAlgorithms || [];
//   }
//   apiCalls();

//   return {
//     props: {
//       camps,
//       algorithms,
//     },
//   };
// });

TopicDetailsPage.displayName = "TopicDetailsPage";

export default TopicDetailsPage;
