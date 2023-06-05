import { useEffect, useRef } from "react";
import useState from "react-usestateref";
import { useRouter } from "next/router";
import { BackTop } from "antd";
import { Typography, List, Select, Tag, Input, Button, Popover } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import {
  getCanonizedNameSpacesApi,
  getCanonizedTopicsApi,
} from "../../../../network/api/homePageApi";
import { setFilterCanonizedTopics } from "../../../../store/slices/filtersSlice";
import styles from "./topicsList.module.scss";
import { Spin, Checkbox } from "antd";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import useAuthentication from "src/hooks/isUserAuthenticated";
import {
  setCheckSupportExistsData,
  setCurrentCheckSupportStatus,
  setManageSupportStatusCheck,
} from "src/store/slices/campDetailSlice";
import {
  replaceSpecialCharacters,
  changeSlashToArrow,
} from "src/utils/generalUtility";
import CustomSkelton from "../../../common/customSkelton";
import { CloseCircleOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined spin />;
const { Title, Text } = Typography;
const { Search } = Input;

const infoContent = (
  <>
    <div className={styles.namespacesPopover}>
      <Title level={5}>Canon</Title>
      <p>
        Canons are a set of topics created for specific organizations and cities
        to separate topics exclusively for them from the topics of general
        interest. To get a canon created for your organization, contact{" "}
        <Link href="mailto:support@canonizer.com">
          <a>support@canonizer.com</a>
        </Link>
      </p>
    </div>
  </>
);

const TopicsList = () => {
  const router = useRouter();
  const [pageNumber, setPageNumber, pageNumberRef] = useState(1);
  const dispatch = useDispatch();
  const { isUserAuthenticated } = useAuthentication();
  const {
    canonizedTopics,
    asofdate,
    asof,
    algorithm,
    filterByScore,
    nameSpaces,
    filterNameSpace,
    userEmail,
    filterNameSpaceId,
    search,
    is_checked,
    is_archive,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state.filters?.filterObject?.asof,
    algorithm: state.filters?.filterObject?.algorithm,
    filterByScore: state.filters?.filterObject?.filterByScore,
    nameSpaces: state.homePage?.nameSpaces,
    filterNameSpace: state?.filters?.filterObject?.nameSpace,
    userEmail: state?.auth?.loggedInUser?.email,
    filterNameSpaceId: state?.filters?.filterObject?.namespace_id,
    search: state?.filters?.filterObject?.search,
    is_checked: state?.utils?.score_checkbox,
    is_archive: state?.filters?.filterObject?.is_archive,
  }));
  const { is_camp_archive_checked } = useSelector((state: RootState) => ({
    is_camp_archive_checked: state?.utils?.archived_checkbox,
  }));
  const [topicsData, setTopicsData] = useState(canonizedTopics);
  const [nameSpacesList, setNameSpacesList] = useState(nameSpaces);
  const [backGroundColorClass, setBackGroundColorClass] = useState("default");

  const [isReview, setIsReview] = useState(asof == "review");
  const [inputSearch, setInputSearch] = useState(search||"");
  // const [archiveSearch, setArchiveSearch] = useState(is_archive || 0);

  const [nameSpaceId, setNameSpaceId] = useState(filterNameSpaceId || "");

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);
  const [getTopicsLoadingIndicator, setGetTopicsLoadingIndicator] =
    useState(false);
  const [selectedNameSpace, setSelectedNameSpace] = useState(filterNameSpace);
  const [clear, setClear] = useState(false);

  let onlyMyTopicsCheck = useRef();

  const formatnamespace = (namespace, reverse = false) => {
    if (reverse) {
      let addslash = `/${namespace}/`;
      addslash = addslash?.replace(/-/g, " > ");
      return addslash;
    } else {
      let removednamespace = namespace?.replace(/^\/|\/$/g, "");
      removednamespace = removednamespace?.replace(/ > /g, "-");
      return removednamespace;
    }
  };

  const selectNameSpace = (id, nameSpace) => {
    setNameSpaceId(id);
    setSelectedNameSpace(nameSpace?.children);

    if (nameSpace?.children?.toLowerCase() !== "/general/") {
      router.query.canon = formatnamespace(nameSpace?.children);
      delete router?.query?.namespace;
      router.replace(router, undefined, { shallow: true });
    } else {
      if (router.query.canon) {
        const params = router.query;
        delete params.canon;
        delete params.namespace;
        router.query = params;
        router.replace(router, undefined, { shallow: true });
      }
    }

    dispatch(
      setFilterCanonizedTopics({
        namespace_id: id,
        nameSpace: nameSpace?.children,
      })
    );
  };
  // const checkTopics = (topics)=>{
  //   let archive = 
  //   if(topics?.length > 0 && !is_camp_archive_checked){
  //     topics?.forEach(element => {
  //       if(element.item.is_archive)
  //     });
  //   }
  // }
  useEffect(() => {
    if (filterNameSpace?.toLowerCase() !== "/general/") {
      router.query.canon = formatnamespace(filterNameSpace);
      delete router?.query?.namespace;
      router.replace(router, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    const q = router.query;
    if (q.canon) {
      const filteredName = nameSpacesList?.filter((n) => {
        if (n.label === formatnamespace(q.canon, true)) {
          return n;
        }
      });

      if (filteredName && filteredName.length) {
        dispatch(
          setFilterCanonizedTopics({
            nameSpace: formatnamespace(q.canon, true),
            namespace_id: filteredName[0]?.id,
          })
        );
      }
    }
  }, [router, nameSpacesList]);
  console.log(search,"search")

  useEffect(() => {
    setSelectedNameSpace(filterNameSpace);
    setNameSpaceId(filterNameSpaceId);
    // setArchiveSearch(is_archive);
    setInputSearch(search.trim());
    setNameSpacesList(nameSpaces);
  }, [filterNameSpace, filterNameSpaceId, search, nameSpaces, is_archive]);

  useEffect(() => {
    setTopicsData(canonizedTopics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonizedTopics?.topics]);

  useEffect(() => {
    setIsReview(asof == "review");
    setBackGroundColorClass(asof);
  }, [asof]);

  useEffect(() => {
    async function getTopicsApiCall() {
      setGetTopicsLoadingIndicator(true);
      await getTopicsApiCallWithReqBody();
      setGetTopicsLoadingIndicator(false);
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
    onlyMyTopicsCheck.current,
    is_camp_archive_checked
  ]);
  useEffect(() => {
    if (inputSearch.length > 0 || search.length > 0) {
      setClear(true);
    } else {
      setClear(false);
    }
  }, []);

  const handlesearch = (e) => {
    if (e.target.value.length > 0) {
      setClear(true);
    } else {
      setClear(false);
    }
  };
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
      user_email: onlyMyTopicsCheck.current ? userEmail : "",
      is_archive: is_camp_archive_checked ? 1: 0,
    };
    await getCanonizedTopicsApi(reqBody, loadMore);
    setLoadMoreIndicator(false);
  }
  const onSearch = (value) => {
    console.log(inputSearch,"value")
    setInputSearch(value.trim());
    dispatch(
      setFilterCanonizedTopics({
        search: value || "",
      })
    );
  };

  const LoadMoreTopics = (
    <div className="text-center">
      {pageNumber < topicsData?.numOfPages &&
        topicsData?.topics?.length > 1 && (
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
    onlyMyTopicsCheck.current = e.target.checked;

    await getTopicsApiCallWithReqBody();
    setGetTopicsLoadingIndicator(false);
  };

  const handleTopicClick = () => {
    setGetTopicsLoadingIndicator(true);
  };
  useEffect(() => {
    //When Page is render remove data from GetCheckSupportStatus and GetCheckSupportExistsData
    dispatch(setCurrentCheckSupportStatus(""));
    dispatch(setCheckSupportExistsData(""));
    dispatch(setManageSupportStatusCheck(false));
    getCanonizedNameSpacesApi();
  }, []);

  return (
    <>
      <div
        className={`header-bg-color-change ${backGroundColorClass} topics-list-card-header ${
          styles.head
        } ${router.asPath.includes("/browse") ? styles.browsePage : ""}`}
      >
        <Title level={3}>
          Select Canon
          <Popover content={infoContent} placement="right">
            <i className="icon-info cursor-pointer"></i>
          </Popover>
        </Title>
        {router.asPath.includes("/browse") && isUserAuthenticated && (
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
          defaultValue={changeSlashToArrow(selectedNameSpace)}
          value={changeSlashToArrow(selectedNameSpace)}
          onChange={selectNameSpace}
          showSearch
          optionFilterProp="children"
          id="name-space-dropdown"
        >
          {nameSpacesList?.map((item) => {
            return (
              <Select.Option
                id={`name-space-${item.id}`}
                key={item.id}
                value={item.id}
              >
                {changeSlashToArrow(item.label)}
              </Select.Option>
            );
          })}
          <Select.Option id="name-space-custom" key="custom-key" value="">
            All
          </Select.Option>
        </Select>
        {router.asPath.includes("/browse") && (
          <div className={styles.inputSearchTopic}>
            <Search
              key={inputSearch}
              placeholder="Search by topic name"
              allowClear={true}
              className={styles.topic}
              defaultValue={inputSearch}
              onSearch={onSearch}
            />
          </div>
        )}
      </div>

      <div
        className={`${styles.card} ${
          router.asPath.includes("/browse") ? "" : styles.homePageCardList
        }`}
      >
        <List
          className={styles.wrap}
          footer={
            <div className={styles.footer}>
              {router.asPath.includes("/browse")
                ? LoadMoreTopics
                : ViewAllTopics}
            </div>
          }
          bordered
          dataSource={topicsData?.topics}
          renderItem={(item: any) => {
            return getTopicsLoadingIndicator ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={10}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : (
              <List.Item className={styles.item} id={`topic-${item?.topic_id}`}>
                <>
                  <Link
                    href={{
                      pathname: `/topic/${
                        item?.topic_id
                      }-${replaceSpecialCharacters(
                        isReview
                          ? item?.tree_structure &&
                              item?.tree_structure[1]?.review_title
                          : item?.topic_name,
                        "-"
                      )}/1-Agreement`,
                    }}
                  >
                    {!item.is_archive || (item.is_archive  && is_camp_archive_checked) ?
                    <a
                      onClick={() => {
                        handleTopicClick();
                      }}
                    >
                      <Text className={item.is_archive? `font-weight-bold ${styles.archive_topic}`: styles.text}>
                       {item.is_archive? <Popover content="Archived Topic">
                        {isReview
                          ? item?.tree_structure &&
                            item?.tree_structure[1].review_title
                          : item?.topic_name}
                          </Popover>:isReview
                          ? item?.tree_structure &&
                            item?.tree_structure[1].review_title
                          : item?.topic_name}
                      </Text>
                      <Tag className={styles.tag}>
                        {/* // ? item?.topic_full_score // : item?.full_score?.toFixed(2) */}
                        {is_checked && isUserAuthenticated
                          ? item?.topic_full_score?.toFixed(2)
                          : item?.topic_score?.toFixed(2)}
                      </Tag>
                    </a>: <></>}
                  </Link>
                </>
              </List.Item>
            );
          }}
        />

        <BackTop />
      </div>
    </>
  );
};

export default TopicsList;
