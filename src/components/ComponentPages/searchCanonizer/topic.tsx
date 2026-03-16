import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { Pagination } from "antd";
import { setPageNumber } from "src/store/slices/searchSlice";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { useRouter } from "next/router";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import Link from "next/link";
import CustomSkelton from "../../common/customSkelton";
import Image from "next/image";
import AdvanceSearchHeader from "./AdvanceSearchHeader";

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
    algorithm,
    pageNumber,
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
  const router = useRouter();
  const dispatch = useDispatch();

  const pageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch(setPageNumber(pageNumber));
  };

  function replaceSpecialCharactersInLink(link) {
    if (!link) return ""; // Handle null/undefined cases

    // Replace special characters (excluding slashes) with hyphens
    link = link.replace(/[^a-zA-Z0-9/_-]/g, "-");

    const topicString = "/topic/";
    const topicIndex = link.indexOf(topicString);

    // If '/topic/' is not found, return the sanitized link
    if (topicIndex === -1) {
      return link;
    }

    // Find the last slash in the link
    const lastSlashIndex = link.lastIndexOf("/");

    // If the last slash is before '/topic/', return as is
    if (lastSlashIndex <= topicIndex + topicString.length) {
      return link;
    }

    // Extract parts of the URL
    const beforeTopic = link.substring(0, topicIndex + topicString.length); // Keep '/topic/' part
    let betweenTopicAndLast = link.substring(
      topicIndex + topicString.length,
      lastSlashIndex
    );
    const afterLastSlash = link.substring(lastSlashIndex);

    // Replace slashes in the part between '/topic/' and the last slash with hyphens
    betweenTopicAndLast = betweenTopicAndLast.replace(/\//g, "-");

    return beforeTopic + betweenTopicAndLast + afterLastSlash;
  }

  const getHighlightedText = (text = "", highlight = "") => {
    if (!text || !highlight) return text; // Handle null/empty cases gracefully

    // Escape special characters in the highlight text for regex
    const escapedHighlight = highlight.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    );

    // Create a case-insensitive regex pattern
    const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));
    const highlightLower = highlight.toLowerCase();

    return parts.map((part, i) => (
      <span
        key={i}
        style={part.toLowerCase() === highlightLower ? { fontWeight: 700 } : {}}
      >
        {part}
      </span>
    ));
  };

  useEffect(() => {
    setIsReview(asof == "review");
  }, [asof]);

  useEffect(() => {
    setDisplayedData(searchDataAll?.topic);
  }, [searchDataAll?.topic, currentPage]);

  useEffect(() => {
    setDisplayedDataforAlgo(selectedTopicFromAdvanceFilterAlgorithm);
  }, [selectedTopicFromAdvanceFilterAlgorithm, currentPage]);

  const TopicItem = ({ item, searchValue, isAlgorithm }) => {
    const topicLink = isAlgorithm
      ? `/topic/${item?.topic_num}-${replaceSpecialCharacters(
          item?.type_value,
          "-"
        )}/1-Agreement`
      : `/${replaceSpecialCharactersInLink(item?.link ?? "")}`;

    return (
      <li className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0">
        <Link href={topicLink}>
          <div className="flex justify-between items-center">
            <label
              className="text-base font-medium text-canBlack flex !mb-2"
              style={{ cursor: "pointer" }}
            >
              {getHighlightedText(item?.type_value, searchValue)}
            </label>
            <Image
              src="/images/search-page-arrow.svg"
              width={16}
              height={10}
              alt="check"
              className="cursor-pointer"
            />
          </div>
        </Link>
        <div className="text-base text-canBlue flex items-center gap-2.5">
          <Image src="/images/flagicon.svg" width={18} height={20} alt="" />
          <span className="text-base !text-canBlack font-medium">
            Canon:
            <span className="font-medium !text-canBlue ml-1">
              {item.namespace}
            </span>
          </span>
        </div>
      </li>
    );
  };

  const TopicList = ({ data, searchValue, isAlgorithm }) => {
    if (!data?.length) {
      return (
        <span className="italic text-canLight">
          There is no data to show in this category.
        </span>
      );
    }

    return (
      <ul>
        {data.map((item) => (
          <TopicItem
            key={item?.topic_num || item?.link}
            item={item}
            searchValue={searchValue}
            isAlgorithm={isAlgorithm}
          />
        ))}
      </ul>
    );
  };
  const isAlgorithmSearch = isReview || asof === "bydate";

  return (
    <Fragment>
      <AdvanceSearchHeader
        sectionId="elastic_topic_search_section"
        subSectionId="elastic_topic_search_section_heading_content"
        headingId="elastic_topic_search_section_img_content"
        imgId="elastic_topic_search_section_img"
        headingTextId="elastic_topic_search_section_heading"
      />
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
              />
            ) : (
              <div className={styles.search_lists}>
                {searchDataAll?.topic?.length ? (
                  <div>
                    {isAlgorithmSearch ? (
                      <TopicList
                        data={displayedDataforAlgo}
                        searchValue={searchValue}
                        isAlgorithm={true}
                      />
                    ) : (
                      <TopicList
                        data={displayedData}
                        searchValue={searchValue}
                        isAlgorithm={false}
                      />
                    )}
                  </div>
                ) : (
                  <span className="italic text-canLight">
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
