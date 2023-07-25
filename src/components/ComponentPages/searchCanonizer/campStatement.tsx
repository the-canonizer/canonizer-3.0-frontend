import React, { Fragment } from "react";
import SearchSideBar from "@/components/common/SearchSideBar";
import styles from "./search.module.scss"
import AdvanceFilter from "@/components/common/AdvanceSearchFilter";

const CampStatementSearch=()=>{
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
        <h4>Camp Statement</h4>
        <AdvanceFilter/>
        </div>
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
                    <li>
                        <div className="d-flex flex-wrap w-100 mb-1">
                            <a href="" className={styles.search_heading}>Spacetime geometry</a>
                            <div className={styles.statement_date}>
                                <strong>Go live Time : </strong>
                                5/27/2020, 8:04:24 AM
                            </div>
                        </div>
                        <p>technology, the application of scientific knowledge to the practical aims of human life or, as it is sometimes phrased, to the change and manipulation of ...</p>
                        <div className={styles.tags_all}> <a href="#"> Technological Improvement </a>/ 
                            <a href="#"> Approachable Via Science Theory</a>/
                            <a href="#">Representational Qualia </a>/
                            <a href="#"> Embrace New Technology</a>/
                            <a href="#"> </a>
                            </div>

                    </li>
                    <li>
                        <div className="d-flex flex-wrap w-100 mb-1">
                            <a href="" className={styles.search_heading}>Scientific knowledge for practical purposes</a>
                            <div className={styles.statement_date}>
                                <strong>Go live Time : </strong>
                                5/27/2020, 8:04:24 AM
                            </div>
                        </div>
                        <p>The definition of Technology is the branch of knowledge that deals with the creation and use of technical means and their interrelation with life, society, ...</p>
                        <div className={styles.tags_all}> <a href="#"> Technological Improvement </a>/ 
                            <a href="#"> Approachable Via Science Theory</a>/
                            <a href="#">Representational Qualia </a>/
                            <a href="#"> Embrace New Technology</a>/
                            <a href="#"> </a>
                            </div>

                    </li>
                    <li>
                        <div className="d-flex flex-wrap w-100 mb-1">
                            <a href="" className={styles.search_heading}>Application of scientific knowledge</a>
                            <div className={styles.statement_date}>
                                <strong>Go live Time : </strong>
                                5/27/2020, 8:04:24 AM
                            </div>
                        </div>
                        <p>From the earliest stone tools to the latest advances in artificial intelligence, robotics, blockchains and virtual reality, technology has continuously ...</p>
                        <div className={styles.tags_all}> <a href="#"> Technological Improvement </a>/ 
                            <a href="#"> Approachable Via Science Theory</a>/
                            <a href="#">Representational Qualia </a>/
                            <a href="#"> Embrace New Technology</a>/
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

export default CampStatementSearch;