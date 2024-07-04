import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
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
import Breadcrumbs from "../Breadcrumbs/breadcrumbs";
import HistoryCard from "../HistoryCard/historyCard";
const { Title } = Typography;

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
const { Panel } = Collapse;

function HistoryContainer() {
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
      {/* <div className="cn-breadcrumbs">
        <Breadcrumb
          separator={
            <>
              <i className="icon-angle-right"></i>
            </>
          }
        >
          <Breadcrumb.Item href="">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">(Canon) General</Breadcrumb.Item>
          <Breadcrumb.Item href="">
            Topic: Representationalist Books
          </Breadcrumb.Item>
          <Breadcrumb.Item>Topic History</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          size="large"
          type="primary"
          className="flex items-center justify-center rounded-[10px] max-lg:hidden gap-3.5 leading-none"
        >
          Update Current Statement
          <i className="icon-edit"></i>
        </Button>
      </div> */}
      <Breadcrumbs />
      <div className="ch-wrapper">
        <div className="ch-history">
          <div className="statement-status-sider">
            <Button
              type="link"
              className="text-2xl text-[#242B37] p-1 mb-14 gap-5 flex items-center max-lg:hidden leading-none"
              icon={<i className="icon-back"></i>}
            >
              Camp Statement History
            </Button>
            <Title level={5} className="mb-6">
              Statements Based On Status
            </Title>
            <div className="sider-btn">
              <Button size="large" className="btn-all min-w-[133px] active">
                View all (3)
              </Button>
              <Button size="large" className="btn-objected min-w-[133px]">
                Objected (1)
              </Button>
              <Button size="large" className="btn-live min-w-[133px]">
                Live (1)
              </Button>
              <Button size="large" className="btn-pending min-w-[133px]">
                Pending (1)
              </Button>
              <Button size="large" className="btn-previous">
                Previous (0)
              </Button>
            </div>
            <Button
              size="large"
              className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none mt-12"
              onClick={onCompareClick}
            >
              Compare Statements
              <i className="icon-compare-statement"></i>
            </Button>
          </div>
          <div className="ch-content lg:w-[calc(100%-320px)] p-8 bg-[#F4F5FA] rounded-lg max-md:w-full relative">
            <HistoryCard />
            {/* <div className="csh-wrapper cn-wrapper pending-wrapper">
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
                      <h5 className="font-semibold text-[#F19C39] mb-3">
                        Statement
                      </h5>
                      <p className="text-[#242B37] pb-5">
                        Contemporary philosophy of mind unfortunately has been
                        burdened for decades with a residual philosophical
                        behaviorism and intellectualized naive realism.
                        Unpacking these terms, the fashionable behaviorism gical
                        nonentity.{" "}
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
                <Divider className="border-[#242B3733] my-[1.125rem]" />
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
                  </div>
                  <div className="cn-link-btn">
                    <Button
                      size="large"
                      type="link"
                      icon={<EyeOutlined />}
                      className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                    >
                      Preview Camp
                    </Button>
                    <Button
                      type="link"
                      danger
                      size="large"
                      icon={<i className="icon-delete"></i>}
                      className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            <div className="csh-wrapper cn-wrapper live-wrapper">
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
                <Divider className="border-[#242B3733] my-[1.125rem]" />
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
                  </div>
                  <div className="cn-link-btn">
                    <Button
                      size="large"
                      type="link"
                      icon={<EyeOutlined />}
                      className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                    >
                      Preview Camp
                    </Button>
                    <Button
                      type="link"
                      danger
                      size="large"
                      icon={<i className="icon-delete"></i>}
                      className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            <div className="csh-wrapper cn-wrapper previous-wrapper">
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
                <Divider className="border-[#242B3733] my-[1.125rem]" />
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
                  </div>
                  <div className="cn-link-btn">
                    <Button
                      size="large"
                      type="link"
                      icon={<EyeOutlined />}
                      className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                    >
                      Preview Camp
                    </Button>
                    <Button
                      type="link"
                      danger
                      size="large"
                      icon={<i className="icon-delete"></i>}
                      className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            <div className="csh-wrapper cn-wrapper objected-wrapper">
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
                <Divider className="border-[#242B3733] my-[1.125rem]" />
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
                  </div>
                  <div className="cn-link-btn">
                    <Button
                      size="large"
                      type="link"
                      icon={<EyeOutlined />}
                      className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                    >
                      Preview Camp
                    </Button>
                  </div>
                </div>
              </Card>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default HistoryContainer;
