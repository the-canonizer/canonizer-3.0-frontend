// import React, { Fragment, useEffect, useState } from "react";
// import SearchSideBar from "../../common/SearchSideBar";
// import styles from "./search.module.scss";
// import { List, Tag } from "antd";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "src/store";
// import moment from "moment";
// import { globalSearchCanonizer } from "src/network/api/userApi";
// import queryParams from "src/utils/queryParams";
// import { setSearchData } from "src/store/slices/searchSlice";
// import { useRouter } from "next/router";
// import CustomSkelton from "@/components/common/customSkelton";
// const Search = () => {

//   const dispatch = useDispatch();
//   const [loader, setloader] = useState(true)
  
//   const { searchData } = useSelector((state: RootState) => ({
//     searchData: state?.searchSlice?.searchData,
//   }));

//   const router = useRouter();

//   const getGlobalSearchCanonizer = async (queryString, onPresEnter) => {
//     let response = await globalSearchCanonizer(
//       queryParams({ term: queryString })
//     );
//     if (response) {
//       dispatch(setSearchData(response?.data?.data));
//     }
//   };

//   useEffect(() => {
//     const searchValue = router?.asPath?.split("=")[1].split("+").join(" ")?.replace(/%20/g, " ")
//     if (searchData.camp.length == 0 && searchData.nickname.length == 0 && searchData.statement.length == 0 && searchData.topic.length == 0) {
//       getGlobalSearchCanonizer(searchValue, true);
//     }

//     if(searchData.camp.length > 0 || searchData.nickname.length > 0 || searchData.statement.length > 0 || searchData.topic.length > 0){
//       setloader(false)
//     }

//   }, [searchData])


//   const covertToTime = (unixTime) => {
//     return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
//   };
//   return (
//     <Fragment>
//       <aside className="leftSideBar miniSideBar">
//         <div className="leftSideBar_Card p-0 m-0">
//           <SearchSideBar />
//         </div>
//       </aside>
//       <div className="pageContentWrap">
//         <div className={styles.card}>
//           <h4 data-testid="all_topic_heading">Topic</h4>
//           <div className={styles.search_lists}>
//             <ul>
//               {!loader ? searchData.topic.length > 0 ? searchData?.topic?.slice(0, 5).map((x,index) => (
//                 <li  key={index}>
//                   <Link href={x.link}>
//                     <a>
//                       <label style={{ cursor: "pointer" }}>{x.type_value}</label>
//                     </a>
//                   </Link>

//                   <span className={styles.ml_auto}>{x.namespace}</span>
//                 </li>)
//               ):<div style={{textAlign:"center"}}><h4>No Data Found</h4></div> : <CustomSkelton
//                 skeltonFor="list"
//                 bodyCount={2}
//                 stylingClass="listSkeleton"
//                 isButton={false}
//               />}
//             </ul>
//           </div>
//           <h4 data-testid="all_camp_heading">Camp</h4>
//           <div className={styles.search_lists}>
//             {
//               !loader ? searchData.camp.length > 0 ? <ul>
//                 {searchData?.camp?.slice(0, 5).map((x) => {
//                   const jsonData = JSON.parse(
//                     x.breadcrumb_data
//                   ) as Array<any>;
//                   const parsedData = jsonData.reduce(
//                     (accumulator, currentVal, index) => {
//                       const accIndex = index + 1;
//                       accumulator[index] = {
//                         camp_name: currentVal[accIndex]?.camp_name == "Agreement" ? currentVal[accIndex].topic_name : currentVal[accIndex].camp_name,
//                         camp_link: currentVal[accIndex]?.camp_link,
//                         topic_name: currentVal[accIndex]?.topic_name,
//                       };
//                       return accumulator;
//                     },
//                     []);
//                   return (
//                     <>
//                       <li>
//                         <Link href={`/${jsonData[0][1].camp_link}`}>
//                           <a> {x.type_value}</a>

//                         </Link>
//                         <div className={styles.tags_all}>
//                           {parsedData.reverse().map((obj, index) => {
//                             return (
//                               <>
//                                 <a href={`/${obj.camp_link}`} key={`/${obj.camp_link}`}>
//                                   {obj.camp_name}
//                                   {index < parsedData.length - 1 ? "/ " : ""}
//                                 </a>
//                               </>
//                             );
//                           })}
//                         </div>
//                       </li>
//                     </>)
//                 })}
//               </ul>:<div style={{textAlign:"center"}}><h4>No Data Found</h4></div> : <CustomSkelton
//                 skeltonFor="list"
//                 bodyCount={2}
//                 stylingClass="listSkeleton"
//                 isButton={false}
//               />
//             }

//           </div>

//           <h4 data-testid="all_camp_statement_heading">Camp Statement</h4>
//           <div className={styles.search_lists}>
//             {
//               !loader ? searchData.statement.length > 0 ? <ul>
//                 {searchData?.statement?.slice(0, 5).map((x) => {
//                   const jsonData = JSON.parse(
//                     x.breadcrumb_data
//                   ) as Array<any>;
//                   const parsedData = jsonData.reduce(
//                     (accumulator, currentVal, index) => {
//                       const accIndex = index + 1;
//                       accumulator[index] = {
//                         camp_name: currentVal[accIndex]?.camp_name == "Agreement" ? currentVal[accIndex].topic_name : currentVal[accIndex].camp_name,
//                         camp_link: currentVal[accIndex]?.camp_link,
//                       };
//                       return accumulator;
//                     },
//                     []
//                   );
//                   return (<>
//                     <li>
//                       <a href={jsonData[0][1].camp_link}>
//                         <h3 className={styles.statement_heading}>{jsonData.length > 1 ? jsonData?.[0]?.[1]?.camp_name : jsonData?.[0]?.[1]?.topic_name}</h3>
//                       </a>
//                       <div className={styles.statement_date}>
//                         <strong>Go live Time : </strong>
//                         {covertToTime(x.go_live_time)}
//                       </div>
//                       <div className="d-flex flex-wrap w-100 mb-1">
//                         {/* <a className={styles.search_heading}>  */}

//                         <div
//                           dangerouslySetInnerHTML={{
//                             __html: x.type_value.substring(0, 800) + "...",
//                           }}
//                         ></div>
//                       </div>
//                       <div className={styles.tags_all}>
//                         {parsedData.reverse().map((obj, index) => {
//                           return (
//                             <>
//                               <a href={obj.camp_link} key={obj.camp_link}>
//                                 {obj.camp_name}
//                                 {index < parsedData.length - 1 ? "/ " : ""}
//                               </a>
//                             </>
//                           );
//                         })}
//                       </div>
//                     </li>
//                   </>
//                   );
//                 })}
//               </ul>:<div style={{textAlign:"center"}}><h4>No Data Found</h4></div> : <CustomSkelton
//                 skeltonFor="directSupportCampsCard"
//                 bodyCount={2}
//                 stylingClass="listSkeleton"
//                 isButton={false}
//               />
//             }

//           </div>

//           <h4 data-testid="all_nick_name_heading">Nickname</h4>
//           <div className={styles.search_lists}>
//             {
//               !loader ? searchData.nickname.length > 0 ? <ul>
//                 {searchData?.nickname?.slice(0, 5).map((x) => {
//                   return (<>
//                     <li>
//                       <Link href={x.link}>
//                         <a>
//                           <label style={{ cursor: "pointer" }}>{x.type_value}</label>
//                         </a>
//                       </Link>

//                       <span className={styles.ml_auto}>
//                         Supported camps:{" "}
//                         <strong className={styles.yellow_color}>
//                           {x.support_count}
//                         </strong>{" "}
//                       </span>
//                     </li>
//                   </>
//                   );
//                 })}
//               </ul>: <div style={{textAlign:"center"}}><h4>No Data Found</h4></div> : <CustomSkelton
//                 skeltonFor="list"
//                 bodyCount={2}
//                 stylingClass="listSkeleton"
//                 isButton={false}
//               />
//             }

//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default Search;
