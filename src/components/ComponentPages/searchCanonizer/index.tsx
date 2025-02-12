import React from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import { Empty } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import moment from "moment";
import CustomSkelton from "../../common/customSkelton";
import Image from "next/image";
import { useRouter } from "next/router";

const formatDate = (unixTime: number) =>
  moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");

const highlightText = (text = "", highlight = "") => {
  if (!highlight.trim()) return text;
  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.split(regex).map((part, i) => (
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
  ));
};

const SearchCategory = ({ title, data, renderItem }) => {
  if (!data?.length) return null;
  return (
    <div className="bg-canGray lg:py-5 lg:px-8 py-4 px-4 rounded-xl mb-5">
      <h4 className="!mb-6 !text-base !font-semibold !text-canBlack">
        {title}
      </h4>
      <ul className="first:p-0">{data.slice(0, 5).map(renderItem)}</ul>
    </div>
  );
};

const Search = () => {
  const { searchData, searchValue, loading } = useSelector(
    (state: RootState) => ({
      searchData: state?.searchSlice?.searchData,
      searchValue: state?.searchSlice?.searchValue,
      loading: state?.loading?.searchLoading,
    })
  );

  const router = useRouter();

  return (
    <>
      <div className="flex justify-between lg:items-center lg:flex-row flex-col items-start mb-10 mt-2.5 lg:gap-0 gap-5">
        <div className="flex items-center">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/recent-activiity-arrow.svg"
              width={16}
              height={24}
              alt="search icon"
            />
            <h3 className="lg:text-3xl text-xl text-canBlack font-medium">
              Search Results for{" "}
              <span className="text-canBlue capitalize">
                {router?.query?.q}
              </span>
            </h3>
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col gap-10">
        <aside className="leftSideBar miniSideBar">
          <div className="leftSideBar_Card p-0 m-0">
            <SearchSideBar />
          </div>
        </aside>

        <div className="pageContentWrap flex-1">
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
                <>
                  <SearchCategory
                    title="Topic"
                    data={searchData.topic}
                    renderItem={(x) => (
                      <li
                        key={x.link}
                        className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none"
                      >
                        <Link href={x.link}>
                          <div className="flex justify-between items-center">
                            <span className="text-base font-medium text-canBlack flex !mb-2">
                              {highlightText(x.type_value, searchValue)}
                            </span>
                            <Image
                              src="/images/search-page-arrow.svg"
                              width={16}
                              height={10}
                              alt="arrow"
                            />
                          </div>
                        </Link>
                        <div className="text-base text-canBlue flex items-center gap-2.5">
                          <Image
                            src="/images/flagicon.svg"
                            width={18}
                            height={20}
                            alt="flag"
                          />
                          <span className="text-base text-canBlack font-medium">
                            Canon: {x.namespace}
                          </span>
                        </div>
                      </li>
                    )}
                  />

                  <SearchCategory
                    title="Camp"
                    data={searchData.camp}
                    renderItem={(x) => {
                      const jsonData = JSON.parse(x.breadcrumb_data) || [];
                      return (
                        <li
                          key={x.link}
                          className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none"
                        >
                          <Link href={jsonData[0]?.[1]?.camp_link || ""}>
                            <div className="flex justify-between items-center">
                              <span className="text-base font-medium text-canBlack flex !mb-2">
                                {highlightText(x.type_value, searchValue)}
                              </span>
                              <Image
                                src="/images/search-page-arrow.svg"
                                width={16}
                                height={10}
                                alt="arrow"
                              />
                            </div>
                          </Link>
                        </li>
                      );
                    }}
                  />

                  <SearchCategory
                    title="Camp Statement"
                    data={searchData.statement}
                    renderItem={(x) => {
                      const jsonData = JSON.parse(x.breadcrumb_data) || [];
                      return (
                        <li
                          key={x.link}
                          className="flex flex-col py-3 first:pt-0 border-b border-canGrey2 last:border-none"
                        >
                          <Link href={jsonData[0]?.[1]?.camp_link || ""}>
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium mb-2 text-canBlack text-base">
                                {highlightText(
                                  jsonData[0]?.[1]?.camp_name ||
                                    jsonData[0]?.[1]?.topic_name,
                                  searchValue
                                )}
                              </h3>
                              <Image
                                src="/images/search-page-arrow.svg"
                                width={16}
                                height={10}
                                alt="arrow"
                              />
                            </div>
                          </Link>
                          <div className="text-base text-canBlack">
                            {x.type_value.substring(0, 800)}...
                          </div>
                        </li>
                      );
                    }}
                  />

                  <SearchCategory
                    title="Nickname"
                    data={searchData.nickname}
                    renderItem={(x) => (
                      <li
                        key={x.link}
                        className="text-sm font-medium bg-white w-full px-5 py-2 rounded-xl mb-2 flex justify-between"
                      >
                        <Link href={x.link}>
                          <div className="flex gap-2.5">
                            <Image
                              src="/images/nickname-user-icon.svg"
                              width={14}
                              height={16}
                              alt="user"
                            />
                            <span className="font-medium text-base">
                              {highlightText(x.type_value, searchValue)}
                            </span>
                          </div>
                        </Link>
                        <span className="font-normal text-base">
                          Supported camps:{" "}
                          <strong className="text-canOrange font-semibold text-base">
                            {x.support_count || 0}
                          </strong>
                        </span>
                      </li>
                    )}
                  />
                </>
              ) : (
                <Empty description="There is no data to show in this category." />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
