import { useEffect, useState, useRef } from "react";
import {
  Typography,
  Button,
  List,
  Radio,
  Breadcrumb,
  Card,
  Divider,
  Badge,
  Checkbox,
  Collapse,
  Tooltip,
  Tag,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";

import styles from "./campHistory.module.scss";

import { getHistoryApi } from "src/network/api/history";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import CustomSkelton from "../../common/customSkelton";

import HistoryCollapse from "./Collapse";
import { RootState } from "src/store";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import CreateNewCampButton from "../../common/button/createNewCampBtn";
import { setCurrentCamp } from "src/store/slices/filtersSlice";
import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";

import { store } from "src/store";
import { setTree } from "src/store/slices/campDetailSlice";
import { updateCampApi } from "src/network/api/campManageStatementApi";
import {
  DeleteOutlined,
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  UpOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
// const Collapse = ({
//   children,
//   collapsedHeight = 0,
//   expanded = false,
//   duration = 300,
//   opacity = 0,
// }) => {
//   const [isOpen, setIsOpen] = useState(expanded);
//   const contentRef = useRef(null);

//   const toggleCollapse = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="collapse-container">
//       <button onClick={toggleCollapse} className="collapse-toggle">
//         {isOpen ? "Collapse" : "Expand"}
//       </button>
//       <div
//         className="collapse-content"
//         ref={contentRef}
//         style={{
//           maxHeight: isOpen
//             ? `${contentRef.current.scrollHeight}px`
//             : `${collapsedHeight}px`,
//           transition: `max-height ${duration}ms ease-in-out opacity-0`,
//         }}
//       >
//         hellooooo
//       </div>
//     </div>
//   );
// };
const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
const { Panel } = Collapse;

function HistoryContainer() {
  return (
    <>
      <div className="cn-breadcrumbs">
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
      </div>
      <div className="ch-history">
        <div className="statement-status-sider">
          <Button
            type="link"
            className="text-2xl text-[#242B37] p-1 mb-16 flex items-center max-lg:hidden leading-none"
            icon={<LeftOutlined />}
          >
            Camp Statement History
          </Button>
          <Title level={5} className="mb-6">
            Statements Based On Status
          </Title>
          <div className="sider-btn">
            <Button size="large" className="btn-all active">
              View all (3)
            </Button>
            <Button size="large" className="btn-objected">
              Objected (1)
            </Button>
            <Button size="large" className="btn-live">
              Live (1)
            </Button>
            <Button size="large" className="btn-pending">
              Pending (1)
            </Button>
            <Button size="large" className="btn-previous">
              Previous (0)
            </Button>
          </div>
          <Button
            size="large"
            className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none mt-12"
          >
            Compare Statements
            <i className="icon-compare-statement"></i>
          </Button>
        </div>
        <Card className="ch-content" bordered={false}>
          <div className="cn-wrapper pending-wrapper">
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
                      behaviorism and intellectualized naive realism. Unpacking
                      these terms, the fashionable behaviorism gical nonentity.{" "}
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
          <div className="cn-wrapper live-wrapper">
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
          <div className="cn-wrapper previous-wrapper">
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
          <div className="cn-wrapper objected-wrapper">
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
          </div>
        </Card>
      </div>
    </>
  );
}

export default HistoryContainer;
