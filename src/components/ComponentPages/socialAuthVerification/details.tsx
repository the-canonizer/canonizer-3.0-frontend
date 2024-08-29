import { Button, Popconfirm, Typography } from "antd";
import { Fragment } from "react";
import Image from "next/image";

import styles from "./Social.module.scss";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const { Text } = Typography;

function Details({ socialLinks, onUnlinkClick, onLinkClick, provider }) {
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
              className="text-canDarkRed text-base font-semibold flex items-center justify-center gap-4"
              data-testid="linkBtn"
            >
              Unlink
              <Image src="/images/unlink-icon.svg" width={24} height={24} />
            </Button>
          </Popconfirm>
        </Fragment>
      ) : (
        <SecondaryButton
          type="primary"
          htmlType="submit"
          className="!py-1.5 h-auto flex items-center justify-center gap-2"
          data-testid="linkBtn"
          tabIndex={12}
          onClick={onLinkClick.bind(this, provider)}
        >
          Link
          <Image src="/images/link-icon.svg" width={24} height={24} />
        </SecondaryButton>
      )}
    </Fragment>
  );
}

export default Details;
