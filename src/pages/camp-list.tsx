import CampList from "../components/ComponentPages/campList";

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

CampListPage.displayName = "CampListPage";

export default CampListPage;
