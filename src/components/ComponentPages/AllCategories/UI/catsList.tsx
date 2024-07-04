import { Typography, Button, Row, Col } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import CommonCards from "components/shared/Card";
import Category from "./singleCat";
import Paginations from "components/shared/Paginations";
import SortByDropdown from "./sortByDropdown";
import SearchBar from "./searchBar";

const { Title, Paragraph } = Typography;

const CatsList = ({
  onBackClick,
  isMobile,
  tags,
  total,
  onPageChange,
  pageSize,
  current,
  onSort,
  onSearchChange,
  onSearchKeyUp,
}) => {
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
          List of Categories
        </Title>
      }
      className={`bg-white mb-6 border-0 [&_.ant-card-head]:border-0 mainCard ${
        isMobile
          ? "[&.mainCard>.ant-card-head>.ant-card-head-wrapper]:flex-col [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-extra]:w-full [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-extra]:text-right [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-head-title]:w-full [&.mainCard>.ant-card-head>.ant-card-head-wrapper>.ant-card-head-title]:h-full"
          : ""
      }`}
      id="card-title"
      extra={
        isMobile ? (
          <div className="flex justify-end">
            <SearchBar
              onSearchChange={onSearchChange}
              onSearchKeyUp={onSearchKeyUp}
            />
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
            <SearchBar
              onSearchChange={onSearchChange}
              onSearchKeyUp={onSearchKeyUp}
            />
            <SortByDropdown onSort={onSort} />
          </Col>
        )}
      </Row>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,_1fr))] gap-6">
        {tags?.map((tag) => (
          <Category onBackClick={undefined} key={tag?.id} tag={tag} />
        ))}
      </div>

      <Paginations
        total={total}
        showSizeChanger
        showQuickJumper
        current_page
        pageSize={pageSize}
        showTotal={(total) => `Total ${total} items`}
        className="mt-16 flex !text-canBlack !text-sm [&>*]:!text-sm [&>*]:!font-normal [&_.ant-pagination-options]:!ml-auto [&_.ant-pagination-total-text]:mr-auto "
        onChange={onPageChange}
        current={current}
        pageSizeOptions={[12, 24, 48, 96, 200]}
      />
    </CommonCards>
  );
};

export default CatsList;
