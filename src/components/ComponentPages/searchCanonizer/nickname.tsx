import React, { Fragment } from "react";
import SearchSideBar from "@/components/common/SearchSideBar";
import styles from "./search.module.scss"
import AdvanceFilter from "@/components/common/AdvanceSearchFilter";

const NicknameSearch=()=>{
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
        <h4>Nickname</h4>
        <AdvanceFilter/>
        </div>
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
                    <li>
                        <a href="#">
                            <label>BruceYoung</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>tylergreen</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>royHayes</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>tylerfisher</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>alan_ford</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>dennis_weber</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>bobbyMarshall</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>steveWallace</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                    </li>
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
                    <li>
                        <a href="#">
                            <label>BruceYoung</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>tylergreen</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>royHayes</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>tylerfisher</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>alan_ford</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>dennis_weber</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>bobbyMarshall</label>
                        </a>
                        <span  className={styles.ml_auto}>Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
                    </li>
                    <li>
                        <a href="#">
                            <label>steveWallace</label>
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

export default NicknameSearch;