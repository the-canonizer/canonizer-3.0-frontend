import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";

import {
  EyeOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/router";
import { useState } from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import HistoryCardModal from "./historyCardDrawer";
import HistoryCardDrawer from "./historyCardDrawer";
// import "./historyCard.scss";

const { Title } = Typography;

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
const { Panel } = Collapse;

function HistoryCard() {
  const router = useRouter();
  const historyOf = router?.asPath.split("/")[1];

  const [selectedTopic, setSelectedTopic] = useState([]);
  const [selectedTopicStatus, setSelectedTopicStatus] = useState([]);

  const onSelectCompare = ({ id, status }, e: CheckboxChangeEvent) => {
    let oldTopics = [...selectedTopic];
    let oldTopicsStatus = [...selectedTopicStatus];

    if (e.target.checked && !oldTopics.includes(id)) {
      oldTopics.push(id);
    } else {
      oldTopics = oldTopics.filter((item) => item !== id);
    }

    if (e.target.checked && !oldTopicsStatus.includes(`${id}_${status}`)) {
      oldTopicsStatus.push(`${id}_${status}`);
    } else {
      oldTopicsStatus = oldTopicsStatus.filter(
        (item) => item !== `${id}_${status}`
      );
    }
    setSelectedTopic(oldTopics);
    setSelectedTopicStatus(oldTopicsStatus);
  };

  const onCompareClick = () => {
    router?.push({
      pathname: `/statement/compare/${router?.query.camp[0]}/${
        router?.query.camp[1] ? router?.query.camp[1] : "1-Agreement"
      }`,
      query: {
        statements: selectedTopic[0] + "_" + selectedTopic[1],
        from:
          historyOf == "statement"
            ? "statement"
            : historyOf == "camp"
            ? "camp"
            : "topic",
        status: selectedTopicStatus.join("-"),
      },
    });
  };
  return (
    <>
      <div className="csh-wrapper cn-wrapper pending-wrapper">
        <div className="badge-wrapper">
          <Badge
            className="cn-dot-badge ch-dot-history"
            color=""
            text={
              <>
                16 Feb 2024,<span>04:36 PM</span>
              </>
            }
          />
          <div className="tooltip-count">
            <Tooltip title="prompt text">
              <InfoCircleOutlined />
            </Tooltip>
            <p>Grace period countdown</p>
            <Tag
              className={
                "bg-[#5482C833] border-0 rounded-md inline-flex py-[3px] items-center"
              }
            >
              00:51:12
            </Tag>
          </div>
        </div>
        <Checkbox className="mb-5 ch-checkbox" onChange={onChange}>
          Select to compare
        </Checkbox>
        <Card className="cn-card">
          <Collapse
            expandIconPosition="end"
            className="ch-collapse"
            defaultActiveKey={["0"]}
            expandIcon={({ isActive }) =>
              isActive ? (
                <i className="icon-up-arrow"></i>
              ) : (
                <i className="icon-down-arrow"></i>
              )
            }
            ghost
          >
            <Panel header="" key="1">
              <div>
                <h5 className="font-semibold text-[#F19C39] mb-3">Statement</h5>
                <p className="text-[#242B37] pb-5">
                  Contemporary philosophy of mind unfortunately has been
                  burdened for decades with a residual philosophical behaviorism
                  and intellectualized naive realism. Unpacking these terms, the
                  fashionable behaviorism gical nonentity.{" "}
                </p>
              </div>
            </Panel>
          </Collapse>
          <p className="font-semibold mb-2.5">Updates</p>
          <p>
            Category:<span>Test</span>
          </p>
          <p>
            Edit summary:<span>Minor tweaks</span>
          </p>
          <p>
            Camp about URL:<a> www.thisisalink.com</a>
          </p>
          <p>
            Camp about Nickname: <span>Jane</span>
          </p>
          <p>
            Submitter nickname:<span>Mary Ann</span>
          </p>
          <p>
            Disable additional sub-camps:<span>No</span>
          </p>
          <p>
            Single level Camps only:<span>Minor tweaks</span>
          </p>
          <p>
            Camp archived:<span> Jane Doe</span>
          </p>
          <p>
            Submitted on:<span> 16 Feb 2024, 04:36 PM</span>
          </p>
          <p>
            Going live on :<span>17 Feb 2024, 04:36 PM</span>
          </p>
          <div className="agreement-wrapper cursor-pointer">
            <Checkbox onChange={onChange}>Agree With Change</Checkbox>
            <Space>
              <HistoryCardDrawer />
              <p>
                <u>1 out of 2 required supporters have agreed.</u>
                Since you are the last hold-out, the moment you agree, the camp
                will go live.
              </p>
            </Space>
          </div>
          <div className="cn-footer-btn">
            <div className="cn-card-btn">
              <Button
                size="large"
                type="primary"
                className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
              >
                Commit Changes
                <i className="icon-upload"></i>
              </Button>
              <Button
                size="large"
                className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
              >
                Edit Statement
                <i className="icon-edit"></i>
              </Button>
              <Button
                size="large"
                className="flex items-center bg-[#E46B6B1A] border-[#E46B6B] hover:border-[#E46B6B] hover:text-[#E46B6B] focus:text-[#E46B6B] focus:border-[#E46B6B] justify-center rounded-[10px] gap-3.5 leading-none"
              >
                Objected Changes
                <i className="icon-thumb-down text-[#E46B6B]"></i>
              </Button>
            </div>
            <div className="cn-link-btn">
              <Button
                size="large"
                type="link"
                className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
              >
                View version
                <EyeOutlined />
              </Button>
              <Button
                type="link"
                danger
                size="large"
                className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
              >
                Delete
                <i className="icon-delete"></i>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default HistoryCard;
