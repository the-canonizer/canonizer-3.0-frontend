import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";
import { EditOutlined } from "@ant-design/icons";

import styles from "../topicDetails.module.scss";

import { RootState } from "src/store";
import K from "src/constants";
import {
  covertToTime,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import CustomSkelton from "components/common/customSkelton";
import ViewCounts from "components/shared/ViewsCount";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import CommonCard from "components/shared/Card";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const CampStatementCard = ({ loadingIndicator }) => {
  const router = useRouter();

  const { campRecord, campStatement, tree } = useSelector(
    (state: RootState) => ({
      campStatement: state?.topicDetails?.campStatement,
      campRecord: state?.topicDetails?.currentCampRecord,
      tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    })
  );

  if (loadingIndicator || !campStatement) {
    return (
      <CustomSkelton
        skeltonFor="card"
        titleName={K?.exceptionalMessages?.campStatementHeading}
        bodyCount={2}
        stylingClass="test"
        isButton={false}
      />
    );
  }

  const onEditDraftClick = (e) => {
    e?.preventDefault();
    router?.push({
      pathname: "/manage/statement/" + campStatement[0]?.draft_record_id,
      query: { is_draft: "1" },
    });
  };

  const isDraftShow = () => {
    if (campStatement?.length) {
      if (
        !campStatement[0]?.parsed_value &&
        campStatement[0]?.draft_record_id
      ) {
        return true;
      }
    }
    return false;
  };

  const getButton = () => {
    if (isDraftShow()) {
      return (
        <PrimaryButton
          className="printHIde flex items-center justify-center text-base h-auto py-2 px-9 gap-2 w-full mt-5 font-medium"
          onClick={onEditDraftClick}
        >
          Edit Draft <EditOutlined />
        </PrimaryButton>
      );
    } else if (
      !isDraftShow() &&
      (!campStatement?.length ||
        (campStatement?.length && !campStatement[0]?.parsed_value))
    ) {
      return (
        <PrimaryButton
          disabled={campRecord?.is_archive == 1 ? true : false}
          className=" printHIde flex items-center justify-center text-base py-5 gap-2 w-full mt-5 font-medium"
          id="add-camp-statement-btn"
          onClick={() =>
            router?.push({
              pathname:
                campStatement?.length < 0
                  ? `/statement/history/${replaceSpecialCharacters(
                      router?.query?.camp.at(0),
                      "-"
                    )}/${replaceSpecialCharacters(
                      router?.query?.camp.at(1) ?? "1-Agreement",
                      "-"
                    )}`
                  : `/create/statement/${replaceSpecialCharacters(
                      router?.query?.camp.at(0),
                      "-"
                    )}/${replaceSpecialCharacters(
                      router?.query?.camp.at(1) ?? "1-Agreement",
                      "-"
                    )}`,
            })
          }
        >
          {K?.exceptionalMessages?.addCampStatementButton}
          <Image
            src="/images/manage-btn-icon.svg"
            alt="svg"
            className="icon-topic"
            height={24}
            width={24}
          />
        </PrimaryButton>
      );
    }

    return (
      <PrimaryButton
        disabled={campRecord?.is_archive == 1 ? true : false}
        className="btn-green printHIde hidden lg:hidden sm:flex md:flex items-center justify-center text-base font-medium"
        id="add-camp-statement-btn"
        onClick={() =>
          router?.push({
            pathname:
              campStatement?.length > 0
                ? `/statement/history/${replaceSpecialCharacters(
                    router?.query?.camp.at(0),
                    "-"
                  )}/${replaceSpecialCharacters(
                    router?.query?.camp.at(1) ?? "1-Agreement",
                    "-"
                  )}`
                : `/create/statement/${replaceSpecialCharacters(
                    router?.query?.camp.at(0),
                    "-"
                  )}/${replaceSpecialCharacters(
                    router?.query?.camp.at(1) ?? "1-Agreement",
                    "-"
                  )}`,
          })
        }
      >
        {K?.exceptionalMessages?.manageCampStatementButton}
        <Image
          src="/images/manage-btn-icon.svg"
          alt="svg"
          className="icon-topic"
          height={24}
          width={24}
        />
      </PrimaryButton>
    );
  };

  return (
    <CommonCard
      className="border-0 h-100 bg-white [&_.ant-card-body]:p-0 [&_.ant-card-body]:lg:p-[24px] lg:bg-canGray mb-8 lg:mb-14 border-t-8 !border-canGreen"
      data-testid="algoSelect"
    >
      <div className="camp-agrrement-new mb-8">
        <div className="flex justify-between items-start">
          <div className="mr-auto">
            <div className="camp-agreement-header flex items-center mb-2.5 lg:mb-5 gap-2">
              <h3 className="text-sm lg:text-base text-canBlack text-left font-semibold ">
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
            <div className="flex items-center justify-start gap-6 camp-header-content lg:border-none border-t border-b border-canGrey2 lg:py-0 py-1.5 lg:mb-0 mb-5">
              {campStatement?.[0]?.go_live_time && (
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/calendar-camp.svg"
                    alt="svg"
                    className="icon-topic"
                    height={16}
                    width={16}
                  />
                  <p className="text-xs font-normal text-canBlack text-opacity-50">
                    Last update:{" "}
                    {covertToTime(campStatement?.[0]?.go_live_time)}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 lg:hidden ">
                <ViewCounts views={tree?.[1] && tree[1]?.camp_views} />
              </div>
            </div>
          </div>
          {campStatement?.length &&
          campStatement[0]?.parsed_value &&
          campStatement[0]?.draft_record_id ? (
            <SecondaryButton
              className="px-8 h-auto py-2 ml-auto"
              onClick={onEditDraftClick}
            >
              Edit Draft <EditOutlined />
            </SecondaryButton>
          ) : null}
        </div>
        <hr className="my-5 hidden lg:flex" />
        <div
          className={`flex flex-col ${
            campStatement?.length && campStatement[0]?.parsed_value
              ? "items-start justify-start"
              : "items-center justify-center"
          } lg:pt-5`}
        >
          <div
            className={
              styles.campStatement +
              " text-canBlack opacity-80 text-sm text-normal leading-6"
            }
          >
            {campStatement?.length && campStatement[0]?.parsed_value ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: `<div class="ck-content">${campStatement[0]?.parsed_value}</div>`,
                }}
              />
            ) : (
              <span className="text-sm lg:text-base">
                {isDraftShow()
                  ? "Continue finishing up your statement"
                  : K?.exceptionalMessages?.campStatement}
              </span>
            )}
          </div>

          <div className="topicDetailsCollapseFooter printHIde camp">
            {getButton()}
          </div>
        </div>
      </div>
    </CommonCard>
  );
};
export default CampStatementCard;
