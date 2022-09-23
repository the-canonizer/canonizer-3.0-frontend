import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography } from "antd";
import styles from "./siteFooter.module.scss";
import { getFooterSocialLinksApi } from "../../../network/api/footerSocialLinksApi";
import Image from "next/image";
import Link from "next/link";
const { Title } = Typography;
import K from "../../../constants";

function Footer() {
  const router = useRouter();
  const [socialLinks, setSocialLinks] = useState(null);
  useEffect(() => {
    async function linksApiCall() {
      const result = await getFooterSocialLinksApi();

      setSocialLinks(result);
    }
    linksApiCall();
  }, []);

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
      link: "https://canonizer.com/blog/",
      linkTitle: "Blog",
      id: 7,
    },
    {
      link: "/topic/6-Canonizer-Jobs/1-Agreement",
      linkTitle: "Jobs",
      id: 8,
    },
  ];

  return (
    <>
      <section className={styles.adv}>
        <Image
          src="/images/footer-adv-img.png"
          alt=""
          width={1054}
          height={184}
          layout="intrinsic"
        />
      </section>
      <footer className={styles.wrap}>
        <div className={styles.container}>
          <Row>
            <Col xs={24} sm={10} md={7} lg={6}>
              <div className={styles.logo}>
                <Link href="/">
                  <a>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/site-images/logo.svg`}
                      alt="Canonizer"
                      width={142}
                      height={26}
                      layout="intrinsic"
                    />
                  </a>
                </Link>
              </div>
              <p>Pattent: US 8,160,970 B2</p>
              <ul className={styles.privacyTerms}>
                <li>
                  <Link href="/privacy-policy">
                    <a>Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-services">
                    <a>Terms &amp; Services</a>
                  </Link>
                </li>
              </ul>
            </Col>
            <Col xs={24} sm={14} md={10} lg={12}>
              <div className={styles.navsWrap}>
                <Row gutter={20}>
                  <Col xs={24} md={12}>
                    <ul>
                      {mockLinks1?.map((item) => {
                        return (
                          <li key={item.id}>
                            <Link href={item.link}>
                              <a>
                                <i className="icon-angle-right"></i>{" "}
                                {item.linkTitle}
                              </a>
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
                            {router.asPath.includes("/topic") ? (
                              <a
                                href={item.link}
                                rel="noopener noreferrer"
                                target={
                                  item?.linkTitle == "White Paper"
                                    ? "_blank"
                                    : "_self"
                                }
                              >
                                <i className="icon-angle-right"></i>{" "}
                                {item.linkTitle}
                              </a>
                            ) : (
                              <Link href={item.link}>
                                <a>
                                  <i className="icon-angle-right"></i>{" "}
                                  {item.linkTitle}
                                </a>
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
              <div className={styles.widgetFollowUs}>
                <Title level={5}>Follow Us</Title>
                <div className={styles.smIcons}>
                  {socialLinks?.map((social) => {
                    return (
                      <Link key={social.id} href={social.link}>
                        <a target="_blank">
                          <Image
                            src={K.Network.URL.BaseImagesURL + social.icon}
                            alt={social.label}
                            width={28}
                            height={28}
                            layout="intrinsic"
                          />
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className={styles.supportWidget}>
                <Title level={5}>Comments and Questions:</Title>
                <Link href="mailto:support@canonizer.com">
                  <a>
                    <i className="icon-envelope"></i> support@canonizer.com
                  </a>
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
    </>
  );
}

export default Footer;
