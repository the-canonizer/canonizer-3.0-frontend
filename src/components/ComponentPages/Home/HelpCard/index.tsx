import { Fragment, memo } from "react";
import { useSelector } from "react-redux";

import styles from "./helpCard.module.scss";
import { RootState } from "../../../../store";

const HelpCard = memo(() => {
  const { whatsNew } = useSelector((state: RootState) => ({
    whatsNew: state.homePage?.whatsNew,
  }));
  return (
    <Fragment>
      {whatsNew && (
        <section className={styles.wrap}>
          <div
            className="help-card-wrap"
            dangerouslySetInnerHTML={{ __html: whatsNew }}
          />
        </section>
      )}
    </Fragment>
  );
});

export default HelpCard;
