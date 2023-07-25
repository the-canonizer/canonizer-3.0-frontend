import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

import styles from "../siteHeader.module.scss";
import { AutoComplete, Input } from "antd";

const HeaderMenu = ({ loggedUser }) => {
  const renderTitle = (icon:any ,title: string) => (
    <span>
      {icon}{title}
    </span>

  );
  
  const renderItem = (title: any) => ({
    value: title,
    label: (
      <div>
       {title}
        <span>
          {/* <UserOutlined /> */}
        </span>
      </div>
    ),
  });
  const options = [
    {
      label: renderTitle(<i className="icon-topic"></i>,'Topic'),
      options: [renderItem( <div className={styles.search_lists}>
        <ul>
            <li>
                <a href="#">
                    <label>Theories of Consciousness</label>
                </a>
            </li>
            <li>
                <a href="#">
                    <label>God Theories</label>
                </a>
            </li>
        </ul>
    </div>)],
    },
    {
      label: renderTitle(<i className="icon-camp"></i>,'Camp'),
      options: [renderItem( <div className={styles.search_lists}>
        <ul>
            <li>
            Canonizer Algorithms
                <div className={styles.tags_all_search_camp_statement}> <a href="#"> Technological Improvement </a>/ 
                    <a href="#"> Approachable Via Science Theory</a>/
                    <a href="#">Representational Qualia </a>/
                    <a href="#"> Embrace New Technology</a>/
                    <a href="#"> </a>
                    </div>
            </li>
            <li>
            Technological Improvement
                <div className={styles.tags_all_search_camp_statement}> <a href="#"> Human Accomplishment</a>/ 
                    <a href="#"> Approachable Via Science</a>/
                    <a href="#">Representational Qualia Theory </a>/
                    <a href="#"> Technological Improvement</a>/
                    <a href="#"> </a>
                    </div>
            </li>
            
        </ul>
    </div>)],
    },
    {
      label: renderTitle(<i className="icon-camp"></i>,'Camp statement'),
      options: [renderItem(<div className={styles.search_lists}>
        <ul>
            <li>
                <div className="d-flex flex-wrap w-100 mb-1">
                    <a href="" className={styles.search_heading_top}>Mind-Brain Identity</a>
                    <div className={styles.statement_date_search_camp_statement}>
                        <strong>Go live Time : </strong>
                        5/27/2020, 8:04:24 AM
                    </div>
                </div>
                <p>The goal of this topic is to build and track consensus around theories of consciousness. Everyone is invited to contribute, as we want to track the default popular consensus. There is also the “Theories” canonizer people can select, so people can compare the popular consensus with the...</p>
                <div className={styles.tags_all_search_camp_statement}> <a href="#"> Technological Improvement </a>/ 
                    <a href="#"> Approachable Via Science Theory</a>/
                    <a href="#">Representational Qualia </a>/
                    <a href="#"> Embrace New Technology</a>/
                    <a href="#"> </a>
                    </div>

            </li>
        </ul>
    </div>)], 
    },
    {
      label: renderTitle(<i className="icon-camp"></i>,'Nickname'),
      options: [renderItem(<div className={styles.search_lists}>
        <ul>
            <li>
              <div className="d-flex flex-wrap">

                <a href="#">
                    <label>Techno</label>
                </a>
                <span  className="ml_auto suppport_camps">Supported camps: <strong className={styles.yellow_color}>23</strong> </span>
              </div>
            </li>
            
            <li>
              <div className="d-flex flex-wrap">
                <a href="#">
                    <label>RogerAndrews</label>
                </a>
                <span  className="ml_auto suppport_camps">Supported camps: <strong className={styles.yellow_color}>26</strong> </span>
                </div>
            </li>
        </ul>
    </div>)],
    },
    {
      options:[renderItem(<footer><i className="icon-search"></i><a href="/search">Search for</a></footer>)]
    }
  ];

  const links = [
    {
      link: "/browse",
      linkTitle: "Browse",
      id: 1,
    },
    {
      link: "/uploadFile",
      linkTitle: "Upload File",
      id: 2,
    },
    {
      link: "/topic/132-Help/1-Agreement?is_tree_open=1",
      linkTitle: "Help",
      id: 3,
    },
    {
      link: "/files/2012_amplifying_final.pdf",
      linkTitle: "White Paper",
      id: 4,
      external: true,
    },
    {
      link: process.env.NEXT_PUBLIC_BLOG_URL,
      linkTitle: "Blog",
      id: 5,
      external: true,
    },
    {
      link: "/topic/6-Canonizer-Jobs/1-Agreement?is_tree_open=1",
      linkTitle: "Jobs",
      id: 6,
    },
  ];
  const { filterObject, filterByScore, viewThisVersion } = useSelector(
    (state: RootState) => ({
      filterObject: state?.filters?.filterObject,
      filterByScore: state.filters?.filterObject?.filterByScore,
      viewThisVersion: state?.filters?.viewThisVersionCheck,
    })
  );

  const [mockLinks, setMockLinks] = useState(links);

  const router = useRouter();

  useEffect(() => {
    if (!loggedUser?.is_admin) {
      const allLinks = [...mockLinks];
      const filteredLinks = allLinks.filter((obj) => {
        return obj.linkTitle != "Upload File";
      });

      setMockLinks(filteredLinks);
    }
  }, [loggedUser]);

  return (
    <Fragment>
      <nav className={styles.nav}>
        <ul>
          {mockLinks?.map((item, idx) => {
            return (
              <li
                className={router?.asPath === item.link ? styles.active : ""}
                key={item.id + "_" + item.link + "___" + idx}
              >
                {router?.asPath.includes("/topic") || item.external ? (
                  <a
                    href={item.link}
                    rel="noopener noreferrer"
                    target={item.external ? "_blank" : "_self"}
                  >
                    {item.linkTitle}
                  </a>
                ) : (
                  <Link
                    href={`${item.link}?score=${filterByScore}&algo=${
                      filterObject?.algorithm
                    }${
                      filterObject?.asof == "bydate"
                        ? "&asofdate=" + filterObject?.asofdate
                        : ""
                    }&asof=${filterObject?.asof}&canon=${
                      filterObject?.namespace_id
                    }${viewThisVersion ? "&viewversion=1" : ""}`}
                  >
                    <a>{item.linkTitle}</a>
                  </Link>
                )}
              </li>
            );
          })}
          
        </ul>
      </nav>
      <AutoComplete
              popupClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={500}
              className={"search_header"}
              options={options}
            > 
          <Input size="large" placeholder="Search for" prefix={<i className="icon-search"></i>} />
         </AutoComplete>
    </Fragment>
  );
};

export default HeaderMenu;
