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

  const campRoute = () => {
    router?.push("/search/topic");
  };
  const dispatch = useDispatch();
  const {
    searchCountForMetaData,
    // searchMetaData,
    // selectedTopicFromAdvanceFilterAlgorithm,
    // selectedCampFromAdvanceFilterAlgorithm,
    // selectedStatementFromAdvanceFilterAlgorithm,
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

  const isReviewOrByDate =
    router.query.asof === "review" || router.query.asof === "bydate";

  const isCampPage = router?.pathname == "/search/camp";

  const campTotal =
    router?.query?.q === ""
      ? storeOnPressEnterSearchCountForMetaData?.camp_total
      : isReviewOrByDate && isCampPage
      ? selectedCampFromAdvanceFilterAlgorithmRecords
      : detectPressEnterInSearch
      ? searchCountForMetaData?.camp_total
      : storeOnPressEnterSearchCountForMetaData?.camp_total;

  const statementTotal =
    router?.query?.q === ""
      ? storeOnPressEnterSearchCountForMetaData?.statement_total
      : (router.query.asof === "review" || router.query.asof === "bydate") &&
        router?.pathname === "/search/camp_statement"
      ? selectedCampStatementFromAdvanceFilterAlgorithmRecords
      : detectPressEnterInSearch
      ? searchCountForMetaData?.statement_total
      : storeOnPressEnterSearchCountForMetaData?.statement_total;

  const topicTotal =
    router?.query?.q === ""
      ? storeOnPressEnterSearchCountForMetaData?.topic_total
      : (router.query.asof === "review" || router.query.asof === "bydate") &&
        router?.pathname === "/search/topic"
      ? selectedTopicFromAdvanceFilterAlgorithmRecords
      : detectPressEnterInSearch
      ? searchCountForMetaData?.topic_total
      : storeOnPressEnterSearchCountForMetaData?.topic_total;

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
                query: { q: router?.query?.q },
              }}
              passHref
            >
              <Button
                size="large"
                className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal disabled:!font-semibold active:!text-canBlue disabled:!border-b-2 disabled:!border-canBlue active:!border-none active:!border-transparent hover:!border-transparent focus:!border-transparent ${
                  router?.pathname === "/search" ? "active" : "btn"
                }`}
                onClick={() => {
                  dispatch(
                    setFilterCanonizedTopics({
                      asofdate: Date.now() / 1000,
                      asof: "default",
                    })
                  );
                }}
              >
                <span className="text-left w-full block">All Results</span>
              </Button>
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
              <Button
                size="large"
                className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 
                    active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal 
                    disabled:!font-semibold active:!text-canBlue disabled:!border-b-2 disabled:!border-canBlue 
                    active:!border-none active:!border-transparent hover:!border-transparent focus:!border-transparent  
                    ${router?.pathname === "/search/topic" ? "active" : "btn"}`}
                // disabled={router?.pathname == "/search/topic" ? true : false}
                // disabled={router?.pathname === "/search/topic"}
                onClick={() => {
                  dispatch(
                    setFilterCanonizedTopics({
                      asofdate: Date.now() / 1000,
                      asof: "default",
                    })
                  );
                }}
              >
                <span className="text-left w-full block">
                  Topic <span>&nbsp;({topicTotal})</span>
                </span>
              </Button>
            </Link>
            <Link
              href={{
                pathname: "/search/camp",
                query: {
                  q: router?.query?.q,
                },
              }}
              passHref
            >
              <Button
                size="large"
                className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 
                active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal 
                disabled:!font-semibold active:!text-canBlue disabled:!border-b-2 disabled:!border-canBlue 
                active:!border-none active:!border-transparent hover:!border-transparent focus:!border-transparent 
                ${router?.pathname === "/search/camp" ? "active" : "btn"}`}
                // disabled={router?.pathname !== "/search/camp"}
                onClick={() => {
                  dispatch(
                    setFilterCanonizedTopics({
                      asofdate: Date.now() / 1000,
                      asof: "default",
                    })
                  );
                }}
              >
                <span className="text-left w-full block">
                  Camp <span>&nbsp;({campTotal})</span>
                </span>
              </Button>
            </Link>
            <Link
              href={{
                pathname: "/search/camp_statement",
                query: { q: router?.query?.q },
              }}
              passHref
            >
              <Button
                size="large"
                className={`p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 
                active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal 
                disabled:!font-semibold active:!text-canBlue disabled:!border-b-2 disabled:!border-canBlue 
                active:!border-none active:!border-transparent hover:!border-transparent focus:!border-transparent 
                ${
                  router?.pathname === "/search/camp_statement"
                    ? "active"
                    : "btn"
                }`}
                // disabled={router?.pathname === "/search/camp_statement"}
                onClick={() => {
                  dispatch(
                    setFilterCanonizedTopics({
                      asofdate: Date.now() / 1000,
                      asof: "default",
                    })
                  );
                }}
              >
                Camp Statement <span>&nbsp;({statementTotal})</span>
              </Button>
            </Link>
            <Link
              href={{
                pathname: "/search/nickname",
                query: { q: router?.query?.q },
              }}
              passHref
            >
              <Button
                size="large"
                className={`
                  p-0 shadow-none border-transparent !rounded-0 !border-t-0 !border-l-0 !border-r-0 
                  active:!bg-transparent disabled:!bg-transparent disabled:!text-canBlue text-base font-normal 
                  disabled:!font-semibold active:!text-canBlue disabled:!border-b-2 disabled:!border-canBlue 
                  active:!border-none active:!border-transparent hover:!border-transparent focus:!border-transparent 
                  ${router.pathname === "/search/nickname" ? "active" : "btn"}
                `}
                // disabled={router.pathname === "/search/nickname"}
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
                <span className="text-left w-full block">
                  Nickname
                  <span>
                    &nbsp;(
                    {storeOnPressEnterSearchCountForMetaData?.nickname_total})
                  </span>
                </span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
