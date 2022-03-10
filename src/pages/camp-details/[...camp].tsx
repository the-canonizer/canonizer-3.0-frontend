import Layout from "../../hoc/layout";

import TopicDetails from "../../components/ComponentPages/TopicDetails";
import { getTreesApi } from "src/network/api/campDetailApi";
import { useDispatch } from "react-redux";
import { setTree } from "src/store/slices/campDetailSlice";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import { setCanonizedAlgorithms } from "src/store/slices/homePageSlice";
import { wrapper } from "src/store";

const TopicDetailsPage = ({ camps, algorithms }) => {
  const dispatch = useDispatch();
  dispatch(setTree(camps));
  dispatch(setCanonizedAlgorithms(algorithms));
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
  const { algo, asof } = context.query;
  console.log(".............////////////////////", campId, "++++++++", algo);
  const reqBody = {
    topic_num: campId,
    asofdate: 1644323333,
    algorithm: algo,
    update_all: 1,
  };

  const [canonizedAlgorithms, canonizedCampTrees] = await Promise.all([
    getCanonizedAlgorithmsApi(),
    getTreesApi(reqBody),
  ]);
  const camps = canonizedCampTrees || [];
  const algorithms = canonizedAlgorithms || [];

  return {
    props: {
      camps,
      algorithms,
    },
  };
}

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
