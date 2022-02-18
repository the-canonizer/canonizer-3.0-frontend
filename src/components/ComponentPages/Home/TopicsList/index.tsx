import { useEffect, useRef } from "react";
import useState from "react-usestateref";
import { useRouter } from "next/router";
import { Typography, List, Select, Tag, Input, Button } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { getCanonizedTopicsApi } from "../../../../network/api/homePageApi";
import { setFilterCanonizedTopics } from "../../../../store/slices/homePageSlice";
import styles from "./topicsList.module.scss";

const { Title, Text } = Typography;
const { Search } = Input;

const TopicsList = () => {
  const router = useRouter();
  const didMount = useRef(false);
  const [pageNumber, setPageNumber, pageNumberRef] = useState(1);
  const dispatch = useDispatch();
  const {
    canonizedTopics,
    asofdate,
    asof,
    algorithm,
    filterByScore,
    nameSpaces,
    includeReview,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.homePage?.filterObject?.asofdate,
    asof: state.homePage?.filterObject?.asof,
    algorithm: state.homePage?.filterObject?.algorithm,
    filterByScore: state.homePage?.filterObject?.filterByScore,
    nameSpaces: state.homePage?.nameSpaces,
    includeReview: state?.homePage?.filterObject?.includeReview,
  }));

  const [topicsData, setTopicsData] = useState(canonizedTopics);
  const [nameSpacesList] = useState(nameSpaces);
  const [isReview, setIsReview] = useState(includeReview);
  const [inputSearch, setInputSearch] = useState("");
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
    setTopicsData(canonizedTopics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonizedTopics?.topics]);

  useEffect(() => {
    setIsReview(includeReview);
  }, [includeReview]);

  useEffect(() => {
    async function getTopicsApiCall() {
      if (didMount.current) {
        await getTopicsApiCallWithReqBody();
      } else didMount.current = true;
    }
    getTopicsApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asofdate, asof, algorithm, nameSpaceId, filterByScore, inputSearch]);

  async function getTopicsApiCallWithReqBody(loadMore = false) {
    loadMore ? setPageNumber(pageNumber + 1) : setPageNumber(1);
    const reqBody = {
      algorithm: algorithm,
      asofdate: asofdate,
      namespace_id: nameSpaceId,
      page_number: pageNumberRef.current,
      page_size: 15,
      search: inputSearch,
      filter: filterByScore,
      asof: asof,
    };
    await getCanonizedTopicsApi(reqBody, loadMore);
  }

  const onSearch = (value) => setInputSearch(value);

  const LoadMoreTopics = (
    <div className="text-center">
      {pageNumber < topicsData?.numOfPages && (
        <Button
          className={styles.viewAll}
          onClick={() => {
            getTopicsApiCallWithReqBody(true);
          }}
        >
          <Text>Load More</Text>
          <i className="icon-angle-right"></i>
        </Button>
      )}
    </div>
  );

  const ViewAllTopics = (
    <div className="text-right">
      {topicsData?.topics?.length && (
        <Link href="/browse">
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
            <div
              className={`${styles.head} ${
                router.asPath === "/browse" ? styles.browsePage : ""
              }`}
            >
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

              {router.asPath === "/browse" && !includeReview && (
                <div className={styles.inputSearchTopic}>
                  <Search
                    placeholder="Search by topic name"
                    allowClear
                    className={styles.topic}
                    onSearch={onSearch}
                  />
                </div>
              )}
            </div>
          }
          footer={
            <div className={styles.footer}>
              {router.asPath === "/browse" ? LoadMoreTopics : ViewAllTopics}
            </div>
          }
          bordered
          dataSource={topicsData?.topics}
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
