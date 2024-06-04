import { Button } from "antd";
import styles from "./button.module.scss";
const CustomButton = (props: any) => {
  return (
    <Button className={`${styles.customButton} printHIde`} {...props}>
      {props.children}
    </Button>
  );
};

export default CustomButton;
