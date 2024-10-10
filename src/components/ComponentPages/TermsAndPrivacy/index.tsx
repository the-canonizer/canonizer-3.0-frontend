import styles from "./terms.module.scss";
import { useRouter } from "next/router";

export default function TermsAndPrivacy({ termsAndPrivacyContent }: any) {
  const router = useRouter();

  return (
    <div className={styles.pageWrapper} data-testid="termsAndPolicy">
      <div
        className="policy-content cn-card-home"
        dangerouslySetInnerHTML={{
          __html:
            router?.pathname == "/privacy-policy"
              ? termsAndPrivacyContent[0]?.privacy_policy_content
              : termsAndPrivacyContent[0]?.terms_and_services_content,
        }}
      />
    </div>
  );
}
