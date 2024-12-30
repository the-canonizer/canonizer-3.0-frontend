import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";

import styles from "../topicDetails.module.scss";

import { RootState } from "src/store";
import K from "src/constants";
import CustomSkelton from "components/common/customSkelton";
import CommonCard from "components/shared/Card";
import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import { setStatementPreview } from "src/store/slices/topicSlice";
import { getPopupStatement } from "src/network/api/campDetailApi";

const StatementPreviewModal = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { haveStatementPreview } = useSelector((state: RootState) => ({
    haveStatementPreview: state?.topic?.haveStatementPreview,
  }));

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [campStatement, setCampStatement] = useState(null);

  const getCampStatement = async () => {
    setLoadingIndicator(true);
    const body = {
      topic_num: haveStatementPreview?.topic_id,
      camp_num: haveStatementPreview?.camp_id,
      as_of: "default",
      as_of_date: Date.now() / 1000,
    };

    const res = await getPopupStatement(body);

    if (res?.status_code === 200) {
      setCampStatement(res?.data?.at(0));
    }

    setLoadingIndicator(false);
  };

  useEffect(() => {
    if (haveStatementPreview) {
      getCampStatement();
    }
  }, [haveStatementPreview]);

  const getBorderColor = () => {
    if (router?.query?.viewversion == "1" || router?.query?.asof == "review") {
      return "!border-canOrange";
    } else if (router?.query?.asof == "bydate") {
      return "border-[#4786CB]";
    } else {
      return "!border-canGreen";
    }
  };

  if (loadingIndicator) {
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

  return (
    <Modal
      confirmLoading={loadingIndicator}
      open={haveStatementPreview}
      footer={null}
      closable={true}
      width={800}
      className="rounded-2xl"
      title={
        <SectionHeading
          title={"Camp Statement: " + haveStatementPreview?.title}
          infoContent=""
          icon={null}
          className="text-sm lg:text-base normal-case text-canBlack text-left font-semibold !mb-0"
        />
      }
      onCancel={() => {
        dispatch(setStatementPreview(null));
        setCampStatement(null);
      }}
    >
      <CommonCard
        className={`border-0 h-100  bg-white [&_.ant-card-body]:p-0 [&_.ant-card-body]:lg:p-[24px] [&_.ant-card-body]:h-[400px] [&_.ant-card-body]:overflow-y-auto overflow-hidden lg:bg-canGray border-t-8 ${getBorderColor()}`}
        data-testid="algoSelect"
        id="statementCard"
      >
        <div
          className={`${styles.campStatement} text-canBlack opacity-80 text-sm font-normal leading-6 [&_a]:!text-canBlue [&_a]:hover:!text-canHoverBlue`}
        >
          {campStatement?.parsed_value ? (
            <div
              className="ck-content"
              dangerouslySetInnerHTML={{
                __html: campStatement?.parsed_value,
              }}
            />
          ) : (
            <span className="text-sm text-center block">
              No statement available.
            </span>
          )}
        </div>
      </CommonCard>
    </Modal>
  );
};
export default StatementPreviewModal;
