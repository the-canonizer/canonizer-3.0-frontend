import { Popover, Tag, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import Headings from "src/components/shared/Typography";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useRouter } from "next/router";

const propTypes = {
  title: PropTypes.string,
  infoContent: PropTypes.string,
  icon: PropTypes.element,
};

const SectionHeading = ({
  title,
  infoContent,
  icon = <InfoCircleOutlined />,
  className = "",
}) => {
  const router = useRouter();
  const { campStatement } = useSelector((state: RootState) => ({
    campStatement: state?.topicDetails?.campStatement,
  }));

  const warningTextForStatement = (
    <div className="popoverParent">
      <span>Some changes are currently under review in this statement.</span>
    </div>
  );

  const handleNavigation = () => {
    const getData = (data) => ({
      num: data?.split("-")?.at(0),
      name: data?.split("-").slice(1).join("-"),
    });

    const topicData = router?.query?.camp?.at(0);
    const campData = router?.query?.camp?.at(1);

    const { num: topic_num, name: topicName } = getData(topicData);
    const { num: camp_num, name: campName } = getData(campData);

    const url = `/statement/history/${topic_num}-${topicName}/${camp_num}-${campName}`;
    router.push(url);
  };

  return (
    <Headings
      level={5}
      className={`text-sm relative font-bold uppercase ${className}`}
      id="section-heading"
    >
      <span className="mr-3" id="section-title">
        {title}
      </span>
      {icon ? (
        <Tooltip title={infoContent} placement="top" id="section-tooltip">
          {icon}
        </Tooltip>
      ) : null}
      {title == "Camp Statement" &&
        campStatement?.at(0)?.in_review_changes > 0 && (
          <Popover
            content={warningTextForStatement}
            className="title-popover"
            placement="bottomLeft"
            overlayClassName="warning-popover"
            id="section-popover"
          >
            <Tag
              className="text-[#DD841C] ml-3 mr-0 bg-[#F19C391A] py-1.5 px-4 text-sm border-0 rounded-full cursor-pointer"
              onClick={() => handleNavigation()}
              id="section-tag"
            >
              Under Review
            </Tag>
          </Popover>
        )}
    </Headings>
  );
};

SectionHeading.propTypes = propTypes;

export default SectionHeading;
