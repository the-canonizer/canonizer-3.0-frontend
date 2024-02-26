import Layout from "../hoc/layout";

import TermsAndPrivacy from "../components/ComponentPages/TermsAndPrivacy";
import { getPrivacyPolicyContent } from "src/network/api/termsAndPrivacyApi";
import { createToken } from "src/network/api/userApi";

function PrivacyPolicy({ privacyPolicyContent }: any) {
  return (
    <Layout>
      <TermsAndPrivacy termsAndPrivacyContent={privacyPolicyContent} />
    </Layout>
  );
}
export async function getStaticProps() {
  const response = await createToken();
  const res = await getPrivacyPolicyContent(response?.access_token);
  return {
    props: {
      privacyPolicyContent: res || [],
    },
  };
}
PrivacyPolicy.displayName = "PrivacyPolicy";

export default PrivacyPolicy;
