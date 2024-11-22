import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import AdvanceFilter from "../../common/AdvanceSearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { Empty, Pagination } from "antd";
import Link from "next/link";
import { setPageNumber } from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";
import Image from "next/image";
import { useRouter } from "next/router";

const CampSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { searchDataAll, searchValue } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
    searchValue: state?.searchSlice?.searchValue,
  }));
  const {
    searchMetaData,
    loading,
    asof,
    algorithm,
    filterByScore,
    selectedCampFromAdvanceFilterAlgorithm,
  } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
    asof: state.filters?.filterObject?.asof,
    selectedCampFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedCampFromAdvanceFilterAlgorithm,
    filterByScore: state.filters?.filterObject?.filterByScore,
    algorithm: state.filters?.filterObject?.algorithm,
    loading: state?.loading?.searchLoading,
  }));

  const [isReview, setIsReview] = useState(asof == "review");
  const [displayList, setDisplayList] = useState([]);

  const dispatch = useDispatch();

  const pageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch(setPageNumber(pageNumber));
  };

  useEffect(() => {
    pageChange(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDataAll?.camp]);
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };

  useEffect(() => {
    setIsReview(asof == "review");
  }, [asof]);

  useEffect(() => {
    if (
      asof == "review" ||
      asof == "bydate" ||
      filterByScore != 0 ||
      algorithm !== "blind_popularity"
    ) {
      pageChange1(1, 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampFromAdvanceFilterAlgorithm]);

  const pageChange1 = (pageNumber, pageSize) => {
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setDisplayList(
      selectedCampFromAdvanceFilterAlgorithm?.slice(
        startingPosition,
        endingPosition
      )
    );
  };
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
      <div
        className="flex justify-between lg:items-center lg:flex-row flex-col items-start mb-10 mt-2.5 lg:gap-0 gap-5"
        id="search_camp_section"
      >
        <div className="flex  items-center  " id="search_camp_section_sub">
          <div
            className="flex items-center gap-2.5"
            id="search_camp_section_heading"
          >
            <Image
              id="search_camp_section_heading_img"
              src="/images/recent-activiity-arrow.svg"
              width={16}
              height={24}
            />

            <h3
              className="lg:text-3xl text-xl   text-canBlack font-medium"
              id="search_camp_section_heading_text"
            >
              Search Results for “
              <span
                className="text-canBlue capitalize"
                id="search_camp_section_heading_text_value"
              >
                {router?.query?.q}
              </span>
              ”
            </h3>
          </div>
        </div>
        <AdvanceFilter />
      </div>
      <div
        className="flex lg:flex-row flex-col gap-10"
        id="search_camp_section_sidebar"
      >
        <aside
          className="leftSideBar miniSideBar"
          id="search_camp_section_sidebar_2"
        >
          <div
            className="leftSideBar_Card p-0 m-0"
            id="search_camp_section_heading_sidebar_3"
          >
            <SearchSideBar />
          </div>
        </aside>
        <div
          className="pageContentWrap flex-1"
          id="search_camp_section_text_div"
        >
          <div
            className="bg-canGray lg:py-5 lg:px-8 py-4 px-4 rounded-xl mb-5"
            id="search_camp_section_text_div_1"
          >
            <div
              className="d-flex mb-2 align-items-center flex-wrap relative"
              id="search_camp_section_text_div_2"
            >
              <h4
                data-testid="camp_heading"
                className="!mb-6 !text-base !font-semibold !text-canBlack"
                id="search_camp_section_text_heading"
              >
                Camp(S)
              </h4>
              {/* <AdvanceFilter /> */}
            </div>
            {loading ? (
              <CustomSkelton
                id="search_camp_section_loader"
                skeltonFor="list"
                bodyCount={10}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : (
              <div
                className={styles.search_lists}
                id="search_camp_section_list"
              >
                {searchDataAll.camp?.length ? (
                  <div id="search_camp_section_map_list">
                    {isReview || asof == "bydate" ? (
                      <div>
                        {selectedCampFromAdvanceFilterAlgorithm?.length ? (
                          <ul id="search_camp_section_ul">
                            {displayList?.map((x) => {
                              const jsonData = JSON.parse(
                                x.breadcrumb
                              ) as Array<any>;
                              const parsedData = jsonData.reduce(
                                (accumulator, currentVal, index) => {
                                  const accIndex = index + 1;
                                  accumulator[index] = {
                                    camp_name:
                                      currentVal[accIndex]?.camp_name ==
                                      "Agreement"
                                        ? currentVal[accIndex]?.topic_name
                                        : currentVal[accIndex]?.camp_name,
                                    camp_link: currentVal[accIndex]?.camp_link,
                                    topic_name:
                                      currentVal[accIndex]?.topic_name,
                                  };
                                  return accumulator;
                                },
                                []
                              );
                              return (
                                <>
                                  <li
                                    className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none"
                                    id="search_camp_section_ul_li"
                                  >
                                    <Link
                                      href={`/${jsonData[0][1]?.camp_link}`}
                                    >
                                      <div
                                        className="flex justify-between items-center"
                                        id="search_camp_section_ul_li_div"
                                      >
                                        <a
                                          className="text-base font-medium text-canBlack flex !mb-2"
                                          id="search_camp_section_ul_li_link_value"
                                        >
                                          {" "}
                                          {/* {x.camp_name} */}
                                          {getHighlightedText(
                                            x?.camp_name,
                                            searchValue
                                          )}
                                        </a>
                                        <a
                                          id="search_camp_section_ul_li_link"
                                          href={`/${jsonData[0][1]?.camp_link}`}
                                        >
                                          <Image
                                            id="search_camp_section_ul_li_img"
                                            src="/images/search-page-arrow.svg"
                                            width={16}
                                            height={10}
                                            alt={"check"}
                                          />
                                        </a>
                                      </div>
                                    </Link>
                                    <div
                                      className="text-base  flex flex-wrap items-center gap-2.5"
                                      id="search_camp_section_ul_li_img_div"
                                    >
                                      <div
                                        className="flex gap-2.5"
                                        id="search_camp_section_ul_li_img_div_1"
                                      >
                                        <Image
                                          id="search_camp_section_ul_li_img"
                                          src="/images/note-sticky.svg"
                                          width={17}
                                          height={19}
                                        />
                                        <span
                                          className="text-base font-medium text-canBlack mr-1"
                                          id="search_camp_section_ul_li_topic_heading"
                                        >
                                          {" "}
                                          Topic:
                                        </span>
                                      </div>
                                      {parsedData
                                        .reverse()
                                        .map((obj, index) => {
                                          return (
                                            <>
                                              <a
                                                id="search_camp_section_ul_li_parsed_link"
                                                className="text-base text-canBlue flex items-center gap-2.5 font-medium"
                                                href={`/${obj?.camp_link}`}
                                                key={`/${obj?.camp_link}`}
                                              >
                                                {/* {obj.camp_name} */}
                                                {getHighlightedText(
                                                  obj?.camp_name,
                                                  searchValue
                                                )}
                                                {index < parsedData.length - 1
                                                  ? "/ "
                                                  : ""}
                                              </a>
                                            </>
                                          );
                                        })}
                                    </div>
                                  </li>
                                </>
                              );
                            })}
                          </ul>
                        ) : (
                          <span
                            className="italic text-canLight"
                            id="search_camp_section_ul_li_no_data"
                          >
                            There is no data to show in this category.
                          </span>
                        )}
                      </div>
                    ) : (
                      <ul id="search_camp_section_advance">
                        {searchDataAll?.camp.map((x) => {
                          const jsonData = JSON.parse(
                            x.breadcrumb_data
                          ) as Array<any>;
                          const parsedData = jsonData.reduce(
                            (accumulator, currentVal, index) => {
                              const accIndex = index + 1;
                              accumulator[index] = {
                                camp_name:
                                  currentVal[accIndex]?.camp_name == "Agreement"
                                    ? currentVal[accIndex]?.topic_name
                                    : currentVal[accIndex]?.camp_name,
                                camp_link: currentVal[accIndex]?.camp_link,
                                topic_name: currentVal[accIndex]?.topic_name,
                              };
                              return accumulator;
                            },
                            []
                          );
                          return (
                            <>
                              <li
                                className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none"
                                id="search_camp_section_ul_li_advance"
                              >
                                <Link href={`/${jsonData?.[0][1]?.camp_link}`}>
                                  <div className="flex justify-between items-center">
                                    <a
                                      className="text-base font-medium text-canBlack flex !mb-2 "
                                      id="search_camp_section_ul_li_advance_link_value"
                                    >
                                      {" "}
                                      {/* {x.type_value} */}
                                      {getHighlightedText(
                                        x?.type_value,
                                        searchValue
                                      )}
                                    </a>
                                    <a
                                      href={`/${jsonData[0][1]?.camp_link}`}
                                      id="search_camp_section_ul_li_advance_link"
                                    >
                                      <Image
                                        id="search_camp_section_ul_li_advance_img"
                                        src="/images/search-page-arrow.svg"
                                        width={16}
                                        height={10}
                                        alt={"check"}
                                      />
                                    </a>
                                  </div>
                                </Link>
                                <div
                                  className="text-base  flex flex-wrap items-center gap-2.5"
                                  id="search_camp_section_ul_li_advance_parsed_area"
                                >
                                  <div
                                    className="flex gap-2.5"
                                    id="search_camp_section_ul_li_advance_parsed_area_div_1"
                                  >
                                    <Image
                                      id="search_camp_section_ul_li_advance_parsed_area_img"
                                      src="/images/note-sticky.svg"
                                      width={17}
                                      height={19}
                                    />
                                    <span
                                      className="text-base font-medium text-canBlack mr-1"
                                      id="search_camp_section_ul_li_advance_parsed_area_topic"
                                    >
                                      {" "}
                                      Topic:
                                    </span>
                                  </div>
                                  {parsedData.reverse().map((obj, index) => {
                                    return (
                                      <>
                                        <a
                                          id="search_camp_section_ul_li_advance_parsed_area_link"
                                          className="text-base text-canBlue flex items-center gap-2.5 font-medium"
                                          href={`/${obj?.camp_link}`}
                                          key={`/${obj?.camp_link}`}
                                        >
                                          {/* {obj.camp_name} */}
                                          {getHighlightedText(
                                            obj?.camp_name,
                                            searchValue
                                          )}

                                          {index < parsedData.length - 1
                                            ? "/ "
                                            : ""}
                                        </a>
                                      </>
                                    );
                                  })}
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
                    id="search_camp_section_ul_li_advance_parsed_area_no_data"
                  >
                    There is no data to show in this category.
                  </span>
                )}
              </div>
            )}

            <Pagination
              className="mt-5 [&_.ant-pagination-item]:!mr-1 lg:[&_.ant-pagination-item]:!mr-2"
              hideOnSinglePage={true}
              total={
                asof == "review" || asof == "bydate"
                  ? selectedCampFromAdvanceFilterAlgorithm?.length
                  : searchMetaData.total
              }
              pageSize={20}
              onChange={
                asof == "review" || asof == "bydate" ? pageChange1 : pageChange
              }
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CampSearch;
