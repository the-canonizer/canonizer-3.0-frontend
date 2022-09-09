import styles from "./privacy.module.scss";
export default function PrivacyPolicys({ termsAndServicesConrent }) {
  return (
    <div className={styles.pageWrapper}>
      <div
        dangerouslySetInnerHTML={{
          __html: termsAndServicesConrent[0]?.privacy_policy_content,
        }}
      />
    </div>
  );
}
