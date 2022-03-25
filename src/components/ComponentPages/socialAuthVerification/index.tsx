import { Button, Col, Divider, Row, Typography } from "antd";
import { Fragment } from "react";
import Image from "next/image";
import {
  FacebookFilled,
  TwitterOutlined,
  GithubFilled,
  LinkedinFilled,
} from "@ant-design/icons";

import styles from "./Social.module.scss";

const { Text } = Typography;

function SocialAuthVerification() {
  const onLinkClick = (provider) => {
    localStorage.setItem("redirectTab", "tab=social");
    alert("link:- " + provider);
  };

  const onUnlinkClick = (provider) => {
    alert("unlink:- " + provider);
  };

  return (
    <Fragment>
      <section className={`${styles.wrapper}`}>
        <div className={`${styles.icon_container}`}>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <Image
                  width={30}
                  height={30}
                  alt="google-logo"
                  src="/images/google.svg"
                />
                <caption>Google</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Text strong className={`${styles.name}`}>
                  Pranav Thakur
                </Text>
                <Text className={`${styles.email}`}>pranav.tel@gmail.com</Text>

                <Button
                  type="link"
                  className={`${styles.linkBtn}`}
                  onClick={onUnlinkClick.bind(this, "Google")}
                  data-testid="linkBtn"
                >
                  Unlink
                </Button>
              </div>
            </div>
          </div>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <FacebookFilled />
                <caption>facebook</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={`ant-btn ant-btn-orange ant-btn-lg ${styles.submitBtn}`}
                  data-testid="linkBtn"
                  tabIndex={12}
                  onClick={onLinkClick.bind(this, "Facebook")}
                >
                  Link
                </Button>
              </div>
            </div>
          </div>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <TwitterOutlined />
                <caption>Twitter</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={`ant-btn ant-btn-orange ant-btn-lg ${styles.submitBtn}`}
                  data-testid="linkBtn"
                  tabIndex={12}
                  onClick={onLinkClick.bind(this, "Twitter")}
                >
                  Link
                </Button>
              </div>
            </div>
          </div>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <LinkedinFilled />
                <caption>Linkedin</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={`ant-btn ant-btn-orange ant-btn-lg ${styles.submitBtn}`}
                  data-testid="linkBtn"
                  tabIndex={12}
                  onClick={onLinkClick.bind(this, "Linkedin")}
                >
                  Link
                </Button>
              </div>
            </div>
          </div>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <GithubFilled />
                <caption>Github</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={`ant-btn ant-btn-orange ant-btn-lg ${styles.submitBtn}`}
                  data-testid="linkBtn"
                  tabIndex={12}
                  onClick={onLinkClick.bind(this, "Github")}
                >
                  Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default SocialAuthVerification;
