import { Typography, Button } from "antd";
import {
  FacebookFilled,
  TwitterOutlined,
  GithubFilled,
  LinkedinFilled,
} from "@ant-design/icons";

import styles from "./social-login.module.scss";
import { socialLogin } from "../../../network/api/userApi";

const { Text } = Typography;

export default function SocialLoginUi({ isNotLogin = false }) {
  // social login api call
  const onSocialLogin = async (provider, e) => {
    e.preventDefault();
    let body = { provider };
    const res = await socialLogin(body);
    try {
      if (res.data) {
        if (isNotLogin) {
          localStorage.setItem("rd_s", "rg");
        }
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Text className={styles.social_login_text} id="social-login-title">
        {`${isNotLogin ? "Signup" : "Login"} with social accounts.`}
      </Text>
      <div className={styles.btn_group}>
        <Button
          shape="circle"
          onClick={onSocialLogin.bind(this, "facebook")}
          type="link"
          icon={<FacebookFilled />}
          data-testid="facebook"
          className={styles["facebook-btn"]}
          id="facebook-link"
        />
        <Button
          shape="circle"
          onClick={onSocialLogin.bind(this, "google")}
          type="link"
          icon={
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/images/google.svg" alt="google logo" />
          }
          data-testid="google"
          className={styles["google-btn"]}
          id="google-link"
        />

        <Button
          shape="circle"
          onClick={onSocialLogin.bind(this, "twitter")}
          type="link"
          icon={<TwitterOutlined />}
          data-testid="twitter"
          className={styles["twitter-btn"]}
          id="twitter-link"
        />

        <Button
          shape="circle"
          onClick={onSocialLogin.bind(this, "linkedin")}
          type="link"
          icon={<LinkedinFilled />}
          data-testid="linkedin"
          className={styles["linkedin-btn"]}
          id="linkedin-link"
        />

        <Button
          shape="circle"
          onClick={onSocialLogin.bind(this, "github")}
          type="link"
          icon={<GithubFilled />}
          data-testid="github"
          className={styles["github-btn"]}
          id="github-link"
        />
      </div>
    </div>
  );
}
