import CustomButton from "../../../common/button";
import { Typography, Collapse, Popover } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import K from "../../../../constants";
import moment from "moment";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";
import CustomSkelton from "../../../common/customSkelton";
import Image from "next/image";

const { Paragraph } = Typography;

const { Panel } = Collapse;
const covertToTime = (unixTime) => {
  return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm A");
};
const CampStatementCard = ({ loadingIndicator, backGroundColorClass }: any) => {
  const router = useRouter();
  const { campRecord, campStatement, history } = useSelector(
    (state: RootState) => ({
      campStatement: state?.topicDetails?.campStatement,
      history: state?.topicDetails?.history,
      campRecord: state?.topicDetails?.currentCampRecord,
    })
  );
  return loadingIndicator || !campStatement ? (
    <CustomSkelton
      skeltonFor="card"
      titleName={K?.exceptionalMessages?.campStatementHeading}
      bodyCount={2}
      stylingClass="test"
      isButton={false}
    />
  ) : (
    <>
      <div className="camp-agrrement-new mb-3">
        <div>
          <div className="camp-agreement-header d-flex items-center mb-3">
            <h3 className="cmp-title">
              {K?.exceptionalMessages?.campStatementHeading}
            </h3>
            <Image
              src="/images/circle-info-bread.svg"
              alt="svg"
              className="icon-topic"
              height={16}
              width={16}
            />
          </div>
          <div className="d-flex items-center justify-start gap-6 camp-header-content">
            <div className="d-flex items-center">
              <Image
                src="/images/calendar-camp.svg"
                alt="svg"
                className="icon-topic"
                height={16}
                width={16}
              />
              <p>Last update: 2 Jan 2024, 03:45 PM</p>
            </div>
            <div className="d-flex items-center gap-1">
              <Image
                src="/images/eye-regular-new.svg"
                alt="svg"
                className="icon-topic"
                height={16}
                width={16}
              />
              <span>1</span>
            </div>
          </div>
          <hr className="my-3" />
          <div className="flex items-center flex-col justify-center pt-10">
            <Paragraph>
              <div className={styles.campStatement}>
                {campStatement?.length && campStatement[0]?.parsed_value ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<div class="ck-content">${campStatement[0]?.parsed_value}</div>`,
                    }}
                  />
                ) : (
                  K?.exceptionalMessages?.campStatement
                )}
              </div>
            </Paragraph>

            <div className="topicDetailsCollapseFooter printHIde camp">
             {campStatement?.length <= 0 ? <CustomButton
                disabled={campRecord?.is_archive == 1 ? true : false}
                className="btn-green printHIde flex items-center justify-center"
                id="add-camp-statement-btn"
              >
                <Link
                  href={
                    campStatement?.length < 0
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
                  className="printHIde"
                >
                 <a className="printHIde gap-2  flex items-center justify-center text-base font-medium">
                      {K?.exceptionalMessages?.addCampStatementButton}
                      <Image
                        src="/images/manage-btn-icon.svg"
                        alt="svg"
                        className="icon-topic"
                        height={24}
                        width={24}
                      />
                    </a>
                </Link>
              </CustomButton>
              :
              <CustomButton
                disabled={campRecord?.is_archive == 1 ? true : false}
                className="btn-green printHIde hidden lg:hidden sm:flex md:flex items-center justify-center"
                id="add-camp-statement-btn"
              >
                <Link
                  href={
                    campStatement?.length > 0
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
                  className="printHIde"
                >
                   <a className="printHIde gap-2  flex items-center justify-center text-base font-medium">
                      {K?.exceptionalMessages?.manageCampStatementButton}
                      <Image
                        src="/images/manage-btn-icon.svg"
                        alt="svg"
                        className="icon-topic"
                        height={24}
                        width={24}
                      />
                    </a>
                </Link>
              </CustomButton>}
            </div>
          </div>
        </div>
      </div>
      {/* <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        className={`campStatementPanel header-bg-color-change ${backGroundColorClass}`}
        disabled
        header={
          <>
            <h3 className="cmp-title">
              {K?.exceptionalMessages?.campStatementHeading}
            </h3>
            <div
              className="cmp-change-icon"
              style={{ display: "inline-block" }}
            >
              {campStatement[0]?.in_review_changes > 0 &&
              campRecord?.is_archive == 0 ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/statement/history/${replaceSpecialCharacters(
                        router?.query?.camp[0],
                        "-"
                      )}/${replaceSpecialCharacters(
                        router?.query?.camp[1] ?? "1-Agreement",
                        "-"
                      )}`
                    );
                  }}
                >
                  <Popover
                    content={
                      "Some changes are currently under review in this camp statement."
                    }
                    placement="topLeft"
                    className={styles.infoIcon}
                  >
                    <Image
                      // className="change-icon"
                      width={20}
                      height={20}
                      src="/images/change-icon.svg"
                      alt=""
                    />
                  </Popover>
                </div>
              ) : null}
            </div>
          </>
        }
        key="1"
        extra={
          campStatement?.length && campStatement[0]?.go_live_time ? (
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
            {campStatement?.length && campStatement[0]?.parsed_value ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: `<div class="ck-content">${campStatement[0]?.parsed_value}</div>`,
                }}
              />
            ) : (
              K?.exceptionalMessages?.campStatement
            )}
          </div>
        </Paragraph>

        <div className="topicDetailsCollapseFooter printHIde">
          <CustomButton
            disabled={campRecord?.is_archive == 1 ? true : false}
            className="btn-green printHIde"
            id="add-camp-statement-btn"
          >
            <Link
              href={
                campStatement?.length > 0
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
              className="printHIde"
            >
              <a className="printHIde">
                {campStatement?.length > 0
                  ? K?.exceptionalMessages?.manageCampStatementButton
                  : K?.exceptionalMessages?.addCampStatementButton}
              </a>
            </Link>
          </CustomButton>
        </div>
      </Panel>
    </Collapse> */}
    </>
  );
};
export default CampStatementCard;
