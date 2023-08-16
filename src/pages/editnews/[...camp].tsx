import Add from "../../components/ComponentPages/News/AddOrEdit";
import Layout from "../../hoc/layout";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import React from "react";

const EditNewsPage = () => {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar">
          <SideBarNoFilter />
        </aside>
        <div className="pageContentWrap">
          <Add edit={true} />
        </div>
      </Layout>
    </>
  );
};
EditNewsPage.displayName = "EditNewsPage";

export default EditNewsPage;
