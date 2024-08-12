import { Typography, Breadcrumb } from "antd";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";

import {
  changeSlashToArrow,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";

const GetBreadCrumbs = ({ topicRecord, campRecord }) => {
  const breadCrumbCss = `font-normal !text-canLight [&_.ant-typography]:!text-canLight`;

  return (
    <Breadcrumb
      className={`text-xs text-canLight font-normal rounded-lg line-clamp-1 pl-8`}
      separator={<RightOutlined className="!text-xs" />}
    >
      <Breadcrumb.Item className={breadCrumbCss}>
        <Typography.Text>Canon: </Typography.Text>
        <Typography.Text>
          {changeSlashToArrow(topicRecord?.namespace_name)}
        </Typography.Text>
      </Breadcrumb.Item>
      <Breadcrumb.Item className={breadCrumbCss}>
        <Typography.Text>Topic: </Typography.Text>
        <Link
          href={{
            pathname: `/topic/${
              topicRecord?.topic_num
            }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/${
              campRecord?.camp_num
            }-${replaceSpecialCharacters(campRecord?.camp_name, "-")}`,
          }}
        >
          <a className="!text-canLight hocus:!text-canBlue">
            {topicRecord?.topic_name}
          </a>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item className={breadCrumbCss}>
        <Typography.Text>Camp: </Typography.Text>
        <Link
          href={{
            pathname: `/topic/${
              topicRecord?.topic_num
            }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/${
              campRecord?.camp_num
            }-${replaceSpecialCharacters(campRecord?.camp_name, "-")}`,
          }}
        >
          <a className="!text-canLight hocus:!text-canBlue">
            {campRecord?.camp_name}
          </a>
        </Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default GetBreadCrumbs;
