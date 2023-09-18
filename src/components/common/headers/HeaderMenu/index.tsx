import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

import styles from "../siteHeader.module.scss";
import TopicCreationBTN from "../TopicCreationBTN";

const HeaderMenu = ({ loggedUser }) => {
  const links = [
    {
      link: "/browse",
      linkTitle: "Browse",
      id: 1,
    },
    // {
    //   link: "/uploadFile",
    //   linkTitle: "Upload File",
    //   id: 2,
    // },
    {
      link: process.env.NEXT_PUBLIC_BLOG_URL,
      linkTitle: "Blog",
      id: 5,
      external: true,
    },
    {
      link: "/topic/132-Help/1-Agreement?is_tree_open=1",
      linkTitle: "Help",
      id: 3,
    },
    // {
    //   link: "/files/2012_amplifying_final.pdf",
    //   linkTitle: "White Paper",
    //   id: 4,
    //   external: true,
    // },

    // {
    //   link: "/topic/6-Canonizer-Jobs/1-Agreement?is_tree_open=1",
    //   linkTitle: "Jobs",
    //   id: 6,
    // },
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

  const getQueryParams = () => {
    let isbool = false;
    let params = "?";
    if (filterObject?.filterByScore != 0) {
      params = params + `score=${filterObject?.filterByScore}&`;
      isbool = true;
    }
    if (filterObject?.algorithm != "blind_popularity") {
      params = params + `algo=${filterObject?.algorithm}&`;
      isbool = true;
    }
    if (filterObject?.asof != "default") {
      params = params + `asof=${filterObject?.asof}&`;
      isbool = true;
    }
    if (filterObject?.asof == "bydate") {
      params = params + `asofdate=${filterObject?.asofdate}&`;
      isbool = true;
    }
    if (filterObject?.namespace_id != 1) {
      params = params + `canon=${filterObject?.namespace_id}&`;
      isbool = true;
    }
    if (viewThisVersion) {
      params = params + `viewversion=1&`;
      isbool = true;
    }
    params = params.slice(0, -1);
    return params;
  };

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
          <li
            className={`topicDeskBTN ${
              router?.asPath === "/create/topic" ? styles.active : ""
            }`}
            key="create-topic-li"
          >
            <TopicCreationBTN key="create-topic-area" />
          </li>
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
                  <Link href={`${item.link}${getQueryParams()}`}>
                    <a>{item.linkTitle}</a>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </Fragment>
  );
};

export default HeaderMenu;
