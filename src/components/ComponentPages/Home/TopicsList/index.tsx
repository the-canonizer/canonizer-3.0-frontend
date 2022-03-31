import { useEffect, useRef } from "react";
import useState from "react-usestateref";
import { useRouter } from "next/router";
import { Typography, List, Select, Tag, Input, Button, Popover } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { getCanonizedTopicsApi } from "../../../../network/api/homePageApi";
import { setFilterCanonizedTopics } from "../../../../store/slices/homePageSlice";
import styles from "./topicsList.module.scss";
import { Spin, Checkbox } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import useAuthentication from "src/hooks/isUserAuthenticated";

const antIcon = <LoadingOutlined spin />;
const { Title, Text } = Typography;
const { Search } = Input;

const infoContent = (
  <>
    <div>
      <Title level={5}>Lorem Ipsum</Title>
      <p>Duis aute irure dolor in reprehderit.</p>
    </div>
  </>
);

const TopicsList = () => {
  const router = useRouter();
  const didMount = useRef(false);
  const [pageNumber, setPageNumber, pageNumberRef] = useState(1);
  const dispatch = useDispatch();
  const isLogin = useAuthentication();
  const {
    canonizedTopics,
    asofdate,
    asof,
    algorithm,
    filterByScore,
    nameSpaces,
    includeReview,
    onlyMyTopics,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.homePage?.filterObject?.asofdate,
    asof: state.homePage?.filterObject?.asof,
    algorithm: state.homePage?.filterObject?.algorithm,
    filterByScore: state.homePage?.filterObject?.filterByScore,
    nameSpaces: state.homePage?.nameSpaces,
    includeReview: state?.homePage?.filterObject?.includeReview,
    onlyMyTopics: state?.homePage?.filterObject?.onlyMyTopics,
  }));

  const [topicsData, setTopicsData] = useState(canonizedTopics);
  const [nameSpacesList] = useState(nameSpaces);
  const [isReview, setIsReview] = useState(includeReview);
  const [inputSearch, setInputSearch] = useState("");
  const [nameSpaceId, setNameSpaceId] = useState("");
  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);
  const [getTopicsLoadingIndicator, setGetTopicsLoadingIndicator] =
    useState(false);

  const selectNameSpace = (id, nameSpace) => {
    setNameSpaceId(id);
    dispatch(
      setFilterCanonizedTopics({
        namespace_id: id,
        nameSpace: nameSpace?.children,
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
        setGetTopicsLoadingIndicator(true);
        await getTopicsApiCallWithReqBody();
        setGetTopicsLoadingIndicator(false);
      } else didMount.current = true;
    }
    getTopicsApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    asofdate,
    asof,
    algorithm,
    nameSpaceId,
    filterByScore,
    inputSearch,
    onlyMyTopics,
  ]);

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
      only_my_topics: onlyMyTopics,
    };
    await getCanonizedTopicsApi(reqBody, loadMore);
    setLoadMoreIndicator(false);
  }

  const onSearch = (value) => setInputSearch(value);

  const LoadMoreTopics = (
    <div className="text-center">
      {pageNumber < topicsData?.numOfPages && (
        <Button
          className={styles.viewAll}
          onClick={() => {
            getTopicsApiCallWithReqBody(true);
            setLoadMoreIndicator(true);
          }}
        >
          <Text>Load More</Text>
          {!loadMoreIndicator && <i className="icon-angle-right"></i>}
          {loadMoreIndicator && <Spin indicator={antIcon} />}
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

  const handleCheckbox = (e) => {
    dispatch(
      setFilterCanonizedTopics({
        onlyMyTopics: e.target.checked,
      })
    );
  };

  return (
    <>
      <div className={`${styles.card} topicsList_card`}>
        <Spin spinning={getTopicsLoadingIndicator} size="large">
          <List
            className={styles.wrap}
            header={
              <div
                className={`${styles.head} ${
                  router.asPath.includes("/browse") ? styles.browsePage : ""
                }`}
              >
                <Title level={3}>
                  Select namespace
                  <Popover content={infoContent} placement="right">
                    <i className="icon-info cursor-pointer"></i>
                  </Popover>
                </Title>
                <Select
                  size="large"
                  className={styles.dropdown}
                  defaultValue="All"
                  onChange={selectNameSpace}
                >
                  <Select.Option key="custom-key" value="">
                    All
                  </Select.Option>
                  {nameSpacesList?.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
                {router.asPath === "/browse" && !isLogin && (
                  <Checkbox onChange={handleCheckbox}>Only My Topics</Checkbox>
                )}

                {router.asPath.includes("/browse") && !includeReview && (
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
                {router.asPath.includes("/browse")
                  ? LoadMoreTopics
                  : ViewAllTopics}
              </div>
            }
            bordered
            dataSource={topicsData?.topics}
            renderItem={(item: any) => (
              <List.Item className={styles.item}>
                <>
                  {console.log("rrrrrrrrrrrrrrrouutrer -=>", router.query)}
                  <Link
                    href={{
                      pathname: `/camp-details/${item?.topic_id}`,

                      query: {
                        ...router.query,
                        filter: filterByScore,
                        algorithm,
                        asofdate,
                      },
                    }}
                  >
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
        </Spin>
      </div>
    </>
  );
};

export default TopicsList;
