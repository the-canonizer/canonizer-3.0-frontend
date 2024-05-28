import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import AdvanceFilter from "../../common/AdvanceSearchFilter";
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

const NicknameSearch = () => {
  const { searchDataAll } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
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

  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar">
        <div className="leftSideBar_Card p-0 m-0">
          <SearchSideBar />
        </div>
      </aside>
      <div className="pageContentWrap">
        <div className={styles.card}>
          <div className="d-flex mb-2 align-items-center flex-wrap relative ant_tags">
            {clickAdvanceFilterOption ? (
              <Space size={[0, 18]} wrap>
                {/* <Tag onClose={()=>{handleTagClose()}}>{selectedTopicFromAdvnaceFilterNickname}</Tag> */}
                {selectedTopicFromAdvnaceFilterNickname.map((topic, index) => (
                  <Tag key={index}>
                    {topic}{" "}
                    <div>
                      <CloseCircleOutlined
                        onClick={() => {
                          dispatch(setClickAdvanceFilterOption(false));
                          handleTagClose(topic);
                        }}
                      />
                    </div>
                  </Tag>
                ))}
              </Space>
            ) : (
              ""
            )}
            <AdvanceFilter />
          </div>

          <div className="mb-2">
            <h4 className="m-0" data-testid="nickname_heading">
              Nickname
            </h4>
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
                    {mapNickNameList(
                      selectNicknameIdFromGetApi,
                      findNicknameId,
                      filterNicknameList,
                      clickAdvanceFilterOption,
                      searchDataAll
                    ).map((x) => {
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
