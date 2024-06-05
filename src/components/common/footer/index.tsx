import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

import styles from "./siteFooter.module.scss";

import { RootState } from "src/store";

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
      linkTitle: "Create Topic",
      id: 3,
    },
    {
      link: "/uploadFile",
      linkTitle: "Upload File",
      id: 5,
    },
    {
      link: "/sitemap",
      linkTitle: "Sitemap",
      id: 10,
      external: true,
    },
  ];

  const mockLinks2 = [
    {
      link: "/topic/132-Help/1-Agreement?is_tree_open=1",
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
      link: "/topic/6-Canonizer-Jobs/1-Agreement?is_tree_open=1",
      linkTitle: "Jobs",
      id: 8,
    },
  ];

  const [mockLinks, setMockLinks] = useState(mockLinks1);

  useEffect(() => {
    if (!loggedInUser?.is_admin) {
      const allLinks = [...mockLinks];
      const filteredLinks = allLinks.filter((obj) => {
        return obj.link != "/uploadFile";
      });

      setMockLinks(filteredLinks);
    } else {
      setMockLinks(mockLinks1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser]);

  return (
    <Fragment>
      <footer className={`printHIde bg-black px-4 py-4`}>
        <Row gutter={20}>
          <Col xs={24} sm={10} md={7} lg={8}>
            <div className="mb-3">
              <Link href="/">
                <a>
                  <Image
                    src={`/images/logo-white.svg`}
                    alt="Canonizer"
                    width={142}
                    height={26}
                    layout="intrinsic"
                  />
                </a>
              </Link>
            </div>
            <p className="text-14 font-inter font-normal text-white">
              Canonizer is an
              <a
                href="https://github.com/the-canonizer/canonizer-3.0-frontend"
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                open source{" "}
              </a>{" "}
              project designed to build consensus and bring people together.
              Your collaboration can make all the difference.{" "}
              <Link href="/login">
                <a className="font-semibold underline">Join us!</a>
              </Link>
            </p>
            <p className="font-semibold text-white text-14 mt-3">
              Patent: US 8,160,970 B2
            </p>
            {/* <ul className={styles.privacyTerms}>
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
              </ul> */}
          </Col>
          <Col xs={24} sm={14} md={10} lg={10}>
            <Row gutter={20} className="px-0 md:px-6">
              <Col xs={24} md={12} className="text-white">
                <Typography.Paragraph className="text-base text-semibold text-white">
                  Explore
                </Typography.Paragraph>
                <ul>
                  {mockLinks?.map((item) => (
                    <li key={item.id} className="text-14 font-normal">
                      {item?.external ? (
                        <a
                          href={item.link}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.linkTitle}
                        </a>
                      ) : (
                        <Link href={item.link}>
                          <a>{item.linkTitle}</a>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={24} md={12} className="text-white">
                <Typography.Paragraph className="text-base text-semibold text-white">
                  Learn More{" "}
                </Typography.Paragraph>
                <ul>
                  {mockLinks2?.map((item) => {
                    return (
                      <li key={item.id} className="text-14 font-normal">
                        {router?.asPath.includes("/topic") || item.external ? (
                          <a
                            href={item.link}
                            rel="noopener noreferrer"
                            target={item.external ? "_blank" : "_self"}
                          >
                            {item.linkTitle}
                          </a>
                        ) : (
                          <Link href={item.link}>
                            <a>{item.linkTitle}</a>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={12} md={7} lg={6}>
            <div className="bg-zinc-500 rounded-lg px-3 py-4">
              <Typography.Paragraph className="text-14 text-white">
                Comments and Questions:
              </Typography.Paragraph>
              <Link href="mailto:support@canonizer.com">
                <a className="text-white text-medium font-medium">
                  <i className="icon-envelope mr-1 text-base"></i>{" "}
                  <span className="underline">support@canonizer.com</span>
                </a>
              </Link>
            </div>
          </Col>
        </Row>
        <div className="border-t-[1px] pt-3 mt-4 text-center text-14 text-white opacity-[0.5]">
          <p className="m-0">
            Copyright owned by the volunteers contributing to the system and its
            contents (2006 - {new Date().getFullYear()})
          </p>
        </div>
      </footer>
    </Fragment>
  );
}

export default Footer;
