import { render } from "@testing-library/react";
import TermsAndPrivacy from "../index";

describe("TermsAndPrivacy", () => {
  const termsAndPrivacyContent = [
    {
      privacy_policy_content: "Privacy policy content",
      terms_and_services_content: "Terms and services content",
    },
  ];

  it("should render privacy policy content correctly", () => {
    const { getByText } = render(
      <TermsAndPrivacy
        termsAndPrivacyContent={termsAndPrivacyContent}
        router={{ pathname: "/privacy-policy" }}
      />
    );

    const privacyPolicyContent = getByText("Privacy policy content");
    expect(privacyPolicyContent).toBeInTheDocument();
  });

  it("should render terms and services content correctly", () => {
    const { getByText } = render(
      <TermsAndPrivacy
        termsAndPrivacyContent={termsAndPrivacyContent}
        router={{ pathname: "/terms-and-services" }}
      />
    );

    const termsAndServicesContent = getByText("Terms and services content");
    expect(termsAndServicesContent).toBeInTheDocument();
  });
});
