import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
// import AdvanceFilter from "../../common/AdvanceSearchFilter";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { Empty, Pagination } from "antd";
import { setPageNumber } from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";
import Image from "next/image";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { useRouter } from "next/router";

const TopicSearch = () => {
  const { searchDataAll, searchData, searchValue } = useSelector(
    (state: RootState) => ({
      searchDataAll: state?.searchSlice?.searchDataAll,
      searchData: state?.searchSlice?.searchData,
      searchValue: state?.searchSlice?.searchValue,
    })
  );
  const {
    searchMetaData,
    selectedTopicFromAdvanceFilterAlgorithm,
    selectedTopicFromAdvanceFilterAlgorithmRecords,
    asof,
    filterByScore,
    algorithm,
    pageNumber
  } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
    selectedTopicFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedTopicFromAdvanceFilterAlgorithm,
    selectedTopicFromAdvanceFilterAlgorithmRecords:
      state?.searchSlice?.selectedTopicFromAdvanceFilterAlgorithmRecords,
    asof: state.filters?.filterObject?.asof,
    filterByScore: state.filters?.filterObject?.filterByScore,
    algorithm: state.filters?.filterObject?.algorithm,
    pageNumber: state?.searchSlice?.pageNumber,
  }));

  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const [isReview, setIsReview] = useState(asof == "review");
  const [displayedData, setDisplayedData] = useState([]);
  const [displayedDataforAlgo, setDisplayedDataforAlgo] = useState([]);

  const dispatch = useDispatch();
  const pageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch(setPageNumber(pageNumber));
  };
 
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };
  function replaceSpecialCharactersInLink(link) {
    // Replace each special character (excluding slashes) with a hyphen
    link = link.replace(/[-\\^$*+?.()|%#@[\]{}]/g, "-");

    // Define the "/topic/" string
    let topicString = "/topic/";
    let topicIndex = link.indexOf(topicString);
    if (topicIndex === 1) {
      // If '/topic/' is not found, return the modified link with special characters replaced
      return link;
    }

    // Find the index of the last slash in the link
    let lastSlashIndex = link.lastIndexOf("/");

    // Extract parts of the URL
    let beforeTopic = link.substring(0, topicIndex + topicString.length); // '/topic/' part
    let betweenTopicAndLast = link.substring(
      topicIndex + topicString.length,
      lastSlashIndex
    );
    let afterLastSlash = link.substring(lastSlashIndex);

    // Replace slashes in the part between '/topic/' and the last slash with hyphens
    betweenTopicAndLast = betweenTopicAndLast.replace(/\//g, "-");

    // Reconstruct the final link
    let finalLink = beforeTopic + betweenTopicAndLast + afterLastSlash;
    return finalLink;
  }
  useEffect(() => {
    setIsReview(asof == "review");
    // setBackGroundColorClass(asof);
  }, [asof]);

  const getHighlightedText = (text, highlight) => {
    const escapedHighlight = highlight.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    );

    // Create a regular expression using the escaped highlight
    const parts = text?.split(new RegExp(`(${escapedHighlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts?.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: 700 }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  };
  const router = useRouter();

  const pageSize = 20;
  useEffect(() => {
    setDisplayedData(searchDataAll?.topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDataAll?.topic, currentPage]);

  useEffect(() => {
    setDisplayedDataforAlgo(selectedTopicFromAdvanceFilterAlgorithm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopicFromAdvanceFilterAlgorithm, currentPage]);
  return (
    <Fragment>
      <div
        className="flex justify-between lg:items-center lg:flex-row flex-col items-start mb-10 mt-2.5 lg:gap-0 gap-5"
        id="elastic_topic_search_section"
      >
        <div
          className="flex  items-center  "
          id="elastic_topic_search_section_heading_content"
        >
          <div
            className="flex items-center gap-2.5"
            id="elastic_topic_search_section_img_content"
          >
            <Image
              id="elastic_topic_search_section_img"
              src="/images/recent-activiity-arrow.svg"
              width={16}
              height={24}
            />

            <h3
              className="lg:text-3xl text-xl   text-canBlack font-medium"
              id="elastic_topic_search_section_heading"
            >
              Search Results for “
              <span className="text-canBlue capitalize break-all whitespace-break-spaces">
                {router?.query?.q}
              </span>
              ”
            </h3>
          </div>
        </div>
        {/* <AdvanceFilter /> */}
      </div>
      <div
        className="flex lg:flex-row flex-col gap-10"
        id="elastic_topic_search_section_sidebar"
      >
        <aside
          className="leftSideBar miniSideBar"
          id="elastic_topic_search_section_sidebar_sub"
        >
          <div
            className="leftSideBar_Card p-0 m-0"
            id="elastic_topic_search_section_sidebar_sub1"
          >
            <SearchSideBar />
          </div>
        </aside>

        <div
          className="pageContentWrap flex-1"
          id="elastic_topic_search_section_topic_heading"
        >
          <div
            className={`bg-canGray lg:py-5 lg:px-8 py-4 px-4 rounded-xl mb-5`}
          >
            <div className="d-flex mb-2 align-items-center flex-wrap relative">
              <h4
                data-testid="topic_heading"
                className="!mb-6 !text-base !font-semibold !text-canBlack"
                id="elastic_topic_search_section_topic_text"
              >
                Topic(S)
              </h4>
            </div>
            {loading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={10}
                stylingClass="listSkeleton"
                isButton={false}
                id="elastic_topic_search_section_loader"
              />
            ) : (
              <div
                className={styles.search_lists}
                id="elastic_topic_search_list_section"
              >
                {searchDataAll.topic?.length ? (
                  <div>
                    {isReview || asof == "bydate" ? (
                      selectedTopicFromAdvanceFilterAlgorithm?.length ? (
                        <div id="elastic_topic_search_section_ul">
                          <ul id="elastic_topic_search_ul">
                            {displayedDataforAlgo?.map((x) => {
                              return (
                                <>
                                  <li
                                    className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0 "
                                    id="elastic_topic_search_li_section"
                                  >
                                    <Link
                                      href={`/topic/${
                                        x?.topic_num
                                      }-${replaceSpecialCharacters(
                                        x?.topic_name,
                                        "-"
                                      )}/1-Agreement`}
                                    >
                                      <div
                                        className="flex justify-between items-center"
                                        id="elastic_topic_search_value"
                                      >
                                        <a id="elastic_topic_search_value_link">
                                          <label
                                            style={{ cursor: "pointer" }}
                                            className="text-base font-medium text-canBlack flex !mb-2"
                                            id="elastic_topic_search_value_lable"
                                          >
                                            {/* {x?.topic_name} */}
                                            {getHighlightedText(
                                              x?.topic_name,
                                              searchValue
                                            )}
                                          </label>
                                        </a>
                                        <a
                                          href={`/topic/${
                                            x?.topic_num
                                          }-${replaceSpecialCharacters(
                                            x?.topic_name,
                                            "-"
                                          )}/1-Agreement`}
                                          id="elastic_topic_search_value_link_2"
                                        >
                                          <Image
                                            id="elastic_topic_search_value_arrow_img"
                                            src="/images/search-page-arrow.svg"
                                            width={16}
                                            height={10}
                                            alt={"check"}
                                          />
                                        </a>
                                      </div>
                                    </Link>

                                    <div
                                      className="text-base text-canBlue flex items-center gap-2.5"
                                      id="elastic_topic_search_canon_section"
                                    >
                                      <Image
                                        id="elastic_topic_search_canon_img"
                                        src="/images/flagicon.svg"
                                        width={18}
                                        height={20}
                                      />
                                      <span
                                        className="text-base !text-canBlack font-medium"
                                        id="elastic_topic_search_canon_text"
                                      >
                                        Canon:
                                        <span
                                          className="font-medium !text-canBlue ml-1"
                                          id="elastic_topic_search_canon_value"
                                        >
                                          {x.namespace}
                                        </span>
                                      </span>
                                    </div>
                                  </li>
                                </>
                              );
                            })}
                          </ul>
                        </div>
                      ) : (
                        <span
                          className="italic text-canLight"
                          id="elastic_topic_search_no_data"
                        >
                          There is no data to show in this category.
                        </span>
                      )
                    ) : (
                      <ul id="elastic_topic_search_display_data_ul">
                        {displayedData?.map((x) => {
                          return (
                            <>
                              <li
                                className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0 "
                                id="elastic_topic_search_display_data_li"
                              >
                                <Link
                                  href={`/${replaceSpecialCharactersInLink(
                                    x?.link
                                  )}`}
                                >
                                  <div
                                    className="flex justify-between items-center"
                                    id="elastic_topic_search_display_data_list_section"
                                  >
                                    <a>
                                      <label
                                        style={{ cursor: "pointer" }}
                                        className="text-base font-medium text-canBlack flex !mb-2"
                                        id="elastic_topic_search_display_data_value"
                                      >
                                        {getHighlightedText(
                                          x?.type_value,
                                          searchValue
                                        )}
                                      </label>
                                    </a>
                                    <a
                                      href={`/${replaceSpecialCharactersInLink(
                                        x?.link
                                      )}`}
                                      id="elastic_topic_search_display_data_link"
                                    >
                                      <Image
                                        id="elastic_topic_search_display_data_img"
                                        src="/images/search-page-arrow.svg"
                                        width={16}
                                        height={10}
                                        alt={"check"}
                                      />
                                    </a>
                                  </div>
                                </Link>
                                <div
                                  className="text-base text-canBlue flex items-center gap-2.5"
                                  id="elastic_topic_search_display_data_canon"
                                >
                                  <Image
                                    id="elastic_topic_search_display_data_canon_img"
                                    src="/images/flagicon.svg"
                                    width={18}
                                    height={20}
                                  />
                                  <span
                                    className="text-base !text-canBlack font-medium"
                                    id="elastic_topic_search_display_data_canon_text"
                                  >
                                    Canon:
                                    <span
                                      className="font-medium !text-canBlue ml-1"
                                      id="elastic_topic_search_display_data_canon_value"
                                    >
                                      {x.namespace}
                                    </span>
                                  </span>
                                </div>
                              </li>
                            </>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <span
                    className="italic text-canLight"
                    id="elastic_topic_search_display_no_data"
                  >
                    There is no data to show in this category.
                  </span>
                )}
              </div>
            )}
            <Pagination
              current={pageNumber}
              className="mt-5 [&_.ant-pagination-item]:!mr-1 lg:[&_.ant-pagination-item]:!mr-2"
              hideOnSinglePage={true}
              total={
                asof == "review" ||
                asof == "bydate" ||
                filterByScore != 0 ||
                algorithm !== "blind_popularity"
                  ? selectedTopicFromAdvanceFilterAlgorithmRecords
                  : searchMetaData.total
              }
              pageSize={20}
              onChange={pageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default TopicSearch;
