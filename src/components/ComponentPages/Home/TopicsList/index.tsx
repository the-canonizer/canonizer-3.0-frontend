import { useEffect, useRef } from "react";
import useState from "react-usestateref";
import { useRouter } from "next/router";
import { Typography, List, Select, Tag, Input, Button, Popover } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { getCanonizedTopicsApi } from "../../../../network/api/homePageApi";
import { setFilterCanonizedTopics } from "../../../../store/slices/filtersSlice";
import styles from "./topicsList.module.scss";
import { Spin, Checkbox } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import useAuthentication from "src/hooks/isUserAuthenticated";

const antIcon = <LoadingOutlined spin />;
const { Title, Text } = Typography;
const { Search } = Input;

const infoContent = (
  <>
    <div className={styles.namespacesPopover}>
      <Title level={5}>Namespace</Title>
      <p>
        Namespaces are a set of topics created for specific organizations and
        cities to separate topics exclusively for them from the topics of
        general interest. To get a namespace created for your organization,
        contact{" "}
        <Link href="mailto:support@canonizer.com">
          <a>support@canonizer.com</a>
        </Link>
      </p>
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
    filterNameSpace,
    userEmail,
    filterNameSpaceId,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state.filters?.filterObject?.asof,
    algorithm: state.filters?.filterObject?.algorithm,
    filterByScore: state.filters?.filterObject?.filterByScore,
    nameSpaces: state.homePage?.nameSpaces,
    includeReview: state?.filters?.filterObject?.includeReview,
    filterNameSpace: state?.filters?.filterObject?.nameSpace,
    userEmail: state?.auth?.loggedInUser?.email,
    filterNameSpaceId: state?.filters?.filterObject?.namespace_id,
  }));

  const [topicsData, setTopicsData] = useState(canonizedTopics);
  const [nameSpacesList] = useState(nameSpaces);
  const [isReview, setIsReview] = useState(includeReview);
  const [inputSearch, setInputSearch] = useState("");
  const [nameSpaceId, setNameSpaceId] = useState(filterNameSpaceId || "");

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);
  const [getTopicsLoadingIndicator, setGetTopicsLoadingIndicator] =
    useState(false);
  const [selectedNameSpace, setSelectedNameSpace] = useState(filterNameSpace);
  let onlyMyTopicsCheck = false;

  const selectNameSpace = (id, nameSpace) => {
    setNameSpaceId(id);
    if (history.pushState) {
      const queryParams = `?namespace=${id}`;
      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        queryParams;
      window.history.replaceState({ path: newurl }, "", newurl);
    }

    dispatch(
      setFilterCanonizedTopics({
        namespace_id: id,
        nameSpace: nameSpace?.children,
      })
    );
  };

  // useEffect(() => {
  //   setSelectedNameSpace(filterNameSpace);
  //   setNameSpaceId(filterNameSpaceId);
  // }, [filterNameSpace, filterNameSpaceId]);

  useEffect(() => {
    setTopicsData(canonizedTopics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonizedTopics?.topics]);

  useEffect(() => {
    setIsReview(includeReview);
  }, [includeReview]);

  useEffect(() => {
    dispatch(
      setFilterCanonizedTopics({
        namespace_id: router.query.namespace,
      })
    );
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
    onlyMyTopicsCheck,
    filterNameSpace,
  ]);

  async function getTopicsApiCallWithReqBody(loadMore = false) {
    loadMore ? setPageNumber(pageNumber + 1) : setPageNumber(1);
    const reqBody = {
      algorithm: algorithm,
      asofdate:
        asof == ("default" || asof == "review") ? Date.now() / 1000 : asofdate,
      namespace_id: nameSpaceId,
      page_number: pageNumberRef.current,
      page_size: 15,
      search: inputSearch,
      filter: filterByScore,
      asof: asof,
      user_email: onlyMyTopicsCheck ? userEmail : "",
    };
    await getCanonizedTopicsApi(reqBody, loadMore);
    setLoadMoreIndicator(false);
  }

  const onSearch = (value) => {
    /[a-zA-Z0-9]/.test(value) ? setInputSearch(value) : setInputSearch("");
  };

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
      {topicsData?.topics?.length ? (
        <Link href="/browse">
          <a className={styles.viewAll}>
            <Text>View All Topics</Text>
            <i className="icon-angle-right"></i>
          </a>
        </Link>
      ) : null}
    </div>
  );

  const handleCheckbox = async (e) => {
    setGetTopicsLoadingIndicator(true);
    onlyMyTopicsCheck = e.target.checked;

    await getTopicsApiCallWithReqBody();
    setGetTopicsLoadingIndicator(false);
  };

  const handleTopicClick = () => {
    setGetTopicsLoadingIndicator(true);
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
                  Canonized list for
                  <Popover content={infoContent} placement="right">
                    <i className="icon-info cursor-pointer"></i>
                  </Popover>
                </Title>
                {router.asPath === "/browse" && isLogin && (
                  <Checkbox
                    className={styles.checkboxOnlyMyTopics}
                    onChange={handleCheckbox}
                  >
                    Only My Topics
                  </Checkbox>
                )}
                <Select
                  size="large"
                  className={styles.dropdown}
                  defaultValue={selectedNameSpace}
                  // value={selectedNameSpace}
                  onChange={selectNameSpace}
                >
                  <Select.Option key="custom-key" value="">
                    All
                  </Select.Option>
                  {nameSpacesList?.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.label}
                      </Select.Option>
                    );
                  })}
                </Select>
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
                  <Link
                    href={{
                      pathname: `/topic/${item?.topic_id}-${
                        isReview
                          ? item?.tree_structure_1_review_title
                              ?.split(" ")
                              .join("-")
                          : item?.topic_name?.split(" ").join("-")
                      }/1-Agreement`,
                    }}
                  >
                    <a
                      onClick={() => {
                        handleTopicClick();
                      }}
                    >
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
