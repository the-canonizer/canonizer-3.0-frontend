import Layout from "../hoc/layout";
import PrivacyPolicys from "../components/ComponentPages/privacyPolicy";
import SideBar from "../components/ComponentPages/Home/SideBar";
import { getTermsAndServicesContent } from "src/network/api/termsAndPrivacyApi";

function PrivacyPolicy({ termsAndServicesConrent }) {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <PrivacyPolicys termsAndServicesConrent={termsAndServicesConrent} />
        </div>
      </Layout>
    </>
  );
}
export async function getServerSideProps() {
  const res = await getTermsAndServicesContent();
  return {
    props: {
      termsAndServicesConrent: res || [],
    },
  };
}
PrivacyPolicy.displayName = "PrivacyPolicy";

export default PrivacyPolicy;
