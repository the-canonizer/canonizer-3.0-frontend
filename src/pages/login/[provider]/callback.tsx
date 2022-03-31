import GetStartedLayout from "../../../hoc/getStartedLayout";
import SocialLoginCallback from "../../../components/ComponentPages/SocialLoginCallback";

function SocialLoginCallbackPage() {
  return (
    <GetStartedLayout initialProps={undefined} initialState={undefined}>
      <SocialLoginCallback />
    </GetStartedLayout>
  );
}

SocialLoginCallbackPage.displayName = "SocialLoginCallbackPage";

export default SocialLoginCallbackPage;
