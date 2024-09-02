import { Typography } from "antd";
import { TagOutlined } from "@ant-design/icons";
import Link from "next/link";

import CustomSkelton from "src/components/common/customSkelton";
import { Fragment } from "react";

const TopicCatsLabel = ({ tags, loading = false, ...restProps }) => {
  if (loading) {
    return (
      <CustomSkelton
        skeltonFor="list"
        bodyCount={1}
        stylingClass="listSkeleton"
        isButton={false}
      />
    );
  }

  const LinkItem = ({ text, link }) => (
    <Link href={link}>
      <a className="!text-canBlue text-xs font-inter font-medium hover:!canHoverBlue">
        {text}
      </a>
    </Link>
  );

  return (
    <Typography.Paragraph
      className={`!bg-transparent border-0 p-0 flex items-center leading-1 !mb-0 mr-3 mainTags ${
        !tags?.length ? "invisible" : ""
      }`}
      {...restProps}
    >
      <TagOutlined className="text-canLight text-medium rotate-[280deg]" />
      <Typography.Paragraph className="line-clamp-1 max-w-52 !mb-0 pl-2">
        {(tags || []).map((item, idx) => (
          <Fragment key={item?.id}>
            <LinkItem
              text={item?.title}
              link={{ pathname: `/categories/${item?.id}` }}
              key={item?.id}
            />
            {idx !== tags?.length - 1 ? (
              <span className="!text-canBlue text-xs font-inter font-medium hover:!canHoverBlue mr-1">
                ,
              </span>
            ) : null}
          </Fragment>
        ))}
      </Typography.Paragraph>
    </Typography.Paragraph>
  );
};

export default TopicCatsLabel;
