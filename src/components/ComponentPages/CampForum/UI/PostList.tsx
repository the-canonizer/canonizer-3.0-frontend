import { Typography, Pagination, Popover } from "antd";
import moment from "moment";
import Link from "next/link";
import {
  CalendarOutlined,
  LeftOutlined,
  UserOutlined,
} from "@ant-design/icons";

import SinglePost from "./singlePost";
import { getTime } from "src/utils/generalUtility";
import CustomSkelton from "components/common/customSkelton";
import CommonCards from "components/shared/Card";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const { Text, Paragraph } = Typography;

const PostUI = ({
  postList,
  pCurrent,
  pTotal,
  pOnChange,
  onDeleteClick,
  onEditClick,
  currentThread,
  isLoading,
  postperPage,
  threadDetailsLoading,
  createdAt,
  onBackClick,
}) => {
  return (
    <CommonCards
      title={
        <div className="border-0 flex items-center justify-start">
          <SecondaryButton
            className="border-0 p-0 flex items-center justify-start text-xl"
            onClick={onBackClick}
          >
            <LeftOutlined />
          </SecondaryButton>
          <span className="text-canBlack font-medium text-xl ml-2">Thread</span>
        </div>
      }
      className={`bg-white border-0 lg:px-6 [&_.ant-card-head]:p-0 [&_.ant-card-body]:px-0 [&_.ant-card-head]:border-0`}
    >
      <div className="bg-canGray p-6 rounded-xl">
        <header className="mb-5">
          <Typography.Paragraph className="text-base font-medium text-canBlack">
            {threadDetailsLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass=""
                listStyle="liHeight"
                isButton={false}
              />
            ) : (
              <Popover
                content={currentThread["title"]}
                key={currentThread["created_at"]}
                placement="topLeft"
              >
                <span id="card-title">{currentThread["title"]}</span>
              </Popover>
            )}
          </Typography.Paragraph>
          {threadDetailsLoading ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass=""
              listStyle="liWidth"
              isButton={false}
            />
          ) : (
            <div className="flex justify-start items-center flex-wrap">
              <Paragraph id="started-by-label" className="!mb-0 text-canLight">
                <UserOutlined className="mr-2 text-canLight" />
                Started by{" "}
                <Link
                  href={`/user/supports/${
                    currentThread["creation_nick_name_id"] || ""
                  }?canon=${currentThread["namespace_id"] || 1}`}
                  passHref
                >
                  <a className="">{currentThread["creation_nick_name"]}</a>
                </Link>
              </Paragraph>
              <span className="block mx-2 text-canLight text-xs">|</span>
              <Paragraph className="!mb-0 text-canLight">
                <CalendarOutlined className="mr-2 text-canLight" />
                {createdAt ? (
                  <Text
                    id="thread-create-label"
                    className="text-canLight"
                  >{`Thread Created on ${moment(getTime(createdAt)).format(
                    "MMM Do YYYY, h:mm:ss a"
                  )}`}</Text>
                ) : currentThread?.created_at ? (
                  <Text
                    id="thread-create-label"
                    className="text-canLight"
                  >{`Thread Created on ${moment(
                    getTime(currentThread?.created_at)
                  ).format("MMM Do YYYY, h:mm:ss a")}`}</Text>
                ) : null}
                {currentThread["creation_nick_name"] && <></>}
              </Paragraph>
              <span className="block mx-2 text-canLight text-xs">|</span>
              <Paragraph className="!mb-0 text-canLight">
                <CalendarOutlined className="mr-2 text-canLight" />
                <Text className="text-canLight">
                  Post in this thread: {currentThread?.post_count}
                </Text>
              </Paragraph>
            </div>
          )}
        </header>
        <hr className="mb-7 mt-3" />
        {isLoading ? (
          <CustomSkelton
            skeltonFor="post_card"
            bodyCount={1}
            stylingClass=""
            listStyle=""
            isButton={false}
          />
        ) : (
          postList?.map((post) => (
            <SinglePost
              postedTime={post.created_at}
              postedUpdatedTime={post.updated_at}
              content={post.body}
              nick_name={post.nick_name}
              key={post.id}
              onEditClick={onEditClick.bind(this, post)}
              onDeleteClick={onDeleteClick.bind(this, post.id)}
              post={post}
            />
          ))
        )}

        <div className={`paginationCon flex justify-center py-5`}>
          {isLoading ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass=""
              listStyle="liHeight"
              isButton={false}
            />
          ) : pTotal > postperPage ? (
            <Pagination
              current={pCurrent}
              onChange={pOnChange}
              total={pTotal}
              showSizeChanger={false}
              data-testid="s"
            />
          ) : null}
        </div>
      </div>
    </CommonCards>
  );
};

export default PostUI;
