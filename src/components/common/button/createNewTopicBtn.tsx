import { useRouter } from "next/router";

import styles from "./button.module.scss";

import Button from "./index";

const CreateNewTopicButton = (props) => {
  const router = useRouter();

  const campRoute = () => {
    if (props.click) {
      props.click();
    }
    router?.push({ pathname: "/create/topic" });
  };

  return (
    <Button
      {...props}
      size="large"
      className={styles.btn}
      onClick={campRoute}
      id="create-topic-btn"
    >
      <i className="icon-topic"></i> Create Topic
    </Button>
  );
};

export default CreateNewTopicButton;
