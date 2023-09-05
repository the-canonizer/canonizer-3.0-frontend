import { Descriptions, Collapse } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import moment from "moment";

import Image from "next/image";

import styles from "../topicDetails.module.scss";

import { currentCampRecordConstants } from "../../../common/componentConstants";
import CustomButton from "../../../common/button";
import K from "../../../../constants";

import { RootState } from "../../../../store";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";
import CustomSkelton from "../../../common/customSkelton";
import { useEffect } from "react";

const { Panel } = Collapse;

const validUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const CurrentCampCard = ({ loadingIndicator, backGroundColorClass }: any) => {
  const router = useRouter();
  const { campRecord, topicRecord, history } = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      history: state?.topicDetails?.history,
    })
  );

  useEffect(() => {
    console.log(campRecord, "#############campdata################");
  }, []);

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

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
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        className={`header-bg-color-change ${backGroundColorClass}`}
        header={
          <>
            <h3>{K?.exceptionalMessages?.campRecordHeading}</h3>
            {campRecord?.in_review_changes > 0 ? (
              // <img className="change-icon" src="/images/change-icon.svg" />

              <Image
                className="change-icon"
                src={"/images/change-icon.svg"}
                alt=""
                width={20}
                height={20}
              />
            ) : (
              ""
            )}
          </>
        }
        key="1"
      >
        <Descriptions column={1} className={styles.descriptions}>
          {currentCampRecordConstants?.map((description) => {
            if (
              description.key == "parent_camp_name" &&
              campRecord?.parentCamps?.length <= 1
            ) {
              ("");
            } else {
              return (
                <Descriptions.Item
                  label={<span className="boldLabel">{description.label}</span>}
                  key={description.key}
                >
                  {campRecord && description.key != "camp_about_url"
                    ? campRecord &&
                      (description.key == "is_disabled" ||
                        description.key == "is_one_level" ||
                        description.key == "is_archive")
                      ? campRecord[description.key] == 1
                        ? "Yes"
                        : "No"
                      : campRecord &&
                        (description.key == "submitter_nick_name" ||
                          description.key == "camp_about_nick_name")
                      ? campRecord &&
                        history &&
                        (campRecord[description.key] !=
                        "Nickname not associated." ? (
                          <Link
                            href={`/user/supports/${
                              description.key == "submitter_nick_name"
                                ? campRecord?.submitter_nick_id
                                : description.key == "camp_about_nick_name"
                                ? campRecord?.camp_about_nick_id
                                : ""
                            }?topicnum=${campRecord?.topic_num || ""}&campnum=${
                              campRecord?.camp_num || ""
                            }&canon=${topicRecord?.namespace_id || ""}`}
                            passHref
                          >
                            <a>{campRecord[description.key]}</a>
                          </Link>
                        ) : (
                          campRecord[description.key]
                        ))
                      : campRecord &&
                        (description.key == "go_live_time" ||
                          description.key == "submit_time")
                      ? covertToTime(campRecord[description.key])
                      : campRecord[description.key]
                    : campRecord &&
                      validUrl(campRecord[description.key]) && (
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
          <CustomButton className="btn-green" id="manage-camp-btn">
            <Link
              href={`/camp/history/${replaceSpecialCharacters(
                router?.query?.camp[0],
                "-"
              )}/${replaceSpecialCharacters(
                router?.query?.camp[1] ?? "1-Agreement",
                "-"
              )}`}
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
