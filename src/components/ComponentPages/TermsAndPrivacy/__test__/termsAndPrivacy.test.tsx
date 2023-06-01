import { render } from "@testing-library/react";
import TermsAndPrivacy from "../index";

describe("TermsAndPrivacy", () => {
  const termsAndPrivacyContent = [
    {
      privacy_policy_content: "<h1>Privacy policy content</h1>",
      terms_and_services_content: "<h1>Terms and services content</h1>",
    },
  ];

  it("should render privacy policy content correctly", () => {
    const { getByTestId } = render(
      <TermsAndPrivacy
        termsAndPrivacyContent={termsAndPrivacyContent}
        router={{ pathname: "/privacy-policy" }}
      />
    );

    const privacyPolicyContent = getByTestId("termsAndPolicy");
    expect(privacyPolicyContent).toBeInTheDocument();
  });

  it("should render terms and services content correctly", () => {
    const { getByTestId } = render(
      <TermsAndPrivacy
        termsAndPrivacyContent={termsAndPrivacyContent}
        router={{ pathname: "/terms-and-services" }}
      />
    );

    const termsAndServicesContent = getByTestId("termsAndPolicy");
    expect(termsAndServicesContent).toBeInTheDocument();
  });
});
