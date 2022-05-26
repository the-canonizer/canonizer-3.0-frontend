import AddOrManage from "../../../components/ComponentPages/Statement/AddOrManage";
import SideBarNoFilter from "../../../components/ComponentPages/Home/SideBarNoFilter";
import Layout from "../../../hoc/layout";

export default function AddStatement() {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>
        <div className="pageContentWrap">
          <AddOrManage add={true} />
        </div>
      </Layout>
    </>
  );
}
