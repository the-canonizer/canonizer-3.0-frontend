import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Typography, List, Select, Tag, Button, Input } from "antd";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { getCanonizedTopicsApi } from "../../../../network/api/homePageApi";
import objectToFormData from "object-to-formdata";
import { setFilterCanonizedTopics } from "../../../../store/slices/homePageSlice";

import styles from "./topicsList.module.scss";

const Option = Select;
const { Title, Text } = Typography;
const { Search } = Input;

const TopicsList = () => {
  const router = useRouter();
  const didMount = useRef(false);
  const didMountForFilterScoreEffect = useRef(false);
  const [pageCounter, setPageCounter] = useState(1);
  const dispatch = useDispatch();
  const {
    canonizedTopics,
    asofdate,
    algorithm,
    filterByScore,
    nameSpaces,
    includeReview,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.homePage?.filterObject?.asofdate,
    algorithm: state.homePage?.filterObject?.algorithm,
    filterByScore: state.homePage?.filterObject?.filterByScore,
    nameSpaces: state.homePage?.nameSpaces,
    includeReview: state?.homePage?.filterObject?.includeReview,
  }));

  const [topicsData, setTopicsData] = useState(canonizedTopics?.topic);
  const [nameSpacesList, setNameSpacesList] = useState(nameSpaces);
  const [isReview, setIsReview] = useState(includeReview);

  const [nameSpaceId, setNameSpaceId] = useState(1);

  const selectNameSpace = (value) => {
    setNameSpaceId(value);
    dispatch(
      setFilterCanonizedTopics({
        namespace_id: value,
      })
    );
  };

  useEffect(() => {
    setTopicsData(canonizedTopics?.topic);
  }, [canonizedTopics?.topic]);
  useEffect(() => {
    setIsReview(includeReview);
  }, [includeReview]);
  useEffect(() => {
    const loadMore = true;
    if (didMount.current) {
      const reqBody = {
        algorithm: algorithm,
        asofdate: asofdate,
        namespace_id: nameSpaceId,
        page_number: 1,
        page_size: 15,
        search: "Hard",
        filter: filterByScore,
      };

      getCanonizedTopicsApi(reqBody, loadMore);
    } else didMount.current = true;
  }, [asofdate, algorithm, nameSpaceId, pageCounter, filterByScore]);

  const LoadMoreTopics = (
    <div className="text-center">
      <Button
        className={styles.viewAll}
        onClick={() => setPageCounter(pageCounter + 1)}
      >
        <Text>Load More</Text>
        <i className="icon-angle-right"></i>
      </Button>
    </div>
  );

  const ViewAllTopics = (
    <div className="text-right">
      {topicsData?.length && (
        <Link href="/">
          <a className={styles.viewAll}>
            <Text>View All Topics</Text>
            <i className="icon-angle-right"></i>
          </a>
        </Link>
      )}
    </div>
  );

  return (
    <>
      <div className={`${styles.card} topicsList_card`}>
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
                defaultValue={nameSpacesList && nameSpacesList[0].name}
                onChange={selectNameSpace}
              >
                {nameSpacesList?.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>

              {router.asPath === "/browse" && (
                <Search
                  placeholder="input search text"
                  allowClear
                  className={styles.topic}
                  style={{ width: 200 }}
                />
              )}
            </div>
          }
          footer={
            <div className={styles.footer}>
              {router.asPath === "/browse" ? LoadMoreTopics : ViewAllTopics}
            </div>
          }
          bordered
          dataSource={topicsData}
          renderItem={(item: any) => (
            <List.Item className={styles.item}>
              <>
                <Link href="#">
                  <a>
                    <Text className={styles.text}>
                      {isReview
                        ? item?.tree_structure_1_review_title
                        : item?.topic_name}
                    </Text>
                    <Tag className={styles.tag}>
                      {item?.topic_score?.toFixed(2)}
                    </Tag>
                  </a>
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
