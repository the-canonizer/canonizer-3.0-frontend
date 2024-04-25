import Add from "../../components/ComponentPages/News/AddOrEdit";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import Layout from "../../hoc/layout";

function AddNewsPage() {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar">
          <SideBarNoFilter />
          <p></p>
        </aside>
        <div className="pageContentWrap">
          <Add edit={false} />
        </div>
      </Layout>
    </>
  );
}
AddNewsPage.displayName = "AddNewsPage";

export default AddNewsPage;
