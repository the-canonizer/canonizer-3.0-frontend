import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography, Image } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";

import { RootState } from "src/store";

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
    {
      link: "/videos",
      linkTitle: "Videos",
      id: 13,
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
    {
      link: "/privacy-policy",
      linkTitle: "Privacy Policy",
      id: 9,
    },
    {
      link: "/terms-and-services",
      linkTitle: "Terms & Services",
      id: 10,
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
      <footer className={`printHIde bg-canBlack px-4 md:px-7 py-4 pt-7`}>
        <Row gutter={20}>
          <Col xs={24} sm={24} md={7} lg={8}>
            <div className="mb-3">
              <Link href="/">
                <a>
                  <Image
                    src={`/images/logo-white.svg`}
                    alt="Canonizer"
                    width={150}
                  />
                </a>
              </Link>
            </div>
            <p className="text-xs font-inter font-normal text-white md:!pr-8">
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
            <p className="font-semibold text-white text-xs mt-3">
              Patent: US 8,160,970 B2
            </p>
          </Col>
          <Col xs={24} sm={24} md={10} lg={10}>
            <Row gutter={20} className="px-6 sm:px-32 sm:py-4">
              <Col xs={12} md={12} className="text-white">
                <Typography.Paragraph className="text-xs font-bold text-white">
                  Explore
                </Typography.Paragraph>
                <ul>
                  {mockLinks?.map((item) => (
                    <li key={item.id} className="text-xs font-normal mb-2">
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
              <Col xs={12} md={12} className="text-white">
                <Typography.Paragraph className="text-xs font-bold text-white">
                  Learn More{" "}
                </Typography.Paragraph>
                <ul>
                  {mockLinks2?.map((item) => {
                    return (
                      <li key={item.id} className="text-xs font-normal mb-2">
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
          <Col xs={24} sm={24} md={7} lg={6}>
            <div className="bg-[#FFFFFF1A] rounded-lg px-3 py-4">
              <Typography.Paragraph className="text-xs text-white">
                Have comments or questions?
              </Typography.Paragraph>
              <Link href="mailto:support@canonizer.com">
                <a className="text-white font-medium break-words text-xs">
                  <i className="icon-envelope mr-1 text-xs"></i>{" "}
                  <span className="underline">support@canonizer.com</span>
                </a>
              </Link>
            </div>
          </Col>
        </Row>
        <div className="border-t-[1px] pt-3 mt-4 text-center text-[10px] text-white opacity-[0.5]">
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
