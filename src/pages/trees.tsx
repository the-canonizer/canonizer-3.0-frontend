import Trees from "../components/componentPages/trees";
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

  return {
    props: {
      data,
    },
  };
}

export default TreesPage;
