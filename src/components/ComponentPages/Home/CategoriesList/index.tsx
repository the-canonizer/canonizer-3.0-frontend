import { Fragment, useEffect } from "react";
import { Popover, Row, Col, Tooltip } from "antd";
import { InfoCircleOutlined, FlagOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSelector } from "react-redux";

import Headings from "src/components/shared/Typography";
import Tags from "src/components/shared/Tag";
import { RootState } from "src/store";
import { getAllTags } from "src/network/api/tagsApi";

const colors = ["#F7E9F5", "#E9EEF9", "#F7EAEA", "#EDF3E6"];

const getRandomColor = () => {
  return Math.floor(Math.random() * colors?.length);
};

const CategoriesList = () => {
  const { tags } = useSelector((state: RootState) => ({
    tags: state?.tag?.tags,
  }));

  const getTags = async () => {
    await getAllTags();
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12} className="mb-3">
          <Headings level={5} className="mb-0 text-14 font-bold uppercase">
            List of Categories{" "}
            <Popover content="List of Categories" placement="top" className="">
              <InfoCircleOutlined />
            </Popover>
          </Headings>
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <Link href="">
            <a className="text-blue hover:text-hblue text-14 font-inter font-medium">
              See More
            </a>
          </Link>
        </Col>
      </Row>

      <div className="mt-0 px-0">
        {tags?.map((cat) => (
          <Tooltip title={cat?.title} key={cat?.id}>
            <Tags
              className="rounded-[5px] py-1 px-5 border-0 text-black bg-blue mt-0 mb-3"
              icon={<FlagOutlined />}
              color={colors[getRandomColor()]}
            >
              {cat?.title}
            </Tags>
          </Tooltip>
        ))}
      </div>
    </Fragment>
  );
};

export default CategoriesList;
