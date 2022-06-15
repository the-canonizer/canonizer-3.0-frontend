import { Fragment } from "react";
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
import isUserAuthenticated from "../../../../hooks/isUserAuthenticated";

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
  isLoggedIn,
  onEditClick,
  paramsList,
}) => {
  const isLog = isUserAuthenticated();

  return (
    <Fragment>
      <Card
        title={<span className={styles.cardTitle}>Camp Forum</span>}
        className="can-card-style"
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
            key="all"
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
                key="my"
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
                key="participate"
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
                key="most_replies"
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
            key="create"
            id="create-btn"
          >
            Create Thread
          </Button>
        </div>
        <Table dataSource={threadList} pagination={false}>
          <Column
            title="Thread Name"
            dataIndex="title"
            key="title"
            render={(text, others) => {
              return (
                <a
                  onClick={(e) => onThreadClick(e, others)}
                  className={styles.threadListTitle}
                  id={"thread-name-" + text?.split(" ")[0].toLowerCase()}
                >
                  {text}
                  {paramsList.by === "my" ? (
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
          <Column
            title="Replies"
            dataIndex="post_count"
            key="post_count"
            responsive={["lg"]}
          />
          <Column
            title="Most Recent Post Date"
            dataIndex="post_updated_at"
            key="post_updated_at"
            responsive={["lg"]}
            render={(dt, others) => {
              return (
                <Text>
                  {others["post_count"] === 0 ? (
                    "This thread doesn't have any posts yet."
                  ) : (
                    <Fragment>
                      <Link href="#" passHref>
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
            <Pagination current={current} onChange={onChange} total={total} />
          ) : null}
        </div>
      </Card>
    </Fragment>
  );
};

export default ThreadListUI;
