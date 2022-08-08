import { Card } from "antd";

import styles from "./disclaimer.module.scss";

import useAuthenticated from "../../../hooks/isUserAuthenticated";
import { useEffect, useState } from "react";

const DisclaimerMsg = () => {
  const auth = useAuthenticated();

  const [isLooged, setIsLogged] = useState(auth);

  useEffect(() => setIsLogged(auth), [auth]);

  return isLooged ? (
    <Card className={styles.card_wrapper}>
      This is not the live system. Any data submitted here is for testing
      purposes only and will be lost. Please go to{" "}
      <a href="https://canonizer.com/" target="_blank" rel="noreferrer">
        canonizer.com
      </a>
    </Card>
  ) : null;
};

export default DisclaimerMsg;
