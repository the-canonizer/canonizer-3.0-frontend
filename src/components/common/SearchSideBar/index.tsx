import { useRouter } from "next/router";
import { Button } from "antd";
import Link from "next/link";
import styles from "./searchSideBar.module.scss";
import Image from "next/image";
import filter from "src/assets/image/face.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import CustomSkelton from "../customSkelton";
import { setClickAdvanceFilterOption } from "src/store/slices/searchSlice";

export default function SearchSideBar() {
  const router = useRouter();
  let { searchValue, filterByScore, algorithm, asof, asofdate } = useSelector(
    (state: RootState) => ({
      searchValue: state?.searchSlice?.searchValue,
      filterByScore: state.filters?.filterObject?.filterByScore,
      algorithm: state.filters?.filterObject?.algorithm,
      asof: state?.filters?.filterObject?.asof,
      asofdate: state.filters?.filterObject?.asofdate,
    })
  );

  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));

  const campRoute = () => {
    router?.push("/search/topic");
  };
  const dispatch = useDispatch();
  const {
    searchCountForMetaData,
    searchMetaData,
    selectedTopicFromAdvanceFilterAlgorithm,
    selectedCampFromAdvanceFilterAlgorithm,
    selectedStatementFromAdvanceFilterAlgorithm,
  } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
    searchData: state?.searchSlice?.searchData,
    searchCountForMetaData: state?.searchSlice?.searchCountForMetaData,
    searchMetaData: state?.searchSlice?.searchMetaData,
    selectedTopicFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedTopicFromAdvanceFilterAlgorithm,
    selectedCampFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedCampFromAdvanceFilterAlgorithm,
    selectedStatementFromAdvanceFilterAlgorithm:
      state?.searchSlice?.selectedStatementFromAdvanceFilterAlgorithm,
  }));
  return (
    <>
      <div className="leftSideBar_Card noFilter">
        {loading ? (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={5}
            stylingClass="listSkeleton"
            isButton={false}
          />
        ) : (
          <div className="search_tabs lg:flex-col flex overflow-x-auto gap-5">
            <Link
              href={{
                pathname: "/search",
                query: { q: searchValue },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  // className={
                  //   router?.asPath.includes("/search?") ? "active" : "btn"
                  // }
                  className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                   active:!border-none active:!border-transparent hover:!border-transparent focus:!border-transparent  ${
                     router?.asPath.includes("/search?") ? "active" : "btn"
                   }`}
                  disabled={router?.pathname == "/search" ? true : false}
                >
                  All Results
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/topic",
                query: {
                  q: searchValue,
                  ...(asof !== "default" && { asof: asof }),
                  ...(asof == "bydate" && { asofdate: asofdate }),
                },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                   active:!border-none active:!border-transparent  hover:!border-transparent focus:!border-transparent  
                    ${
                      router?.asPath.includes("/search/topic?")
                        ? "active"
                        : "btn"
                    } `}
                  disabled={router?.pathname == "/search/topic" ? true : false}
                >
                  {/* <i className="icon-topic"></i> */}
                  <a>
                    Topic{" "}
                    <span>
                      {" "}
                      &nbsp;(
                      {searchValue == ""
                        ? searchMetaData?.topic_total
                        : router.query.asof == "review" ||
                          router.query.asof == "bydate"
                        ? selectedTopicFromAdvanceFilterAlgorithm.length
                        : searchCountForMetaData?.topic_total}
                      )
                    </span>
                  </a>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/camp",
                query: {
                  q: searchValue,
                  ...(asof !== "default" && { asof: asof }),
                  ...(asof == "bydate" && { asofdate: asofdate }),
                },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  className={` p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                   active:!border-none active:!border-transparent  hover:!border-transparent focus:!border-transparent 
                    ${
                      router?.asPath.includes("/search/camp?")
                        ? "active"
                        : "btn"
                    }`}
                  disabled={router?.pathname == "/search/camp" ? true : false}
                >
                  {/* <i className="icon-camp"></i> */}
                  <a>
                    Camp{" "}
                    <span>
                      {" "}
                      &nbsp;(
                      {searchValue == ""
                        ? searchMetaData?.camp_total
                        : router.query.asof == "review" ||
                          router.query.asof == "bydate"
                        ? selectedCampFromAdvanceFilterAlgorithm.length
                        : searchCountForMetaData?.camp_total}
                      )
                    </span>
                  </a>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/camp_statement",
                query: { q: searchValue },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                   active:!border-none active:!border-transparent  hover:!border-transparent focus:!border-transparent 
                    ${
                      router?.asPath.includes("/search/camp_statement?")
                        ? "active"
                        : "btn"
                    }`}
                  disabled={
                    router?.pathname == "/search/camp_statement" ? true : false
                  }
                >
                  {/* <i className="icon-camp"></i> */}
                  <a>
                    Camp Statement{" "}
                    <span>
                      {" "}
                      &nbsp;(
                      {searchValue == ""
                        ? searchMetaData?.statement_total
                        : router.query.asof == "review" ||
                          router.query.asof == "bydate"
                        ? selectedStatementFromAdvanceFilterAlgorithm.length
                        : searchCountForMetaData?.statement_total}
                      )
                    </span>
                  </a>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/nickname",
                query: { q: searchValue },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                   active:!border-none active:!border-transparent  hover:!border-transparent focus:!border-transparent 
                    ${
                      router?.asPath.includes("/search/nickname?")
                        ? "active"
                        : "btn"
                    }`}
                  disabled={
                    router.pathname == "/search/nickname" ? true : false
                  }
                  onClick={() => {
                    dispatch(setClickAdvanceFilterOption(false));
                  }}
                >
                  {/* <Image
                    className={styles.nickname_icon}
                    id="nick_name"
                    alt="face Image"
                    src={filter}
                    width={15}
                    height={15}
                  /> */}
                  <a>
                    Nickname{" "}
                    <span>
                      {" "}
                      &nbsp;(
                      {searchValue == ""
                        ? searchMetaData?.nickname_total
                        : searchCountForMetaData?.nickname_total}
                      )
                    </span>
                  </a>
                </Button>
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
