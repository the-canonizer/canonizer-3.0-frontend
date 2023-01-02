import { Card } from "antd";
import styles from "./disclaimer.module.scss";
const DisclaimerMsg = () => {
  return process.env.NEXT_PUBLIC_HIDE_DISCLAIMER === "false" ? (
    <div>
      <Card className={styles.card_wrapper}>
        This is not the live system. Any data submitted here is for testing
        purposes only and will be lost. Please go to{" "}
        <a href="https://canonizer.com/" target="_blank" rel="noreferrer">
          canonizer.com
        </a>
      </Card>
    </div>
  ) : (
    <div></div>
  );
};
export default DisclaimerMsg;
