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
  isUpdate = false,
}) => {
  const dispatch = useDispatch();
  return (
    <CommonCards className="bg-topic-card-gr !border-canGrey2 h-full">
      {isError && (
        <>
          <header
            className="mb-1 text-canRed flex items-start justify-start"
            id="error-header"
          >
            <WarningOutlined
              className="text-xl text-canRed"
              id="warning-icon"
            />
            <div className="ml-3" id="error-message">
              <Typography.Paragraph
                className="text-canRed font-medium text-base !mb-2"
                id="error-paragraph-1"
              >
                A Topic with this exact name already exists!
              </Typography.Paragraph>
              <Typography.Paragraph
                className="text-canRed font-medium text-lg whitespace-break-spaces break-all text-wrap line-clamp-1"
                id="error-paragraph-2"
              >
                {topicName}
              </Typography.Paragraph>
            </div>
          </header>
          <hr className="border-canGrey2" id="error-divider" />
        </>
      )}
      <Typography.Paragraph
        className="text-canBlack font-medium mt-5 text-base"
        id="similar-topics-header"
      >
        Topics with similar name -
      </Typography.Paragraph>
      {isLoading ? (
        <CustomSkelton
          skeltonFor="list"
          bodyCount={5}
          stylingClass="listSkeleton"
          isButton={false}
          id="loading-skeleton"
        />
      ) : (
        <div className="w-full h-full">
          <div
            className={`${
              isUpdate ? "max-h-[850px]" : "max-h-[500px]"
            } overflow-y-auto overflow-x-hidden pr-3 mb-4`}
          >
            <List
              dataSource={data}
              locale={{ emptyText: "There are no related topics available" }}
              className="!list-disc"
              renderItem={(item: {
                id: string;
                link: string;
                type_value: string;
              }) => (
                <List.Item
                  className="!border-b-0 mt-0 pt-0 text-lg font-[300]"
                  key={item?.id}
                  id={`list-item-${item?.id}`}
                >
                  <Link href={{ pathname: "/" + item?.link }}
                      className="flex justify-start items-start whitespace-break-spaces break-all text-wrap line-clamp-1"
                      target="_blank"
                      id={`list-item-link-${item?.id}`}
                    >
                      <div
                        className="w-[5px] h-[5px] rounded-full bg-canBlack mr-3 mt-2.5"
                        id={`list-item-dot-${item?.id}`}
                      ></div>
                      {getHighlightedText(item?.type_value, topicName)}
                  </Link>
                </List.Item>
              )}
              id="topics-list"
            />
          </div>
          {isShowMore && (
            <Link
              href={{
                pathname: "/search/topic",
                query: { q: topicName },
              }}
                className="text-canBlue uppercase text-xs font-semibold hocus:text-canHoverBlue "
                target="_blank"
                role="button"
                tabIndex={0}
                onClick={() => {
                  dispatch(setSearchValue(""));
                  dispatch(
                    setFilterCanonizedTopics({
                      asof: "default",
                    })
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    dispatch(setSearchValue(""));
                  }
                }}
                id="see-more-results"
              >
                See more results
            </Link>
          )}
        </div>
      )}
    </CommonCards>
  );
};

export default ExistingTopicList;
