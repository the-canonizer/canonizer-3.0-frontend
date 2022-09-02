import CustomButton from "../../../common/button";
import { Typography, Collapse } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import K from "../../../../constants";
import moment from "moment";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

const { Paragraph } = Typography;

const { Panel } = Collapse;
const covertToTime = (unixTime) => {
  return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm A");
};
const CampStatementCard = ({ myRefToCampStatement, onCampForumClick }) => {
  const router = useRouter();
  const { campStatement } = useSelector((state: RootState) => ({
    campStatement: state?.topicDetails?.campStatement,
  }));

  return (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        className="campStatementPanel"
        disabled
        header={<h3>Camp Statement</h3>}
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
          {campStatement?.length ? (
            <div
              dangerouslySetInnerHTML={{
                __html: campStatement[0]?.parsed_value,
              }}
            />
          ) : (
            K?.exceptionalMessages?.campStatement
          )}
        </Paragraph>

        <div className="topicDetailsCollapseFooter">
          <CustomButton className="btn-green">
            <Link
              href={
                campStatement?.length > 0
                  ? `/statement/history/${replaceSpecialCharacters(
                      router?.query?.camp[0],
                      "-"
                    )}/${replaceSpecialCharacters(router?.query?.camp[1], "-")}`
                  : `/create/statement/${replaceSpecialCharacters(
                      router?.query?.camp[0],
                      "-"
                    )}/${replaceSpecialCharacters(router?.query?.camp[1], "-")}`
              }
            >
              <a>
                {campStatement?.length > 0
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
