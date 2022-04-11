import { Button } from "antd";
import styles from "./button.module.scss";
const CustomButton = (props) => {
  return (
    <Button className={styles.customButton} {...props}>
      {props.children}
    </Button>
  );
};

export default CustomButton;
