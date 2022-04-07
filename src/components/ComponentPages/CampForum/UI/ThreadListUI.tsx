import { Fragment } from "react";
import { Card, Input, Button, Typography, Table, Pagination } from "antd";
import { ColumnsType } from "antd/es/table";

import styles from "./Forum.module.scss";
import messages from "../../../../messages";

const { Text } = Typography;
const { Column } = Table;

const { placeholders } = messages;

const ThreadListUI = ({ onSearch, onChange }) => {
  const CardTitle = <span className={styles.cardTitle}>Camp Forum</span>;

  const data = [
    {
      key: "101",
      name: "Can we unify “Integrated Information” and “Global Workspace” with “Representational Qualia Theory”?",
      replies: 32,
      recent_post:
        "Brent_Allsop replied 3 years ago (Mar 18, 2019, 10:54:32 PM)",
    },
    {
      key: "102",
      name: "Moving “Mind Brain Identity” above “Dualism” in the camp structure.",
      replies: 3,
      recent_post:
        "Brent_Allsop replied 3 years ago (Sep 19, 2018, 3:48:20 AM)",
    },
  ];

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
          >
            All Threads
          </Button>
          <Button type="primary" ghost className={`${styles.tabBtn}`}>
            My Threads
          </Button>
          <Button type="primary" ghost className={`${styles.tabBtn}`}>
            My Participation
          </Button>
          <Button type="primary" ghost className={`${styles.tabBtn}`}>
            Top 10
          </Button>
          <Button
            type="primary"
            className={`${styles.tabBtn} ${styles.submit_btn}`}
          >
            Create Thread
          </Button>
        </div>
        <Table
          dataSource={data}
          pagination={{ position: ["none"] }}
          // showSizeChanger={"false"}
          footer={() => (
            <Pagination current={1} onChange={onChange} total={50} />
          )}
        >
          <Column
            title="Thread Name"
            dataIndex="name"
            key="name"
            render={(text) => <a>{text}</a>}
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
      </Card>
    </Fragment>
  );
};

export default ThreadListUI;
