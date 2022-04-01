import Layout from "../../hoc/layout";

import TopicDetails from "../../components/ComponentPages/TopicDetails";
import {
  getTreesApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getCanonizedCampSupportingTreeApi,
} from "src/network/api/campDetailApi";
import { useDispatch } from "react-redux";
import {
  setTree,
  setCurrentTopicRecord,
  setCurrentCampRecord,
  setCampStatement,
  setNewsFeed,
  setCampSupportingTree,
} from "src/store/slices/campDetailSlice";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import { setCanonizedAlgorithms } from "src/store/slices/homePageSlice";
// import { wrapper } from "src/store";

const TopicDetailsPage = ({
  camps,
  algorithms,
  topicRecord,
  campRecord,
  campStatement,
  newsFeed,
  supportingTree,
}) => {
  const dispatch = useDispatch();
  dispatch(setTree(camps));
  dispatch(setCanonizedAlgorithms(algorithms));
  dispatch(setCurrentTopicRecord(topicRecord));
  dispatch(setCurrentCampRecord(campRecord));
  dispatch(setCampStatement(campStatement));
  dispatch(setNewsFeed(newsFeed));
  dispatch(setCampSupportingTree(supportingTree));
  return (
    <>
      <Layout>
        <TopicDetails />
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  const topicID = context.query.camp.join(",");
  const { algorithm, asofdate, asof } = context.query;

  const treeReqBody = {
    topic_num: topicID,
    asofdate: asofdate,
    algorithm,
    update_all: 1,
  };
  const topicOrCampReqBody = {
    // topic_num: topicID,
    // camp_num: 1,
    topic_num: 45,
    camp_num: 1,
    as_of: asof,
    as_of_date: asofdate,
  };
  // const campStatementReq = {
  //   topic_num: 45,
  //   camp_num: 1,
  //   // topic_num: +router.query.camp,
  //   // camp_num: "1",
  //   as_of: asof,
  //   as_of_date: asofdate,
  // };

  const [
    canonizedAlgorithms,
    canonizedCampTrees,
    currentTopicRecord,
    currentCampRecord,
    currentCampStatement,
    campNewsFeed,
    campSupportingTree,
  ] = await Promise.all([
    getCanonizedAlgorithmsApi(),
    getTreesApi(treeReqBody),
    getCurrentTopicRecordApi(topicOrCampReqBody),
    getCurrentCampRecordApi(topicOrCampReqBody),
    getCanonizedCampStatementApi(topicOrCampReqBody),
    getNewsFeedApi(topicOrCampReqBody),
    getCanonizedCampSupportingTreeApi(topicOrCampReqBody),
  ]);

  const camps = canonizedCampTrees || [];
  const algorithms = canonizedAlgorithms || [];
  const topicRecord = currentTopicRecord || [];
  const campRecord = currentCampRecord || [];
  const campStatement = currentCampStatement || [];
  const newsFeed = campNewsFeed || [];
  const supportingTree = campSupportingTree || [];

  return {
    props: {
      camps,
      algorithms,
      topicRecord,
      campRecord,
      campStatement,
      newsFeed,
      supportingTree,
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
