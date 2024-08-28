import { useEffect, useMemo, useRef, useState } from "react";
import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Popover, Select } from "antd";
import { Row, Col, Typography, Divider, Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  getCanonizedNameSpacesApi,
  getCanonizedTopicsApi,
} from "src/network/api/homePageApi";
import { setSelectCanonCatsPage } from "src/store/slices/filtersSlice";
import { RootState } from "src/store";
import { changeSlashToArrow } from "src/utils/generalUtility";
import SortTopics from "components/ComponentPages/SortingTopics";
import CustomSkelton from "components/common/customSkelton";
import CustomPagination from "components/shared/CustomPagination/intex";
import Layout from "src/hoc/layout";
import SingleTopicCard from "../Home/HotTopics/topicCard";
import ScoreTag from "../Home/TrandingTopic/scoreTag";

const { Title } = Typography;
const { Search } = Input;

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

const TopicsListByCats = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    nameSpaces,
    userEmail,
    onlyMyTopicsCheck,
    loading,
    sortLatestTopic,
    sortScoreViewTopic,
    selectCanonCatsPage,
    selectCanonNameCatsPage,
  } = useSelector((state: RootState) => ({
    nameSpaces: state.homePage?.nameSpaces,
    userEmail: state?.auth?.loggedInUser?.email,
    loading: state?.loading?.loading,
    onlyMyTopicsCheck: state?.filters?.onlyMyTopicsCheck,
    selectCanonCatsPage: state?.filters?.selectCanonCatsPage,
    selectCanonNameCatsPage: state?.filters?.selectCanonNameCatsPage,
    sortLatestTopic: state?.utils?.sortLatestTopic,
    sortScoreViewTopic: state?.utils?.sortScoreViewTopic,
  }));

  const [topicsData, setTopicsData] = useState([]);
  const [nameSpacesList, setNameSpacesList] = useState(nameSpaces);
  const [nameSpaceId, setNameSpaceId] = useState("");
  const [selectedNameSpace, setSelectedNameSpace] = useState(
    selectCanonNameCatsPage
  );
  const [inputSearch, setInputSearch] = useState("");
  const [pageSize, setPageSize] = useState(24);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalTopics, setTotalTopics] = useState<any>(0);
  const [allowClear, setAllowClear] = useState(false);
  const [isCanonChange, setIsCanonChange] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (nameSpaceId !== selectCanonCatsPage) {
      setNameSpaceId(() => String(selectCanonCatsPage));
    }

    if (selectedNameSpace !== selectCanonNameCatsPage) {
      setSelectedNameSpace(() => String(selectCanonNameCatsPage));
    }
  }, [selectCanonCatsPage, selectCanonNameCatsPage]);

  useEffect(() => {
    setNameSpacesList(() => nameSpaces);
  }, [nameSpaces]);

  const handlePageChange = (newPageNumber, newPageSize) => {
    setIsCanonChange(false);
    setPageNumber(newPageNumber);
    setPageSize(newPageSize);
  };

  const selectNameSpace = (id, canonName) => {
    setIsCanonChange(true);
    setPageNumber(1);

    dispatch(
      setSelectCanonCatsPage({
        canon_id: String(id),
        canon_name: canonName?.children,
      })
    );
  };

  async function getTopicsApiCallWithReqBody() {
    const reqBody = {
      algorithm: "blind_popularity",
      asof: "default",
      asofdate: Date.now() / 1000,
      namespace_id: String(nameSpaceId),
      page_number: isCanonChange ? 1 : pageNumber,
      page_size: pageSize,
      search: inputSearch,
      filter: 0,
      user_email: onlyMyTopicsCheck ? userEmail : "",
      is_archive: 0,
      sort: sortLatestTopic ? true : false,
      page: "browse",
      topic_tags: [router?.query?.id],
    };

    const response = await getCanonizedTopicsApi(reqBody);

    setTopicsData(response?.topic);
    setTotalTopics(response?.total_count);
  }

  const onSearch = (value) => {
    setIsCanonChange(true);
    setInputSearch(value?.trim());
    setAllowClear(true);
  };

  const handleClear = () => {
    setAllowClear(false);
    setInputSearch("");
    setPageNumber(1);
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
    if (inputSearch) inputRef.current!.focus();
  }, [inputSearch, onSearch]);

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

  const memoizedOptions = useMemo(() => {
    return nameSpacesList?.map((item) => (
      <Select.Option id={`name-space-${item.id}`} key={item.id} value={item.id}>
        {changeSlashToArrow(item.label)}
      </Select.Option>
    ));
  }, [nameSpacesList]);

  return (
    <Layout routeName={"browse"} className="min-h-screen">
      <div className="browse-wrapper pb-4 mt-3">
        <Title level={4} className="browse-title !mb-0">
          List of Topics
        </Title>
        <Divider />
        <div className="browse-actions">
          <Form layout="vertical">
            <Form.Item className="browse-dropdown">
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
              className="browse-search mainInput"
              placeholder="Search via keyword"
              defaultValue={inputSearch}
              onSearch={onSearch}
              ref={inputRef}
              disabled={loading}
            />
            <SortTopics />
          </div>
        </div>
        {allowClear && inputSearch?.length > 0 && (
          <div className="search-response">
            <p>{totalTopics} Results Found</p>
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
            {topicsData &&
              topicsData?.map((ft: any, index) => (
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
        {totalTopics > pageSize && (
          <CustomPagination
            totalTopics={totalTopics}
            pageNumber={pageNumber}
            pageSize={pageSize}
            loading={loading}
            handlePageChange={handlePageChange}
            pageSizeOptions={[12, 18, 27, 36]}
          />
        )}
      </div>
    </Layout>
  );
};

export default TopicsListByCats;
