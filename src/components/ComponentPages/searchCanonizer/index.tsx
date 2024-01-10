import React, { Fragment } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import { Empty, List, Tag } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import moment from "moment";
import CustomSkelton from "../../common/customSkelton";

const Search = () => {
  const { searchData } = useSelector((state: RootState) => ({
    searchData: state?.searchSlice?.searchData,
  }));
  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
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
        {loading ? (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={10}
            stylingClass="listSkeleton"
            isButton={false}
          />
        ) : (
          <div className={styles.card}>
            {searchData?.topic?.length ||
            searchData?.camp?.length ||
            searchData?.statement?.length ||
            searchData?.nickname?.length ? (
              <div>
                {searchData?.topic?.length > 0 ? (
                  <h4 data-testid="all_topic_heading">Topic</h4>
                ) : (
                  ""
                )}
                <div className={styles.search_lists}>
                  <ul>
                    {searchData?.topic?.slice(0, 5).map((x) => {
                      return (
                        <>
                          <li>
                            <Link href={x.link}>
                              <a>
                                <label style={{ cursor: "pointer" }}>
                                  {x.type_value}
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
                {searchData.camp?.length > 0 ? (
                  <h4 data-testid="all_camp_heading">Camp</h4>
                ) : (
                  ""
                )}
                <div className={styles.search_lists}>
                  <ul>
                    {searchData?.camp?.slice(0, 5).map((x) => {
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

                {searchData.statement?.length > 0 ? (
                  <h4 data-testid="all_camp_statement_heading">
                    Camp Statement
                  </h4>
                ) : (
                  ""
                )}
                <div className={styles.search_lists}>
                  <ul>
                    {searchData?.statement?.slice(0, 5).map((x) => {
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
                          };
                          return accumulator;
                        },
                        []
                      );
                      return (
                        <>
                          <li>
                            <a href={jsonData[0][1]?.camp_link}>
                              <h3 className={styles.statement_heading}>
                                {jsonData.length > 1
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
                                    x.type_value.substring(0, 800) + "...",
                                }}
                              ></div>
                            </div>
                            <div className={styles.tags_all}>
                              {parsedData.reverse().map((obj, index) => {
                                return (
                                  <>
                                    <a
                                      href={obj?.camp_link}
                                      key={obj?.camp_link}
                                    >
                                      {obj?.camp_name}
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

                {searchData.nickname?.length > 0 ? (
                  <h4 data-testid="all_nick_name_heading">Nickname</h4>
                ) : (
                  ""
                )}
                <div className={styles.search_lists}>
                  <ul>
                    {searchData?.nickname?.slice(0, 5).map((x) => {
                      return (
                        <>
                          <li>
                            <Link href={x.link}>
                              <a>
                                <label style={{ cursor: "pointer" }}>
                                  {x.type_value}
                                </label>
                              </a>
                            </Link>

                            <span className={styles.ml_auto}>
                              Supported camps:{" "}
                              <strong className={styles.yellow_color}>
                                {x.support_count}
                              </strong>{" "}
                            </span>
                          </li>
                        </>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : (
              showEmpty("No Data Found ")
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Search;
