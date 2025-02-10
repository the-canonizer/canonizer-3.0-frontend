import React, { Fragment } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import { Empty } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import moment from "moment";
import CustomSkelton from "../../common/customSkelton";
import Image from "next/image";
import AdvanceFilter from "components/common/AdvanceSearchFilter";
import { useRouter } from "next/router";

const Search = () => {
  const { searchData, searchDataAll } = useSelector((state: RootState) => ({
    searchData: state?.searchSlice?.searchData,
    searchDataAll: state?.searchSlice?.searchDataAll,
  }));
  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));
  let { searchValue } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
  }));
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };
  function replaceSpecialCharactersInLink(link) {
    return link.replace(/[-\\^$*+?.()|%#|[\]{}@]/g, "-");
  }
  const getHighlightedText = (text, highlight) => {
    const escapedHighlight = highlight.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    );

    // Create a regular expression using the escaped highlight
    const parts = text?.split(new RegExp(`(${escapedHighlight})`, "gi"));
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
        id="auto_search_section"
      >
        <div className="flex  items-center  " id="auto_search_section_sub">
          <div
            className="flex items-center gap-2.5"
            id="auto_search_section_img_div"
          >
            <Image
              id="auto_search_section_img"
              src="/images/recent-activiity-arrow.svg"
              width={16}
              height={24}
            />

            <h3
              className="lg:text-3xl text-xl   text-canBlack font-medium"
              id="auto_search_section_placeholder"
            >
              Search Results for “
              <span className="text-canBlue capitalize break-all whitespace-break-spaces">
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
        id="auto_search_section_sidebar"
      >
        <aside
          className="leftSideBar miniSideBar"
          id="auto_search_section_left_sidebar"
        >
          <div
            className="leftSideBar_Card p-0 m-0"
            id="auto_search_section_left_sidebar_card"
          >
            <SearchSideBar />
          </div>
        </aside>
        <div className="pageContentWrap flex-1" id="auto_search_section_loader">
          {loading ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={10}
              stylingClass="listSkeleton"
              isButton={false}
            />
          ) : (
            <div className={styles.card} id="auto_search_section_topic_text">
              {searchData?.topic?.length ||
              searchData?.camp?.length ||
              searchData?.statement?.length ||
              searchData?.nickname?.length ? (
                <div id="auto_search_section_topic">
                  {searchData?.topic?.length > 0 ? (
                    <div className="bg-canGray lg:py-5 lg:px-8 py-4 px-4 rounded-xl mb-5">
                      <h4
                        data-testid="all_topic_heading "
                        className="!mb-6 !text-base !font-semibold !text-canBlack"
                        id="auto_search_section_topic_h4"
                      >
                        Topic
                      </h4>

                      <ul
                        className="first:p-0 "
                        id="auto_search_section_topic_ul"
                      >
                        {searchData?.topic?.slice(0, 5)?.map((x) => {
                          return (
                            <>
                              <li
                                className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none "
                                id="auto_search_section_topic_li"
                              >
                                <Link
                                  href={replaceSpecialCharactersInLink(x?.link)}
                                >
                                  <div
                                    className="flex justify-between items-center"
                                    id="auto_search_section_topic_type_value"
                                  >
                                    <a id="auto_search_section_topic_type_value_link">
                                      <label
                                        style={{ cursor: "pointer" }}
                                        className="text-base font-medium text-canBlack flex !mb-2"
                                        id="auto_search_section_topic_type_value_lable"
                                      >
                                        {getHighlightedText(
                                          x.type_value,
                                          searchValue
                                        )}
                                      </label>
                                    </a>
                                    <a
                                      href={replaceSpecialCharactersInLink(
                                        x?.link
                                      )}
                                    >
                                      <Image
                                        id="auto_search_section_topic_arrow_img"
                                        src="/images/search-page-arrow.svg"
                                        width={16}
                                        height={10}
                                        alt={"check"}
                                      />
                                    </a>
                                  </div>
                                </Link>

                                <div
                                  className="text-base text-canBlue flex items-center gap-2.5"
                                  id="auto_search_section_topic_canon"
                                >
                                  <Image
                                    id="auto_search_section_topic_canon_img"
                                    src="/images/flagicon.svg"
                                    width={18}
                                    height={20}
                                  />
                                  <span
                                    className="text-base !text-canBlack font-medium"
                                    id="auto_search_section_topic_canon_text"
                                  >
                                    {" "}
                                    Canon:{" "}
                                    <span
                                      className="font-medium !text-canBlue"
                                      id="auto_search_section_topic_canon_value"
                                    >
                                      {" "}
                                      {x.namespace}
                                    </span>
                                  </span>{" "}
                                </div>
                              </li>
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}

                  {searchData?.camp?.length > 0 ? (
                    <div
                      className="bg-canGray lg:py-5 lg:px-8  py-4 px-4 rounded-xl mb-5"
                      id="auto_search_section_camp"
                    >
                      <h4
                        data-testid="all_camp_heading"
                        className="!mb-6 !text-base !font-semibold !text-canBlack"
                        id="auto_search_section_camp_text"
                      >
                        Camp
                      </h4>

                      <ul
                        className="first:p-0"
                        id="auto_search_section_camp_ul"
                      >
                        {searchData?.camp?.slice(0, 5)?.map((x) => {
                          const jsonData = JSON.parse(
                            x.breadcrumb_data
                          ) as Array<any>;
                          const jsonData1 = Array.isArray(jsonData)
                            ? jsonData
                            : [];
                          const parsedData = jsonData1.reduce(
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
                                className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0 "
                                id="auto_search_section_camp_li"
                              >
                                <Link
                                  href={`/${
                                    jsonData?.[0]?.[1]?.camp_link ?? ""
                                  }`}
                                >
                                  <div
                                    className="flex justify-between items-center"
                                    id="auto_search_section_camp_li_list"
                                  >
                                    <a
                                      className="text-base font-medium text-canBlack flex !mb-2"
                                      id="auto_search_section_camp_value_link"
                                    >
                                      {" "}
                                      {getHighlightedText(
                                        x.type_value,
                                        searchValue
                                      )}
                                    </a>
                                    <a
                                      href={`/${
                                        jsonData?.[0]?.[1]?.camp_link ?? "#"
                                      }`}
                                      id="auto_search_section_camp_sub_camp_link"
                                    >
                                      <Image
                                        id="auto_search_section_camp_img"
                                        src="/images/search-page-arrow.svg"
                                        width={16}
                                        height={10}
                                        alt={"check"}
                                      />
                                    </a>
                                  </div>
                                </Link>
                                <div
                                  className="flex flex-wrap "
                                  id="auto_search_section_camp_topic"
                                >
                                  <div
                                    className="flex gap-2.5"
                                    id="auto_search_section_camp_topic_links"
                                  >
                                    <Image
                                      id="auto_search_section_camp_topic_img"
                                      src="/images/note-sticky.svg"
                                      width={17}
                                      height={19}
                                    />
                                    <span
                                      className="text-base font-medium text-canBlack mr-1"
                                      id="auto_search_section_camp_topic_text"
                                    >
                                      {" "}
                                      Topic:
                                    </span>
                                  </div>

                                  {parsedData.reverse().map((obj, index) => {
                                    return (
                                      <>
                                        <a
                                          className="text-base text-canBlue flex items-center gap-2.5"
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
                    ""
                  )}

                  {searchData.statement?.length > 0 ? (
                    <div
                      className="bg-canGray lg:py-5 lg:px-8  py-4 px-4 rounded-xl mb-5"
                      id="auto_search_section_camp_statment"
                    >
                      <h4
                        data-testid="all_camp_statement_heading"
                        className="!mb-6 !text-base !font-semibold !text-canBlack"
                        id="auto_search_section_camp_statment_text"
                      >
                        Camp Statement
                      </h4>

                      <ul
                        className="first:p-0"
                        id="auto_search_section_camp_statment_ul"
                      >
                        {searchData?.statement?.slice(0, 5)?.map((x) => {
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
                              };
                              return accumulator;
                            },
                            []
                          );
                          return (
                            <>
                              <li
                                className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none last:pb-0 "
                                id="auto_search_section_camp_statment_li"
                              >
                                <div className="flex justify-between items-center">
                                  <a href={jsonData?.[0]?.[1]?.camp_link}>
                                    <h3
                                      className="font-medium mb-2 text-canBlack text-base"
                                      id="auto_search_section_camp_statment_heading"
                                    >
                                      {jsonData?.length > 1
                                        ? getHighlightedText(
                                            jsonData?.[0]?.[1]?.camp_name,
                                            searchValue
                                          )
                                        : getHighlightedText(
                                            jsonData?.[0]?.[1]?.topic_name,
                                            searchValue
                                          )}
                                    </h3>
                                  </a>
                                  <a
                                    href={jsonData?.[0]?.[1]?.camp_link}
                                    id="auto_search_section_camp_statment_heading_link"
                                  >
                                    <Image
                                      id="auto_search_section_camp_statment_img"
                                      src="/images/search-page-arrow.svg"
                                      width={16}
                                      height={10}
                                      alt={"check"}
                                    />
                                  </a>
                                </div>

                                {/* <div className={styles.statement_date}>
                                <strong>Go live Time : </strong>
                                {covertToTime(x.go_live_time)}
                              </div> */}
                                <div
                                  className="d-flex flex-wrap w-100 mb-1"
                                  id="auto_search_section_camp_statment_parse_value"
                                >
                                  {/* <a className={styles.search_heading}>  */}

                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        x.type_value.substring(0, 800) + "...",
                                    }}
                                  ></div>
                                </div>
                                <div
                                  className="flex flex-wrap gap-2.5 gap-y-1.5"
                                  id="auto_search_section_camp_statment_topic_img_div"
                                >
                                  <Image
                                    id="auto_search_section_camp_statment_topic_img"
                                    src="/images/note-sticky.svg"
                                    width={17}
                                    height={19}
                                  />
                                  <span
                                    className="text-base font-medium text-canBlack mr-1"
                                    id="auto_search_section_camp_statment_topic_text"
                                  >
                                    {" "}
                                    Topic:
                                  </span>

                                  {parsedData?.reverse().map((obj, index) => {
                                    return (
                                      <>
                                        <a
                                          className="text-base text-canBlue flex items-center gap-2.5"
                                          href={obj?.camp_link}
                                          key={obj?.camp_link}
                                          id="auto_search_section_camp_statment_topic_link"
                                        >
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
                    </div>
                  ) : (
                    ""
                  )}

                  {searchData.nickname?.length > 0 ? (
                    <div
                      className="bg-canGray lg:py-5 lg:px-8  py-4 px-4 rounded-xl mb-5"
                      id="auto_search_section_nickname"
                    >
                      <h4
                        data-testid="all_nick_name_heading"
                        className="!mb-6 !text-base !font-semibold !text-canBlack"
                        id="auto_search_section_nickname_text"
                      >
                        Nickname
                      </h4>

                      <ul id="auto_search_section_nickname_ul">
                        {searchData?.nickname?.slice(0, 5)?.map((x) => {
                          return (
                            <>
                              <li
                                className="text-sm font-medium bg-white w-full px-5 py-2 rounded-xl mb-2 flex justify-between"
                                id="auto_search_section_nickname_li"
                              >
                                <Link href={x.link}>
                                  <a
                                    className="flex gap-2.5"
                                    id="auto_search_section_nickname_link"
                                  >
                                    <Image
                                      id="auto_search_section_nickname_img"
                                      src="/images/nickname-user-icon.svg"
                                      width={14}
                                      height={16}
                                    />
                                    <label
                                      id="auto_search_section_nickname_value"
                                      style={{ cursor: "pointer" }}
                                      className="font-medium text-base"
                                    >
                                      {getHighlightedText(
                                        x.type_value,
                                        searchValue
                                      )}
                                    </label>
                                  </a>
                                </Link>

                                <span
                                  className="font-normal text-base"
                                  id="auto_search_section_nickname_supported_camps"
                                >
                                  Supported camps:{" "}
                                  <strong
                                    className="text-canOrange font-semibold text-base"
                                    id="auto_search_section_nickname_count"
                                  >
                                    {x.support_count == ""
                                      ? 0
                                      : x.support_count}
                                  </strong>{" "}
                                </span>
                              </li>
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <span
                  className="italic text-canLight"
                  id="auto_search_section_empty_data"
                >
                  There is no data to show in this category.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Search;
