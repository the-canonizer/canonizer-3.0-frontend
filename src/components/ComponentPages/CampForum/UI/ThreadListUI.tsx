import { Fragment, useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  Table,
  Pagination,
  Tooltip,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import Link from "next/link";

import styles from "./Forum.module.scss";
import messages from "../../../../messages";
import { getTime } from "../../../../utils/generalUtility";
import useAuthentication from "../../../../hooks/isUserAuthenticated";
import CustomSkelton from "../../../common/customSkelton";

const { Text } = Typography;
const { Column } = Table;

const { placeholders } = messages;

const ThreadListUI = ({
  onSearch,
  onChange,
  onCreateThread,
  threadList,
  onThreadClick,
  current,
  total,
  filterThread,
  onEditClick,
  paramsList,
  isLoading,
}) => {
  const [isLog, setIsLog] = useState(false);
  const { isUserAuthenticated } = useAuthentication();

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

  return (
    <Fragment>
      <Card
        title={<span className={styles.cardTitle}>Camp Forum</span>}
        className={`can-card-style ${styles.thread_card}`}
        extra={
          <div className={styles.inputSearchTopic}>
            <Input.Search
              placeholder={placeholders.searchPlaceholder}
              allowClear
              onSearch={onSearch}
              className={styles.searchInput}
              id="search-bar"
            />
          </div>
        }
      >
        <Text strong className={styles.labelHeading} id="list-label">
          List of All Camp Threads
        </Text>
        <div className={styles.btn_group}>
          <Button
            type="primary"
            ghost
            className={`${styles.tabBtn} ${
              (!paramsList.by || paramsList.by === "all") && styles.orange
            }`}
            onClick={filterThread.bind(this, "all")}
            key="all-btn"
            id="all-thread-btn"
          >
            All Threads
          </Button>
          {isLog ? (
            <Fragment>
              <Button
                type="primary"
                ghost
                className={`${styles.tabBtn} ${
                  paramsList.by === "my" && styles.orange
                }`}
                onClick={filterThread.bind(this, "my")}
                key="my-btn"
                id="my-thread-btn"
              >
                My Threads
              </Button>
              <Button
                type="primary"
                ghost
                className={`${styles.tabBtn} ${
                  paramsList.by === "participate" && styles.orange
                }`}
                onClick={filterThread.bind(this, "participate")}
                key="participate-btn"
                id="participate-btn"
              >
                My Participation
              </Button>
              <Button
                type="primary"
                ghost
                className={`${styles.tabBtn} ${
                  paramsList.by === "most_replies" && styles.orange
                }`}
                onClick={filterThread.bind(this, "most_replies")}
                key="most_replies-btn"
                id="most-rep-btn"
              >
                Top 10
              </Button>
            </Fragment>
          ) : null}
          <Button
            type="primary"
            className={`${styles.tabBtn} ${styles.submit_btn}`}
            onClick={onCreateThread}
            key="create-btn"
            id="create-btn"
          >
            Create Thread
          </Button>
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
                width="350px"
              />
              <Column
                title="Replies"
                dataIndex="post_count"
                key="post_count"
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
                render={(text, others, idx) => {
                  return (
                    <a
                      onClick={(e) => onThreadClick(e, others)}
                      className={styles.threadListTitle}
                      id={"thread-label-" + (+idx + 1)}
                    >
                      {text}
                      {isLog && paramsList.by === "my" ? (
                        <Tooltip title="edit">
                          <a
                            onClick={(e) => onEditClick(e, others)}
                            className="linkCss"
                          >
                            <EditOutlined />
                          </a>
                        </Tooltip>
                      ) : null}
                    </a>
                  );
                }}
                width="350px"
              />
              <Column title="Replies" dataIndex="post_count" key="post_count" />
              <Column
                title="Last Updated On"
                dataIndex="post_updated_at"
                key="post_updated_at"
                render={(dt, others) => {
                  return (
                    <Text>
                      {others["post_count"] === 0 ? (
                        "This thread doesn't have any posts yet."
                      ) : (
                        <Fragment>
                          <Link
                            href={`/user/supports/${
                              others["nick_name_id"] || ""
                            }?topicnum=${others["topic_id"] || ""}&campnum=${
                              others["camp_id"] || ""
                            }&canon=${others["namespace_id"] || 1}`}
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
                  );
                }}
              />
            </Table>

            <div className={`paginationCon`}>
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
      </Card>
    </Fragment>
  );
};

export default ThreadListUI;
