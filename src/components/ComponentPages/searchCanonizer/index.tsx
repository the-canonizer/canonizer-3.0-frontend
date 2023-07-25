import React, { Fragment } from "react";
import SearchSideBar from "@/components/common/SearchSideBar";
import styles from "./search.module.scss"
import { List, Tag } from "antd";
import Link from "next/link";
const Search=()=>{
    return(
        <Fragment>
            <aside className="leftSideBar miniSideBar">
          <div className="leftSideBar_Card p-0 m-0">
            <SearchSideBar />
          </div>
        </aside>
        <div className="pageContentWrap">

        <div className={styles.card}>
            <h4>Topic</h4>
            <div className={styles.search_lists}>
                <ul>
                    <li>
                        <a href="#">
                            <label>Theories of Consciousness</label>
                        </a>
                        <span  className={styles.ml_auto}>Corporation</span>
                    </li>
                    <li>
                        <a href="#">
                            <label>God Theories</label>
                        </a>
                        <span className={styles.ml_auto}>crypto_currency</span>
                    </li>
                    <li>
                        <a href="#">
                            <label>Hard Problem Theories</label>
                        </a>
                        <span className={styles.ml_auto}>family</span>
                    </li>
                    <li>
                        <a href="#">
                            <label>Religious Preference Theories</label>
                        </a>
                        <span className={styles.ml_auto}>family/jesperson_oscar</span>
                    </li>
                    <li>
                        <a href="#">
                            <label>Technological Improvement Theory</label>
                        </a>
                        <span className={styles.ml_auto}>Occupy wall street</span>
                    </li>
                </ul>
            </div>
            <h4>Camp</h4>

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
                        <div className={styles.tags_all}> <a href="#"> Human Accomplishment</a>/ 
                            <a href="#"> Approachable Via Science</a>/
                            <a href="#">Representational Qualia Theory </a>/
                            <a href="#"> Technological Improvement</a>/
                            <a href="#"> </a>
                            </div>
                    </li>
                    
                </ul>
            </div>


            <h4>Camp Statement</h4>
            <div className={styles.search_lists}>
                <ul>
                    <li>
                        <div className="d-flex flex-wrap w-100 mb-1">
                            <a href="" className={styles.search_heading}>Mind-Brain Identity</a>
                            <div className={styles.statement_date}>
                                <strong>Go live Time : </strong>
                                5/27/2020, 8:04:24 AM
                            </div>
                        </div>
                        <p>The goal of this topic is to build and track consensus around theories of consciousness. Everyone is invited to contribute, as we want to track the default popular consensus. There is also the “Theories” canonizer people can select, so people can compare the popular consensus with the...</p>
                        <div className={styles.tags_all}> <a href="#"> Technological Improvement </a>/ 
                            <a href="#"> Approachable Via Science Theory</a>/
                            <a href="#">Representational Qualia </a>/
                            <a href="#"> Embrace New Technology</a>/
                            <a href="#"> </a>
                            </div>

                    </li>
                    
                   
                </ul>
            </div>


            <h4>Nickname</h4>
            <div className={styles.search_lists}>
                <ul>
                    <li>
                        <a href="#">
                            <label>Techno</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    
                    <li>
                        <a href="#">
                            <label>RogerAndrews</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                    </li>
                </ul>
            </div>
         </div>
        </div>
        </Fragment>
       
    )
}

export default Search;