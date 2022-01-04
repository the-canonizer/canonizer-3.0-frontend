import Trees from "../components/componentPages/trees";
import LoggedInLayout from "../hoc/loggedInLayout";
import { getTreesApi } from "../network/api/treeApi";
import Layout from "../hoc/layout";

const TreesPage = ({ data }) => {
  return (
    <Layout>
      <Trees treesData={data} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const result = await getTreesApi();
  const data = result || [];
  // const data = await result;
  console.log("result");

  return {
    props: {
      data,
    },
  };
}

export default TreesPage;
