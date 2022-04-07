import { Fragment } from "react";

import styles from "../../CreateNewTopic/UI/createNewTopic.module.scss";

export default function TopBar({ paramsList }) {
  return (
    <Fragment>
      <div className={`${styles.upperTitle}`}>
        <p>
          <strong>Topic:</strong> {paramsList?.topic}
        </p>
        <p>
          <strong>Camp:</strong> {paramsList?.camp}
        </p>
      </div>
    </Fragment>
  );
}
