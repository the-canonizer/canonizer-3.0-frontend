import Layout from "../hoc/layout";
import TermsService from "../components/ComponentPages/TermServices";
import SideBar from "../components/ComponentPages/Home/SideBar";
import { getTermsAndServicesContent } from "src/network/api/termsAndPrivacyApi";

function TermService({ termsAndServicesConrent }) {
  return (
    <>
      <Layout>
        <TermsService termsAndServicesConrent={termsAndServicesConrent} />
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
