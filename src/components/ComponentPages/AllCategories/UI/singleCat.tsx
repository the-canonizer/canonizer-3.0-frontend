import { useEffect, useState } from "react";
import { Typography } from "antd";
import { FlagOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import PropTypes from "prop-types";

import CommonCards from "components/shared/Card";
import { getRandomColor } from "components/ComponentPages/Home/CategoriesList";

const { Paragraph, Text } = Typography;

const propTypes = {
  tag: PropTypes.object,
};

const Category = ({ tag }) => {
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    setBgColor(getRandomColor()?.toLowerCase());
  }, []);

  return (
    <CommonCards
      title={
        <Paragraph
          id="category-title"
          className={`flex items-center pl-5 capitalize py-2 pr-5 rounded-r-lg`}
          style={{ backgroundColor: bgColor }}
        >
          <FlagOutlined
            id="flag-icon"
            className="text-canLight p-1 text-medium"
          />
          <Link href={{ pathname: `/categories/${tag?.id}` }}
              id="category-link"
              className="!text-canBlack text-lg font-inter font-medium hover:!canHoverBlue"
            >
              {tag?.title}
          </Link>
        </Paragraph>
      }
      className={`bg-white border-1 [&_.ant-card-head]:border-0 transition duration-300 [&_.ant-card-extra]:opacity-0 [&_.ant-card-extra]:transition [&_.ant-card-extra]:duration-300 [&_.ant-card-extra]:hover:opacity-100 [&_.ant-card-head]:pl-0 hocus:shadow-md [&_.ant-card-head-title]:w-10/12 [&_.ant-card-head-title]:md:w-8/12 [&_.ant-card-extra]:w-2/12 [&_.ant-card-extra]:md:w-4/12 [&_.ant-card-extra]:flex [&_.ant-card-extra]:justify-end [&_.ant-card-body]:py-0`}
      id="common-card"
      extra={
        <Link href={{ pathname: `/categories/${tag?.id}` }} type="link"
            id="extra-link"
            className="p-0 text-xl flex justify-center items-center mr-2 text-canBlack hover:text-canBlue"
          >
            <RightOutlined id="right-icon" />
        </Link>
      }
    >
      <Paragraph
        id="total-topics"
        className="text-sm font-normal text-canBlack font-inter"
      >
        <Text id="total-topics-count" className="font-semibold text-sm mr-1">
          {tag?.total_topics}
        </Text>
        <Text> Topic(s)</Text>
      </Paragraph>
      <Paragraph
        id="total-users"
        className="text-sm font-normal text-canBlack mb-0"
      >
        <Text id="total-users-count" className="font-semibold text-sm mr-1">
          {tag?.total_users}
        </Text>
        <Text> People have contributed</Text>
      </Paragraph>
    </CommonCards>
  );
};

Category.propTypes = propTypes;

export default Category;
