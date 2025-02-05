import Layout from "../hoc/layout";
import TermsAndPrivacy from "../components/ComponentPages/TermsAndPrivacy";
import { getTermsAndServicesContent } from "src/network/api/termsAndPrivacyApi";
import { createTokenForSSG } from "src/network/api/userApi";

function TermAndService({ termsAndServicesContent }: any) {
  return (
    <Layout>
      <TermsAndPrivacy termsAndPrivacyContent={termsAndServicesContent} />
    </Layout>
  );
}
export async function getStaticProps() {
  const response = await createTokenForSSG();
  const resp = await getTermsAndServicesContent(response);
  return {
    props: {
      termsAndServicesContent: resp || [],
    },
  };
}
TermAndService.displayName = "TermAndService";

export default TermAndService;
