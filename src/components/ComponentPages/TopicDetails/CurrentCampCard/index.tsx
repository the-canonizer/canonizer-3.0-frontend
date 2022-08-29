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

  return (
    <Collapse
      accordion={true}
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel header={<h3>Current Camp Record</h3>} key="1">
        <Descriptions column={1}>
          {currentCampRecordConstants?.map((description) => {
            if (
              description.key == "parent_camp_name" &&
              campRecord?.parentCamps?.length <= 1
            ) {
              ("");
            } else {
              return (
                <Descriptions.Item
                  label={description.label}
                  key={description.key}
                >
                  {campRecord && description.key != "camp_about_url"
                    ? campRecord[description.key]
                    : campRecord && (
                        // <Link href={campRecord[description.key]}>
                        <a
                          href={campRecord[description.key]}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {campRecord[description.key]}
                        </a>
                        // </Link>
                      )}
                </Descriptions.Item>
              );
            }
          })}
        </Descriptions>
        <div className="topicDetailsCollapseFooter">
          <CustomButton className="btn-green">
            <Link
              href={`/camp/history/${encodeURIComponent(
                router?.query?.camp[0]
              )}/${encodeURIComponent(router?.query?.camp[1])}`}
            >
              <a>{K?.exceptionalMessages?.manageCampButton} </a>
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
