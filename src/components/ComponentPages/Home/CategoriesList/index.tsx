import { Fragment, useEffect } from "react";
import { Row, Col, Tooltip } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import Tags from "src/components/shared/Tag";
import { RootState } from "src/store";
import { getAllTags } from "src/network/api/tagsApi";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";

const colors = ["#F7E9F5", "#E9EEF9", "#F7EAEA", "#EDF3E6"];

const getRandomColor = () => {
  return Math.floor(Math.random() * colors?.length);
};

const CategoriesList = () => {
  const { tags } = useSelector((state: RootState) => ({
    tags: state?.tag?.tags,
  }));

  const getTags = async () => {
    await getAllTags(1, 25);
  };

  useEffect(() => {
    getTags();
  }, []);

  if (!tags?.length) {
    return null;
  }

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={24}>
          <SectionHeading
            title="List of Categories"
            infoContent="List of Categories"
          />
        </Col>
        <Col md={12} sm={12} xs={24} className="text-right">
          <SeeMoreLInk />
        </Col>
      </Row>

      <div className="mt-3">
        {tags?.map((cat) => (
          <Tooltip title={cat?.title} key={cat?.id}>
            <Tags
              className="rounded-[5px] py-1 px-5 border-0 text-canBlack bg-canBlue mt-0 mb-3"
              icon={<FlagOutlined />}
              color={colors[getRandomColor()]}
            >
              {cat?.title}
            </Tags>
          </Tooltip>
        ))}
      </div>
    </Fragment>
  );
};

export default CategoriesList;
