import Layout from "../hoc/layout";
import TermsAndPrivacy from "../components/ComponentPages/TermsAndPrivacy";
import { getTermsAndServicesContent } from "src/network/api/termsAndPrivacyApi";

function TermAndService({ termsAndServicesContent }) {
  return (
    <>
      <Layout>
        <TermsAndPrivacy termsAndPrivacyContent={termsAndServicesContent} />
      </Layout>
    </>
  );
}
export async function getStaticProps() {
  const res = await getTermsAndServicesContent();
  return {
    props: {
      termsAndServicesContent: res || [],
    },
  };
}
TermAndService.displayName = "TermAndService";

export default TermAndService;
