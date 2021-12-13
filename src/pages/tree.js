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
      <h1>Trees Page</h1>
    </Layout>
  );
};

export default TreesPage;
