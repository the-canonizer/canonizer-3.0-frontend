import { Card } from "antd";
import styles from "./disclaimer.module.scss";
const DisclaimerMsg = () => {
  return (typeof window !== "undefined" &&
    window.location.origin.includes(
      process.env.NEXT_PUBLIC_BETA_URL.replace(/\/$/, "")
    )) ||
    process.env.NEXT_PUBLIC_HIDE_DISCLAIMER === "true" ? (
    <div></div>
  ) : (
    <div>
      <Card className={styles.card_wrapper}>
        This is not the live system. Any data submitted here is for testing
        purposes only and will be lost. Please go to{" "}
        <a href="https://canonizer.com/" target="_blank" rel="noreferrer">
          canonizer.com
        </a>
      </Card>
    </div>
  );
};
export default DisclaimerMsg;
