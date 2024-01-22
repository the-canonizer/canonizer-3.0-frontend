import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
// import AdvanceFilter from "../../common/AdvanceSearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import Link from "next/link";
import { Empty, Pagination } from "antd";
import { setPageNumber } from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";

const NicknameSearch = () => {
  const { searchDataAll } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
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
  },[searchDataAll?.nickname]);
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
            <h4 data-testid="nickname_heading">Nickname</h4>
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
              {searchDataAll.nickname?.length ? (
                <div>
                  <ul>
                    {searchDataAll.nickname.map((x) => {
                      return (
                        <>
                          <li>
                            <Link href={`${x?.link}`}>
                              <a>
                                <label style={{ cursor: "pointer" }}>
                                  {x?.type_value}
                                </label>
                              </a>
                            </Link>

                            <span className={styles.ml_auto}>
                              Supported camps:{" "}
                              <strong className={styles.yellow_color}>
                                {x.support_count ? x.support_count : 0}
                              </strong>{" "}
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

export default NicknameSearch;
