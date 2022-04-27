import { useRouter } from "next/router";

import styles from "./button.module.scss";

import Button from "./index";

const CreateNewCampButton = (props) => {
  const router = useRouter();

  const campRoute = () => {
    router.push("/create/topic");
  };

  return (
    <Button {...props} size="large" className={styles.btn} onClick={campRoute}>
      <i className="icon-topic"></i> Create New Topic
    </Button>
  );
};

export default CreateNewCampButton;
