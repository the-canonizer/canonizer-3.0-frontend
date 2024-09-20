import { List, Typography } from "antd";
import Link from "next/link";
import { WarningOutlined } from "@ant-design/icons";

import CommonCards from "components/shared/Card";
import CustomSkelton from "components/common/customSkelton";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { setSearchValue } from "src/store/slices/searchSlice";
import { useDispatch } from "react-redux";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

export const getHighlightedText = (text, highlight) => {
  const parts = text?.split(
    new RegExp(`(${replaceSpecialCharacters(highlight, "-")})`, "gi")
  );
  return (
    <span>
      {parts?.map((part, i) => (
        <span
          key={i}
          style={
            part?.toLowerCase() === highlight?.toLowerCase()
              ? { fontWeight: 500 }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};
const ExistingTopicList = ({
  isLoading,
  topicName,
  data,
  isShowMore,
  isError,
}) => {
  const dispatch = useDispatch();
  return (
    <CommonCards className="bg-topic-card-gr !border-canGrey2 h-full">
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
          <hr className="border-canGrey2" />
        </>
      )}
      <Typography.Paragraph className="text-canBlack font-medium mt-5 text-base">
        Topics with similar name -
      </Typography.Paragraph>
      {isLoading ? (
        <CustomSkelton
          skeltonFor="list"
          bodyCount={5}
          stylingClass="listSkeleton"
          isButton={false}
        />
      ) : (
        <List
          dataSource={data}
          locale={{ emptyText: "There are no related topics available" }}
          className="!list-disc"
          footer={
            isShowMore && (
              <Link
                href={{ pathname: "/search/topic", query: { q: topicName } }}
              >
                <a
                  className="text-canBlue uppercase text-xs font-semibold hocus:text-canHoverBlue"
                  target="_blank"
                  role="button" // Adds button role
                  tabIndex={0} // Makes it focusable via keyboard
                  onClick={() => {
                    dispatch(setSearchValue(""));
                    dispatch(
                      setFilterCanonizedTopics({
                        // asofdate: Date.now() / 1000,
                        asof: "default",
                      })
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      dispatch(setSearchValue(""));
                    }
                  }}
                >
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
            <List.Item
              className="!border-b-0 mt-0 pt-0 text-lg font-[300]"
              key={item?.id}
            >
              <Link href={{ pathname: "/" + item?.link }}>
                <a className="flex justify-start items-start" target="_blank">
                  <div className="w-[5px] h-[5px] rounded-full bg-canBlack mr-3 mt-2.5"></div>
                  {getHighlightedText(item?.type_value, topicName)}
                </a>
              </Link>
            </List.Item>
          )}
        />
      )}
    </CommonCards>
  );
};

export default ExistingTopicList;
