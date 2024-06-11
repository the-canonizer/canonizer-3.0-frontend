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
import { useRouter } from "next/router";

const CampStatementSearch = () => {
  const { searchDataAll } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
  }));
  const { searchMetaData ,selectedStatementFromAdvanceFilterAlgorithm,asof,filterByScore,algorithm} = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
    selectedStatementFromAdvanceFilterAlgorithm:state?.searchSlice?.selectedStatementFromAdvanceFilterAlgorithm,
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
      selectedStatementFromAdvanceFilterAlgorithm?.slice(startingPosition, endingPosition)
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

  const router = useRouter()

  useEffect(() => {
    setIsReview(asof == "review");
  }, [asof]);
  
  useEffect(() => {
    if(asof == "review" || asof == "bydate" || filterByScore != 0 || algorithm !== "blind_popularity"){
    pageChange1(1,20)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatementFromAdvanceFilterAlgorithm]);
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
            <h4 data-testid="camp_statment_heading">Camp Statement</h4>
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
              {searchDataAll.statement?.length ? (
                <div>
                  {isReview || asof == "bydate"? 
                  <div>
                    {selectedStatementFromAdvanceFilterAlgorithm?.length?<ul>
                    {displayList?.map((x) => {
                      const jsonData = JSON.parse(
                        x.breadcrumb
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
                        <>
                          <li>
                            <a href={`/${jsonData?.[0]?.[1]?.camp_link}`}>
                              <h3 className={styles.statement_heading}>
                                {jsonData?.length > 1
                                  ? jsonData?.[0]?.[1]?.camp_name
                                  : jsonData?.[0]?.[1]?.topic_name}
                              </h3>
                            </a>
                            <div className={styles.statement_date}>
                              <strong>Go live Time : </strong>
                              {covertToTime(x.go_live_time)}
                            </div>
                            <div className="d-flex flex-wrap w-100 mb-1">
                              {/* <a className={styles.search_heading}>  */}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    x.type_value.substring(0, fileNameLength) +
                                    "...",
                                }}
                              ></div>
                            </div>
                            <div className={styles.tags_all}>
                              {parsedData?.reverse()?.map((obj, index) => {
                                return (
                                  <>
                                    <a
                                      href={`/${obj?.camp_link}`}
                                      key={`/${obj?.camp_link}`}
                                    >
                                      {obj.camp_name}
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
                  </ul>:showEmpty("No Data Found")}
                  </div>:
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
                        <>
                          <li>
                            <a href={`/${jsonData?.[0]?.[1]?.camp_link}`}>
                              <h3 className={styles.statement_heading}>
                                {jsonData?.length > 1
                                  ? jsonData?.[0]?.[1]?.camp_name
                                  : jsonData?.[0]?.[1]?.topic_name}
                              </h3>
                            </a>
                            <div className={styles.statement_date}>
                              <strong>Go live Time : </strong>
                              {covertToTime(x.go_live_time)}
                            </div>
                            <div className="d-flex flex-wrap w-100 mb-1">
                              {/* <a className={styles.search_heading}>  */}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    x.type_value.substring(0, fileNameLength) +
                                    "...",
                                }}
                              ></div>
                            </div>
                            <div className={styles.tags_all}>
                              {parsedData?.reverse()?.map((obj, index) => {
                                return (
                                  <>
                                    <a
                                      href={`/${obj?.camp_link}`}
                                      key={`/${obj?.camp_link}`}
                                    >
                                      {obj.camp_name}
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
                  </ul>}
                </div>
              ) : (
                showEmpty("No Data Found")
              )}
            </div>
          )}
          <Pagination
            hideOnSinglePage={true}
            total={asof == "review" || asof == "bydate" ?(selectedStatementFromAdvanceFilterAlgorithm?.length):(searchMetaData.total)}
            pageSize={20}
            onChange={asof == "review" || asof == "bydate"?pageChange1:pageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CampStatementSearch;
