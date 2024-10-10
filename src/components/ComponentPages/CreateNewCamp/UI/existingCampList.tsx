import { List, Typography } from "antd";
import Link from "next/link";
import { WarningOutlined } from "@ant-design/icons";

import CommonCards from "components/shared/Card";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import UserEditIcon from "./userEditIcon";
import { getHighlightedText } from "components/ComponentPages/CreateNewTopic/UI/existingTopicList";
import CustomSkelton from "components/common/customSkelton";
import { useDispatch } from "react-redux";
import { setSearchValue } from "src/store/slices/searchSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

const geturl = (bd) => {
  if (bd[1] && bd[1][2]?.camp_link) {
    return bd[1][2]?.camp_link;
  } else {
    return bd[0][1]?.camp_link;
  }
};

export const getTopicNameLink = (
  item,
  campName,
  isTopicNameReq = true,
  className = ""
) => {
  const bd = JSON.parse(item?.breadcrumb_data);
  return (
    <div className={"flex" + className}>
      <div className="w-[5px] h-[5px] rounded-full bg-canBlack mr-2 mt-2.5"></div>
      <div className="w-full whitespace-break-spaces break-all text-wrap line-clamp-1">
        <Link href={{ pathname: "/" + bd[0][1]?.camp_link }}>
          <a className="flex justify-start items-start">
            {getHighlightedText(item?.type_value, campName)}
          </a>
        </Link>
        {isTopicNameReq && (
          <Link
            href={{
              pathname: "/" + geturl(bd),
            }}
          >
            <a className="flex justify-start items-start text-xs mt-2 text-canLight whitespace-break-spaces break-all text-wrap line-clamp-1">
              Topic: {bd[0][1]?.topic_name}
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

const ExistingCampList = ({
  campName,
  data,
  isShowMore,
  isError,
  onContributeCLick,
  isLoading,
}) => {
  const dispatch = useDispatch();
  return (
    <CommonCards className="bg-topic-card-gr h-full">
      {isError && (
        <>
          <header className="mb-1 text-canRed flex items-start justify-start">
            <WarningOutlined className="text-xl text-canRed" />
            <div className="ml-3">
              <Typography.Paragraph className="text-canRed font-medium text-base !mb-2">
                A Camp with this exact name already exists!
              </Typography.Paragraph>
              <Typography.Paragraph className="text-canRed font-medium text-lg whitespace-break-spaces break-all text-wrap line-clamp-1">
                {campName}
              </Typography.Paragraph>
            </div>
          </header>
          <hr />
        </>
      )}
      <Typography.Paragraph className="text-canBlack font-medium mt-5 text-base">
        Camps with similar name where you can contribute -
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
          locale={{ emptyText: "There are no related camps available" }}
          className="!list-disc"
          footer={
            isShowMore && (
              <Link href={{ pathname: "/search/camp", query: { q: campName } }}>
                <a
                  className="text-canBlue uppercase text-xs font-semibold hocus:text-canHoverBlue"
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
              className="!border-b-0 mt-0 text-lg font-medium hover:shadow-lg !p-4 rounded-lg"
              key={item?.id}
            >
              {getTopicNameLink(item, campName)}
              <SecondaryButton
                className="flex p-0 !bg-transparent h-auto shadow-none border-0 uppercase text-xs font-semibold text-canBlue hocus:text-canBlue hocus:[&_>svg]:fill-canBlue"
                onClick={onContributeCLick.bind(this, item)}
              >
                contribute{" "}
                <UserEditIcon
                  className="[&_>svg]:text-sm ml-2"
                  width="18"
                  height=""
                />
              </SecondaryButton>
            </List.Item>
          )}
        />
      )}
    </CommonCards>
  );
};

export default ExistingCampList;
