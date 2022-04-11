import NewsAdd from "../../../components/ComponentPages/NewsAdd";

import SideBar from "../../../components/ComponentPages/Home/SideBar";
import Layout from "../../../hoc/layout";
export default function AddNewsPage() {
  return (
    <>
      <Layout routeName={"add-news"}>
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <NewsAdd />
        </div>
      </Layout>
    </>
  );
}
