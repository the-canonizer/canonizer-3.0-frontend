import { Card } from "antd";
import { useEffect, useState } from "react";

import styles from "./disclaimer.module.scss";

import useAuthenticated from "../../../hooks/isUserAuthenticated";

const DisclaimerMsg = () => {
  const auth = useAuthenticated();

  const [isLogged, setIsLogged] = useState(auth);

  useEffect(() => setIsLogged(auth), [auth]);

  return isLogged ? (
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
