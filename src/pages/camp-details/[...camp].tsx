import Layout from "../../hoc/layout";

import TopicDetails from "../../components/ComponentPages/TopicDetails";
import {
  getTreesApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import { useDispatch } from "react-redux";
import {
  setTree,
  setCurrentTopicRecord,
  setCurrentCampRecord,
} from "src/store/slices/campDetailSlice";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import { setCanonizedAlgorithms } from "src/store/slices/homePageSlice";
// import { wrapper } from "src/store";

const TopicDetailsPage = ({ camps, algorithms, topicRecord, campRecord }) => {
  const dispatch = useDispatch();
  dispatch(setTree(camps));
  dispatch(setCanonizedAlgorithms(algorithms));
  dispatch(setCurrentTopicRecord(topicRecord));
  dispatch(setCurrentCampRecord(campRecord));
  return (
    <>
      <Layout>
        <TopicDetails />
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  const campId = context.query.camp.join(",");
  const { algorithm, asofdate } = context.query;

  const reqBody = {
    topic_num: campId,
    asofdate: 1644323333,
    algorithm,
    update_all: 1,
  };
  const topicOrCampReqBody = {
    topic_num: 76,
    camp_num: 1,
  };

  const [
    canonizedAlgorithms,
    canonizedCampTrees,
    currentTopicRecord,
    currentCampRecord,
  ] = await Promise.all([
    getCanonizedAlgorithmsApi(),
    getTreesApi(reqBody),
    getCurrentTopicRecordApi(topicOrCampReqBody),
    getCurrentCampRecordApi(topicOrCampReqBody),
  ]);
  const camps = canonizedCampTrees || [];
  const algorithms = canonizedAlgorithms || [];
  const topicRecord = currentTopicRecord || [];
  const campRecord = currentCampRecord || [];

  return {
    props: {
      camps,
      algorithms,
      topicRecord,
      campRecord,
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

export default TopicDetailsPage;
