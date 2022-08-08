import { Card } from "antd";

import styles from "./disclaimer.module.scss";

const DisclaimerMsg = () => (
  <Card className={styles.card_wrapper}>
    This is not the live system. Any data submitted here is for testing purposes
    only and will be lost. Please go to{" "}
    <a href="https://canonizer.com/" target="_blank" rel="noreferrer">
      canonizer.com
    </a>
  </Card>
);

export default DisclaimerMsg;
