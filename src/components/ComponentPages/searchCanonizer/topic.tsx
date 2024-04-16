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

const TopicSearch = () => {
  const { searchDataAll,searchData } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
    searchData: state?.searchSlice?.searchData,
  }));
  const { searchMetaData } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
  }));

  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));
  const [currentPage, setCurrentPage] = useState(1);
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
    // Replace each special character with a series of hyphens
    // return link.replace(/[-\\^$*+?.()|%#|[\]{}]/g, "-");
    return link.replace(/[-\\^$*+?.()|%#|[\]{}@]/g, "-");
}
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
              {searchDataAll.topic?.length ? (
                <div>
                  <ul>
                    {searchDataAll.topic.map((x) => {
                      return (
                        <>
                          <li>
                            <Link href={`/${replaceSpecialCharactersInLink(x?.link)}`}>
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
                </div>
              ) : (
                showEmpty("No Data Found")
              )}
            </div>
          )}
          <Pagination
            hideOnSinglePage={true}
            total={searchMetaData.total}
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
