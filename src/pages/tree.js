import Trees from "../components/pages/trees";
import Layout from "../hoc/appLayout";

const TreesPage = () => {
  const meta = {
    title: "About Canonizer Trees",
    description: "Short description ",
    route: "tree",
  };

  const permissionRequired = "view_tree123";

  return (
    <Layout meta={meta} permission={permissionRequired}>
      <Trees />
    </Layout>
  );
};

export default TreesPage;
