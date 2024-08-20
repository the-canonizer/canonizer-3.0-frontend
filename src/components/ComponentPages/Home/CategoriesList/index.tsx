import { Fragment, useEffect } from "react";
import { Row, Col } from "antd";
import { FlagOutlined, TagOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Link from "next/link";

import Tags from "src/components/shared/Tag";
import { RootState } from "src/store";
import { getAllTags } from "src/network/api/tagsApi";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";
import { useIsMobile } from "src/hooks/useIsMobile";

const colors = ["#F7E9F5", "#E9EEF9", "#F7EAEA", "#EDF3E6"];

export const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors?.length)];
};

const CategoriesList = () => {
  const { tags } = useSelector((state: RootState) => ({
    tags: state?.tag?.tags,
  }));

  const isMobile = useIsMobile();

  const getTags = async () => {
    await getAllTags(1, 20);
  };

  useEffect(() => {
    getTags();
  }, []);

  if (!tags || tags.length === 0) {
    return null;
  }

  const renderedTags = tags.slice(0, isMobile ? 5 : 25);

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12}>
          <SectionHeading
            title="List of Topic Tags"
            infoContent="List of Topic Tags"
          />
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <SeeMoreLInk href="/categories" />
        </Col>
      </Row>

      <div className="w-full flex flex-wrap mt-3 -mb-5">
        {renderedTags?.map((cat) => (
          <Link href={{ pathname: `/categories/${cat?.id}` }} key={cat?.id}>
            <a>
              <Tags
                className="rounded-lg py-3 px-6 border-0 text-canBlack bg-canBlue mt-0 mb-[15px] mr-[15px] hover:shadow-md"
                icon={<TagOutlined className="rotate-[280deg]" />}
                color={getRandomColor()}
              >
                {cat?.title}
              </Tags>
            </a>
          </Link>
        ))}
        {isMobile ? (
          <Link href="/categories" key="moretag">
            <a className="text-canBlack font-semibold">
              +{tags?.length - 5} more
            </a>
          </Link>
        ) : null}
      </div>
    </Fragment>
  );
};

export default CategoriesList;
