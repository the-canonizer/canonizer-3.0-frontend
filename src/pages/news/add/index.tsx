import NewsAdd from "../../../components/ComponentPages/NewsAdd";

import SideBarNoFilter from "../../../components/ComponentPages/Home/SideBarNoFilter";

import Layout from "../../../hoc/layout";
export default function AddNewsPage() {
  return (
    <>
      <Layout routeName={"add-news"}>
        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>
        <div className="pageContentWrap">
          <NewsAdd />
        </div>
      </Layout>
    </>
  );
}
