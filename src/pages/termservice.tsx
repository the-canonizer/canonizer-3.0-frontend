import Layout from "../hoc/layout";
import TermsService from "../components/ComponentPages/TermServices";
import SideBar from "../components/ComponentPages/Home/SideBar";
import { getTermsAndServicesContent } from "src/network/api/termsAndPrivacyApi";

function TermService({ termsAndServicesConrent }) {
  return (
    <>
      <Layout>
        <div className="pageContentWrap">
          <TermsService termsAndServicesConrent={termsAndServicesConrent} />
        </div>
      </Layout>
    </>
  );
}
export async function getStaticProps() {
  const res = await getTermsAndServicesContent();
  return {
    props: {
      termsAndServicesConrent: res || [],
    },
  };
}
TermService.displayName = "TermService";

export default TermService;
