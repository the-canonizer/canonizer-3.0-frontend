import { Fragment } from "react";
import { Card, Input, Button, Typography, Table, Pagination } from "antd";

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
}) => {
  const CardTitle = <span className={styles.cardTitle}>Camp Forum</span>;

  return (
    <Fragment>
      <Card
        title={CardTitle}
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
            className={`${styles.orange} ${styles.tabBtn}`}
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
                className={`${styles.tabBtn}`}
                onClick={filterThread.bind(this, "own")}
                key="thread"
              >
                My Threads
              </Button>
              <Button
                type="primary"
                ghost
                className={`${styles.tabBtn}`}
                onClick={filterThread.bind(this, "participation")}
                key="participation"
              >
                My Participation
              </Button>
              <Button
                type="primary"
                ghost
                className={`${styles.tabBtn}`}
                onClick={filterThread.bind(this, "top")}
                key="top"
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
            dataIndex="name"
            key="name"
            render={(text) => <a onClick={onThreadClick}>{text}</a>}
            responsive={["md"]}
          />
          <Column
            title="Replies"
            dataIndex="replies"
            key="replies"
            responsive={["md"]}
          />
          <Column
            title="Most Recent Post Date"
            dataIndex="recent_post"
            key="recent_post"
            responsive={["lg"]}
          />
        </Table>
        <div className={`paginationCon`}>
          <Pagination current={current} onChange={onChange} total={total} />
        </div>
      </Card>
    </Fragment>
  );
};

export default ThreadListUI;
