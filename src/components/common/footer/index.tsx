import { useRouter } from "next/router";
import { Row, Col, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

import styles from "./siteFooter.module.scss";

import { RootState } from "src/store";
import { Fragment } from "react";

const { Title } = Typography;

function Footer() {
  const router = useRouter();
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  const mockLinks1 = [
    {
      link: "/browse",
      linkTitle: "Browse",
      id: 1,
    },
    {
      link: "/create/topic",
      linkTitle: "Create New Topic",
      id: 3,
    },
    {
      link: "/uploadFile",
      linkTitle: "Upload File",
      id: 5,
    },
  ];
  const mockLinks2 = [
    {
      link: "/topic/132-Help/1-Agreement",
      linkTitle: "Help",
      id: 4,
    },
    {
      link: "/files/2012_amplifying_final.pdf",
      linkTitle: "White Paper",
      id: 6,
      external: true,
    },
    {
      link: process.env.NEXT_PUBLIC_BLOG_URL,
      linkTitle: "Blog",
      id: 7,
      external: true,
    },
    {
      link: "/topic/6-Canonizer-Jobs/1-Agreement",
      linkTitle: "Jobs",
      id: 8,
    },
  ];

  const filterMockLinks = mockLinks1.filter((obj) => {
    return obj.id != 5;
  });

  return (
    <Fragment>
      <footer className={styles.wrap}>
        <div className={styles.container}>
          <Row>
            <Col xs={24} sm={10} md={7} lg={6}>
              <div className={styles.logo}>
                <Link href="/">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/site-images/logo.svg`}
                    alt="Canonizer"
                    width={142}
                    height={26}
                    layout="intrinsic"
                  />
                </Link>
              </div>
              <p>Patent: US 8,160,970 B2</p>
              <ul className={styles.privacyTerms}>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms-and-services">Terms &amp; Services</Link>
                </li>
              </ul>
            </Col>
            <Col xs={24} sm={14} md={10} lg={12}>
              <div className={styles.navsWrap}>
                <Row gutter={20}>
                  <Col xs={24} md={12}>
                    <ul>
                      {(loggedInUser?.is_admin == true
                        ? mockLinks1
                        : filterMockLinks
                      )?.map((item) => {
                        return (
                          <li key={item.id}>
                            <Link href={item.link}>
                              <i className="icon-angle-right"></i>{" "}
                              {item.linkTitle}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Col>
                  <Col xs={24} md={12}>
                    <ul>
                      {mockLinks2?.map((item) => {
                        return (
                          <li key={item.id}>
                            {router?.asPath.includes("/topic") ||
                            item.external ? (
                              <a
                                href={item.link}
                                rel="noopener noreferrer"
                                target={item.external ? "_blank" : "_self"}
                              >
                                <i className="icon-angle-right"></i>{" "}
                                {item.linkTitle}
                              </a>
                            ) : (
                              <Link href={item.link}>
                                <i className="icon-angle-right"></i>{" "}
                                {item.linkTitle}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={24} sm={12} md={7} lg={6}>
              <div className={styles.supportWidget}>
                <Title level={5}>Comments and Questions:</Title>
                <Link href="mailto:support@canonizer.com">
                  <i className="icon-envelope"></i> support@canonizer.com
                </Link>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.copyRights}>
          <p>
            Copyright owned by the volunteers contributing to the system and its
            contents (2006 - {new Date().getFullYear()})
          </p>
        </div>
      </footer>
    </Fragment>
  );
}

export default Footer;
