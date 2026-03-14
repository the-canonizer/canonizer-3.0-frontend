import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import Link from "next/link";
import { Empty, Pagination, Space, Tag } from "antd";
import {
  setClickAdvanceFilterOption,
  setPageNumber,
  setSelectedTopicFromAdvnaceFilterNickname,
} from "src/store/slices/searchSlice";
import CustomSkelton from "../../common/customSkelton";
import { CloseCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import AdvanceSearchHeader from "./AdvanceSearchHeader";

const NicknameSearch = () => {
  const { searchDataAll, searchValue } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
    searchValue: state?.searchSlice?.searchValue,
  }));
  const { searchMetaData } = useSelector((state: RootState) => ({
    searchMetaData: state?.searchSlice?.searchMetaData,
  }));
  const {
    loading,
    selectedTopicFromAdvnaceFilterNickname,
    supportTreeForCamp,
    selectNicknameIdFromGetApi,
    clickAdvanceFilterOption,
    selectNickNameIdFromDirectSupportTree,
  } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
    selectedTopicFromAdvnaceFilterNickname:
      state?.searchSlice?.selectedTopicFromAdvnaceFilterNickname,
    campSupportingTree: supportTreeForCamp,
    selectNicknameIdFromGetApi: state?.searchSlice?.selectNicknameIdFromGetApi,
    selectNickNameIdFromDirectSupportTree:
      state?.searchSlice?.selectNickNameIdFromDirectSupportTree,
    clickAdvanceFilterOption: state?.searchSlice?.clickAdvanceFilterOption,
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
  }, [searchDataAll?.nickname]);
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };
  const handleTagClose = (topic) => {
    dispatch(
      setSelectedTopicFromAdvnaceFilterNickname(
        selectedTopicFromAdvnaceFilterNickname.filter((item) => item !== topic)
      )
    );
    // setSelectedTopics(selectedTopics.filter(item => item !== topic));
  };
  const extractNumbers = (dataArray) => {
    return dataArray?.map((item) => {
      // Split each string by hyphen
      const parts = item.split("-");
      // Return the second part which contains the number
      return parseInt(parts[1], 10);
    });
  };
  const findNicknameId = searchDataAll.nickname?.map((obj) => {
    return obj.id;
  });

  const filterNicknameList = searchDataAll?.nickname?.filter((obj) => {
    const secondPartId = obj.id.split("-")[1];
    return selectNicknameIdFromGetApi?.includes(parseInt(secondPartId));
  });

  const filterNicknameListFromSupportTree = searchDataAll?.nickname?.filter(
    (obj) => {
      const secondPartId = obj.id.split("-")[1];
      return selectNickNameIdFromDirectSupportTree?.includes(
        parseInt(secondPartId)
      );
    }
  );
  const compareArrays = (arr1, arr2) => {
    // Iterate over each element in arr1
    for (let i = 0; i < arr1?.length; i++) {
      // Check if the current element of arr1 exists in arr2
      if (arr2?.some((value) => value === arr1[i])) {
        // If match found, return true
        return true;
      }
    }
    // If no match found, return false
    return false;
  };
  // const isArray= compareArrays(selectNickNameIdFromDirectSupportTree,extractNumbers(findNicknameId));
  const mapNickNameList = (
    selectNicknameIdFromGetApi,
    findNicknameId,
    filterNicknameList,
    clickAdvanceFilterOption,
    searchDataAll
  ) => {
    const isArray = compareArrays(
      selectNicknameIdFromGetApi,
      extractNumbers(findNicknameId)
    );
    const isArray2 = compareArrays(
      selectNickNameIdFromDirectSupportTree,
      extractNumbers(findNicknameId)
    );
    if (isArray && filterNicknameList && clickAdvanceFilterOption) {
      return filterNicknameList;
    } else if (
      isArray2 &&
      filterNicknameListFromSupportTree &&
      clickAdvanceFilterOption
    ) {
      return filterNicknameListFromSupportTree;
    } else {
      return searchDataAll.nickname;
    }
  };
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
      <AdvanceSearchHeader
        sectionId="elastic_nickname_search"
        subSectionId="elastic_nickname_search_sub_section"
        headingId="elastic_nickname_search_heading_section"
        imgId="elastic_nickname_search_img"
        headingTextId="elastic_nickname_search_heading_text"
      />

      <div
        className="flex lg:flex-row flex-col gap-10"
        id="elastic_nickname_search_sidebar_section"
      >
        <aside
          className="leftSideBar miniSideBar"
          id="elastic_nickname_search_sidebar_section_asidebar"
        >
          <div
            className="leftSideBar_Card p-0 m-0"
            id="elastic_nickname_search_sidebar_section_search_sidebar"
          >
            <SearchSideBar />
          </div>
        </aside>
        <div
          className="pageContentWrap flex-1"
          id="elastic_nickname_search_nickname_list_advance"
        >
          <div
            className="bg-canGray lg:py-5 lg:px-8 py-4 px-4 rounded-xl mb-5"
            id="elastic_nickname_search_nickname_list_advance_sub"
          >
            <div
              className="d-flex mb-2 align-items-center flex-wrap relative ant_tags"
              id="elastic_nickname_search_nickname_list_advance_ul"
            >
              {clickAdvanceFilterOption ? (
                <Space size={[0, 18]} wrap>
                  {selectedTopicFromAdvnaceFilterNickname.map(
                    (topic, index) => (
                      <Tag key={index}>
                        {topic}{" "}
                        <div>
                          <CloseCircleOutlined
                            onClick={() => {
                              dispatch(setClickAdvanceFilterOption(false));
                              handleTagClose(topic);
                            }}
                            id="elastic_nickname_search_nickname_list_advance_close_outline"
                          />
                        </div>
                      </Tag>
                    )
                  )}
                </Space>
              ) : (
                ""
              )}
            </div>
            <div className="mb-2" id="elastic_nickname_search_nickname_list">
              <h4
                className="!mb-6 !text-base !font-semibold !text-canBlack"
                data-testid="nickname_heading"
                id="elastic_nickname_search_nickname_list_text"
              >
                Nickname(S)
              </h4>
            </div>

            {loading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={10}
                stylingClass="listSkeleton"
                isButton={false}
                id="elastic_nickname_search_nickname_list_loader"
              />
            ) : (
              <div className="">
                {searchDataAll.nickname?.length ? (
                  <div>
                    <ul>
                      {mapNickNameList(
                        selectNicknameIdFromGetApi,
                        findNicknameId,
                        filterNicknameList,
                        clickAdvanceFilterOption,
                        searchDataAll
                      ).map((x) => {
                        return (
                          <>
                            <li
                              className="text-sm font-medium bg-white w-full px-5 py-2 rounded-xl mb-2 flex justify-between"
                              id="elastic_nickname_search_nickname_list_li"
                            >
                              <Link href={`${x?.link}`}
                                  className="flex gap-2.5"
                                  id="elastic_nickname_search_nickname_list_link"
                                >
                                  <Image
                                    src="/images/nickname-user-icon.svg"
                                    width={14}
                                    height={16}
                                    id="elastic_nickname_search_nickname_list_img"
                                    alt=""
                                  />
                                  <label
                                    style={{ cursor: "pointer" }}
                                    className="font-medium text-base"
                                    id="elastic_nickname_search_nickname_list_lable"
                                  >
                                    {getHighlightedText(
                                      x?.type_value,
                                      searchValue
                                    )}
                                  </label>
                              </Link>
                              <span
                                className="font-normal text-base"
                                id="elastic_nickname_search_nickname_list_supported_camps"
                              >
                                Supported camps:{" "}
                                <strong
                                  className="text-canOrange font-semibold text-base"
                                  id="elastic_nickname_search_nickname_list_count"
                                >
                                  {x.support_count == "" ? 0 : x.support_count}
                                </strong>{" "}
                              </span>
                            </li>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <span
                    className="italic text-canLight"
                    id="elastic_nickname_search_nickname_list_no_data"
                  >
                    There is no data to show in this category.
                  </span>
                )}
              </div>
            )}
            <Pagination
              className="mt-5 [&_.ant-pagination-item]:!mr-1 lg:[&_.ant-pagination-item]:!mr-2"
              hideOnSinglePage={true}
              total={searchMetaData.total}
              pageSize={20}
              onChange={pageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NicknameSearch;
