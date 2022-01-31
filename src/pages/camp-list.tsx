import CampList from "../components/componentPages/campList";

import Layout from "../hoc/layout";

const CampListPage = () => {
  return (
    <>
      <Layout routeName={"camp-list"}>
        <CampList />
      </Layout>
    </>
  );
};

export default CampListPage;
