import Layout from "../hoc/layout";

import TermsAndPrivacy from "../components/ComponentPages/TermsAndPrivacy";
import { getPrivacyPolicyContent } from "src/network/api/termsAndPrivacyApi";
import { createTokenForSSG } from "src/network/api/userApi";

function PrivacyPolicy({ privacyPolicyContent }: any) {
  return (
    <Layout>
      <TermsAndPrivacy termsAndPrivacyContent={privacyPolicyContent} />
    </Layout>
  );
}
export async function getStaticProps() {
  const response = await createTokenForSSG();
  const resp = await getPrivacyPolicyContent(response);
  return {
    props: {
      privacyPolicyContent: resp || [],
    },
  };
}
PrivacyPolicy.displayName = "PrivacyPolicy";

export default PrivacyPolicy;
