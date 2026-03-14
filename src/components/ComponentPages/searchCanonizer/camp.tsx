import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { Empty, Pagination } from "antd";
import Link from "next/link";
import { setPageNumber } from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";
import Image from "next/image";
import AdvanceSearchHeader from "./AdvanceSearchHeader";

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
    selectedCampFromAdvanceFilterAlgorithmRecords,
    pageNumber,
  } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
    asof: state.filters?.filterObject?.asof,
    selectedCampFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedCampFromAdvanceFilterAlgorithm,
    filterByScore: state.filters?.filterObject?.filterByScore,
    algorithm: state.filters?.filterObject?.algorithm,
    loading: state?.loading?.searchLoading,
    selectedCampFromAdvanceFilterAlgorithmRecords:
      state?.searchSlice?.selectedCampFromAdvanceFilterAlgorithmRecords,
    pageNumber: state?.searchSlice?.pageNumber,
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
  }, [searchDataAll?.camp]);

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
      pageChange1(pageNumber, 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampFromAdvanceFilterAlgorithm]);

  const pageChange1 = (pageNumber, pageSize) => {
    //setDisplayList(selectedCampFromAdvanceFilterAlgorithm);
    dispatch(setPageNumber(pageNumber));
  };

  const getHighlightedText = (text = "", highlight = "") => {
    if (!text || !highlight) return text; // If no text or highlight, return the original text.

    // Escape special characters in the highlight for regex
    const escapedHighlight = highlight.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    );
    // Create a regular expression with the escaped highlight (case-insensitive)
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    // Split the text using the regex pattern
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          // If the part matches the highlight, wrap it in a <mark> tag (can be styled with CSS)
          regex.test(part) ? (
            <mark key={i} className="highlighted-text">
              {part}
            </mark>
          ) : (
            // Otherwise, return the part as regular text
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const parseBreadcrumbData = (breadcrumbData: string) => {
    const jsonData = JSON.parse(breadcrumbData) as Array<any>;
    const parsedDataArray = Array.isArray(jsonData) ? jsonData : [];
    return parsedDataArray.reduce((accumulator, currentVal, index) => {
      const accIndex = index + 1;
      accumulator[index] = {
        camp_name:
          currentVal[accIndex]?.camp_name === "Agreement"
            ? currentVal[accIndex]?.topic_name
            : currentVal[accIndex]?.camp_name,
        camp_link: currentVal[accIndex]?.camp_link,
        topic_name: currentVal[accIndex]?.topic_name,
      };
      return accumulator;
    }, []);
  };

  const CampList = ({ campData, searchValue }) => (
    <ul id="search_camp_section_list">
      {campData.map((x) => {
        const parsedData = parseBreadcrumbData(x.breadcrumb_data);
        return (
          <li
            className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none"
            key={x.type_value}
          >
            <Link href={`/${parsedData?.[0]?.camp_link ?? "#"}`}>
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-canBlack flex !mb-2 break-words overflow-hidden">
                  {getHighlightedText(x?.type_value, searchValue)}
                </span>
                <Image
                  src="/images/search-page-arrow.svg"
                  width={16}
                  height={10}
                  alt="check"
                  className="cursor-pointer"
                />
              </div>
            </Link>
            <div className="text-base flex flex-wrap items-center gap-2.5">
              <div className="flex gap-2.5">
                <Image src="/images/note-sticky.svg" width={17} height={19} />
                <span className="text-base font-medium text-canBlack mr-1">
                  Topic:
                </span>
              </div>
              {parsedData.reverse().map((obj, index) => (
                <a
                  className="text-base text-canBlue flex items-center gap-2.5 font-medium break-words overflow-hidden"
                  href={`/${obj?.camp_link}`}
                  key={obj?.camp_link}
                >
                  {getHighlightedText(obj?.camp_name, searchValue)}
                  {index < parsedData.length - 1 ? "/ " : ""}
                </a>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Fragment>
      <AdvanceSearchHeader
        sectionId="search_camp_section"
        subSectionId="search_camp_section_sub"
        headingId="search_camp_section_heading"
        imgId="search_camp_section_heading_img"
        headingTextId="search_camp_section_heading_text"
      />
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
              <div className={styles.search_lists}>
                {searchDataAll.camp?.length ? (
                  isReview || asof == "bydate" ? (
                    selectedCampFromAdvanceFilterAlgorithm?.length ? (
                      <CampList
                        campData={selectedCampFromAdvanceFilterAlgorithm}
                        searchValue={searchValue}
                      />
                    ) : (
                      <span className="italic text-canLight">
                        There is no data to show in this category.
                      </span>
                    )
                  ) : (
                    <CampList
                      campData={searchDataAll.camp}
                      searchValue={searchValue}
                    />
                  )
                ) : (
                  <span className="italic text-canLight">
                    There is no data to show in this category.
                  </span>
                )}
              </div>
            )}

            <Pagination
              current={pageNumber}
              className="mt-5 [&_.ant-pagination-item]:!mr-1 lg:[&_.ant-pagination-item]:!mr-2"
              hideOnSinglePage={true}
              total={
                asof == "review" || asof == "bydate"
                  ? selectedCampFromAdvanceFilterAlgorithmRecords
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
