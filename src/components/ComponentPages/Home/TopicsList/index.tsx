import { useEffect, useMemo, useRef, useState } from "react";
import {
  CloseOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Checkbox, Popover, Select } from "antd";
import { Row, Col, Typography, Divider, Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  getCanonizedNameSpacesApi,
  getCanonizedTopicsApi,
  getCanonizedTopicsForSuggestion,
} from "src/network/api/homePageApi";
import {
  setFilterCanonizedTopics,
  setOnlyMyTopic,
} from "src/store/slices/filtersSlice";
import { RootState } from "src/store";
import { changeSlashToArrow } from "src/utils/generalUtility";
import SortTopics from "components/ComponentPages/SortingTopics";
import CustomSkelton from "components/common/customSkelton";
import CustomPagination from "components/shared/CustomPagination/intex";
import Layout from "src/hoc/layout";
import SingleTopicCard from "../HotTopics/topicCard";
import ScoreTag from "../TrandingTopic/scoreTag";
import { getAllTags } from "src/network/api/tagsApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import { setLoadingAction } from "src/store/slices/loading";

const { Title } = Typography;
const { Search } = Input;

const TopicsList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isUserAuthenticated } = useAuthentication();

  const {
    canonizedTopics,
    asofdate,
    asof,
    algorithm,
    nameSpaces,
    filterNameSpace,
    userEmail,
    filterNameSpaceId,
    search,
    onlyMyTopicsCheck,
    loading,
    sortLatestTopic,
    sortScoreViewTopic,
    is_camp_archive_checked,
    filterByScore,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state.filters?.filterObject?.asof,
    algorithm: state.filters?.filterObject?.algorithm,
    nameSpaces: state.homePage?.nameSpaces,
    filterNameSpace: state?.filters?.filterObject?.nameSpace,
    userEmail: state?.auth?.loggedInUser?.email,
    filterNameSpaceId: String(state?.filters?.filterObject?.namespace_id),
    search: state?.filters?.filterObject?.search,
    loading: state?.loading?.loading,
    onlyMyTopicsCheck: state?.filters?.onlyMyTopicsCheck,
    sortLatestTopic: state?.utils?.sortLatestTopic,
    sortScoreViewTopic: state?.utils?.sortScoreViewTopic,
    is_camp_archive_checked: state?.utils?.archived_checkbox,
    filterByScore: state.filters?.filterObject?.filterByScore,
  }));

  const [topicsData, setTopicsData] = useState(canonizedTopics);
  const [nameSpacesList, setNameSpacesList] = useState(nameSpaces);
  const [inputSearch, setInputSearch] = useState(search || "");
  const [nameSpaceId, setNameSpaceId] = useState(
    String(filterNameSpaceId) || "1"
  );
  const [selectedNameSpace, setSelectedNameSpace] = useState(filterNameSpace);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [totalTopics, setTotalTopics] = useState<any>([]);
  const inputRef = useRef(null);
  const [allowClear, setAllowClear] = useState(false);
  const [isCanonChange, setIsCanonChange] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showOnlyMyTopics, setShowOnlyMyTopics] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedResult, setSearchedResult] = useState([]);

  const mapItemsToValueLabel = (items) => {
    return items?.map((item) => ({
      label: item.title,
      value: item.title,
    }));
  };

  const getAlltagsData = async () => {
    let res = await getAllTags();
    setOptions(mapItemsToValueLabel(res?.data?.items));
    setAllTags(res?.data?.items);
  };

  useEffect(() => {
    getAlltagsData();
  }, []);

  const sharedProps: any = {
    mode: "multiple",

    options,
    placeholder: "Select Item...",
    maxTagCount: "responsive",
  };

  const selectProps = {
    value,
    onChange: setValue,
  };

  const infoContent = (
    <div className="max-w-[300px] w-full">
      <Title level={5}>Canon</Title>
      <p>
        Canons are a set of topics created for specific organizations and cities
        to separate topics exclusively for them from the topics of general
        interest. To get a canon created for your organization, contact{" "}
      </p>

      <a className="text-[#096dd9]" href="mailto:support@canonizer.com">
        support@canonizer.com
      </a>
    </div>
  );

  const tagInfoContent = (
    <div className="max-w-[300px] w-full">
      <Title level={5}>Topic Tag</Title>
      <p>
        Topic Tags are keywords that help categorize and organize topics within
        a Canon on Canonizer. By adding relevant tags to a topic, users can
        enhance discoverability, making it easier for others to find and engage
        with topics that match their interests. Tags also provide context,
        allowing users to quickly understand the focus and scope of a topic.
      </p>
    </div>
  );

  const handlePageChange = (newPageNumber, newPageSize) => {
    setIsCanonChange(false);
    setPageNumber(newPageNumber);
    setPageSize(newPageSize);
  };

  const selectNameSpace = (id, nameSpace) => {
    setIsCanonChange(true);
    setNameSpaceId(String(id));
    setSelectedNameSpace(nameSpace?.children);
    setPageNumber(1);

    if (id?.toString() !== "1") {
      router.query.canon = id;
      delete router?.query?.namespace;
      router?.replace(router, undefined, { shallow: true });
    } else {
      if (router.query.canon) {
        const params = router?.query;
        delete params.canon;
        delete params.namespace;
        router.query = params;
        router.replace(router, undefined, { shallow: true });
      }
    }

    dispatch(
      setFilterCanonizedTopics({
        namespace_id: String(id),
        nameSpace: nameSpace?.children,
      })
    );
  };

  async function getTopicsApiCallWithReqBody() {
    const reqBody = {
      algorithm: algorithm,
      asofdate:
        asof == ("default" || asof == "review") ? Date.now() / 1000 : asofdate,
      namespace_id: String(nameSpaceId),
      page_number: isCanonChange ? 1 : pageNumber,
      page_size: pageSize,
      search: inputSearch,
      filter: 0,
      asof: asof,
      user_email: onlyMyTopicsCheck ? userEmail : "",
      is_archive: 0,
      sort: sortLatestTopic ? true : false,
      page: "browse",
      topic_tags: getIdsOfFilteredTags(value, allTags),
    };
    const response = await getCanonizedTopicsApi(reqBody);
    setTotalTopics(response);
  }

  const handleKeyUpSearch = (event: any) => {
    setSearchedResult([]);
    setSearchLoading(true);
    const value = event.target.value?.trim();
    if (value) {
      setAllowClear(true);
      setSearchTerm(value);
      setShowSearchDropdown(true);
    } else {
      setAllowClear(false);
      setSearchTerm("");
      setSearchedResult([]);
      setShowSearchDropdown(false);
    }
  };

  const onSearch = (value) => {
    setIsCanonChange(true);
    setInputSearch(value?.trim());
    dispatch(setFilterCanonizedTopics({ search: value || "" }));
    setAllowClear(true);
  };

  let throttled: any = null;

  useEffect(() => {
    if (throttled) {
      clearTimeout(throttled);
    }

    inputRef.current?.focus();

    throttled = setTimeout(() => {
      if (searchTerm?.trim()) {
        onSearchInput(searchTerm);
      }
    }, 800);

    return () => {
      if (throttled) {
        clearTimeout(throttled);
        throttled = null;
      }
    };
  }, [searchTerm]);

  const handleTopicNameClick = (
    value: string,
    e: { preventDefault: () => void }
  ) => {
    e.preventDefault();
    if (value?.trim()) {
      setInputSearch(value?.trim());
      setShowSearchDropdown(false);
    }
  };

  const onSearchInput = async (value: string) => {
    try {
      const reqBody = {
        algorithm: algorithm,
        asofdate:
          asof == ("default" || asof == "review")
            ? Date.now() / 1000
            : asofdate,
        namespace_id: String(nameSpaceId),
        page_number: pageNumber,
        page_size: 15,
        search: value,
        filter: filterByScore,
        asof: asof,
        user_email: onlyMyTopicsCheck ? userEmail : "",
        is_archive: is_camp_archive_checked ? 1 : 0,
      };
      const res = await getCanonizedTopicsForSuggestion(reqBody);

      setSearchLoading(false);
      if (res) {
        setSearchedResult(res?.topic);
        setTimeout(() => {
          inputRef?.current?.focus();
        }, 400);
      }
    } catch (error) {
      // console.error("Error:", error);
      /**/
    }
  };

  const handleClear = () => {
    setAllowClear(false);
    setInputSearch("");
    setPageNumber(1);
    dispatch(setFilterCanonizedTopics({ search: "" }));
  };

  useEffect(() => {
    if (inputSearch) {
      setAllowClear(true);
    }
    if (!(nameSpaces?.length > 0)) {
      getCanonizedNameSpacesApi();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm) inputRef.current!.focus();
  }, [searchTerm, onSearch]);

  /* eslint-enable */

  useEffect(() => {
    setSelectedNameSpace(() => filterNameSpace);
    if (nameSpaceId !== filterNameSpaceId) {
      setNameSpaceId(() => String(filterNameSpaceId));
    }
    setInputSearch(() => search.trim());
    setNameSpacesList(() => nameSpaces);
  }, [filterNameSpace, filterNameSpaceId, search, nameSpaces]);

  useEffect(() => {
    setTopicsData(canonizedTopics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonizedTopics?.topics]);

  useEffect(() => {
    async function getTopicsApiCall() {
      await getTopicsApiCallWithReqBody();
    }

    getTopicsApiCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nameSpaceId,
    inputSearch,
    sortLatestTopic,
    sortScoreViewTopic,
    pageSize,
    pageNumber,
    onlyMyTopicsCheck,
    value,
  ]);

  const memoizedOptions = useMemo(() => {
    return nameSpacesList?.map((item) => (
      <Select.Option id={`name-space-${item.id}`} key={item.id} value={item.id}>
        {changeSlashToArrow(item.label)}
      </Select.Option>
    ));
  }, [nameSpacesList]);

  const getIdsOfFilteredTags = (arr, resData) => {
    return arr?.map((item) => {
      const found = resData?.find((data) => data?.title === item);
      return found ? found?.id : null;
    });
  };

  const showOnlyMyTopicsHandler = (e) => {
    dispatch(setLoadingAction(true));
    dispatch(setOnlyMyTopic(e?.target?.checked));
    dispatch(setLoadingAction(false));
  };

  return (
    <Layout routeName={"browse"}>
      <div className="browse-wrapper pb-4 mt-3">
        <Title level={4} className="browse-title !mb-0">
          Browse Canonizer’s Topics
        </Title>
        <Divider />
        <Form layout="vertical">
          <div className="browse-actions">
            <div className="flex gap-2 lg:w-[70%] max-sm:flex-col">
              <Form.Item className="browse-dropdown w-full">
                <div className="filter-popover-wrapper">
                  <p className="text-xs font-medium">Filter By Canon</p>
                  <Popover placement="right" content={infoContent}>
                    <InfoCircleOutlined />
                  </Popover>
                </div>
                <Select
                  size="large"
                  virtual={true}
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={selectNameSpace}
                  defaultValue={changeSlashToArrow(selectedNameSpace)}
                  value={changeSlashToArrow(selectedNameSpace)}
                  disabled={loading}
                  className="text-canBlack font-normal commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack"
                >
                  {memoizedOptions}
                  <Select.Option
                    id="name-space-custom"
                    key="custom-key"
                    value=""
                  >
                    All
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item className="browse-dropdown w-full">
                <div className="filter-popover-wrapper">
                  <p className="text-xs font-medium">Filter by Topic Tags</p>
                  <Popover placement="right" content={tagInfoContent}>
                    <InfoCircleOutlined />
                  </Popover>
                </div>
                <Select
                  size="large"
                  mode="multiple"
                  className="text-canBlack font-normal commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack"
                  showArrow
                  {...sharedProps}
                  {...selectProps}
                />
                {/* <Select
                  size="large"
                  mode="multiple"
                  className="text-canBlack font-normal commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack"
                  showArrow
                  options={options}
                /> */}
              </Form.Item>
            </div>
            <div className="search-wrapper w-full items-center max-sm:flex-wrap lg:justify-end max-lg:justify-between">
              {router?.asPath.includes("/browse") && isUserAuthenticated && (
                <Checkbox
                  className="min-w-[169px] max-sm:order-2"
                  onChange={(e: any) => showOnlyMyTopicsHandler(e)}
                  disabled={loading}
                  checked={onlyMyTopicsCheck}
                >
                  Show only my topics
                </Checkbox>
              )}
              <div className="input-search-topic">
                <Search
                  key={inputSearch}
                  size="large"
                  className="browse-search mainInput"
                  placeholder="Search via keyword"
                  allowClear={allowClear}
                  defaultValue={inputSearch}
                  onSearch={onSearch}
                  ref={inputRef}
                  disabled={loading}
                  onChange={handleKeyUpSearch}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowSearchDropdown(false);
                    }, 300);
                  }}
                  onFocus={() => {
                    setSearchLoading(false);
                    setShowSearchDropdown(true);
                  }}
                />
                {showSearchDropdown && searchTerm && (
                  <div className="suggestion-list">
                    <ul>
                      {searchLoading ? (
                        <li className="search-loader">
                          <LoadingOutlined spin />
                        </li>
                      ) : searchedResult?.length > 0 ? (
                        searchedResult?.map((t, i) => (
                          <li
                            key={i}
                            onClick={handleTopicNameClick.bind(
                              this,
                              t?.topic_name
                            )}
                          >
                            {t?.topic_name}
                          </li>
                        ))
                      ) : searchTerm ? (
                        <li>No Data</li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <SortTopics />
            </div>
          </div>
        </Form>

        {allowClear && search?.length > 0 && (
          <div className="search-response">
            <p>{totalTopics?.total_count} Results Found</p>
            <Button
              type="link"
              danger
              className="btn-clear"
              onClick={() => handleClear()}
            >
              Clear all
              <CloseOutlined />
            </Button>
          </div>
        )}
        {loading ? (
          <CustomSkelton skeltonFor="browse" />
        ) : (
          <Row gutter={[24, 24]}>
            {topicsData?.topics &&
              topicsData?.topics?.map((ft: any, index) => (
                <Col
                  key={index}
                  xs={24}
                  sm={24}
                  md={8}
                  className={`${
                    ft?.tags?.length == 0 ? "[&_.mainTags]:!hidden" : ""
                  }`}
                >
                  <SingleTopicCard
                    cardClassName="[&_.scoreTag]:mx-0 [&_.scoreTag]:ml-2 [&_.catTags]:flex-row [&_.cardCountCls]:!mt-0 [&_.scoreTag]:w-max [&_.topicDesc]:line-clamp-2"
                    topic={{
                      ...ft,
                      topic_num: ft?.topic_id,
                      topicTags: ft?.tags,
                      views: ft?.camp_views,
                    }}
                    avatars={
                      ft?.tree_structure &&
                      ft?.tree_structure[1]?.support_tree
                        ?.map((support) => support?.user)
                        ?.slice(0, 5)
                    }
                    maxCount={5}
                    scoreTag={<ScoreTag topic_score={ft?.topic_score} />}
                  />
                </Col>
              ))}
          </Row>
        )}
        {totalTopics?.total_count > 10 && (
          <CustomPagination
            totalTopics={totalTopics?.total_count}
            pageNumber={pageNumber}
            pageSize={pageSize}
            loading={loading}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </Layout>
  );
};

export default TopicsList;
