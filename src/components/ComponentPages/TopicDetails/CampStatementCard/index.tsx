import { Card, Typography, Button } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";

const { Paragraph, Title } = Typography;

const CampStatementCard = ({ myRefToCampStatement }) => {
  const { campStatement } = useSelector((state: RootState) => ({
    campStatement: state?.topicDetails?.campStatement,
  }));
  return (
    <Card
      className="canCard"
      title={
        <div className="cardHeader" ref={myRefToCampStatement}>
          <h3>Camp Statement</h3>
        </div>
      }
      extra={
        <div className="cardActions">
          <span className="bold">Go live Time </span>: 5/27/2020, 8:04:24 AM{" "}
        </div>
      }
      actions={[
        <div className="card-actions-wrapper" key="key1">
          <Button className="edit-btn-style">Manage/Edit Camp Statement</Button>
          <Button className="camp-btn-style">Camp Forum</Button>
        </div>,
      ]}
    >
      <Paragraph>{campStatement && campStatement[0]?.value}</Paragraph>
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
    </Card>
  );
};
export default CampStatementCard;
