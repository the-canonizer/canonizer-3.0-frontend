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
import { setCanonizedAlgorithms } from "../../store/slices/homePageSlice";

import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";

import { getHistoryApi } from "../../network/api/history";

import Layout from "src/hoc/layout";
import TopicDetails from "src/components/ComponentPages/TopicDetails";
import { setCurrentDate } from "src/store/slices/filtersSlice";

// import { wrapper } from "src/store";

const TopicDetailsPage = ({
  current_date,
  newsFeed,
  topicRecord,
  campRecord,
  campStatement,
  statementHistory,
  canonizedAlgorithms,
  tree,
}: any) => {
  const dispatch = useDispatch();
  dispatch(setNewsFeed(newsFeed));
  dispatch(setCurrentTopicRecord(topicRecord));
  dispatch(setCurrentCampRecord(campRecord));
  dispatch(setCampStatement(campStatement));
  dispatch(setHistory(statementHistory));
  dispatch(setCanonizedAlgorithms(canonizedAlgorithms));
  dispatch(setTree([tree] || []));

  dispatch(setCurrentDate(current_date));

  return (
    <>
      <Layout>
        <TopicDetails />
      </Layout>
    </>
  );
};

export async function getServerSideProps({ req, res, resolvedUrl }) {
  let topicNum = +resolvedUrl?.split("/")[2].split("-")[0];
  let campNum = +(resolvedUrl?.split("/")[3].split("-")[0] ?? 1);
  const currentDate = new Date().valueOf();
  const reqBodyForService = {
    topic_num: topicNum,
    camp_num: campNum,
    asOf: "default",
    asofdate: Date.now() / 1000,
    algorithm: "blind_popularity",
    update_all: 1,
    fetch_topic_history: null,
  };

  const reqBody = {
    topic_num: topicNum,
    camp_num: campNum,
    as_of: "default",
    as_of_date: Date.now() / 1000,
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
    canonizedAlgorithms,
    tree,
  ] = await Promise.all([
    getNewsFeedApi(reqBody),
    getCurrentTopicRecordApi(reqBody),
    getCurrentCampRecordApi(reqBody),
    getCanonizedCampStatementApi(reqBody),
    getHistoryApi(reqBodyForCampData, "1", "statement"),
    getCanonizedAlgorithmsApi(),
    getTreesApi(reqBodyForService),
  ]);

  return {
    props: {
      current_date: currentDate,
      newsFeed: newsFeed || [],
      topicRecord: topicRecord || {},
      campRecord: campRecord || {},
      campStatement: campStatement || [],
      statementHistory: statementHistory || {},
      canonizedAlgorithms: canonizedAlgorithms || [],
      tree: tree || [],
    },
  };
}

//////////////////////////////////////////////
// Bellow commented code will be used later//
////////////////////////////////////////////

// export const getServerSideProps = wrapper.getServerSideProps(({ store }) => {
//   console.log("/..///////////////////////store", store.getState());
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
