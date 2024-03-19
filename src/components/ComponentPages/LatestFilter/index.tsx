import { CloseOutlined } from "@ant-design/icons";
import { Space, Tag } from "antd";
import moment from "moment";
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "src/store";
import { setFilterCanonizedTopics, setViewThisVersion } from "src/store/slices/filtersSlice";
import {
    setScoreCheckBox,
    setArchivedCheckBox,
  } from "src/store/slices/utilsSlice";
import { useRouter } from "next/router";
import styles from "./latestFilter.module.scss"

const LatestFilter = ()=>{
  const router = useRouter();
    const dispatch = useDispatch()
    const { campRecord } = useSelector((state: RootState) => ({
        campRecord: state?.topicDetails?.currentCampRecord,
      }));
      const {algorithms,selectedAlgorithm, is_camp_archive_checked,is_checked,filteredAsOfDate,includeReview,filteredScore,current_date_filter,filterObject,viewThisVersion,campScoreValue,selectedAsOf} = useSelector(
        (state: RootState) => ({
          is_camp_archive_checked: state?.utils?.archived_checkbox,
          loading: state?.loading?.loading,
          is_checked: state?.utils?.score_checkbox,
          filteredAsOfDate: state?.filters?.filterObject?.asofdate,
          includeReview: state?.filters?.filterObject?.includeReview,
          filteredScore: state?.filters?.filterObject?.filterByScore,
          selectedAlgorithm: state?.filters?.filterObject?.algorithm,
          algorithms: state.homePage?.algorithms,
          current_date_filter: state?.filters?.current_date,
          filterObject: state?.filters?.filterObject,
          viewThisVersion: state?.filters?.viewThisVersionCheck,
          campScoreValue: state?.filters?.campWithScoreValue,
          selectedAsOf: state?.filters?.filterObject?.asof,
        })
      );
      const lable = algorithms?.find((obj)=>{
        return obj.algorithm_key == selectedAlgorithm
      })
      const onChangeRoute = (
        filterByScore = filterObject?.filterByScore,
        algorithm = filterObject?.algorithm,
        asof = filterObject?.asof,
        asofdate = filterObject?.asofdate,
        namespace_id = filterObject?.namespace_id,
        viewversion = viewThisVersion
      ) => {
        let query: any = {
          score: filterByScore,
          algo: algorithm,
          canon: namespace_id,
          asof: asof,
          filter: campScoreValue || "10",
        };
    
        if (asof === "bydate") {
          query.asofdate = asofdate;
        }
    
        if (viewversion) {
          query.viewversion = "1";
        }
    if(router){
        router.query = { ...router?.query, ...query }}
    
        if (asof !== "bydate") {
          delete router?.query.asofdate;
        }
    
        if (String(filterByScore) === "0") {
          delete router?.query.score;
        }
    
        if (String(namespace_id) === "1") {
          delete router?.query.canon;
        }
    
        if (!namespace_id && String(namespace_id) === "0") {
          delete router.query.canon;
        }
    
        if (asof === "default") {
          delete router?.query.asof;
        }
    
        if (!query?.canon) {
          delete router?.query.canon;
        }
    
        if (algorithm === "blind_popularity") {
          delete router?.query.algo;
        }
    
        if (String(campScoreValue) === "10") {
          delete router?.query.filter;
        }
    
        if (
          router?.query.filter === "undefined" ||
          router?.query.filter === undefined ||
          router?.query.filter === "null" ||
          router?.query.filter === null
        ) {
          delete router?.query.filter;
        }
    
        router?.replace(router, null, { shallow: true });
      };

      
      const filterForAsofDate = ()=>{
        dispatch(setViewThisVersion(false));
        dispatch(
            setFilterCanonizedTopics({
              asof: "default",
            })
          )
          onChangeRoute(
            filterObject?.filterByScore,
            filterObject?.algorithm,
            "default",
            Date.now() / 1000,
            filterObject?.namespace_id,
            viewThisVersion
          );

      }
      const filterscore = ()=>{
        dispatch(setViewThisVersion(false));
        dispatch(
          setFilterCanonizedTopics({
            filterByScore: 0,
          })
        );
        onChangeRoute(
          0,
          filterObject?.algorithm,
          filterObject?.asof,
          filterObject?.asofdate,
          filterObject?.namespace_id,
          viewThisVersion
        );

      }
      const algoRevert = ()=>{
        onChangeRoute(
          filterObject?.filterByScore,
          "blind_popularity",
          filterObject?.asof,
          filterObject?.asofdate,
          filterObject?.namespace_id,
          viewThisVersion
        );
      }
      const clearAllFilter =()=>{
        dispatch(setArchivedCheckBox(false))
        dispatch(setScoreCheckBox(false))
        dispatch(setFilterCanonizedTopics({
            filterByScore: 0,
          }))
        dispatch(setArchivedCheckBox(false))
        dispatch(setArchivedCheckBox(false))
        filterForAsofDate()
      }
      let filteredDate = moment(filteredAsOfDate * 1000).format("YYYY-MM-DD");
    return (
    <div className={styles.selected_filter_area}>
      {(router?.query?.algo&&selectedAlgorithm && lable?.algorithm_label !==undefined)||is_camp_archive_checked||is_checked||selectedAsOf== "bydate"||includeReview||filteredScore != 0?<span>
      <label className={styles.selected_filter_heading} data-testid="Selected filter">
        Selected filter
    </label>
    <span className={styles.clear_all_filter} onClick={clearAllFilter} data-testid="clear_all">
            (Clear All)
        </span>
        </span>:""}

    <Space size={[0, 18]} wrap>
      {router?.query?.algo&&selectedAlgorithm && lable?.algorithm_label !==undefined?<Tag icon={<CloseOutlined onClick={()=>{algoRevert()}}/>}>{lable?.algorithm_label}</Tag>:""}
      {is_camp_archive_checked?<Tag icon={<CloseOutlined onClick={()=>{dispatch(setArchivedCheckBox(false))}} data-testid="close_icon_archived_camps"/>}data-testid="archived_camps">Show archived camps</Tag>:""}
      {is_checked?<Tag icon={<CloseOutlined onClick={()=>{dispatch(setScoreCheckBox(false))}} data-testid="close_icon_100%_of_canonized_score"/>} data-testid="100%_of_canonized_score">100% of canonized score</Tag>:""}
      {selectedAsOf == "bydate"?<Tag icon={<CloseOutlined onClick={filterForAsofDate}  data-testid="close_icon_as_of_date"/>} data-testid="asOfDate">{`As of date: ${filteredDate}`}</Tag>:""}
      {includeReview?<Tag icon={<CloseOutlined onClick={filterForAsofDate} data-testid="close_icon_include_review"/>} data-testid="include_review">{`Include review`}</Tag>:""}
      {filteredScore != 0?<Tag icon={<CloseOutlined  onClick={filterscore} data-testid="close_icon_Score"/>} data-testid="Score">{`Score < ${filteredScore}`}</Tag>:""}
    </Space>
  </div>
    )
}

export default LatestFilter;