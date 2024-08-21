import { Button, Popconfirm, Typography } from "antd";
import { Fragment } from "react";
import Image from "next/image";
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
              className="text-canDarkRed text-base font-semibold flex items-center justify-center gap-4"
              data-testid="linkBtn"
            >
              Unlink
              <Image src="/images/unlink-icon.svg" width={24} height={24} />
            </Button>
          </Popconfirm>
        </Fragment>
      ) : (
        <>
          {" "}
          <Button
            type="primary"
            htmlType="submit"
            className="bg-btnBg bg-opacity-10 w-40 !py-2.5 !border !border-canBlue text-base text-canBlack font-medium [&_.ant-btn-primary]:!border [&_.ant-btn-primary]:!border-canBlue !h-14 rounded-lg flex items-center justify-center gap-2.5 hover:!bg-btnbg hover:bg-opacity-10"
            data-testid="linkBtn"
            tabIndex={12} 
            onClick={onLinkClick.bind(this, provider)}
          >
            Link
            <Image src="/images/link-icon.svg" width={24} height={24} />
          </Button>
        </>
      )}
    </Fragment>
  );
}
