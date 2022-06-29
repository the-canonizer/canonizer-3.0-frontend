import { Typography, Button, Collapse, Space, Checkbox, Divider } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from ".././campHistory.module.scss";

const { Panel } = Collapse;
const { Title } = Typography;

function HistoryCollapse({
  campStatement,
  onSelectCompare,
  isDisabledCheck,
  isChecked,
}) {
  const router = useRouter();

  return (
    <div>
      <Space
        direction="vertical"
        className={`${
          styles[campStatement?.status ? campStatement?.status : "live"]
        } ${styles.campStatementCollapseHistory}`}
      >
        <Collapse
          collapsible="header"
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          className={`campHistoryCollapseCards + " " + ${
            campStatement?.status ? campStatement?.status : "live"
          }`}
        >
          <Panel
            header={<i className="icon-uparrow"></i>}
            key="1"
            className={styles.campStatementCollapse}
            showArrow={false}
          >
            <>
              <Title level={5}>Statement :</Title>

              <div
                dangerouslySetInnerHTML={{
                  __html: campStatement?.parsed_value,
                }}
              />

              <Divider />
            </>
          </Panel>
          <>
            <div className={styles.campCollapseSummaryWrap}>
              <div className={styles.campStatementCollapseSummary}>
                <Title level={5}>
                  Edit summary :{" "}
                  <span className={styles.updateSurveyPrj}>
                    {campStatement?.note}
                    submit_time
                  </span>
                </Title>
                <Title level={5}>
                  Submitted on : <span>{campStatement?.submit_time}</span>
                </Title>
                <Title level={5}>
                  Submitter Nick Name :{" "}
                  <span>
                    <a href="">{campStatement?.objector_nick_name}</a>
                  </span>
                </Title>
                <Title level={5}>
                  Go live Time : <span>{campStatement?.go_live_time}</span>
                </Title>
                <Checkbox
                  className={styles.campSelectCheckbox}
                  onChange={onSelectCompare.bind(this, campStatement)}
                  disabled={isDisabledCheck}
                  defaultChecked={isChecked}
                >
                  Select to Compare
                </Checkbox>
              </div>
              <div className={styles.campStatementCollapseButtons}>
                <Button type="primary" className={styles.campUpdateButton}>
                  <Link href={`/manage/statement/${campStatement?.id}`}>
                    Submit Statement Update Based on This
                  </Link>
                </Button>
                <Button type="primary" className={styles.campVersionButton}>
                  <Link
                    href={{
                      pathname: `/topic/${
                        router?.query?.camp[0] + "/" + router?.query?.camp[1]
                      }`,
                      query: {
                        asof: "bydate",
                        asofdate: campStatement?.go_live_time,
                      },
                    }}
                  >
                    View This Version
                  </Link>
                </Button>
              </div>
            </div>
          </>
        </Collapse>
      </Space>
    </div>
  );
}

export default HistoryCollapse;
