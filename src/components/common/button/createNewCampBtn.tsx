import { useRouter } from "next/router";

import styles from "./button.module.scss";

import Button from "./index";

const CreateNewTopicButton = (props) => {
  const router = useRouter();

  const campRoute = () => {
    router.push({
      pathname: props.url,
    });
  };

  return (
    <Button
      {...props}
      size="large"
      className={styles.btn}
      onClick={campRoute}
      id="create-camp-btn"
    >
      <i className="icon-topic"></i> Create New Camp
    </Button>
  );
};

export default CreateNewTopicButton;
