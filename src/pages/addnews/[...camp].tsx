import Add from "../../components/ComponentPages/News/Add";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import Layout from "../../hoc/layout";

export default function AddNewsPage() {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>
        <div className="pageContentWrap">
          <Add />
        </div>
      </Layout>
    </>
  );
}
