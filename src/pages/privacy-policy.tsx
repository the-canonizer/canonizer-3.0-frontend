import Layout from "../hoc/layout";

import TermsAndPrivacy from "../components/ComponentPages/TermsAndPrivacy";
import { getPrivacyPolicyContent } from "src/network/api/termsAndPrivacyApi";

function PrivacyPolicy({ privacyPolicyContent }: any) {
  return (
    <>
      <Layout>
        <TermsAndPrivacy termsAndPrivacyContent={privacyPolicyContent} />
      </Layout>
    </>
  );
}
export async function getStaticProps() {
  const res = await getPrivacyPolicyContent();
  return {
    props: {
      privacyPolicyContent: res || [],
    },
  };
}
PrivacyPolicy.displayName = "PrivacyPolicy";

export default PrivacyPolicy;
