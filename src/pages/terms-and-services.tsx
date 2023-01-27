import Layout from "../hoc/layout";
import TermsAndPrivacy from "../components/ComponentPages/TermsAndPrivacy";
import { getTermsAndServicesContent } from "src/network/api/termsAndPrivacyApi";
import { createToken } from "src/network/api/userApi";

function TermAndService({ termsAndServicesContent }: any) {
  return (
    <>
      <Layout>
        <TermsAndPrivacy termsAndPrivacyContent={termsAndServicesContent} />
      </Layout>
    </>
  );
}
export async function getStaticProps() {
  const response = await createToken();
  const res = await getTermsAndServicesContent(response?.access_token);
  return {
    props: {
      termsAndServicesContent: res || [],
    },
  };
}
TermAndService.displayName = "TermAndService";

export default TermAndService;
