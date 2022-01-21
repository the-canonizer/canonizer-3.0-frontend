import React, { useEffect, useRef, useState } from "react";
import { Typography, List, Select, Tag, Button } from "antd";
import styles from "./topicsList.module.scss";
import { RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { getCanonizedTopicsApi } from "../../../../network/api/homePageApi";
import objectToFormData from "object-to-formdata";
import { setFilterCanonizedTopics } from "../../../../store/slices/homePageSlice";

const Option = Select;
const { Title, Link, Text } = Typography;

const TopicsList = () => {
  const didMount = useRef(false);
  const didMountForFilterScoreEffect = useRef(false);
  const dispatch = useDispatch();
  const { canonizedTopics, asofdate, algorithm, filterByScore } = useSelector(
    (state: RootState) => ({
      canonizedTopics: state.homePage?.canonizedTopics?.topic,
      asofdate: state.homePage?.filterObject?.asofdate,
      algorithm: state.homePage?.filterObject?.algorithm,
      filterByScore: state.homePage?.filterObject?.filterByScore,
    })
  );

  const [topics, setTopics] = useState(canonizedTopics);

  const mockDropdownList = [
    { id: 1, name: "/General/" },
    { id: 2, name: "Jack" },
    { id: 3, name: "Lucy" },
    { id: 4, name: "yiminghe" },
  ];
  const [nameSpaceId, setNameSpaceId] = useState(null);

  const selectNameSpace = (value: Number) => {
    setNameSpaceId(value);
    dispatch(
      setFilterCanonizedTopics({
        namespace_id: value,
      })
    );
  };

  useEffect(() => {
    if (didMount.current) {
      const reqBody = {
        page_number: 1,
        page_size: 15,
        namespace_id: nameSpaceId,
        asofdate: asofdate,
        algorithm: algorithm,
        search: "Hard",
      };

      getCanonizedTopicsApi(reqBody);
    } else didMount.current = true;
  }, [asofdate, algorithm, nameSpaceId]);

  useEffect(() => {
    console.log("filterByScore", filterByScore);
    if (didMountForFilterScoreEffect.current) {
      if (filterByScore.toString() == "") {
        setTopics(canonizedTopics);
      } else {
        const filteredTopics = canonizedTopics.filter(
          (topic) => topic.topic_score <= filterByScore
        );
        setTopics(filteredTopics);
      }
    } else didMountForFilterScoreEffect.current = true;
  }, [filterByScore]);

  return (
    <>
      <div className={styles.card}>
        <List
          className={styles.wrap}
          header={
            <div className={styles.head}>
              <Title level={3}>
                Canonized list for
                <i className="icon-info"></i>
              </Title>
              <Select
                size="large"
                className={styles.dropdown}
                defaultValue={mockDropdownList[0].name}
                onChange={selectNameSpace}
              >
                {mockDropdownList.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          }
          footer={
            <div className={styles.footer}>
              <Link href="#" className={styles.viewAll}>
                <Text>View All Topics</Text>
                <i className="icon-angle-right"></i>
              </Link>
            </div>
          }
          bordered
          dataSource={topics}
          renderItem={(item: any) => (
            <List.Item className={styles.item}>
              <>
                <Link href="#">
                  <Text className={styles.text}>{item.topic_name}</Text>
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
