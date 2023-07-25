import React, { Fragment } from "react";
import SearchSideBar from "@/components/common/SearchSideBar";
import styles from "./search.module.scss"
import AdvanceFilter from "@/components/common/AdvanceSearchFilter";

const TopicSearch=()=>{
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
        </div>
        </div>
        </Fragment>
       
    )
}

export default TopicSearch;