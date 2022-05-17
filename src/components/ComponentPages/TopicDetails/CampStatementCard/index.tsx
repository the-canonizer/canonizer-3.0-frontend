import CustomButton from "@/components/common/button";
import { Typography, Collapse } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";

const { Paragraph } = Typography;

const { Panel } = Collapse;

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
        header={<h3>Camp Statement</h3>}
        key="1"
        extra={
          campStatement?.length ? (
            <div className="cardActions">
              <span className="bold">Go live Time: </span>
              {campStatement?.length && campStatement[0]?.go_live_time}
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
            "No Statement Found"
          )}
        </Paragraph>

        {/* Will remove the below commented code once the api is integrated completed */}

        {/* <Title level={2} className={styles.cardHeading}>
          Theories of Mind and Consciousness
        </Title>
        <Paragraph>
          The goal of this topic is to build and track consensus around theories
          of consciousness. Everyone is invited to contribute, as we want to track
          the default popular consensus. There is also the “Mind Expert” canonizer
          people can select, so people can compare the popular consensus with the
          “Expert Consensus”.
        </Paragraph>
        <Paragraph>
          {" "}
          We focus on bridging the <a> Explanatory Gap </a> to explore the
          qualitative nature of consciousness. We are asking the questions: “What
          are the physical properties of conscious experience?” Physical
          properties can be measured. “Can consciousness then be physically
          measured, tested, and observed?”{" "}
        </Paragraph>

        <Paragraph>
          Contributors should work to describe experiments that are consistent
          with particular theories, and falsify competing theories.
        </Paragraph>

        <Paragraph>
          This topic is part of the <a>Consciousness Consensus Project.</a>
        </Paragraph>*/}

        <div className="topicDetailsCollapseFooter">
          <CustomButton className="btn-green">
            <Link
              href={`/statement/history/${router.query?.camp[0]}/${router.query?.camp[1]}`}
            >
              <a>Manage/Edit Camp Statement </a>
            </Link>
          </CustomButton>
        </div>
      </Panel>
    </Collapse>
  );
};
export default CampStatementCard;
