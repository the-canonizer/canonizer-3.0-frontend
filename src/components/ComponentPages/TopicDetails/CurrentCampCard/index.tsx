import { Descriptions, Collapse } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { currentCampRecordConstants } from "../../../common/componentConstants";
import CustomButton from "../../../common/button";
import K from "../../../../constants";

import { RootState } from "../../../../store";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";
import CustomSkelton from "../../../common/customSkelton";

const { Panel } = Collapse;

const CurrentCampCard = ({ loadingIndicator }) => {
  const router = useRouter();
  const { campRecord, topicRecord, history } = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      history: state?.topicDetails?.history,
    })
  );

  return loadingIndicator ? (
    <CustomSkelton
      titleName={K?.exceptionalMessages?.campRecordHeading}
      skeltonFor="card"
      bodyCount={6}
      stylingClass="test"
      isButton={false}
    />
  ) : (
    <Collapse
      accordion={true}
      defaultActiveKey={[]}
      expandIconPosition="end"
      className="topicDetailsCollapse"
    >
      <Panel
        header={<h3>{K?.exceptionalMessages?.campRecordHeading}</h3>}
        key="1"
      >
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
                    ? campRecord &&
                      (description.key == "is_disabled" ||
                        description.key == "is_one_level")
                      ? campRecord[description.key] == 1
                        ? "Yes"
                        : "No"
                      : campRecord && description.key == "nick_name"
                      ? campRecord &&
                        history &&
                        (campRecord[description.key] !=
                        "Nickname not associated." ? (
                          <Link
                            href={`/user/supports/${
                              history?.details?.liveCamp?.camp_about_nick_id ||
                              ""
                            }?topicnum=${campRecord?.topic_num || ""}&campnum=${
                              campRecord?.camp_num || ""
                            }&namespace=${topicRecord?.namespace_id || ""}`}
                            passHref
                          >
                            {campRecord[description.key]}
                          </Link>
                        ) : (
                          campRecord[description.key]
                        ))
                      : campRecord[description.key]
                    : campRecord && (
                        <a
                          href={campRecord[description.key]}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {campRecord[description.key]}
                        </a>
                      )}
                </Descriptions.Item>
              );
            }
          })}
        </Descriptions>
        <div className="topicDetailsCollapseFooter">
          <CustomButton className="btn-green">
            <Link
              href={`/camp/history/${replaceSpecialCharacters(
                router?.query?.camp[0],
                "-"
              )}/${replaceSpecialCharacters(
                router?.query?.camp[1] ?? "1-Agreement",
                "-"
              )}`}
            >
              {K?.exceptionalMessages?.manageCampButton}
            </Link>
          </CustomButton>
        </div>
      </Panel>
    </Collapse>
  );
};
export default CurrentCampCard;
