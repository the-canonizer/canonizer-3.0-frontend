import { Fragment } from "react";
import { Popover, Typography, Row, Col, Image, Avatar, Tooltip } from "antd";
import {
  ArrowRightOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  MoreOutlined,
  EyeOutlined,
  FlagOutlined,
  UserOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import Headings from "@/components/shared/Typography";
import CommonCard from "@/components/shared/Card";
import Tags from "@/components/shared/Tag";

const CategoriesList = () => {
  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} className="mb-3">
          <Headings
            level={5}
            className="mb-0 text-base font-bold uppercase"
          >
            List of Categories{" "}
            <Popover content="List of Categories" placement="top" className="">
              <InfoCircleOutlined />
            </Popover>
          </Headings>
        </Col>
        <Col md={12} className="text-right">
          <Link href="">
            <a className="text-blue hover:text-hblue text-medium font-inter">
              See More
            </a>
          </Link>
        </Col>
      </Row>

      <div className="mt-3 px-0">
        {["#F7E9F5", "#E9EEF9", "#F7EAEA", "#EDF3E6"]?.map((cat) => (
          <Tooltip title={cat}>
            <Tags
              className="rounded-[5px] py-1 px-4 border-0 text-black bg-blue"
              icon={<FlagOutlined />}
              color={cat}
            >
              {cat}
            </Tags>
          </Tooltip>
        ))}
      </div>
    </Fragment>
  );
};

export default CategoriesList;
