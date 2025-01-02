import { Typography, Breadcrumb } from "antd";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";

import {
  changeSlashToArrow,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";

const truncateText = (text, maxLength = 30) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

const GetBreadCrumbs = ({ topicRecord, campRecord }) => {
  const breadCrumbCss = `font-normal !text-canLight [&_.ant-typography]:!text-canLight inline-flex gap-1`;

  return (
    <Breadcrumb
      className={`text-xs text-canLight font-normal rounded-lg pl-8 [&_ol]:overflow-hidden [&_ol>li]:inline-flex gap-1`}
      separator={<RightOutlined className="!text-xs" />}
    >
      <Breadcrumb.Item className={breadCrumbCss}>
        <Typography.Text
          id="breadcrumb-canon-text"
          className="capitalize min-w-max"
        >
          Canon:{" "}
        </Typography.Text>
        <Typography.Text id="breadcrumb-canon-namespace">
          {changeSlashToArrow(topicRecord?.namespace_name)}
        </Typography.Text>
      </Breadcrumb.Item>

      <Breadcrumb.Item className={breadCrumbCss}>
        <Typography.Text
          id="breadcrumb-topic-text"
          className="capitalize min-w-max"
        >
          Topic:{" "}
        </Typography.Text>
        <Link
          href={{
            pathname: `/topic/${
              topicRecord?.topic_num
            }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/${
              campRecord?.camp_num
            }-${replaceSpecialCharacters(campRecord?.camp_name, "-")}`,
          }}
        >
          <a
            id="breadcrumb-topic-link"
            className="!text-canLight hocus:!text-canBlue"
          >
            {truncateText(topicRecord?.topic_name)}
          </a>
        </Link>
      </Breadcrumb.Item>

      <Breadcrumb.Item className={breadCrumbCss}>
        <Typography.Text
          id="breadcrumb-camp-text"
          className="capitalize min-w-max"
        >
          Camp:{" "}
        </Typography.Text>
        <Link
          href={{
            pathname: `/topic/${
              topicRecord?.topic_num
            }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/${
              campRecord?.camp_num
            }-${replaceSpecialCharacters(campRecord?.camp_name, "-")}`,
          }}
        >
          <a
            id="breadcrumb-camp-link"
            className="!text-canLight hocus:!text-canBlue"
          >
            {truncateText(campRecord?.camp_name)}
          </a>
        </Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default GetBreadCrumbs;
