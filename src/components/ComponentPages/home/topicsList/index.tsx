import React, { useState } from "react";
import { Typography, List, Select, Tag, Button } from "antd";
import styles from "./topicsList.module.scss";
import { RightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

const Option = Select;
const { Title, Link, Text } = Typography;

const TopicsList = () => {
  const canonizedTopics = useSelector(
    (state: RootState) => state.homePage?.canonizedTopics?.data?.topic
  );

  const mockDropdownList = ["Jack", "Lucy", "yiminghe"];
  const [nameSpace, setNameSpace] = useState("/General/");

  const selectNameSpace = (value) => {
    setNameSpace(value);
  };

  return (
    <>
      <div className={styles.wrap}>
        <List
          className={styles.list}
          header={
            <div className={styles.head}>
              <Title level={3}>
                Canonized list for
                <i className="icon-info"></i>
              </Title>
              <Select
                size="large"
                className={styles.dropdown}
                defaultValue="/General/"
                onChange={selectNameSpace}
              >
                {mockDropdownList.map((item) => {
                  return <Option key={item}>{item}</Option>;
                })}
              </Select>
            </div>
          }
          footer={
            <div className={styles.footer}>
              <Link>
                <Text className={styles.link}>View All Topics</Text>{" "}
                <RightOutlined className={styles.anticonright} />
              </Link>
            </div>
          }
          bordered
          dataSource={canonizedTopics}
          renderItem={(item: any) => (
            <List.Item>
              <>
                <Link href="#">
                  <Text>{item.topic_name}</Text>
                  <Tag className={styles.tag}>{item.topic_score}</Tag>
                </Link>
              </>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default TopicsList;
