import { Fragment, useEffect } from "react";
import useState from "react-usestateref";
import { Typography, Row, Col, Select, List, Tag } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";

import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import {
  getCanonizedAlgorithmsApi,
  getCanonizedTopicsApi,
} from "src/network/api/homePageApi";
import CustomSkelton from "src/components/common/customSkelton";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";
import HandIcon from "./handIcon";
import { DownOutlined } from "@ant-design/icons";

const { Option } = Select;

const TrandingTopics = () => {
  const { canonizedTopics, algorithms } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    algorithms: state.homePage?.algorithms,
  }));

  const [topicsData, setTopicsData] = useState(canonizedTopics);
  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);
  const [algoValue, setAlgoValue] = useState("blind_popularity");

  useEffect(() => {
    setTopicsData(canonizedTopics);
  }, [canonizedTopics?.topics]);

  async function getTopicsApiCallWithReqBody(loadMore = false) {
    setLoadMoreIndicator(true);
    const reqBody = {
      algorithm: algoValue,
      asofdate: Date.now() / 1000,
      namespace_id: "1",
      page_number: "1",
      page_size: 10,
      search: "",
      filter: 0,
      asof: "default",
      user_email: "",
      is_archive: 0,
      sort: false,
    };
    await getCanonizedTopicsApi(reqBody, loadMore);
    setLoadMoreIndicator(false);
  }

  const selectAlgorithm = (value) => {
    setAlgoValue(value);
  };

  useEffect(() => {
    async function getTopicsApiCall() {
      await getTopicsApiCallWithReqBody();
    }

    getTopicsApiCall();
  }, [algoValue]);

  const fetchNameSpaceList = async () => {
    await getCanonizedAlgorithmsApi();
  };

  useEffect(() => {
    fetchNameSpaceList();
  }, []);

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12}>
          <SectionHeading
            title="TRENDING TOPICS"
            infoContent="TRENDING TOPICS"
            icon={null}
          />
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <SeeMoreLInk href="/browse" />
        </Col>
      </Row>

      <div className="mt-2">
        <CommonCard
          className="border-0 h-100 bg-white [&_.ant-card-body]:p-0 [&_.ant-card-body]:lg:p-[24px] lg:bg-canGray"
          data-testid="algoSelect"
        >
          <Select
            size="large"
            showSearch
            suffixIcon={<DownOutlined />}
            optionFilterProp="children"
            className="w-full [&_.ant-select-selector]:!rounded-lg [&_.ant-select-arrow]:text-canBlack [&_.ant-select-selector]:!px-4"
            defaultValue={
              algorithms?.filter((algo) => algo?.algorithm_key == algoValue)[0]
                ?.algorithm_label
            }
            onChange={selectAlgorithm}
            value={
              algorithms?.filter((algo) => algo?.algorithm_key == algoValue)[0]
                ?.algorithm_label
            }
            disabled={false}
            id="trending_algo_dropdown"
          >
            {algorithms?.map((algo) => {
              return (
                <Option
                  key={algo.id}
                  value={algo.algorithm_key}
                  id={"trending-algo_drop_item_" + algo?.id}
                >
                  {algo.algorithm_label}
                </Option>
              );
            })}
          </Select>
          {loadMoreIndicator ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={10}
              stylingClass="listSkeleton"
              isButton={false}
            />
          ) : (
            <List
              className="rounded-lg mt-1 border-1 overflow-hidden"
              size="small"
              bordered
              dataSource={topicsData?.topics}
              locale={{
                emptyText: "Currently, trading topics are not available.",
              }}
              renderItem={(item: any) => (
                <List.Item
                  className="font-inter text-sm font-medium bg-white hover:bg-canGrey1 !px-3.5 !py-4 justify-start"
                  id={`topic-${item?.topic_id}`}
                >
                  <Link
                    href={{
                      pathname: `/topic/${
                        item?.topic_id
                      }-${replaceSpecialCharacters(
                        item?.topic_name,
                        "-"
                      )}/1-Agreement`,
                    }}
                    passHref
                  >
                    <a
                      className="hover:*:text-canHoverBlue font-medium"
                      onClick={() => setLoadMoreIndicator(false)}
                    >
                      <Typography.Text>{item?.topic_name}</Typography.Text>
                    </a>
                  </Link>
                  <Tag
                    className={
                      "bg-canOrange text-white border-0 rounded-md ml-1 inline-flex py-[2px] flex items-center text-12"
                    }
                  >
                    <HandIcon />
                    {item?.topic_score?.toFixed(2)}
                  </Tag>
                </List.Item>
              )}
            />
          )}
        </CommonCard>
      </div>
    </Fragment>
  );
};

export default TrandingTopics;
