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
        <Title
          level={3}
          className="flex justify-start items-center"
          id="title-1"
        >
          <Button
            onClick={onBackClick}
            type="link"
            className="p-0 text-xl flex justify-center items-center mr-2 text-canBlack hover:text-canBlue"
            id="back-button-1"
          >
            <LeftOutlined id="left-icon-1" />
          </Button>
          List of Topic Tags
        </Title>
      }
      className={`bg-white mb-6 border-0 [&_.ant-card-head]:border-0 mainCard ${
        isMobile
          ? "[&.mainCard>.ant-card-head>.ant-card-head-wrapper]:flex-col [&.mainCard>.ant-card-head>.ant-card-head-wrapper]:sm:flex-row [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-extra]:sm:w-4/12 [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-extra]:text-right [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-head-title]:w-full [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-head-title]:sm:w-8/12 [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-head-title]:h-full"
          : ""
      }`}
      id="common-cards-1"
      extra={
        isMobile ? (
          <div className="flex justify-end" id="sort-dropdown-container-1">
            <SortByDropdown onSort={onSort} id="sort-dropdown-1" />
          </div>
        ) : null
      }
    >
      <Row gutter={15} className="border-b-2 pb-4 mb-4" id="row-1">
        <Col lg={12} id="col-1">
          <Paragraph
            className="font-semibold text-base text-canBlack uppercase"
            id="paragraph-1"
          >
            What are Topic Tags?
          </Paragraph>
          <Paragraph
            className="text-sm opacity-80 text-black font-normal mb-0"
            id="paragraph-2"
          >
            Topic Tags are keywords that help categorize and organize topics
            within a Canon on Canonizer. By adding relevant tags to a topic,
            users can enhance discoverability, making it easier for others to
            find and engage with topics that match their interests. Tags also
            provide context, allowing users to quickly understand the focus and
            scope of a topic.
          </Paragraph>
        </Col>
        {!isMobile && (
          <Col lg={12} className="flex justify-end items-center" id="col-2">
            <SortByDropdown onSort={onSort} id="sort-dropdown-2" />
          </Col>
        )}
      </Row>

      <div
        className="grid grid-cols-[repeat(auto-fill,minmax(350px,_1fr))] gap-6"
        id="grid-1"
      >
        {tags?.map((tag) => (
          <Category key={tag?.id} tag={tag} id={`category-${tag?.id}`} />
        ))}
      </div>
    </CommonCards>
  );
};

CatsList.propTypes = propTypes;

export default CatsList;
