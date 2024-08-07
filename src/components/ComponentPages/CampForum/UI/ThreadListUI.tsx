import { Fragment, useState, useEffect } from "react";
import { Input, Typography, Table, Pagination, Tooltip } from "antd";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./Forum.module.scss";

import messages from "src/messages";
import { getTime, replaceSpecialCharacters } from "src/utils/generalUtility";
import useAuthentication from "src/hooks/isUserAuthenticated";
import CustomSkelton from "components/common/customSkelton";
import CommonCards from "components/shared/Card";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

const { Text, Paragraph } = Typography;
const { Column } = Table;

const { placeholders } = messages;

const ThreadListUI = ({
  onSearch,
  onChange,
  threadList,
  onThreadClick,
  current,
  total,
  filterThread,
  paramsList,
  isLoading,
  onThreadEdit,
}) => {
  const [isLog, setIsLog] = useState(false);
  const { isUserAuthenticated } = useAuthentication();

  const router = useRouter();

  useEffect(() => {
    setIsLog(isUserAuthenticated);
  }, [isUserAuthenticated]);

  const loadingData = threadList.length
    ? threadList
    : [
        {
          id: 1,
          title: "",
          post_count: 2,
          post_updated_at: 1342405587,
        },
        {
          id: 2,
          title: "",
          post_count: 2,
          post_updated_at: 1342405587,
        },
        {
          id: 3,
          title: "",
          post_count: 2,
          post_updated_at: 1342405587,
        },
        {
          id: 4,
          title: "",
          post_count: 2,
          post_updated_at: 1342405587,
        },
        {
          id: 5,
          title: "",
          post_count: 2,
          post_updated_at: 1342405587,
        },
      ];

  const btnClass =
      "border-0 [&:not(:last-child)]:mr-5 text-sm font-normal !text-canBlack hover:!text-canBlue relative after:content-[''] after:absolute after:border-b-4 after:w-[70%] after:top-auto after:left-[50%] after:-translate-x-[50%] after:bottom-0 after:border-canBlue after:rounded after:hidden",
    activeCls = "font-semibold !text-canBlue after:!block";

  return (
    <CommonCards
      title={
        <div className="border-0 flex items-center justify-start">
          <SecondaryButton className="border-0 p-0 flex items-center justify-start text-xl">
            <LeftOutlined />
          </SecondaryButton>
          <span className="text-canBlack font-medium text-xl ml-2">
            Camp Forum
          </span>
        </div>
      }
      className={`bg-white border-0 px-6 [&_.ant-card-head]:p-0 [&_.ant-card-body]:px-0 [&_.ant-card-head]:border-0`}
    >
      <div className="flex justify-between mb-9">
        <div className="flex justify-between items-center border-b-2 max-w-[50%]">
          <PrimaryButton
            ghost
            className={`${btnClass} ${
              (!paramsList.by || paramsList.by === "all") && activeCls
            }`}
            onClick={filterThread.bind(this, "all")}
            key="all-btn"
            id="all-thread-btn"
            data-testid="all-thread-btn"
          >
            All Threads
          </PrimaryButton>
          {isLog ? (
            <Fragment>
              <PrimaryButton
                ghost
                className={`${btnClass} ${paramsList.by === "my" && activeCls}`}
                onClick={filterThread.bind(this, "my")}
                key="my-btn"
                id="my-thread-btn"
                data-testid="my-thread-btn"
              >
                My Threads
              </PrimaryButton>
              <PrimaryButton
                ghost
                className={`${btnClass} ${
                  paramsList.by === "participate" && activeCls
                }`}
                onClick={filterThread.bind(this, "participate")}
                key="participate-btn"
                id="participate-btn"
                data-testid="participate-btn"
              >
                My Participation
              </PrimaryButton>
              <PrimaryButton
                ghost
                className={`${btnClass} ${
                  paramsList.by === "most_replies" && activeCls
                }`}
                onClick={filterThread.bind(this, "most_replies")}
                key="most_replies-btn"
                id="most-rep-btn"
                data-testid="most-rep-btn"
              >
                Top 10
              </PrimaryButton>
            </Fragment>
          ) : null}
        </div>
        <div className="max-w-[300px]">
          <Input.Search
            placeholder={placeholders.searchPlaceholder}
            allowClear
            onSearch={onSearch}
            className="[&_.ant-input-affix-wrapper]:!rounded-l-lg [&_.ant-input-search-button]:!rounded-r-lg [&_.ant-input]:h-[30px] [&_button]:h-[40px]"
            id="search-bar"
            data-testid="search-bar"
          />
        </div>
      </div>

      {isLoading ? (
        <Fragment>
          <Table dataSource={loadingData} pagination={false}>
            <Column
              title="Thread Name"
              dataIndex="title"
              key="title"
              render={() => (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass=""
                  isButton={false}
                />
              )}
            />
            <Column
              title="Replies"
              dataIndex="post_count"
              key="post_count"
              responsive={["lg"]}
              width="150px"
              render={() => (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass=""
                  isButton={false}
                />
              )}
            />
            <Column
              title="Last Updated On"
              dataIndex="post_updated_at"
              key="post_updated_at"
              responsive={["lg"]}
              render={() => (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass=""
                  isButton={false}
                />
              )}
            />
          </Table>
          <div className={`paginationCon`}>
            {total > 10 ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass=""
                listStyle="liHeight"
                isButton={false}
              />
            ) : null}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <Table dataSource={threadList} pagination={false}>
            <Column
              title="Thread Name"
              dataIndex="title"
              key="title"
              render={(text, others: any, idx) => {
                return (
                  <Fragment key={idx}>
                    <a
                      onClick={(e) => onThreadClick(e, others)}
                      className="!text-canBlack hocus:!text-canBlue font-medium text-sm"
                      id={"thread-label-" + (+idx + 1)}
                      data-testid={"thread-label-" + (+idx + 1)}
                      href={`/forum/${replaceSpecialCharacters(
                        router?.query?.topic as string,
                        "-"
                      )}/${replaceSpecialCharacters(
                        router?.query?.camp as string,
                        "-"
                      )}/threads/${others?.id}`}
                    >
                      <Fragment>{text}</Fragment>
                    </a>
                    {isLog && paramsList.by === "my" ? (
                      <Tooltip title="edit">
                        <a
                          onClick={() => {
                            onThreadEdit({ text, others });
                          }}
                          className="linkCss"
                          data-testid="edit_btn"
                        >
                          <EditOutlined />
                        </a>
                      </Tooltip>
                    ) : null}
                  </Fragment>
                );
              }}
            />
            <Column
              title="Replies"
              dataIndex="post_count"
              key="post_count"
              width="150px"
              className="!text-center"
            />
            <Column
              title="Last Updated On"
              dataIndex="post_updated_at"
              key="post_updated_at"
              width="600px"
              render={(dt, others) => {
                return (
                  <Paragraph className="!mb-0">
                    <Text className="block">
                      {others["post_count"] === 0 ? (
                        "This thread doesn't have any posts yet."
                      ) : (
                        <Fragment>
                          <Link
                            href={`/user/supports/${
                              others["nick_name_id"] || ""
                            }?canon=${others["namespace_id"] || 1}`}
                            passHref
                          >
                            <a>
                              {others["nick_name"] === null ||
                              others["nick_name"] === ""
                                ? ""
                                : others["nick_name"]}
                            </a>
                          </Link>{" "}
                          {`replied ${moment(getTime(dt))
                            .local()
                            .startOf("seconds")
                            .fromNow()} (${moment(getTime(dt)).format(
                            "MMM Do YYYY, h:mm:ss a"
                          )})`}
                        </Fragment>
                      )}
                    </Text>
                    <Text className="block text-xs text-canLight mt-2">
                      {moment(getTime(dt)).format("DD MMM YYYY, h:mm A")}
                    </Text>
                  </Paragraph>
                );
              }}
            />
          </Table>

          <div className={`paginationCon mt-10 flex justify-center`}>
            {total > 10 ? (
              <Pagination
                current={current}
                onChange={onChange}
                showSizeChanger={false}
                total={total}
              />
            ) : null}
          </div>
        </Fragment>
      )}
    </CommonCards>
  );
};

export default ThreadListUI;
