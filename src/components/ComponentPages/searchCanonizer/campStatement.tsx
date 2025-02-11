import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { Pagination } from "antd";
import { setPageNumber } from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";
import Image from "next/image";
import { useRouter } from "next/router";
import AdvanceSearchHeader from "./AdvanceSearchHeader";

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
    selectedCampStatementFromAdvanceFilterAlgorithmRecords,
    pageNumber,
  } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
    selectedStatementFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedStatementFromAdvanceFilterAlgorithm,
    asof: state.filters?.filterObject?.asof,
    filterByScore: state.filters?.filterObject?.filterByScore,
    algorithm: state.filters?.filterObject?.algorithm,
    selectedCampStatementFromAdvanceFilterAlgorithmRecords:
      state?.searchSlice
        ?.selectedCampStatementFromAdvanceFilterAlgorithmRecords,
    pageNumber: state?.searchSlice?.pageNumber,
  }));
  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const [isReview, setIsReview] = useState(asof == "review");
  const [displayList, setDisplayList] = useState([]);
  const fileNameLength = 800;
  const router = useRouter();
  const dispatch = useDispatch();

  const pageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch(setPageNumber(pageNumber));
  };

  const pageChange1 = (pageNumber, pageSize) => {
    setDisplayList(selectedStatementFromAdvanceFilterAlgorithm);
    dispatch(setPageNumber(pageNumber));
  };

  useEffect(() => {
    pageChange(currentPage);
  }, [searchDataAll?.statement]);

  useEffect(() => {
    setIsReview(asof == "review");
  }, [asof]);

  useEffect(() => {
    if (
      asof == "review" ||
      asof == "bydate" 
    ) {
      pageChange1(pageNumber, 20);
    }
  }, [selectedStatementFromAdvanceFilterAlgorithm]);

  const getHighlightedText = (text, highlight) => {
    if (!text || !highlight) return text;
    const escapedHighlight = highlight.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    );
    // Create a regular expression using the escaped highlight
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    return text.replace(regex, (match) => `<strong>${match}</strong>`);
  };

  const getHighlightedText2 = (text, highlight) => {
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

  const StatementList = ({ statements, router, fileNameLength }) => {
    if (!statements?.length) {
      return <span className="italic text-canLight">There is no data to show in this category.</span>;
    }
  
    return (
      <ul id="advance_search_section_camp_statement_search_all_ul">
        {statements.map((x) => {
          const jsonData = JSON.parse(x.breadcrumb_data) || [];
          const parsedData = jsonData?.reduce((acc, currentVal, index) => {
            const accIndex = index + 1;
            acc[index] = {
              camp_name:
                currentVal[accIndex]?.camp_name === "Agreement"
                  ? currentVal[accIndex]?.topic_name
                  : currentVal[accIndex]?.camp_name,
              camp_link: currentVal[accIndex]?.camp_link,
              topic_name: currentVal[accIndex]?.topic_name,
            };
            return acc;
          }, []);
  
          return (
            <li className="flex flex-col py-3 border-b border-canGrey2 last:border-none last:pb-0" key={x.id}>
              <div className="flex justify-between items-center">
                <a href={`/${jsonData?.[0]?.[1]?.camp_link}`}>
                  <h3 className="font-medium mb-2 text-canBlack text-base">
                    {jsonData?.length > 1
                      ? getHighlightedText2(jsonData?.[0]?.[1]?.camp_name, router?.query?.q)
                      : getHighlightedText2(jsonData?.[0]?.[1]?.topic_name, router?.query?.q)}
                  </h3>
                </a>
                <ArrowLink campLink={jsonData?.[0]?.[1]?.camp_link} />
              </div>
              <div className="d-flex flex-wrap w-100 mb-1">
                <div
                  dangerouslySetInnerHTML={{
                    __html: getHighlightedText(x.type_value.substring(0, fileNameLength) + "...", router?.query?.q),
                  }}
                ></div>
              </div>
              <div className="text-base flex flex-wrap items-center gap-2.5">
                <div className="flex gap-2.5">
                  <Image src="/images/note-sticky.svg" width={17} height={19} />
                  <span className="text-base font-medium text-canBlack mr-1"> Topic: </span>
                </div>
                {parsedData?.reverse()?.map((obj, index) => (
                  <a className="text-base !text-canBlue flex items-center gap-2.5 font-medium" href={`/${obj?.camp_link}`} key={`/${obj?.camp_link}`}>
                    {getHighlightedText2(obj.camp_name, router?.query?.q)}
                    {index < parsedData.length - 1 ? " / " : ""}
                  </a>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };
  return (
    <Fragment>
      <AdvanceSearchHeader
        sectionId="search_section_camp_statement_heading"
        subSectionId="search_section_camp_statement_heading_1"
        headingId="search_section_camp_statement_heading_2"
        imgId="search_section_camp_statement_img"
        headingTextId="search_section_camp_statement_text"
      />
      <div className="flex lg:flex-row flex-col gap-10" id="search_section_camp_statement_text_sidebar">
        <aside className="leftSideBar miniSideBar" id="search_section_camp_statement_text_sidebar_1">
          <div className="leftSideBar_Card p-0 m-0" id="search_section_camp_statement_text_sidebar_2">
            <SearchSideBar />
          </div>
        </aside>
        <div className="pageContentWrap flex-1" id="search_section_camp_statement_header">
          <div className="bg-canGray lg:py-5 lg:px-8 py-4 px-4 rounded-xl mb-5" id="search_section_camp_statement_header_1">
            <div className="d-flex mb-2 align-items-center flex-wrap relative" id="search_section_camp_statement_header_2">
              <h4 data-testid="camp_statment_heading" className="!mb-6 !text-base !font-semibold !text-canBlack" id="search_section_camp_statement_header_text">
                Camp Statement(S)
              </h4>
            </div>
            {loading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={10}
                stylingClass="listSkeleton"
                isButton={false}
                id="search_section_camp_statement_loader"
              />
            ) : (
              <div className={styles.search_lists} id="search_section_camp_statement_search_all">
              {searchDataAll.statement?.length ? (
                <StatementList
                  statements={isReview || asof === "bydate" ? selectedStatementFromAdvanceFilterAlgorithm : searchDataAll.statement}
                  router={router}
                  fileNameLength={fileNameLength}
                />
              ) : (
                <span className="italic text-canLight">There is no data to show in this category.</span>
              )}
            </div>
            )}
            <Pagination
              current={pageNumber}
              className="mt-5 [&_.ant-pagination-item]:!mr-1 lg:[&_.ant-pagination-item]:!mr-2"
              hideOnSinglePage={true}
              total={
                asof == "review" || asof == "bydate"
                  ? selectedCampStatementFromAdvanceFilterAlgorithmRecords
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
