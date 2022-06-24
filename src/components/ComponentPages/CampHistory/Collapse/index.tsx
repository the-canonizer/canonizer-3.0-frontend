import { Typography, Button, Collapse, Space, Checkbox, Divider } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import { changeCommitStatement } from "../../../../network/api/campStatementHistory";

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
  const commitChanges = async () => {
    let reqBody = {
      type: "statement",
      id: campStatement?.id,
    };

    console.log("req body of commit => ", reqBody);

    let res = await changeCommitStatement(reqBody);
    console.log("res of commit =>", res);
  };
  console.log("camp statement of camp histroy in componrent=>", campStatement);
  return (
    <div>
      <Space
        direction="vertical"
        className={`${styles[campStatement?.status]} ${
          styles.campStatementCollapseHistory
        }`}
      >
        <Collapse
          collapsible="header"
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          className={`campHistoryCollapseCards + " " + ${campStatement?.status}`}
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
                {campStatement?.status == "in_review" && (
                  <Button type="ghost">Object</Button>
                )}
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
              {campStatement?.status == "in_review" && (
                <div className={styles.campStatementCollapseButtons}>
                  <p>
                    Note: This countdown timer is the grace period in which you
                    can make minor changes to your statement before other direct
                    supporters are notified.
                  </p>
                  <Button type="primary" className={styles.campUpdateButton}>
                    Edit Change
                  </Button>
                  <Button
                    type="primary"
                    className={styles.campUpdateButton}
                    onClick={commitChanges}
                  >
                    Commit Change
                  </Button>
                </div>
              )}
            </div>
          </>
        </Collapse>
      </Space>
    </div>
  );
}

export default HistoryCollapse;
