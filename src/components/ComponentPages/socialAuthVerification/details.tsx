import { Button, Popconfirm, Typography } from "antd";
import { Fragment } from "react";

import styles from "./Social.module.scss";

const { Text } = Typography;

export default function Details({
  socialLinks,
  onUnlinkClick,
  onLinkClick,
  provider,
}: any) {
  const text = "Are you sure to unlink this account?";

  return (
    <Fragment>
      {socialLinks[provider] ? (
        <Fragment>
          <Text strong className={`${styles.name}`}>
            {socialLinks[provider + "_name"]}
          </Text>
          <Text className={`${styles.email}`}>
            {socialLinks[provider + "_email"]}
          </Text>

          <Popconfirm
            title={text}
            onConfirm={onUnlinkClick.bind(
              this,
              provider,
              socialLinks[provider]
            )}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              className={`${styles.linkBtn}`}
              data-testid="linkBtn"
            >
              Unlink
            </Button>
          </Popconfirm>
        </Fragment>
      ) : (
        <Button
          type="primary"
          htmlType="submit"
          className={`ant-btn ant-btn-orange ant-btn-lg ${styles.submitBtn}`}
          data-testid="linkBtn"
          tabIndex={12}
          onClick={onLinkClick.bind(this, provider)}
        >
          Link
        </Button>
      )}
    </Fragment>
  );
}
