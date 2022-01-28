import styles from "./helpCard.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

const HelpCard = () => {
  const { whatsNew } = useSelector((state: RootState) => ({
    whatsNew: state.homePage?.whatsNew,
  }));
  return (
    <>
      <section className={styles.wrap}>
        <div dangerouslySetInnerHTML={{ __html: whatsNew }} />
      </section>
    </>
  );
};

export default HelpCard;
