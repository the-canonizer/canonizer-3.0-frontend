import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import AdvanceFilter from "../../common/AdvanceSearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import moment from "moment";
import { Empty, Pagination } from "antd";
import { setPageNumber } from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";
import Image from "next/image";
import { useRouter } from "next/router";

const CampStatementSearch = () => {
  const { searchDataAll, searchValue } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
    searchValue: state?.searchSlice?.searchValue,
  }));
  const {
    searchMetaData,
    selectedStatementFromAdvanceFilterAlgorithm,
    asof,
    filterByScore,
    algorithm,
  } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
    selectedStatementFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedStatementFromAdvanceFilterAlgorithm,
    asof: state.filters?.filterObject?.asof,
    filterByScore: state.filters?.filterObject?.filterByScore,
    algorithm: state.filters?.filterObject?.algorithm,
  }));
  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const [isReview, setIsReview] = useState(asof == "review");
  const [displayList, setDisplayList] = useState([]);
  const dispatch = useDispatch();
  const pageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch(setPageNumber(pageNumber));
  };
  const pageChange1 = (pageNumber, pageSize) => {
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setDisplayList(
      selectedStatementFromAdvanceFilterAlgorithm?.slice(
        startingPosition,
        endingPosition
      )
    );
  };
  useEffect(() => {
    pageChange(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDataAll?.statement]);
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  const fileNameLength = 800;
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
  }, [selectedStatementFromAdvanceFilterAlgorithm]);
  const getHighlightedText = (text, highlight) => {
    const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts?.map((part, i) => (
          <span
            key={part + i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: 700 }
                : {}
            }
          >
            <div dangerouslySetInnerHTML={{ __html: part }}></div>
          </span>
        ))}{" "}
      </span>
    );
  };
  const getHighlightedText2 = (text, highlight) => {
    const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts?.map((part, i) => (
          <span
            key={part + i}
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
  const ArrowLink = ({ campLink }) => (
    <a href={`/${campLink}`}>
      <Image
        src="/images/search-page-arrow.svg"
        width={16}
        height={10}
        alt="check"
      />
    </a>
  );
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

            <h3 className="lg:text-3xl text-xl   text-canBlack font-medium">
              Search Results for “
              <span className="text-canBlue capitalize">
                {router?.query?.q}
              </span>
              ”
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
          <div className="bg-canGray lg:py-5 lg:px-8 py-4 px-4 rounded-xl mb-5">
            <div className="d-flex mb-2 align-items-center flex-wrap relative">
              <h4
                data-testid="camp_statment_heading"
                className="!mb-6 !text-base !font-semibold !text-canBlack"
              >
                Camp Statement
              </h4>
              {/* <AdvanceFilter /> */}
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
                {searchDataAll.statement?.length ? (
                  <div>
                    {isReview || asof == "bydate" ? (
                      <div>
                        {selectedStatementFromAdvanceFilterAlgorithm?.length ? (
                          <ul>
                            {displayList?.map((x) => {
                              const jsonData = JSON.parse(
                                x.breadcrumb
                              ) as Array<any>;
                              const parsedData = jsonData?.reduce(
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
                                <li
                                  className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0"
                                  key={x.id}
                                >
                                  <div className="flex justify-between items-center">
                                    <a
                                      href={`/${jsonData?.[0]?.[1]?.camp_link}`}
                                    >
                                      <h3 className="font-medium mb-2 text-canBlack text-base">
                                        {jsonData?.length > 1
                                          ? getHighlightedText2(
                                              jsonData?.[0]?.[1]?.camp_name,
                                              searchValue
                                            )
                                          : getHighlightedText2(
                                              jsonData?.[0]?.[1]?.topic_name,
                                              searchValue
                                            )}
                                      </h3>
                                    </a>
                                    <ArrowLink
                                      campLink={jsonData?.[0]?.[1]?.camp_link}
                                    />
                                  </div>

                                  {/* <div className={styles.statement_date}>
                                      <strong>Go live Time : </strong>
                                      {covertToTime(x.go_live_time)}
                                    </div> */}
                                  <div className="d-flex flex-wrap w-100 mb-1">
                                    {/* <div
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            x.type_value.substring(
                                              0,
                                              fileNameLength
                                            ) + "...",
                                        }}
                                      ></div> */}
                                    {getHighlightedText(
                                      x.type_value.substring(
                                        0,
                                        fileNameLength
                                      ) + "...",
                                      searchValue
                                    )}
                                  </div>

                                  <div className="text-base  flex flex-wrap items-center gap-2.5">
                                    <div className="flex gap-2.5">
                                      <Image
                                        src="/images/note-sticky.svg"
                                        width={17}
                                        height={19}
                                      />
                                      <span className="text-base font-medium text-canBlack mr-1">
                                        {" "}
                                        Topic:
                                      </span>
                                    </div>
                                    {parsedData
                                      ?.reverse()
                                      ?.map((obj, index) => {
                                        return (
                                          <>
                                            <a
                                              className="text-base !text-canBlue flex items-center gap-2.5 font-medium"
                                              href={`/${obj?.camp_link}`}
                                              key={`/${obj?.camp_link}`}
                                            >
                                              {getHighlightedText2(
                                                obj.camp_name,
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
                              );
                            })}
                          </ul>
                        ) : (
                          <span className="italic text-canLight">
                            There is no data to show in this category.
                          </span>
                        )}
                      </div>
                    ) : (
                      <ul>
                        {searchDataAll?.statement.map((x) => {
                          const jsonData = JSON.parse(
                            x.breadcrumb_data
                          ) as Array<any>;
                          const parsedData = jsonData?.reduce(
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
                            <li
                              className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0"
                              key={x.id}
                            >
                              <div className="flex justify-between items-center">
                                <a href={`/${jsonData?.[0]?.[1]?.camp_link}`}>
                                  <h3 className="font-medium mb-2 text-canBlack text-base">
                                    {jsonData?.length > 1
                                      ? getHighlightedText2(
                                          jsonData?.[0]?.[1]?.camp_name,
                                          searchValue
                                        )
                                      : getHighlightedText2(
                                          jsonData?.[0]?.[1]?.topic_name,
                                          searchValue
                                        )}
                                  </h3>
                                </a>
                                <ArrowLink
                                  campLink={jsonData?.[0]?.[1]?.camp_link}
                                />
                              </div>

                              {/* <div className={styles.statement_date}>
                                <strong>Go live Time : </strong>
                                {covertToTime(x.go_live_time)}
                              </div> */}
                              <div className="d-flex flex-wrap w-100 mb-1">
                                {/* <a className={styles.search_heading}>  */}
                                {/* <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        x.type_value.substring(
                                          0,
                                          fileNameLength
                                        ) + "...",
                                    }}
                                  ></div> */}
                                <div>
                                  {getHighlightedText(
                                    x.type_value.substring(0, fileNameLength) +
                                      "...",
                                    searchValue
                                  )}
                                </div>
                              </div>
                              <div className="text-base  flex flex-wrap items-center gap-2.5">
                                <div className="flex gap-2.5">
                                  <Image
                                    src="/images/note-sticky.svg"
                                    width={17}
                                    height={19}
                                  />
                                  <span className="text-base font-medium text-canBlack mr-1">
                                    {" "}
                                    Topic:
                                  </span>
                                </div>
                                {parsedData?.reverse()?.map((obj, index) => {
                                  return (
                                    <>
                                      <a
                                        className="text-base !text-canBlue flex items-center gap-2.5 font-medium"
                                        href={`/${obj?.camp_link}`}
                                        key={`/${obj?.camp_link}`}
                                      >
                                        {getHighlightedText2(
                                          obj.camp_name,
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
                asof == "review" || asof == "bydate"
                  ? selectedStatementFromAdvanceFilterAlgorithm?.length
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

export default CampStatementSearch;
