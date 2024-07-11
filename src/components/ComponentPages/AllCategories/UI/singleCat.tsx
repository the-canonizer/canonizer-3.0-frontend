import { useEffect, useState } from "react";
import { Typography, Button } from "antd";
import { FlagOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";

import CommonCards from "components/shared/Card";
import { changeSlashToArrow } from "src/utils/generalUtility";
import { getRandomColor } from "components/ComponentPages/Home/CategoriesList";

const { Paragraph, Text } = Typography;

const Category = ({ onBackClick, tag }) => {
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    setBgColor(getRandomColor()?.toLowerCase());
  }, []);

  return (
    <CommonCards
      title={
        <Paragraph
          className={`flex items-center pl-5 capitalize py-2 pr-5 rounded-r-lg`}
          style={{ backgroundColor: bgColor }}
        >
          <FlagOutlined className="text-canLight p-1 text-medium" />
          <Link href="#">
            <a className="!text-canBlack text-lg font-inter font-medium hover:!canHoverBlue">
              {changeSlashToArrow(tag?.title)}
            </a>
          </Link>
        </Paragraph>
      }
      className={`bg-white border-1 [&_.ant-card-head]:border-0 transition duration-300 [&_.ant-card-extra]:opacity-0 [&_.ant-card-extra]:transition [&_.ant-card-extra]:duration-300 [&_.ant-card-extra]:hover:opacity-100 [&_.ant-card-head]:pl-0 hocus:shadow-md [&_.ant-card-head-title]:w-10/12 [&_.ant-card-head-title]:md:w-8/12 [&_.ant-card-extra]:w-2/12 [&_.ant-card-extra]:md:w-4/12 [&_.ant-card-extra]:flex [&_.ant-card-extra]:justify-end`}
      id="card-title"
      extra={
        <Button
          onClick={onBackClick}
          type="link"
          className="p-0 text-xl flex justify-center items-center mr-2 text-canBlack hover:text-canBlue"
        >
          <RightOutlined />
        </Button>
      }
    >
      <Paragraph className="text-sm font-medium text-canBlack font-inter">
        <Text className="font-semibold text-base">{tag?.total_topics}</Text>
        <Text> Topic(s)</Text>
      </Paragraph>
      <Paragraph className="text-sm font-medium text-canBlack mb-0">
        <Text className="font-semibold text-base">{tag?.total_users}</Text>
        <Text> People have contributed</Text>
      </Paragraph>
    </CommonCards>
  );
};

export default Category;
