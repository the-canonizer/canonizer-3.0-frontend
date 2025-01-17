import React, { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { AutoComplete, Card, Empty, List, Popover, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Image from "next/image";

import type { TabsProps } from "antd";

import styles from "./search.module.scss";

import { RootState } from "src/store";
import queryParams from "src/utils/queryParams";
import { globalSearchCanonizer } from "src/network/api/userApi";
import {
  setSearchData,
  setSearchMetaData,
  setSearchValue,
  setSearchDataAll,
  setOpenSearchForMobileView,
  setSearchCountForMetaData,
} from "src/store/slices/searchSlice";
import CustomSkelton from "../../customSkelton";
import { setSearchLoadingAction } from "src/store/slices/loading";
import SearchInputs from "components/shared/FormInputs/search";
import CustomTabs from "components/shared/Tabs";

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
              ? { fontWeight: "bold" }
              : {}
          }
        >
          {part}
        </span>
      ))}{" "}
    </span>
  );
};

const getHighlightedTextForCampStatement = (text, highlight) => {
  const escapedHighlight = highlight.replace(
    /[-[\]{}()*+?.,\\^$|#\s]/g,
    "\\$&"
  );

  // Create a regular expression using the escaped highlight
  const parts = text?.split(new RegExp(`(${escapedHighlight})`, "gi"));
  return (
    <>
      {parts?.map((part, i) => (
        <div
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: "bold" }
              : {}
          }
        >
          <div className="" dangerouslySetInnerHTML={{ __html: part }}></div>
        </div>
      ))}{" "}
    </>
  );
};

function replaceSpecialCharactersInLink(link) {
  return link.replace(/[-\\^$*+?.()|%#|[\]{}@]/g, "-");
}

const renderItem = (title: any) => ({
  value: title,
  label: <div className="titleDiv ">{title}</div>,
});

const advanceSearchValueLength = 100;

const HeaderSearch = ({ className = "" }: any) => {
  const router = useRouter(),
    dispatch = useDispatch();

  let { searchValue, pageNumber, openSearchForMobileView } = useSelector(
    (state: RootState) => ({
      searchValue: state?.searchSlice?.searchValue,
      pageNumber: state?.searchSlice?.pageNumber,
      openSearchForMobileView: state?.searchSlice?.openSearchForMobileView,
    })
  );

  const [inputSearch, setInputSearch] = useState("");
  const [searchTopics, setSearchTopics] = useState([]);
  const [searchCamps, setSearchCamps] = useState([]);
  const [searchCampStatement, setSearchCampStatement] = useState([]);
  const [searchNickname, setSearchNickname] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [loadingSekelton, setLoadingSekelton] = useState(true);
  const [isActiveTagHaveData, setIsActiveTagHaveData] = useState(true);

  useEffect(() => {
    const { q } = router.query; // Extract the query parameter from the URL

    if (typeof q === "string") {
      // Check if q is a string
      // If 'q' is present, format and set the search value, then call the search function
      const formattedSearchValue = q.split("+").join(" ").replace(/%20/g, " ");
      setSearchVal(formattedSearchValue); // Update the local search value state
      dispatch(setSearchValue(formattedSearchValue)); // Dispatch the search value to Redux
      getGlobalSearchCanonizer(formattedSearchValue, true); // Call the search function
    } else {
      // If 'q' is not present or not a string, clear the search value
      setSearchVal("");
      dispatch(setSearchValue("")); // Optionally clear the dispatched search value
    }
  }, [router.query.q]);

  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All Results",
      children: (
        <AllItems
          searchValue={searchValue}
          searchTopics={searchTopics}
          searchCamps={searchCamps}
          searchCampStatement={searchCampStatement}
          searchNickname={searchNickname}
        />
      ),
    },
    {
      key: "2",
      label: "Topics",
      children: (
        <TopicItems searchTopics={searchTopics} searchValue={searchValue} />
      ),
    },
    {
      key: "3",
      label: "Camps",
      children: (
        <CampItems searchCamps={searchCamps} searchValue={searchValue} />
      ),
    },
    {
      key: "4",
      label: "Camp Statement",
      children: (
        <CampStatementsItems
          searchValue={searchValue}
          searchCampStatement={searchCampStatement}
        />
      ),
    },
    {
      key: "5",
      label: "Nicknames",
      children: (
        <NickNamesItems
          searchValue={searchValue}
          searchNickname={searchNickname}
        />
      ),
    },
  ];

  const handleSearchfor = () => {
    setInputSearch("");
    setSearchVal("");
    getGlobalSearchCanonizer(searchValue, true);
  };

  const options = [
    {
      label: "",
      options: [
        renderItem(
          <CustomTabs
            defaultActiveKey="1"
            items={items}
            className="text-sm font-normal font-inter"
            onChange={(tabId) => {
              if (tabId == 2 && searchTopics?.length === 0) {
                setIsActiveTagHaveData(false);
              } else if (tabId == 3 && searchCamps?.length === 0) {
                setIsActiveTagHaveData(false);
              } else if (tabId == 4 && searchCampStatement?.length === 0) {
                setIsActiveTagHaveData(false);
              } else if (tabId == 5 && searchNickname?.length === 0) {
                setIsActiveTagHaveData(false);
              } else {
                setIsActiveTagHaveData(true);
              }
            }}
          />
        ),
      ],
    },
    {
      label: "",
      options: [
        renderItem(
          <FooterItems
            searchValue={searchValue}
            handleSearchfor={handleSearchfor}
          />
        ),
      ],
    },
  ];

  const no = [
    {
      options: [
        renderItem(
          showEmpty(
            "No results found. Try searching by using a different keyword."
          )
        ),
      ],
    },
  ];

  const loader = [
    {
      options: [
        renderItem(
          <CustomSkelton
            skeltonFor="search"
            bodyCount={10}
            stylingClass=""
            // isButton={false}
          />
        ),
      ],
    },
  ];

  const [preventInitialRender, setPreventInitialRender] = useState(true);

  useEffect(() => {
    if (preventInitialRender && pageNumber !== 1)
      setPreventInitialRender(false);
    else if (
      (inputSearch || searchValue || router?.query?.q) &&
      router.pathname.includes("/search")
    ) {
      getGlobalSearchCanonizerNav(router?.query?.q);
    }
    setPreventInitialRender(false);
    return () => {
      setPreventInitialRender(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, router?.pathname]);

  const getGlobalSearchCanonizerNav = async (queryString) => {
    let queryParamObj: any = {
      term: queryString,
      size: 20,
      page: pageNumber,
    };
    switch (router.pathname) {
      case "/search":
        queryParamObj = {
          term: queryString,
        };
        break;
      case "/search/topic":
        queryParamObj.type = "topic";
        break;
      case "/search/camp":
        queryParamObj.type = "camp";
        break;
      case "/search/camp_statement":
        queryParamObj.type = "statement";
        break;
      case "/search/nickname":
        queryParamObj.type = "nickname";
        break;
      default:
        queryParamObj.type = "all";
        break;
    }
    dispatch(setSearchLoadingAction(true));
    let response = await globalSearchCanonizer(queryParams(queryParamObj));
    if (response) {
      setSearchTopics(response.data.data.topic);
      setSearchCamps(response.data.data.camp);
      setSearchCampStatement(response.data.data.statement);
      setSearchNickname(response.data.data.nickname);

      if (
        router.pathname == "/search/topic" ||
        router.pathname == "/search/camp" ||
        router.pathname == "/search/camp_statement" ||
        router.pathname == "/search/nickname"
      ) {
        dispatch(setSearchMetaData(response?.data?.meta_data));

        dispatch(setSearchDataAll(response?.data?.data));
      }
    }
    dispatch(setSearchLoadingAction(false));
  };

  const getGlobalSearchCanonizer = async (queryString, onPresEnter) => {
    let response = await globalSearchCanonizer(
      queryParams({ term: queryString == undefined ? "" : queryString })
    );
    if (response) {
      setSearchTopics(response.data.data.topic);
      setSearchCamps(response.data.data.camp);
      setSearchCampStatement(response.data.data.statement);
      setSearchNickname(response.data.data.nickname);
      dispatch(setSearchCountForMetaData(response?.data?.meta_data));
      if (onPresEnter) {
        dispatch(setSearchData(response?.data?.data));
        dispatch(setSearchLoadingAction(false));
      }
      setLoadingSekelton(false);
    }
  };

  const handlePress = () => {
    setInputSearch("");
    setSearchVal("");
    router.push({
      pathname: "/search",
      query: { q: searchValue },
    });
  };

  const debounceFn = useMemo(() => debounce(getGlobalSearchCanonizer, 500), []);

  return (
    <Fragment>
      <AutoComplete
        id="desktop-auto-complete"
        popupClassName={`w-full lg:!w-[54rem] bg-white pt-6 rounded-lg [&_.ant-tabs-nav]:mb-10 [&_.ant-tabs-nav-wrap]:px-12  [&_.ant-select-item-option-content]:!bg-white [&_.ant-select-item-option-grouped]:!bg-white [&_.ant-select-item-option-content]:!px-6 [&_>div]:w-full [&_.ant-select-item-option-grouped]:!px-0 [&_.ant-tabs-tab-btn]:!text-base [&_.ant-tabs-nav-list]:gap-12 [&_.ant-tabs-tab-btn]:!font-normal [&_.ant-tabs-tab-active>div]:!font-semibold [&_.ant-tabs-tab]:!ml-0 [&_.ant-tabs-ink-bar]:!border-b-4 [&_.ant-tabs-ink-bar]:!border-canBlue [&_.ant-tabs-ink-bar]:!rounded-tl-full  [&_.ant-tabs-ink-bar]:!rounded-tr-full  lg:[&_.ant-tabs-ink-bar]:!h-1 [&_.ant-tabs-ink-bar]:!h-1 [&_.ant-tabs-tab-active>div]:!shadow-none [&_.ant-card-head-title]:!font-semibold [&_.ant-tabs-nav-list]:!w-full ${
          !isActiveTagHaveData ? "[&_.ftSearchLink]:hidden" : ""
        } ${styles.searchCategories} `}
        dropdownMatchSelectWidth={false}
        options={
          inputSearch == ""
            ? []
            : loadingSekelton
            ? loader
            : searchTopics?.length ||
              searchCamps?.length ||
              searchCampStatement?.length ||
              searchNickname?.length
            ? options
            : no
        }
        value={
          searchVal.length > advanceSearchValueLength
            ? searchVal.substring(0, advanceSearchValueLength)
            : searchVal
        }
        className={`lg:ml-5 transition-all delay-300 [&>div]:!border-0 w-full tab:w-4/12 xl:w-2/5`}
      >
        <div
          id="desktop-search-input"
          className={`items-center !hidden lg:!flex ${className}  `}
        >
          <SearchInputs
            id="desktop-search-input-field"
            placeholder="Search via keyword"
            value={
              searchVal.length > advanceSearchValueLength
                ? searchVal.substring(0, advanceSearchValueLength)
                : searchVal
            }
            className={`${styles.searchInput} text-medium font-medium [&_.ant-input]:!shadow-none [&_.ant-input]:!border-canGrey2 hover:!border-canGrey2 searchInputHeader`}
            name="search"
            onChange={(e) => {
              setLoadingSekelton(true);
              dispatch(setSearchValue(e.target.value));
              setInputSearch(e.target.value);
              setSearchVal(e.target.value);
              debounceFn.cancel();
              if (e?.target?.value) debounceFn(e.target.value, false);
            }}
            onPressEnter={(e) => {
              handlePress();
              if ((e.target as HTMLTextAreaElement).value)
                getGlobalSearchCanonizer(
                  (e.target as HTMLTextAreaElement).value,
                  true
                );
            }}
            onSearch={handlePress}
          />
        </div>
      </AutoComplete>
      <div
        id="mobile-auto-complete-container"
        className=" lg:hidden flex items-center justify-end absolute  py-2"
      >
        <AutoComplete
          id="mobile-auto-complete"
          popupClassName={`[&_.ant-select-item-option-active]:!bg-white !top-26 !shadow-none [&_.ant-select-item-option-grouped]:!px-0 ${
            styles.searchCategories
          } [&_.ant-tabs-nav-list]:!gap-5  [&_.ant-tabs-tab]:m-0 [&_.ant-tabs-tab]:gap-8 w-full [&_.ant-tabs-tab]:px-3 [&_.ant-tabs-nav]:!mb-8 [&_.ant-tabs-tab-btn]:text-base [&_.ant-tabs-tab-btn]:font-normal ${
            !isActiveTagHaveData ? "[&_.ftSearchLink]:hidden" : ""
          }`}
          dropdownMatchSelectWidth={false}
          open={false}
          options={
            inputSearch == ""
              ? []
              : loadingSekelton
              ? loader
              : searchTopics?.length ||
                searchCamps?.length ||
                searchCampStatement?.length ||
                searchNickname?.length
              ? options
              : no
          }
          value={
            searchVal.length > advanceSearchValueLength
              ? searchVal.substring(0, advanceSearchValueLength)
              : searchVal
          }
          className={`flex w-full [&_.ant-tabs-nav-list]:!w-full transition-all delay-300 [&>div]:!border-0 bg-white`}
        >
          <div
            id="mobile-search-input-container"
            className="w-full flex bg-white gap-3"
          >
            {openSearchForMobileView ? (
              <>
                <div
                  id="mobile-search-back-button"
                  className="flex items-center"
                  onClick={() => {
                    dispatch(setOpenSearchForMobileView(false));
                  }}
                >
                  <Image
                    src="/images/recent-activiity-arrow.svg"
                    width={20}
                    height={20}
                    alt={"check"}
                  />
                </div>
                <SearchInputs
                  id="mobile-search-input-field"
                  placeholder="Search via keyword"
                  value={
                    searchVal.length > advanceSearchValueLength
                      ? searchVal.substring(0, advanceSearchValueLength)
                      : searchVal
                  }
                  className={`${styles.searchInput} [&_.ant-btn-primary]:!bg-transparent [&_.ant-btn-primary]:!border-canGrey2 w-full text-medium font-medium [&_.ant-input]:!shadow-none [&_.ant-input]:!border-canGrey2 hover:!border-canGrey2 [&_.ant-btn-primary]:!rounded-tr-lg [&_.ant-btn-primary]:!rounded-br-lg searchInputHeader`}
                  name="search"
                  onChange={(e) => {
                    setLoadingSekelton(true);
                    dispatch(setSearchValue(e.target.value));
                    setInputSearch(e.target.value);
                    setSearchVal(e.target.value);
                    debounceFn.cancel();
                    if (e?.target?.value) debounceFn(e.target.value, false);
                  }}
                  onPressEnter={(e) => {
                    handlePress();
                    if ((e.target as HTMLTextAreaElement).value)
                      getGlobalSearchCanonizer(
                        (e.target as HTMLTextAreaElement).value,
                        true
                      );
                  }}
                />
              </>
            ) : null}
          </div>
        </AutoComplete>
      </div>
      <div
        id="mobile-search-icon-container"
        className="flex items-center absolute right-8"
      >
        {!openSearchForMobileView ? (
          <Image
            id="mobile-search-icon"
            src="/images/mobile-header-icon.svg"
            width={24}
            height={24}
            onClick={() => {
              dispatch(setOpenSearchForMobileView(!openSearchForMobileView));
            }}
          />
        ) : null}
      </div>
    </Fragment>
  );
};

export default HeaderSearch;

const NoData = () => (
  <Card id="no-data-card" className={`border-0 text-center`}>
    <Typography.Text
      id="no-data-text"
      className="text-canBlack uppercase text-sm font-semibold"
    >
      no data found
    </Typography.Text>
  </Card>
);

const AllItems = ({
  searchTopics,
  searchCamps,
  searchCampStatement,
  searchNickname,
  searchValue,
}) => (
  <Fragment>
    {searchTopics?.length > 0 && (
      <TopicItems searchTopics={searchTopics} searchValue={searchValue} />
    )}
    <br id="all-items-topic-br" />
    {searchCamps?.length > 0 && (
      <CampItems searchCamps={searchCamps} searchValue={searchValue} />
    )}
    <br id="all-items-camp-br" />
    {searchCampStatement?.length > 0 && (
      <CampStatementsItems
        searchValue={searchValue}
        searchCampStatement={searchCampStatement}
      />
    )}
    <br id="all-items-camp-statement-br" />
    {searchNickname?.length > 0 && (
      <NickNamesItems
        searchValue={searchValue}
        searchNickname={searchNickname}
      />
    )}
  </Fragment>
);

const TopicItems = ({ searchTopics, searchValue }) => {
  if (!searchTopics?.length) {
    return <NoData />;
  }

  return (
    <Card
      id="topic-card"
      className={`[&_.ant-empty-normal]:!m-0 [&_.ant-list-empty-text]:!p-0 [&_.ant-card-head-title]:!font-semibold [&_.ant-card-head-title]:uppercase border-0 h-100 bg-canGray lg:rounded-xl [&_.ant-card-head-wrapper]:mb-6 [&_.ant-card-head-title]:!p-0 [&_.ant-card-head]:!p-0  [&_.ant-card-body]:!p-0 py-5 lg:px-6 px-4  ${styles.ItemCard}`}
      title="Topic(s)"
    >
      <List
        id="topic-list"
        size="small"
        className=""
        locale={{ emptyText: "Currently, topic(s) are not available." }}
        dataSource={searchTopics?.slice(0, 5)}
        footer={
          searchTopics?.length ? (
            <span id="topic-list-footer" className={styles.bold_margin}></span>
          ) : null
        }
        renderItem={(item: any) => (
          <List.Item
            id={`topic-list-item-${item.id}`}
            className="w-full flex font-medium !border-b !border-canGrey2 !py-3 lg:!py-3.5 !px-0 first:!pt-0 last:!border-none "
          >
            <Link
              id={`topic-link-${item.id}`}
              className="!font-semibold"
              href={`/${replaceSpecialCharactersInLink(item.link)}`}
            >
              <a className="flex justify-between w-full items-start break-all whitespace-break-spaces">
                <span className="flex flex-col w-full">
                  <div className="flex items-center justify-between w-full gap-2">
                    <span
                      id={`topic-title-${item.id}`}
                      className="text-base lg:font-medium font-normal text-canBlack mb-2 line-clamp-1"
                    >
                      {getHighlightedText(item.type_value, searchValue)}
                    </span>

                    <RightOutlined
                      id={`topic-icon-${item.id}`}
                      className="ml-auto"
                    />
                  </div>
                  <div className="text-left flex gap-7">
                    <Popover
                      id={`topic-popover-${item.id}`}
                      content="Share Topic"
                      placement="top"
                    >
                      <Typography.Paragraph
                        id={`topic-namespace-${item.id}`}
                        className="bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent flex gap-1.5 items-center leading-1 !mb-0 "
                      >
                        <Image
                          className="cursor-default"
                          src="/images/serach-flag.svg"
                          width={18}
                          height={20}
                        />
                          <span className="text-canBlue text-base font-inter font-normal cursor-default lg:font-medium">
                            {item?.namespace}
                          </span>
                      </Typography.Paragraph>
                    </Popover>
                  </div>
                </span>
              </a>
            </Link>
          </List.Item>
        )}
      />
    </Card>
  );
};

const CampItems = ({ searchCamps, searchValue }) => {
  if (!searchCamps?.length) {
    return <NoData />;
  }

  return (
    <Card
      id="camp-card"
      className={`[&_.ant-empty-normal]:!m-0 [&_.ant-list-empty-text]:!p-0 [&_.ant-card-head-title]:uppercase [&_.ant-card-head-title]:!font-semibold border-0 h-100 bg-canGray lg:rounded-xl [&_.ant-card-head-wrapper]:mb-6 [&_.ant-card-head-title]:!p-0 [&_.ant-card-head]:!p-0  [&_.ant-card-body]:!p-0 py-5  lg:px-6 px-4  ${styles.ItemCard}`}
      title="Camp(s)"
    >
      <List
        id="camp-list"
        size="small"
        dataSource={searchCamps?.slice(0, 5)}
        locale={{ emptyText: "Currently, camp(s) are not available." }}
        footer={
          searchCamps?.length ? (
            <span id="camp-list-footer" className={styles.bold_margin}></span>
          ) : null
        }
        renderItem={(item: any) => {
          const jsonData = JSON.parse(item.breadcrumb_data) as Array<any>;
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
            <List.Item
              id={`camp-list-item-${item.id}`}
              className="w-full flex font-medium !border-b !border-canGrey2 !py-3.5 !px-0 first:!pt-0"
            >
              <Link
                id={`camp-link-${item.id}`}
                href={`/${jsonData?.[0][1]?.camp_link}`}
              >
                <a className="flex justify-between w-full items-start break-all whitespace-break-spaces">
                  <span className="flex flex-col w-full break-all whitespace-break-spaces">
                    <div className="flex items-center justify-between w-full gap-2">
                      <span
                        id={`camp-title-${item.id}`}
                        className="text-base font-medium text-canBlack mb-2 line-clamp-1"
                      >
                        {getHighlightedText(item.type_value, searchValue)}
                      </span>
                      <RightOutlined
                        id={`camp-icon-${item.id}`}
                        className="ml-auto"
                      />
                    </div>

                    <div
                      className="text-left grid gap-2"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(250px, 1fr))",
                      }}
                    >
                      {parsedData.reverse().map((obj, index) => (
                        <Typography.Paragraph
                          id={`camp-topic-${item.id}`}
                          className="text-base font-medium bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent !mb-0 flex gap-2 break-all whitespace-break-spaces items-start justify-start"
                          key={`/${obj?.camp_link}`}
                        >
                          <div className="w-[15px] h-[15px] mt-1">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_31_13108)">
                                <path
                                  d="M3.4066 2.96875C3.07267 2.96875 2.79946 3.23594 2.79946 3.5625V15.4375C2.79946 15.7641 3.07267 16.0312 3.4066 16.0312H11.9066V13.0625C11.9066 12.4057 12.4492 11.875 13.1209 11.875H16.1566V3.5625C16.1566 3.23594 15.8834 2.96875 15.5495 2.96875H3.4066ZM11.9066 17.8125H3.4066C2.06709 17.8125 0.978027 16.7475 0.978027 15.4375V3.5625C0.978027 2.25254 2.06709 1.1875 3.4066 1.1875H15.5495C16.889 1.1875 17.978 2.25254 17.978 3.5625V11.875V12.0791C17.978 12.71 17.7238 13.3148 17.2684 13.7602L13.8343 17.1186C13.3789 17.5639 12.7604 17.8125 12.1153 17.8125H11.9066Z"
                                  fill="#242B37"
                                />
                                <path
                                  d="M9.88172 4.88394C9.8077 4.73405 9.65128 4.63867 9.47949 4.63867C9.3077 4.63867 9.15267 4.73405 9.07726 4.88394L8.17922 6.68667L6.17364 6.97555C6.00605 7.00007 5.86638 7.11453 5.81471 7.27123C5.76303 7.42793 5.80493 7.60099 5.92504 7.71681L7.38034 9.12166L7.03677 11.107C7.00883 11.2705 7.07867 11.4367 7.21693 11.5335C7.3552 11.6302 7.53816 11.6425 7.689 11.5648L9.48089 10.6314L11.2728 11.5648C11.4236 11.6425 11.6066 11.6316 11.7448 11.5335C11.8831 11.4354 11.9529 11.2705 11.925 11.107L11.58 9.12166L13.0353 7.71681C13.1554 7.60099 13.1987 7.42793 13.1457 7.27123C13.0926 7.11453 12.9543 7.00007 12.7867 6.97555L10.7798 6.68667L9.88172 4.88394Z"
                                  fill="#242B37"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_31_13108">
                                  <rect
                                    width="15"
                                    height="15"
                                    fill="white"
                                    transform="translate(0.978027)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>

                          <span className="break-normal whitespace-nowrap">
                            Topic:
                          </span>

                          <a
                            className="text-base text-canBlue font-medium line-clamp-1"
                            href={`/${obj?.camp_link}`}
                          >
                            {getHighlightedText(obj?.camp_name, searchValue)}
                          </a>
                        </Typography.Paragraph>
                      ))}
                    </div>
                  </span>
                </a>
              </Link>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

const CampStatementsItems = ({ searchCampStatement, searchValue }) => {
  if (!searchCampStatement?.length) {
    return <NoData />;
  }

  return (
    <Card
      id="camp-statement-card"
      className={`[&_.ant-empty-normal]:!m-0 [&_.ant-list-empty-text]:!p-0 [&_.ant-card-head-title]:uppercase [&_.ant-card-head-title]:!font-semibold border-0 h-100 bg-canGray lg:rounded-xl [&_.ant-card-head-wrapper]:mb-6 [&_.ant-card-head-title]:!p-0 [&_.ant-card-head]:!p-0  [&_.ant-card-body]:!p-0 py-5  lg:px-6 px-4 ${styles.ItemCard}`}
      title="Camp Statement(s)"
    >
      <List
        id="camp-statement-list"
        className="[&_.ant-list-footer]:!hidden"
        size="small"
        dataSource={searchCampStatement?.slice(0, 5)}
        locale={{ emptyText: "Currently, statement(s) are not available." }}
        footer={
          searchCampStatement?.length ? (
            <span
              id="camp-statement-list-footer"
              className={styles.bold_margin}
            ></span>
          ) : null
        }
        renderItem={(item: any) => {
          const jsonData = JSON.parse(item?.breadcrumb_data) as Array<any>;

          return (
            <List.Item
              id={`camp-statement-list-item-${item.id}`}
              className="w-full flex font-medium !border-b !border-canGrey2 !py-3.5 !px-0 first:!pt-0 last:!border-none last:!pb-0 "
            >
              <div id={`camp-statement-item-${item.id}`}>
                <div className="w-full [&_div]:inline">
                  {getHighlightedTextForCampStatement(
                    item.type_value,
                    searchValue
                  )}
                </div>
                <div
                  id={`camp-statement-topic-${item.id}`}
                  className="text-left grid gap-2 w-full mt-3"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(250px, 1fr))",
                  }}
                >
                  <Typography.Paragraph
                    id={`camp-statement-topic-paragraph-${item.id}`}
                    className="text-base font-medium bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent flex gap-1.5 items-center leading-1 !mb-0"
                  >
                    <Image
                      src="/images/camp-search-icon.svg"
                      width={17}
                      height={19}
                    />
                    Topic:
                    <Link href={`/${jsonData?.[0][1]?.camp_link}`}>
                      <a
                        id={`camp-statement-topic-link-${item.id}`}
                        className="text-canBlue text-base font-inter font-medium line-clamp-1"
                      >
                        {getHighlightedText(
                          jsonData?.[0]?.[1]?.topic_name,
                          searchValue
                        )}
                      </a>
                    </Link>
                  </Typography.Paragraph>
                  <Typography.Paragraph
                    id={`camp-statement-paragraph-${item.id}`}
                    className="bg-transparent border-0 p-0 flex items-center leading-1 mb-2 [&_span]:inline-flex gap-2 !mb-0"
                  >
                    <span className="break-normal whitespace-nowrap">
                      Camp:
                    </span>
                    <Link href={`/${jsonData?.[0][1]?.camp_link}`}>
                      <a
                        id={`camp-statement-link-${item.id}`}
                        className="flex w-full items-start !text-canBlue hover:!text-canHoverBlue text-base font-medium"
                      >
                        {getHighlightedTextForCampStatement(
                          jsonData?.[0]?.[1]?.camp_name,
                          searchValue
                        )}
                      </a>
                    </Link>
                  </Typography.Paragraph>
                </div>
              </div>
              <RightOutlined
                id={`camp-statement-icon-${item.id}`}
                className="ml-auto"
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

const NickNamesItems = ({ searchNickname, searchValue }) => {
  if (!searchNickname?.length) {
    return <NoData />;
  }

  return (
    <Card
      id="nickname-card"
      className={`[&_.ant-empty-normal]:!m-0 [&_.ant-list-empty-text]:!p-0 [&_.ant-card-head-title]:uppercase [&_.ant-card-head-title]:!font-semibold border-0 h-100 bg-canGray lg:rounded-xl [&_.ant-card-head-wrapper]:mb-6 [&_.ant-card-head-title]:!p-0 [&_.ant-card-head]:!p-0  [&_.ant-card-body]:!p-0 py-5  lg:px-6 px-4 ${styles.ItemCard}`}
      title="Nickname(s)"
    >
      <List
        id="nickname-list"
        size="small"
        dataSource={searchNickname?.slice(0, 5)}
        locale={{ emptyText: "Currently, nick-name(s) are not available." }}
        footer={
          searchNickname?.length ? (
            <span
              id="nickname-list-footer"
              className={styles.bold_margin}
            ></span>
          ) : null
        }
        renderItem={(item: any) => {
          return (
            <List.Item
              id={`nickname-list-item-${item.id}`}
              className="w-full flex !border-none !py-2 lg:!px-5 !px-2.5 bg-white rounded-lg mb-2"
            >
              <Link id={`nickname-link-${item.id}`} href={`${item?.link}`}>
                <a className="flex justify-between w-full items-start">
                  <span className="flex items-center gap-3.5 text-base font-normal">
                    <Image
                      id={`nickname-image-${item.id}`}
                      src="/images/nickname-user-icon.svg"
                      width={14}
                      height={16}
                    />
                    {getHighlightedText(item.type_value, searchValue)}
                  </span>
                  <span
                    id={`nickname-supported-camps-${item.id}`}
                    className="ml_auto text-base font-normal"
                  >
                    Supported camps:{" "}
                    <strong
                      id={`nickname-support-count-${item.id}`}
                      className="text-canOrange text-base !font-normal"
                    >
                      {item?.support_count == "" ? 0 : item?.support_count}
                    </strong>{" "}
                  </span>
                </a>
              </Link>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

const FooterItems = ({ searchValue, handleSearchfor }) => (
  <footer
    id="footer-items"
    className="px-2 pt-5 mt-5 pb-5 text-center lg:border-t lg:border-canGrey2 ftSearchLink"
  >
    <Link
      id="footer-link"
      href={{ pathname: "/search", query: { q: searchValue } }}
      className="[&_.ant-select-item-option-active]:!bg-white [&_.ant-select-item]:!p-0 [&_.ant-select-item-option]:!p-0 [&_.ant-select-item-option-grouped]:!p-0 "
    >
      <a
        id="footer-view-all-results"
        onClick={() => handleSearchfor()}
        className="text-base uppercase font-inter font-semibold text-canBlack !p-0"
      >
        View All Results
      </a>
    </Link>
  </footer>
);
