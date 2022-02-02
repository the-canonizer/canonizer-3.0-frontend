import { Typography, Button } from "antd";
import {
  FacebookFilled,
  LinkedinFilled,
  TwitterOutlined,
  GithubFilled,
} from "@ant-design/icons";

import styles from "./social-login.module.scss";

const { Text } = Typography;

export default function SocialLoginUi() {
  return (
    <div className={styles.wrapper}>
      <Text className={styles.social_login_text}>
        Login or Signup with social accounts.
      </Text>
      <div className={styles.btn_group}>
        <Button shape="circle" type="link" icon={<FacebookFilled />} />
        <Button
          shape="circle"
          type="link"
          // eslint-disable-next-line @next/next/no-img-element
          icon={<img src="/images/google.svg" alt="google logo" />}
        />
        <Button shape="circle" type="link" icon={<TwitterOutlined />} />
        <Button shape="circle" type="link" icon={<LinkedinFilled />} />
        <Button shape="circle" type="link" icon={<GithubFilled />} />
      </div>
    </div>
  );
}
