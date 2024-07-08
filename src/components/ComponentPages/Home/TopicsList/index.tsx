import {
  CloseOutlined,
  InfoCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Popover, Select } from "antd";
import Link from "next/link";
import {
  Row,
  Col,
  Typography,
  Divider,
  Form,
  Input,
  Button,
  Tag,
  Pagination,
} from "antd";
import { useEffect, useRef, useState } from "react";
import {
  getCanonizedNameSpacesApi,
  getCanonizedTopicsApi,
} from "src/network/api/homePageApi";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { useRouter } from "next/router";
import CommonCard from "src/components/shared/Card";
import {
  changeSlashToArrow,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import SortTopics from "components/ComponentPages/SortingTopics";
import CustomSkelton from "components/common/customSkelton";
import AvatarGroup from "components/shared/AvaratGroup";
import ViewCounts from "components/shared/ViewsCount";
import CardDescription from "../HotTopics/descriptions";
import NameSpaceLabel from "components/shared/NameSpaceLabel";
import CustomPagination from "components/shared/CustomPagination/intex";
const { Title } = Typography;
const { Search } = Input;

const TopicsList = () => {
  const router = useRouter();
  const dispatch = useDispatch();

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
    onlyMyTopicsCheck,
    loading,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state.filters?.filterObject?.asof,
    algorithm: state.filters?.filterObject?.algorithm,
    filterByScore: state.filters?.filterObject?.filterByScore,
    nameSpaces: state.homePage?.nameSpaces,
    filterNameSpace: state?.filters?.filterObject?.nameSpace,
    userEmail: state?.auth?.loggedInUser?.email,
    filterNameSpaceId: String(state?.filters?.filterObject?.namespace_id),
    search: state?.filters?.filterObject?.search,
    is_checked: state?.utils?.score_checkbox,
    filterObject: state?.filters?.filterObject,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
    loading: state?.loading?.loading,
    onlyMyTopicsCheck: state?.filters?.onlyMyTopicsCheck,
  }));
  const { sortLatestTopic, sortScoreViewTopic } = useSelector(
    (state: RootState) => ({
      sortLatestTopic: state?.utils?.sortLatestTopic,
      sortScoreViewTopic: state?.utils?.sortScoreViewTopic,
      loading: state?.loading?.loading,
    })
  );
  const [topicsData, setTopicsData] = useState(canonizedTopics);
  const [nameSpacesList, setNameSpacesList] = useState(nameSpaces);
  const [inputSearch, setInputSearch] = useState(search || "");
  const [nameSpaceId, setNameSpaceId] = useState(
    String(filterNameSpaceId) || "1"
  );
  const [selectedNameSpace, setSelectedNameSpace] = useState(filterNameSpace);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTopics, setTotalTopics] = useState<any>([]);
  const inputRef = useRef(null);
  const [allowClear, setAllowClear] = useState(false);
  const [isCanonChange, setIsCanonChange] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(true);

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
    };
    const response = await getCanonizedTopicsApi(reqBody);
    setTotalTopics(response);
  }

  function getNameById(id) {
    const namespace = nameSpacesList?.length && nameSpacesList?.find((item) => item?.id === id);
    return nameSpacesList?.length ? namespace?.name : null;
  }

  const onSearch = (value) => {
    setIsCanonChange(true);
    setInputSearch(value?.trim());
    dispatch(setFilterCanonizedTopics({ search: value || "" }));
    setAllowClear(true);
  };

  const handleKeyUpSearch = (event: any) => {
    const value = event.target.value?.trim();
    if (value?.length > 0) {
      setIsCanonChange(true);
      setSearchTerm(value);
      setAllowClear(true);
    } else {
      setSearchTerm("");
      setAllowClear(false);
    }
  };

  const handleClear = () => {
    setAllowClear(false);
    setInputSearch("");
    setPageNumber(1);
    dispatch(setFilterCanonizedTopics({ search: "" }));
  };

  useEffect(() => {
    if (String(filterNameSpaceId) !== "1") {
      router.query.canon = String(filterNameSpaceId);
      delete router.query?.namespace;
      router.replace(router, undefined, { shallow: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    inputRef.current!.focus();
  }, [searchTerm, onSearch]);

  /* eslint-enable */

  useEffect(() => {
    setSelectedNameSpace(filterNameSpace);
    setNameSpaceId(String(filterNameSpaceId));
    setInputSearch(search.trim());
    setNameSpacesList(nameSpaces);
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
  ]);

  return (
    <>
      <div className="browse-wrapper pb-4">
        <Title level={2} className="browse-title">
          Browse Canonizer’s Topics
        </Title>
        <Divider />
        <div className="browse-actions">
          <Form layout="vertical">
            <Form.Item className="browse-dropdown">
              <div className="filter-popover-wrapper">
                <p>Filter By Canon</p>
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
              >
                {nameSpacesList?.length > 0 &&
                  nameSpacesList?.map((item) => {
                    return (
                      <Select.Option
                        id={`name-space-${item?.id}`}
                        key={item?.id}
                        value={item?.id}
                      >
                        {changeSlashToArrow(item?.label)}
                      </Select.Option>
                    );
                  })}
                <Select.Option id="name-space-custom" key="custom-key" value="">
                  All
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
          <div className="search-wrapper">
            <Search
              key={inputSearch}
              size="large"
              className="browse-search"
              placeholder="Search via keyword"
              defaultValue={inputSearch}
              // value={searchTerm}
              onSearch={onSearch}
              // onChange={handleKeyUpSearch}
              ref={inputRef}
              disabled={loading}
            />
            <SortTopics />
          </div>
        </div>
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
          <>
            <CustomSkelton skeltonFor="browse" />
          </>
        ) : (
          <Row gutter={[24, 24]}>
            {topicsData?.topics &&
              topicsData?.topics?.map((ft: any, index) => (
                <Col key={index} xs={24} sm={24} md={12}>
                  <CommonCard className="browse-card" key={ft?.id}>
                    <Link
                      href={{
                        pathname: `/topic/${ft?.topic_id}-${replaceSpecialCharacters(ft?.topic_name, "-") || ""
                          }/1-Agreement`,
                      }}
                    >
                      <a className="flex justify-between mb-2.5 items-center">
                        <Typography.Paragraph className="m-0 text-base font-medium font-inter">
                          {ft?.topic_name}
                        </Typography.Paragraph>
                        <RightOutlined className="text-canBlue font-bold hidden rightArrow" />
                        <Button
                          className="btn-right"
                          type="link"
                          size="small"
                          icon={<i className="icon-angle-right"></i>}
                        />
                      </a>
                    </Link>
                    <Tag
                      className={
                        "bg-canOrange text-white border-0 rounded-[5px] ml-0 inline-flex py-[2px] flex items-center text-12"
                      }
                    >
                      <svg
                        width="10"
                        height="13"
                        viewBox="0 0 13 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1"
                      >
                        <path
                          d="M10.1522 5.2133C9.8674 5.21302 9.58615 5.27647 9.32905 5.39899V3.01823C9.32915 2.68533 9.24269 2.35812 9.07816 2.06872C8.91364 1.77931 8.6767 1.53765 8.39059 1.36746C8.10448 1.19726 7.77905 1.10437 7.44621 1.09791C7.11337 1.09144 6.78457 1.17162 6.49207 1.33058C6.35149 0.895086 6.06003 0.524102 5.67019 0.284444C5.28035 0.0447849 4.81774 -0.047797 4.36569 0.023373C3.91365 0.094543 3.50186 0.324787 3.20452 0.672636C2.90717 1.02048 2.7438 1.46308 2.74384 1.92069V2.38077C2.45113 2.24174 2.12799 2.17905 1.80452 2.19856C1.48106 2.21806 1.16779 2.31911 0.893901 2.49229C0.620011 2.66548 0.394408 2.90517 0.238109 3.18904C0.0818086 3.4729 -0.000104252 3.79171 9.95772e-08 4.11576V9.87782C9.95772e-08 11.4788 0.635981 13.0142 1.76803 14.1462C2.90009 15.2783 4.43548 15.9143 6.03645 15.9143C7.63741 15.9143 9.1728 15.2783 10.3049 14.1462C11.4369 13.0142 12.0729 11.4788 12.0729 9.87782V7.13399C12.0723 6.62476 11.8698 6.13656 11.5097 5.77649C11.1496 5.41641 10.6614 5.21387 10.1522 5.2133ZM10.9754 9.87782C10.9754 11.1877 10.455 12.4439 9.52878 13.3702C8.60256 14.2964 7.34633 14.8167 6.03645 14.8167C4.72656 14.8167 3.47033 14.2964 2.54411 13.3702C1.61788 12.4439 1.09754 11.1877 1.09754 9.87782V4.11576C1.09754 3.89745 1.18426 3.68808 1.33863 3.53371C1.493 3.37934 1.70237 3.29261 1.92069 3.29261C2.139 3.29261 2.34837 3.37934 2.50274 3.53371C2.65711 3.68808 2.74384 3.89745 2.74384 4.11576V7.13399C2.74384 7.27953 2.80166 7.41911 2.90457 7.52202C3.00748 7.62494 3.14706 7.68275 3.29261 7.68275C3.43815 7.68275 3.57773 7.62494 3.68064 7.52202C3.78356 7.41911 3.84137 7.27953 3.84137 7.13399V1.92069C3.84137 1.70238 3.9281 1.49301 4.08247 1.33864C4.23684 1.18427 4.44621 1.09754 4.66453 1.09754C4.88284 1.09754 5.09221 1.18427 5.24658 1.33864C5.40095 1.49301 5.48768 1.70238 5.48768 1.92069V6.58522C5.48768 6.73076 5.54549 6.87034 5.64841 6.97326C5.75132 7.07617 5.8909 7.13399 6.03645 7.13399C6.18199 7.13399 6.32157 7.07617 6.42448 6.97326C6.5274 6.87034 6.58521 6.73076 6.58521 6.58522V3.01823C6.58521 2.79992 6.67194 2.59054 6.82631 2.43617C6.98068 2.2818 7.19005 2.19508 7.40836 2.19508C7.62668 2.19508 7.83605 2.2818 7.99042 2.43617C8.14479 2.59054 8.23152 2.79992 8.23152 3.01823V8.00286C7.4647 8.13356 6.76877 8.53111 6.26668 9.12525C5.76459 9.71938 5.48867 10.4719 5.48768 11.2497C5.48768 11.3953 5.54549 11.5349 5.64841 11.6378C5.75132 11.7407 5.8909 11.7985 6.03645 11.7985C6.18199 11.7985 6.32157 11.7407 6.42448 11.6378C6.5274 11.5349 6.58521 11.3953 6.58521 11.2497C6.58587 10.6678 6.81735 10.1098 7.22886 9.69832C7.64038 9.28681 8.19832 9.05533 8.78028 9.05467C8.92583 9.05467 9.06541 8.99685 9.16832 8.89394C9.27123 8.79103 9.32905 8.65145 9.32905 8.50591V7.13399C9.32905 6.91567 9.41578 6.7063 9.57015 6.55193C9.72452 6.39756 9.93389 6.31083 10.1522 6.31083C10.3705 6.31083 10.5799 6.39756 10.7343 6.55193C10.8886 6.7063 10.9754 6.91567 10.9754 7.13399V9.87782Z"
                          fill="#fff"
                        />
                      </svg>
                      {ft?.topic_score?.toFixed(2)}
                    </Tag>
                    <div className="card-description mt-3">
                      <CardDescription
                        description={ft?.statement}
                        isBrowsing={isBrowsing}
                      />
                    </div>
                    <div className="browse-card-footer">
                      <div className="text-left flex ">
                        <NameSpaceLabel
                          namespace={
                            selectedNameSpace != "All"
                              ? selectedNameSpace
                              : getNameById(ft?.namespace_id)
                          }
                        />
                        <ViewCounts views={ft?.camp_views} />
                      </div>
                      <AvatarGroup
                        className="browse-avatar"
                        avatars={
                          ft?.tree_structure &&
                          ft?.tree_structure[1]?.support_tree?.map(
                            (support) => support?.user
                          )
                        }
                        size="large"
                        maxCount={4}
                        maxStyle={{
                          color: "#f56a00",
                          backgroundColor: "#fde3cf",
                        }}
                      />
                    </div>
                  </CommonCard>
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
    </>
  );
};

export default TopicsList;
