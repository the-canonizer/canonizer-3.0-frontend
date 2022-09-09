import Layout from "../hoc/layout";
import PrivacyPolicys from "../components/ComponentPages/privacyPolicy";
import { getTermsAndServicesContent } from "src/network/api/termsAndPrivacyApi";

function PrivacyPolicy({ termsAndServicesConrent }) {
  return (
    <>
      <Layout>
        <PrivacyPolicys termsAndServicesConrent={termsAndServicesConrent} />
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
