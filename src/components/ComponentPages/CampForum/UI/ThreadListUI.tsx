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

import styles from "./Forum.module.scss";
import messages from "../../../../messages";

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
}) => (
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
          />
        </div>
      }
    >
      <Text strong className={styles.labelHeading}>
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
        >
          All Threads
        </Button>
        {isLoggedIn ? (
          <Fragment>
            <Button
              type="primary"
              ghost
              className={`${styles.tabBtn} ${
                paramsList.by === "my" && styles.orange
              }`}
              onClick={filterThread.bind(this, "my")}
              key="my"
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
              <a onClick={onThreadClick}>
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
                {others["post_count"] === 0
                  ? "This thread doesn't have any posts yet."
                  : `${
                      others["nick_name"] === null || others["nick_name"] === ""
                        ? ""
                        : others["nick_name"]
                    } replied ${moment(dt)
                      .local()
                      .startOf("seconds")
                      .fromNow()} (${moment(dt).format(
                      "MMM Do YYYY, h:mm:ss a"
                    )})`}
              </Text>
            );
          }}
        />
      </Table>
      <div className={`paginationCon`}>
        <Pagination current={current} onChange={onChange} total={total} />
      </div>
    </Card>
  </Fragment>
);

export default ThreadListUI;
