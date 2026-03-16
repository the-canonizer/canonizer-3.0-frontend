import { Typography } from "antd";
import { TagOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

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

  const router = useRouter();
  const LinkItem = ({ text, link }) => (
    <span
      id="browse-topic-tags-item"
      className="!text-canBlue text-xs font-inter font-medium hover:!canHoverBlue cursor-pointer"
      onClick={(e) => {
        e?.stopPropagation();
        e?.preventDefault();
        router.push(link);
      }}
    >
      {text}
    </span>
  );

  return (
    <Typography.Paragraph
      id="topic-cats-label"
      className={`!bg-transparent border-0 p-0 flex items-center leading-1 !mb-0 mr-3 mainTags ${
        !tags?.length ? "invisible" : ""
      }`}
      {...restProps}
    >
      <TagOutlined
        id="tag-icon"
        className="text-canLight text-medium rotate-[280deg]"
      />
      <Typography.Paragraph
        id="browse-topic-tags-container"
        className="line-clamp-1 max-w-52 !mb-0 pl-2"
      >
        {(tags || []).map((item, idx) => (
          <Fragment key={`${item?.id}-${idx}`}>
            <LinkItem
              text={item?.title}
              link={{ pathname: `/categories/${item?.id}` }}
            />
            {idx !== tags?.length - 1 ? (
              <span
                id={`comma-${item?.id}`}
                className="!text-canBlue text-xs font-inter font-medium hover:!canHoverBlue mr-1"
              >
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
