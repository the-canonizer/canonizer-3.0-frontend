import { List, Typography } from "antd";
import Link from "next/link";
import { WarningOutlined } from "@ant-design/icons";

import CommonCards from "components/shared/Card";

export const getHighlightedText = (text, highlight) => {
  const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts?.map((part, i) => (
        <span
          key={i}
          style={
            part?.toLowerCase() === highlight?.toLowerCase()
              ? { fontWeight: "bold" }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};

const ExistingTopicList = ({ topicName, data, isShowMore, isError }) => {
  return (
    <CommonCards className="bg-topic-card-gr h-full">
      {isError && (
        <>
          <header className="mb-1 text-canRed flex items-start justify-start">
            <WarningOutlined className="text-xl text-canRed" />
            <div className="ml-3">
              <Typography.Paragraph className="text-canRed font-medium text-base !mb-2">
                A Topic with this exact name already exists!
              </Typography.Paragraph>
              <Typography.Paragraph className="text-canRed font-medium text-lg">
                {topicName}
              </Typography.Paragraph>
            </div>
          </header>
          <hr />
        </>
      )}
      <Typography.Paragraph className="text-canBlack font-medium mt-5 text-base">
        Topics with similar name -
      </Typography.Paragraph>
      <List
        dataSource={data}
        locale={{ emptyText: "There are no related topics available" }}
        className="!list-disc"
        footer={
          isShowMore && (
            <Link href={{ pathname: "/search/topic", query: { q: topicName } }}>
              <a className="text-canBlue uppercase text-xs font-semibold hocus:text-canHoverBlue">
                See more results
              </a>
            </Link>
          )
        }
        renderItem={(item: {
          id: string;
          link: string;
          type_value: string;
        }) => (
          <List.Item className="!border-b-0 mt-0 pt-0 text-sm" key={item?.id}>
            <Link href={{ pathname: "/" + item?.link }}>
              <a className="flex justify-start items-start">
                <div className="w-[5px] h-[5px] rounded-full bg-canBlack mr-2 mt-1.5"></div>
                {getHighlightedText(item?.type_value, topicName)}
              </a>
            </Link>
          </List.Item>
        )}
      />
    </CommonCards>
  );
};

export default ExistingTopicList;