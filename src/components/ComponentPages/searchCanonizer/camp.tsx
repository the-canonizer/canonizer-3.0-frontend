import React, { Fragment } from "react";
import SearchSideBar from "@/components/common/SearchSideBar";
import styles from "./search.module.scss"
import AdvanceFilter from "@/components/common/AdvanceSearchFilter";

const CampSearch=()=>{
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
        <h4>Camp</h4>
        <AdvanceFilter/>
        </div>
<div className={styles.search_lists}>
    <ul>
        <li>
        Canonizer Algorithms
            <div className={styles.tags_all}> <a href="#"> Technological Improvement </a>/ 
                <a href="#"> Approachable Via Science Theory</a>/
                <a href="#">Representational Qualia </a>/
                <a href="#"> Embrace New Technology</a>/
                <a href="#"> </a>
                </div>
        </li>
        <li>
        Technological Improvement
            <div className={styles.tags_all}> <a href="#">Human Accomplishment </a>/ 
                <a href="#"> Approachable Via Science</a>/
                <a href="#">Representational Qualia Theories </a>/
                <a href="#"> Technological Improvement</a>/
                <a href="#"> </a>
                </div>
        </li>
        <li>
        Definition of Technology
            <div className={styles.tags_all}> <a href="#">Human Accomplishment </a>/ 
                <a href="#"> Approachable Via Science</a>/
                <a href="#">reporting on big tech</a>/
                <a href="#"> Technological Improvement</a>/
                <a href="#"> </a>
                </div>
        </li>
        <li>
        Technology is also a particular method
            <div className={styles.tags_all}> <a href="#">Human Accomplishment </a>/ 
                <a href="#"> Approachable Via Science</a>/
                <a href="#">practical application of knowledgeTheories</a>/
                <a href="#"> Technological Improvement</a>/
                <a href="#"> </a>
                </div>
        </li>
        <li>
        Technology News
            <div className={styles.tags_all}> <a href="#">Human Accomplishment </a>/ 
                <a href="#"> Approachable Via Science</a>/
                <a href="#">Breaking news and analysis</a>/
                <a href="#"> Technological Improvement</a>/
                <a href="#"> </a>
                </div>
        </li>
        <li>
        TECHNOLOGY is the practical application
            <div className={styles.tags_all}> <a href="#">Human Accomplishment </a>/ 
                <a href="#"> Approachable Via Science</a>/
                <a href="#">Particular method by which science is used </a>/
                <a href="#"> Technological Improvement</a>/
                <a href="#"> </a>
                </div>
        </li>
        
    </ul>
</div>
        </div>
        </div>
        </Fragment>
       
    )
}

export default CampSearch;