import FormData from "../../components/addnewsformdata/formadd";

import SideBar from "../../components/ComponentPages/Home/SideBar";
import Layout from "../../hoc/layout";
export default function Home() {
  return (
    <>
      <Layout routeName={"add-news"}>
        {/* <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside> */}
        <div className="pageContentWrap">
          <FormData />
        </div>
      </Layout>
    </>
  );
}
