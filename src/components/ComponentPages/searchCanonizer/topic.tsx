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
    asof,
    filterByScore,
    algorithm,
  } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
    selectedTopicFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedTopicFromAdvanceFilterAlgorithm,
    asof: state.filters?.filterObject?.asof,
    filterByScore: state.filters?.filterObject?.filterByScore,
    algorithm: state.filters?.filterObject?.algorithm,
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
    const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
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
  return (
    <Fragment>
      <div className="flex justify-between lg:items-center lg:flex-row flex-col items-start mb-10 mt-2.5 lg:gap-0 gap-5">
        <div className="flex  items-center  ">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/recent-activiity-arrow.svg"
              width={16}
              height={24}
            />

            <h3 className="lg:text-32 text-xl   text-canBlack font-medium">
              Search Results for “
              <span className="text-canBlue capitalize">{router?.query?.q}</span>”
            </h3>
          </div>
        </div>
        <AdvanceFilter />
      </div>
      <div className="flex lg:flex-row flex-col gap-10">
        <aside className="leftSideBar miniSideBar">
          <div className="leftSideBar_Card p-0 m-0">
            <SearchSideBar />
          </div>
        </aside>

        <div className="pageContentWrap flex-1">
          <div
            className={`bg-canGray lg:py-5 lg:px-8 py-4 px-4 rounded-xl mb-5`}
          >
            <div className="d-flex mb-2 align-items-center flex-wrap relative">
              <h4
                data-testid="topic_heading"
                className="!mb-6 !text-base !font-semibold !text-canBlack"
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
                {searchDataAll.topic?.length ? (
                  <div>
                    {isReview || asof == "bydate" ? (
                      selectedTopicFromAdvanceFilterAlgorithm?.length ? (
                        <div>
                          <ul>
                            {selectedTopicFromAdvanceFilterAlgorithm?.map(
                              (x) => {
                                return (
                                  <>
                                    <li className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0 ">
                                      <Link
                                        href={`/topic/${
                                          x?.topic_num
                                        }-${replaceSpecialCharacters(
                                          x?.topic_name,
                                          "-"
                                        )}/1-Agreement`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <a>
                                            <label
                                              style={{ cursor: "pointer" }}
                                              className="text-base font-medium text-canBlack flex !mb-2"
                                            >
                                              {/* {x?.topic_name} */}
                                              {getHighlightedText(
                                                x?.topic_name,
                                                searchValue
                                              )}
                                            </label>
                                          </a>
                                          <Image
                                            src="/images/search-page-arrow.svg"
                                            width={16}
                                            height={10}
                                            alt={"check"}
                                          />
                                        </div>
                                      </Link>

                                      <div className="text-base text-canBlue flex items-center gap-2.5">
                                        <Image
                                          src="/images/flagicon.svg"
                                          width={18}
                                          height={20}
                                        />
                                        <span className="text-base !text-canBlack font-medium">
                                          Canon:
                                          <span className="font-medium !text-canBlue ml-1">
                                            {x.namespace}
                                          </span>
                                        </span>
                                      </div>
                                    </li>
                                  </>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      ) : (
                        <span className="italic text-canLight">
                          There is no data to show in this category.
                        </span>
                      )
                    ) : (
                      <ul>
                        {searchDataAll.topic.map((x) => {
                          return (
                            <>
                              <li className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0 ">
                                <Link
                                  href={`/${replaceSpecialCharactersInLink(
                                    x?.link
                                  )}`}
                                >
                                  <div className="flex justify-between items-center">
                                    <a>
                                      <label
                                        style={{ cursor: "pointer" }}
                                        className="text-base font-medium text-canBlack flex !mb-2"
                                      >
                                        {getHighlightedText(
                                          x?.type_value,
                                          searchValue
                                        )}
                                      </label>
                                    </a>
                                    <Image
                                      src="/images/search-page-arrow.svg"
                                      width={16}
                                      height={10}
                                      alt={"check"}
                                    />
                                  </div>
                                </Link>
                                <div className="text-base text-canBlue flex items-center gap-2.5">
                                  <Image
                                    src="/images/flagicon.svg"
                                    width={18}
                                    height={20}
                                  />
                                  <span className="text-base !text-canBlack font-medium">
                                    Canon:
                                    <span className="font-medium !text-canBlue ml-1">
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
                  <span className="italic text-canLight">
                    There is no data to show in this category.
                  </span>
                )}
              </div>
            )}
            <Pagination
              className="mt-5 [&_.ant-pagination-item]:!mr-1 lg:[&_.ant-pagination-item]:!mr-2"
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
      </div>
    </Fragment>
  );
};
export default TopicSearch;
