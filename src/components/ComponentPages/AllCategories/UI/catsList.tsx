import { Typography, Button, Row, Col } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import CommonCards from "components/shared/Card";
import Category from "./singleCat";
import SortByDropdown from "./sortByDropdown";

const { Title, Paragraph } = Typography;

const propTypes = {
  onBackClick: PropTypes.func,
  isMobile: PropTypes.bool,
  tags: PropTypes.array,
  onSort: PropTypes.func,
};

const CatsList = ({ onBackClick, isMobile, tags, onSort }) => {
  return (
    <CommonCards
      title={
        <Title level={3} className="flex justify-start items-center">
          <Button
            onClick={onBackClick}
            type="link"
            className="p-0 text-xl flex justify-center items-center mr-2 text-canBlack hover:text-canBlue"
          >
            <LeftOutlined />
          </Button>
          List of Topic Tags
        </Title>
      }
      className={`bg-white mb-6 border-0 [&_.ant-card-head]:border-0 mainCard ${
        isMobile
          ? "[&.mainCard>.ant-card-head>.ant-card-head-wrapper]:flex-col [&.mainCard>.ant-card-head>.ant-card-head-wrapper]:sm:flex-row [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-extra]:sm:w-4/12 [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-extra]:text-right [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-head-title]:w-full [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-head-title]:sm:w-8/12 [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-head-title]:h-full"
          : ""
      }`}
      id="card-title"
      extra={
        isMobile ? (
          <div className="flex justify-end">
            <SortByDropdown onSort={onSort} />
          </div>
        ) : null
      }
    >
      <Row gutter={15} className="border-b-2 pb-4 mb-4">
        <Col lg={12}>
          <Paragraph className="font-semibold text-base text-canBlack uppercase">
            What are Categories?
          </Paragraph>
          <Paragraph className="text-sm opacity-80 text-black font-normal mb-0">
            Every conversation has to have a context, a group that it belongs
            to. Category is that group that lorem Ipsum is simply dummy text of
            the printing and typesetting industry.
          </Paragraph>
        </Col>
        {!isMobile && (
          <Col lg={12} className="flex justify-end items-center">
            <SortByDropdown onSort={onSort} />
          </Col>
        )}
      </Row>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,_1fr))] gap-6">
        {tags?.map((tag) => (
          <Category key={tag?.id} tag={tag} />
        ))}
      </div>
    </CommonCards>
  );
};

CatsList.propTypes = propTypes;

export default CatsList;
