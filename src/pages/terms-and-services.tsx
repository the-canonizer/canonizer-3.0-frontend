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
  let ssg=true
  const response = await createToken(null, null,ssg);
  const resp = await getTermsAndServicesContent(response);
  return {
    props: {
      termsAndServicesContent: resp || [],
    },
  };
}
TermAndService.displayName = "TermAndService";

export default TermAndService;
