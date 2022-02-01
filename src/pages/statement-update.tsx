import StatementUpdate from "../components/ComponentPages/StatementUpdate";

import Layout from "../hoc/layout";

const StatementUpdatePage = () => {
  return (
    <>
      <Layout routeName={"statement-update"}>
        <StatementUpdate />
      </Layout>
    </>
  );
};

export default StatementUpdatePage;