import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "@/components/common/SearchSideBar";
import styles from "./search.module.scss"
import AdvanceFilter from "@/components/common/AdvanceSearchFilter";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const TopicSearch=()=>{
    const { searchData } = useSelector((state: RootState) => ({
        searchData: state?.searchSlice?.searchData,
      }));
    return(
        <Fragment>
            <aside className="leftSideBar miniSideBar">
          <div className="leftSideBar_Card p-0 m-0">
            <SearchSideBar />
          </div>
        </aside>
        
        <div className="pageContentWrap">
        <div className={styles.card}>
        <div className="d-flex mb-2 align-items-center flex-wrap relative">
        <h4>Topic</h4>
            <AdvanceFilter/>
        </div>
            <div className={styles.search_lists}>
                <ul>
                    {searchData.topic.map((x)=>{
                    return(<>
                     <li>
                        <Link href={x.link}>
                        <a>
                            <label>{x.type_value}</label>
                        </a>
                        </Link>
                        
                        <span  className={styles.ml_auto}>{x.namespace}</span>
                    </li>
                    </>)
                       
                    })}
                    
                </ul>
            </div>
        </div>
        </div>
        </Fragment>
       
    )
}

export default TopicSearch;