import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import styles from "../siteHeader.module.scss";

const HeaderMenu = ({ loggedUser }) => {
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
      link: "/topic/132-Help/1-Agreement",
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
      link: "/topic/6-Canonizer-Jobs/1-Agreement",
      linkTitle: "Jobs",
      id: 6,
    },
  ];

  const [mockLinks, setMockLinks] = useState(links);

  
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
                className={pathname === item.link ? styles.active : ""}
                key={item.id + "_" + item.link + "___" + idx}
              >
                {searchParams?.has("/topic") || item.external ? (
                  <a
                    href={item.link}
                    rel="noopener noreferrer"
                    target={item.external ? "_blank" : "_self"}
                  >
                    {item.linkTitle}
                  </a>
                ) : (
                  <Link href={{ pathname: item.link }} passHref>
                    {item.linkTitle}
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
