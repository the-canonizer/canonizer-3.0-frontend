import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Menu } from "antd";
import { RightOutlined } from "@ant-design/icons";
import styles from "./siteFooter.module.scss";
import { getFooterSocialLinksApi } from "../../../network/api/footerSocialLinksApi";
import Image from "next/image";
import Link from "next/link";
const { Title } = Typography;

function Footer() {
  const [socialLinks, setSocialLinks] = useState(null);
  useEffect(() => {
    async function linksApiCall() {
      const result = await getFooterSocialLinksApi();

      setSocialLinks(result);
    }
    linksApiCall();
  }, []);
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
                      src="/images/logo.svg"
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
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms &amp; Services</a>
                </li>
              </ul>
            </Col>
            <Col xs={24} sm={14} md={10} lg={12}>
              <div className={styles.navsWrap}>
                <ul>
                  <li>
                    <Link href="">
                      <a>
                        <i className="icon-angle-right"></i> Browse
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <a>
                        <i className="icon-angle-right"></i> Create New Topic
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <a>
                        <i className="icon-angle-right"></i> Upload File
                      </a>
                    </Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link href="">
                      <a>
                        <i className="icon-angle-right"></i> Services
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <a>
                        <i className="icon-angle-right"></i> Help
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <a>
                        <i className="icon-angle-right"></i> White Paper
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <a>
                        <i className="icon-angle-right"></i> Blog
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <a>
                        <i className="icon-angle-right"></i> Jobs
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col xs={24} sm={12} md={7} lg={6}>
              <div className={styles.widgetFollowUs}>
                <Title level={5}>Follow Us</Title>
                <div className={styles.smIcons}>
                  {socialLinks?.map((social, index) => {
                    return (
                      <Link key={social.id} href={social.link}>
                        <a target="_blank">
                          <Image
                            src={social.icon}
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
            contents (2006 - 2021)
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
