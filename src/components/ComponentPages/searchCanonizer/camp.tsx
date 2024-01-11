import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
// import AdvanceFilter from "../../common/AdvanceSearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { Empty, Pagination } from "antd";
import Link from "next/link";
import { setPageNumber } from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";

const CampSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { searchDataAll } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
  }));
  const { searchMetaData } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
  }));
  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));
  const dispatch = useDispatch();
  const pageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch(setPageNumber(pageNumber));
  };
  useEffect(() => {
    pageChange(currentPage);
  },[searchDataAll?.camp]);
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
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
            {/* <AdvanceFilter/> */}
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
                  </ul>
                </div>
              ) : (
                showEmpty("No Data Found")
              )}
            </div>
          )}

          <Pagination
            hideOnSinglePage={true}
            total={searchMetaData?.total}
            pageSize={20}
            onChange={pageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CampSearch;
