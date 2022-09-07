import Layout from "../hoc/layout";
import PrivacyPolicys from "../components/ComponentPages/privacyPolicy";

import SideBar from "../components/ComponentPages/Home/SideBar";
function PrivacyPolicy() {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <PrivacyPolicys />
        </div>
      </Layout>
    </>
  );
}

PrivacyPolicy.displayName = "PrivacyPolicy";

export default PrivacyPolicy;
