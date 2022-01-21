import React, { useEffect, useState } from "react";
import { Row, Col, Image, Typography, Menu } from "antd";
import { RightOutlined } from "@ant-design/icons";
import styles from "./siteFooter.module.scss";
import { getFooterSocialLinksApi } from "../../../network/api/footerSocialLinksApi";

const { Title, Link } = Typography;

function Footer() {
  const linksMock = {
    facebook: "https://www.facebook.com",
    twitter: "https://www.twitter.com",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com",
    linkedIn: "https://www.linkedin.com",
  };
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
        <img src="/images/footer-adv-img.png" alt="" />
      </section>
      <footer className={styles.wrap}>
        <div className={styles.container}>
          <Row>
            <Col xs={24} sm={10} md={7} lg={6}>
              <div className={styles.logo}>
                <Link href="/">
                  <img src="/images/logo.svg" alt="Canonizer" />
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
                      <i className="icon-angle-right"></i> Browse
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <i className="icon-angle-right"></i> Create New Topic
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <i className="icon-angle-right"></i> Upload File
                    </Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link href="">
                      <i className="icon-angle-right"></i> Services
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <i className="icon-angle-right"></i> Help
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <i className="icon-angle-right"></i> White Paper
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <i className="icon-angle-right"></i> Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="">
                      <i className="icon-angle-right"></i> Jobs
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col xs={24} sm={12} md={7} lg={6}>
              <div className={styles.widgetFollowUs}>
                <Title level={5}>Follow Us</Title>
                <div className={styles.smIcons}>
                  <Link
                    href={socialLinks?.instagram}
                    target="_blank"
                    className={styles.iconInstagram}
                  >
                    Instagram
                  </Link>
                  <Link
                    href={socialLinks?.facebook}
                    target="_blank"
                    className={styles.iconFacebook}
                  >
                    Facebook
                  </Link>
                  <Link
                    href={socialLinks?.twitter}
                    target="_blank"
                    className={styles.iconTwitter}
                  >
                    Twitter
                  </Link>
                  <Link
                    href={socialLinks?.youtube}
                    target="_blank"
                    className={styles.iconYoutube}
                  >
                    Youtube
                  </Link>
                  <Link
                    href={socialLinks?.linkedIn}
                    target="_blank"
                    className={styles.iconLinkedin}
                  >
                    Linkedin
                  </Link>
                </div>
              </div>
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
            contents (2006 - 2021)
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
