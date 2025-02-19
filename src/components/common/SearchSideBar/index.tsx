import { useRouter } from "next/router";
import { Button } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import CustomSkelton from "../customSkelton";
import { setClickAdvanceFilterOption } from "src/store/slices/searchSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

export default function SearchSideBar() {
  const router = useRouter();
  // let { searchValue, filterByScore, algorithm, asof, asofdate } = useSelector(
  //   (state: RootState) => ({
  //     searchValue: state?.searchSlice?.searchValue,
  //     filterByScore: state.filters?.filterObject?.filterByScore,
  //     algorithm: state.filters?.filterObject?.algorithm,
  //     asof: state?.filters?.filterObject?.asof,
  //     asofdate: state.filters?.filterObject?.asofdate,
  //   })
  // );

  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));

  // const campRoute = () => {
  //   router?.push("/search/topic");
  // };
  const dispatch = useDispatch();
  const {
    searchCountForMetaData,
    searchMetaData,
    selectedTopicFromAdvanceFilterAlgorithm,
    selectedCampFromAdvanceFilterAlgorithm,
    selectedStatementFromAdvanceFilterAlgorithm,
    selectedTopicFromAdvanceFilterAlgorithmRecords,
    selectedCampFromAdvanceFilterAlgorithmRecords,
    selectedCampStatementFromAdvanceFilterAlgorithmRecords,
    detectPressEnterInSearch,
    storeOnPressEnterSearchCountForMetaData,
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
    selectedTopicFromAdvanceFilterAlgorithmRecords:
      state?.searchSlice?.selectedTopicFromAdvanceFilterAlgorithmRecords,
    selectedCampFromAdvanceFilterAlgorithmRecords:
      state?.searchSlice?.selectedCampFromAdvanceFilterAlgorithmRecords,
    selectedCampStatementFromAdvanceFilterAlgorithmRecords:
      state?.searchSlice
        ?.selectedCampStatementFromAdvanceFilterAlgorithmRecords,
    detectPressEnterInSearch: state?.searchSlice?.detectPressEnterInSearch,
    storeOnPressEnterSearchCountForMetaData:
      state?.searchSlice?.storeOnPressEnterSearchCountForMetaData,
  }));

  const isQueryEmpty = router?.query?.q === "";
  const isReviewOrByDate =
    router.query.asof === "review" || router.query.asof === "bydate";
  const isCampPage = router?.pathname == "/search/camp";
  const isTopicPage = router?.pathname == "/search/topic";
  const isStatementPage = router?.pathname == "/search/camp_statement";

  const getTotal = (defaultCount, reviewRecords, searchCount, isPage) => {
    if (isQueryEmpty) return defaultCount;
    if (isReviewOrByDate && isPage) return reviewRecords;
    if (detectPressEnterInSearch) return searchCount;
    return defaultCount;
  };

  const campTotal = getTotal(
    storeOnPressEnterSearchCountForMetaData?.camp_total,
    selectedCampFromAdvanceFilterAlgorithmRecords,
    searchCountForMetaData?.camp_total,
    isCampPage
  );

  const statementTotal = getTotal(
    storeOnPressEnterSearchCountForMetaData?.statement_total,
    selectedCampStatementFromAdvanceFilterAlgorithmRecords,
    searchCountForMetaData?.statement_total,
    isStatementPage
  );

  const topicTotal = getTotal(
    storeOnPressEnterSearchCountForMetaData?.topic_total,
    selectedTopicFromAdvanceFilterAlgorithmRecords,
    searchCountForMetaData?.topic_total,
    isTopicPage
  );

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
              href={{ pathname: "/search", query: { q: router?.query?.q } }}
              passHref
            >
              <a
                className={`${
                  router?.asPath.includes("/search?") ? "active" : "btn"
                }`}
              >
                <Button
                  size="large"
                  className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 
                    active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal 
                    disabled:!font-semibold active:!text-canBlue disabled:!border-b-2 disabled:!border-canBlue 
                    active:!border-none hover:!border-transparent focus:!border-transparent`}
                  disabled={router?.pathname === "/search"}
                  onClick={() =>
                    dispatch(
                      setFilterCanonizedTopics({
                        asofdate: Date.now() / 1000,
                        asof: "default",
                      })
                    )
                  }
                >
                  All Results
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/topic",
                query: {
                  q: router?.query?.q,
                },
              }}
              passHref
            >
              <a
                className={`${
                  router?.asPath.includes("/search/topic?") ? "active" : "btn"
                }`}
              >
                <Button
                  size="large"
                  className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                  active:!border-none active:!border-transparent  hover:!border-transparent focus:!border-transparent`}
                  disabled={router?.pathname == "/search/topic" ? true : false}
                  onClick={() =>
                    dispatch(
                      setFilterCanonizedTopics({
                        asofdate: Date.now() / 1000,
                        asof: "default",
                      })
                    )
                  }
                >
                  Topic <span> &nbsp;({topicTotal})</span>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/camp",
                query: { q: router?.query?.q },
              }}
              passHref
            >
              <a
                className={`${
                  router?.asPath.includes("/search/camp?") ? "active" : "btn"
                }`}
              >
                <Button
                  size="large"
                  className={` p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                  active:!border-none active:!border-transparent  hover:!border-transparent focus:!border-transparent`}
                  disabled={router?.pathname == "/search/camp" ? true : false}
                  onClick={() => {
                    dispatch(
                      setFilterCanonizedTopics({
                        asofdate: Date.now() / 1000,
                        asof: "default",
                      })
                    );
                  }}
                >
                  Camp <span> &nbsp;({campTotal})</span>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/camp_statement",
                query: { q: router?.query?.q },
              }}
              passHref
            >
              <a
                className={`${
                  router?.asPath.includes("/search/camp_statement?")
                    ? "active"
                    : "btn"
                }`}
              >
                <Button
                  size="large"
                  className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                  active:!border-none active:!border-transparent  hover:!border-transparent focus:!border-transparent`}
                  disabled={
                    router?.pathname == "/search/camp_statement" ? true : false
                  }
                  onClick={() => {
                    dispatch(
                      setFilterCanonizedTopics({
                        asofdate: Date.now() / 1000,
                        asof: "default",
                      })
                    );
                  }}
                >
                  Camp Statement{" "}
                  <span>
                    {" "}
                    &nbsp;(
                    {statementTotal})
                  </span>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/nickname",
                query: { q: router?.query?.q },
              }}
              passHref
            >
              <a
                className={` ${
                  router?.asPath.includes("/search/nickname?")
                    ? "active"
                    : "btn"
                }`}
              >
                <Button
                  size="large"
                  className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2  disabled:!border-canBlue 
                  active:!border-none active:!border-transparent  hover:!border-transparent focus:!border-transparent `}
                  disabled={
                    router.pathname == "/search/nickname" ? true : false
                  }
                  onClick={() => {
                    dispatch(setClickAdvanceFilterOption(false));
                    dispatch(
                      setFilterCanonizedTopics({
                        asofdate: Date.now() / 1000,
                        asof: "default",
                      })
                    );
                  }}
                >
                  Nickname{" "}
                  <span>
                    {" "}
                    &nbsp;(
                    {storeOnPressEnterSearchCountForMetaData?.nickname_total})
                  </span>
                </Button>
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
