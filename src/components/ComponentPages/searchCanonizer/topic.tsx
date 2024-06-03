import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import AdvanceFilter from "../../common/AdvanceSearchFilter";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { Empty, Pagination } from "antd";
import { setPageNumber } from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";
import { useRouter } from "next/router";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

const TopicSearch = () => {
  const {
    searchDataAll,
    searchData,
    selectedTopicFromAdvanceFilterAlgorithm,
    asof,
    filterByScore,
    algorithm,
  } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
    searchData: state?.searchSlice?.searchData,
    selectedTopicFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedTopicFromAdvanceFilterAlgorithm,
    asof: state.filters?.filterObject?.asof,
    filterByScore: state.filters?.filterObject?.filterByScore,
    algorithm: state.filters?.filterObject?.algorithm,
  }));
  const { searchMetaData } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
  }));

  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const [isReview, setIsReview] = useState(asof == "review");

  const dispatch = useDispatch();

  const pageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch(setPageNumber(pageNumber));
  };
  useEffect(() => {
    pageChange(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDataAll?.topic]);
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
    let lastSlashIndex = link.lastIndexOf('/');
    
    // Extract parts of the URL
    let beforeTopic = link.substring(0, topicIndex + topicString.length); // '/topic/' part
    let betweenTopicAndLast = link.substring(topicIndex + topicString.length, lastSlashIndex);
    let afterLastSlash = link.substring(lastSlashIndex);
  
    // Replace slashes in the part between '/topic/' and the last slash with hyphens
    betweenTopicAndLast = betweenTopicAndLast.replace(/\//g, "-");
  
    // Reconstruct the final link
    let finalLink = beforeTopic + betweenTopicAndLast + afterLastSlash;
    return finalLink;
  }
  const router = useRouter();
  const mapTopicList = () => {
    if (router?.query?.algo) {
      selectedTopicFromAdvanceFilterAlgorithm;
    } else {
      searchDataAll.topic;
    }
  };
  useEffect(() => {
    setIsReview(asof == "review");
    // setBackGroundColorClass(asof);
  }, [asof]);
  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar">
        <div className="leftSideBar_Card p-0 m-0">
          <SearchSideBar />
        </div>
      </aside>

      <div className="pageContentWrap">
        <div className={styles.card}>
          <div className="d-flex mb-2 align-items-center flex-wrap relative">
            <h4 data-testid="topic_heading">Topic</h4>
            <AdvanceFilter />
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
              {searchDataAll.topic?.length ? (
                <div>
                  {router?.query?.algo ||
                  router?.query?.score ||
                  isReview ||
                  asof == "bydate" ? (
                    selectedTopicFromAdvanceFilterAlgorithm?.length ? (
                      <div>
                        <ul>
                          {selectedTopicFromAdvanceFilterAlgorithm?.map((x) => {
                            return (
                              <>
                                <li>
                                  <Link
                                    href={`/topic/${
                                      x?.topic_num
                                    }-${replaceSpecialCharacters(
                                      x?.topic_name,
                                      "-"
                                    )}/1-Agreement`}
                                  >
                                    <a>
                                      <label style={{ cursor: "pointer" }}>
                                        {x?.topic_name}
                                      </label>
                                    </a>
                                  </Link>

                                  <span className={styles.ml_auto}>
                                    {x.namespace}
                                  </span>
                                </li>
                              </>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      showEmpty("No Data Found")
                    )
                  ) : (
                    <ul>
                      {searchDataAll.topic.map((x) => {
                        return (
                          <>
                            <li>
                              <Link
                                href={`/${replaceSpecialCharactersInLink(
                                  x?.link
                                )}`}
                              >
                                <a>
                                  <label style={{ cursor: "pointer" }}>
                                    {x?.type_value}
                                  </label>
                                </a>
                              </Link>

                              <span className={styles.ml_auto}>
                                {x.namespace}
                              </span>
                            </li>
                          </>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ) : (
                showEmpty("No Data Found")
              )}
            </div>
          )}
          <Pagination
            hideOnSinglePage={true}
            total={
              asof == "review" ||
              asof == "bydate" ||
              filterByScore != 0 ||
              algorithm !== "blind_popularity"
                ? selectedTopicFromAdvanceFilterAlgorithm?.length
                : searchMetaData.total
            }
            pageSize={20}
            onChange={pageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </Fragment>
  );
};
export default TopicSearch;
