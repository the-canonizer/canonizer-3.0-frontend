import { useRouter } from "next/router";
import {
  AutoComplete,
  Button,
  Collapse,
  Dropdown,
  Input,
  Popover,
  Radio,
  Select,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import styles from "./advanceSearchFilter.module.scss";
import { Fragment } from "react";
import filter from "src/assets/image/filter.svg";
import Image from "next/image";
import { LeftOutlined } from "@ant-design/icons";
import { CloseCircleOutlined } from "@ant-design/icons";

export default function AdvanceFilter() {
  const { Panel } = Collapse;
  const { Title, Text, Paragraph } = Typography;
  const { Search } = Input;

  const router = useRouter();
  const campRoute = () => {
    router?.push("/search/topic");
  };
  const renderTitle = (icon: any, title: string) => (
    <span>
      {icon}
      {title}
    </span>
  );

  const renderItem = (title: any) => ({
    value: title,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}
        <span>{/* <UserOutlined /> */}</span>
      </div>
    ),
  });

  return (
    <div
      className={
        router.pathname !== "/search/nickname"
          ? "advanceFilter"
          : "NicknameadvanceFilter advanceFilter"
      }
    >
      <Collapse
        className={`${styles.cardAccordian} topicListFilterCardCollapse`}
        expandIconPosition="right"
        expandIcon={() => (
          <div className={styles.collapseIcon}>
            <i className="icon-angle-up"></i>
          </div>
        )}
        bordered={false}
        // defaultActiveKey={["1", "2", "3"]}
        // accordion={false}
      >
        <Panel
          header={
            <span className="filter-heading">
              <Image
                id="viewFile"
                alt="Eye Image"
                src={filter}
                width={15}
                height={11}
              />
              Advance Filter
            </span>
          }
          key="1"
        >
          <div className="advance_close">
            <CloseCircleOutlined />
          </div>

          {router.pathname !== "/search/nickname" ? (
            <div className="row">
              <div className="col-sm-6">
                <h4>Canonizer</h4>
                <label>Canonizer Algorithm:</label>
                <Select className="w-100">
                  <Select.Option>123</Select.Option>
                </Select>
                <Link href={"#"}>
                  <a className="Algorithm">Algorithm Information</a>
                </Link>
                <div className="score-box">
                  <label>Score</label>

                  <LeftOutlined className={styles.LeftOutlined} />
                  <Input size="large" value={1} />
                  <Popover
                    content={"infoContent"}
                    placement="right"
                    className={styles.infoIcon}
                  >
                    <i className="icon-info"></i>
                  </Popover>
                </div>
              </div>
              <div className="col-sm-6">
                <h4>Search Type</h4>
                <Radio>Search include review</Radio>
                <Radio>Search live</Radio>
                <Radio>Search historical</Radio>
              </div>
            </div>
          ) : (
            <div className="nicknameAdvanceFilter">
              <label>Search for Topic or Camp </label>
              <input placeholder="Search a keyword"></input>
            </div>
          )}
          {/* <div>
                 <AutoComplete
              popupClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={500}
              className={"search_header"}
              options={options}
            > 
          <Input size="large" placeholder="input here" prefix={<i className="icon-search"></i>} />
         </AutoComplete>
            </div> */}
          {/* <div className={styles.algo_title}>
              <Title level={5} className={styles.algoText}>
                Canonizer Algorithm:
              </Title>
              </div> */}
          {/* <Select>
                <Select.Option>
                    123
                </Select.Option>
              </Select> */}

          {/* <div>
                <span>Search Type</span>
                <Radio>Search include review</Radio>
                <Radio>Search live</Radio>
                <Radio>Search historical</Radio>


            </div> */}
        </Panel>
      </Collapse>
    </div>
  );
}
