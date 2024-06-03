import { useState } from "react";
import { useDispatch } from "react-redux";
import { Typography, Button } from "antd";
import {
  FacebookFilled,
  // TwitterOutlined,
  GithubFilled,
  LinkedinFilled,
} from "@ant-design/icons";

import styles from "./social-login.module.scss";

import { getNickNameList, socialLogin } from "src/network/api/userApi";
import { setValue } from "src/store/slices/utilsSlice";
import CustomSkeleton from "../customSkelton";
import { setUserNickNames } from "src/store/slices/authSlice";

const { Text } = Typography;

export default function SocialLoginUi({ isNotLogin = false }: any) {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const fetchNickNameList = async () => {
    let response = await getNickNameList();
      dispatch(setUserNickNames(response?.data));
  }
  
  
  // social login api call
  const onSocialLogin = async (
    provider: any,
    e: { preventDefault: () => void }
  ) => {
    setIsLoading(true);

    e.preventDefault();
    let body = { provider };
    const res = await socialLogin(body);
    try {
      if (res.data) {  
        fetchNickNameList()
        if (isNotLogin) {
          dispatch(setValue({ label: "redirect_type", value: true }));
        }
        window.location.href = res.data.url;
      }
    } catch (error) {
      // continue regardless of error
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <Text className={styles.social_login_text} id="social-login-title">
        {`${isNotLogin ? "Signup" : "Login"} with social accounts.`}
      </Text>
      {isLoading ? (
        <CustomSkeleton
          skeltonFor="list"
          bodyCount={1}
          stylingClass="listSkeleton"
          isButton={false}
        />
      ) : (
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
      )}
    </div>
  );
}
