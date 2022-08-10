import { currentCampRecordConstants } from "../../../common/componentConstants";
import { Button, Descriptions, Collapse } from "antd";
import CustomButton from "../../../common/button";
import Link from "next/link";
import { useRouter } from "next/router";
import K from "../../../../constants";

import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Panel } = Collapse;

const CurrentCampCard = () => {
  const router = useRouter();
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

  console.log("current record const ", currentCampRecordConstants);
  console.log("camprecodr on point ", campRecord);

  return (
    <Collapse
      accordion={true}
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel header={<h3>Current Camp Record</h3>} key="1">
        <Descriptions column={1}>
          {currentCampRecordConstants?.map((description) => (
            <Descriptions.Item label={description.label} key={description.key}>
              {campRecord && description.key != "camp_about_url" ? (
                campRecord[description.key]
              ) : (
                <Link href={campRecord[description.key]}>
                  <a target="_blank">{campRecord[description.key]}</a>
                </Link>
              )}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <div className="topicDetailsCollapseFooter">
          <CustomButton className="btn-green">
            <Link
              href={`/camp/history/${router?.query?.camp[0]?.replace(
                "?",
                "%3f"
              )}/${router?.query?.camp[1]?.replace("?", "%3f")}`}
            >
              <a>{K?.exceptionalMessages?.manageCampButton}</a>
            </Link>
          </CustomButton>
        </div>

        {/* <div className="topicDetailsCollapseFooter">
          <Button className="btn-green">Manage/Edit This Camp</Button>
        </div> */}
      </Panel>
    </Collapse>
  );
};
export default CurrentCampCard;
