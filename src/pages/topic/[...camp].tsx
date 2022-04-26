import Layout from "../../hoc/layout";

import TopicDetails from "../../components/ComponentPages/TopicDetails";

// import { wrapper } from "src/store";

const TopicDetailsPage = () => {
  return (
    <>
      <Layout>
        <TopicDetails />
      </Layout>
    </>
  );
};

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
