import CustomButton from "../../../common/button";
import { Typography, Collapse } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import K from "../../../../constants";
import moment from "moment";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";
import CustomSkelton from "../../../common/customSkelton";

const { Paragraph } = Typography;

const { Panel } = Collapse;
const covertToTime = (unixTime) => {
  return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm A");
};
const CampStatementCard = ({ loadingIndicator }) => {
  const router = useRouter();
  const {campRecord, campStatement, history } = useSelector((state: RootState) => ({
    campStatement: state?.topicDetails?.campStatement,
    history: state?.topicDetails?.history,
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  return loadingIndicator || !campStatement ? (
    <CustomSkelton
      skeltonFor="card"
      titleName={K?.exceptionalMessages?.campStatementHeading}
      bodyCount={2}
      stylingClass="test"
      isButton={false}
    />
  ) : (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        className="campStatementPanel"
        disabled
        header={<h3>{K?.exceptionalMessages?.campStatementHeading}</h3>}
        key="1"
        extra={
          campStatement?.length ? (
            <div className={styles.cardActions}>
              <span className="bold">Go live Time : </span>
              {campStatement?.length &&
                covertToTime(campStatement[0]?.go_live_time)}
            </div>
          ) : null
        }
      >
        <Paragraph>
          <div className={styles.campStatement}>
            {campStatement?.length ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: campStatement[0]?.parsed_value,
                }}
              />
            ) : (
              K?.exceptionalMessages?.campStatement
            )}
          </div>
        </Paragraph>

        <div className="topicDetailsCollapseFooter">
          <CustomButton disabled={campRecord.is_archive == 1 ? true :false} className="btn-green" id="add-camp-statement-btn">
            <Link
              href={
                history?.items?.length > 0
                  ? `/statement/history/${replaceSpecialCharacters(
                      router?.query?.camp[0],
                      "-"
                    )}/${replaceSpecialCharacters(
                      router?.query?.camp[1] ?? "1-Agreement",
                      "-"
                    )}`
                  : `/create/statement/${replaceSpecialCharacters(
                      router?.query?.camp[0],
                      "-"
                    )}/${replaceSpecialCharacters(
                      router?.query?.camp[1] ?? "1-Agreement",
                      "-"
                    )}`
              }
            >
              <a>
                {history?.items?.length > 0
                  ? K?.exceptionalMessages?.manageCampStatementButton
                  : K?.exceptionalMessages?.addCampStatementButton}
              </a>
            </Link>
          </CustomButton>
        </div>
      </Panel>
    </Collapse>
  );
};
export default CampStatementCard;
