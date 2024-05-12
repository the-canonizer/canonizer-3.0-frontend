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
import { useRouter } from "next/router";

const CampSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { searchDataAll } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
  }));
  const { searchMetaData } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
  }));
  const { loading ,asof,selectedCampFromAdvanceFilterAlgorithm,filterByScore,algorithm} = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
    asof: state.filters?.filterObject?.asof,
    selectedCampFromAdvanceFilterAlgorithm:
        state?.searchSlice?.selectedCampFromAdvanceFilterAlgorithm,
        filterByScore: state.filters?.filterObject?.filterByScore,
        algorithm: state.filters?.filterObject?.algorithm,
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

  const router = useRouter()

  useEffect(() => {
    setIsReview(asof == "review");
  }, [asof]);

  useEffect(() => {
    if(asof == "review" || asof == "bydate" || filterByScore || algorithm !== "blind_popularity"){
    pageChange1(1,20)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampFromAdvanceFilterAlgorithm]);

  const pageChange1 = (pageNumber, pageSize) => {
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setDisplayList(
      selectedCampFromAdvanceFilterAlgorithm?.slice(startingPosition, endingPosition)
    );
  };
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
            <h4 data-testid="camp_heading">Camp</h4>
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
              {searchDataAll.camp?.length ? (
                <div>
                  {router?.query?.algo || router?.query?.score || isReview || asof == "bydate" ?
                  <div>
                  {selectedCampFromAdvanceFilterAlgorithm?.length?<ul>
                    {displayList?.map((x) => {
                      const jsonData = JSON.parse(
                        x.breadcrumb
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
                          <li>
                            <Link href={`/${jsonData[0][1]?.camp_link}`}>
                              <a> {x.camp_name}</a>
                            </Link>
                            <div className={styles.tags_all}>
                              {parsedData.reverse().map((obj, index) => {
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
                  </ul>: showEmpty("No Data Found")}
                  </div>:
                  <ul>
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
                          <li>
                            <Link href={`/${jsonData[0][1]?.camp_link}`}>
                              <a> {x.type_value}</a>
                            </Link>
                            <div className={styles.tags_all}>
                              {parsedData.reverse().map((obj, index) => {
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
            // total={selectedCampFromAdvanceFilterAlgorithm?.length}
            total={asof == "review" || asof == "bydate" || filterByScore || algorithm !== "blind_popularity" ?(selectedCampFromAdvanceFilterAlgorithm?.length):(searchMetaData.total)}
            pageSize={20}
            onChange={asof == "review" || asof == "bydate" || filterByScore || algorithm !== "blind_popularity"?pageChange1:pageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CampSearch;
