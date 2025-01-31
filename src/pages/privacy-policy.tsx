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
  let ssg=true
  const response = await createToken(null,null,ssg);
  const resp = await getPrivacyPolicyContent(response);
  return {
    props: {
      privacyPolicyContent: resp || [],
    },
  };
}
PrivacyPolicy.displayName = "PrivacyPolicy";

export default PrivacyPolicy;
