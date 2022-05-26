import Add from "../../components/ComponentPages/News/AddOrEdit";
import AddOrManage from "../../components/ComponentPages/Statement/AddOrManage";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import Layout from "../../hoc/layout";

export default function ManageStatement() {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>
        <div className="pageContentWrap">
          <AddOrManage add={false} />
        </div>
      </Layout>
    </>
  );
}
