import Trees from "../components/ComponentPages/Trees";
import LoggedInLayout from "../hoc/loggedInLayout";
import { getTreesApi } from "../network/api/treeApi";
import Layout from "../hoc/layout";

const TreesPage = ({ result }) => {
  return (
    <Layout>
      <Trees treesData={result} />
    </Layout>
  );
};

// export async function getServerSideProps(context: any) {
//   // const result = await getTreesApi();
//   console.log("//////server///////");
//   return {
//     props: {
//       // result,
//     },
//   };
// }

export default TreesPage;
