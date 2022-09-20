import styles from "./terms.module.scss";
export default function TermsService({ termsAndServicesConrent }) {
  return (
    <div className={styles.pageWrapper}>
      <div
        dangerouslySetInnerHTML={{
          __html: termsAndServicesConrent[0]?.terms_and_services_content,
        }}
      />
    </div>
  );
}
