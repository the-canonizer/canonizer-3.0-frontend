import Edit from "../../components/ComponentPages/News/Edit";
import Layout from "../../hoc/layout";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import React from "react";

export default function EditNewsPage() {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>
        <div className="pageContentWrap">
          <Edit />
        </div>
      </Layout>
    </>
  );
}
