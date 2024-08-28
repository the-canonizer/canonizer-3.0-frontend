import { Spin, Tooltip, Typography, Button } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";

import styles from "../topicDetails.module.scss";

import { RootState } from "src/store";
import K from "src/constants";
import {
  setManageSupportStatusCheck,
  setOpenDrawer,
} from "src/store/slices/campDetailSlice";
import { setOpenConsensusTreePopup } from "src/store/slices/hotTopicSlice";
import RefineFilter from "../../RefineFilter";
import LatestFilter from "../../LatestFilter";
import CampDisclaimer from "components/common/CampDisclaimer";
import RefineIcon from "./refineIcon";

const InfoBar = ({ isTopicPage = false }: any) => {
  const dispatch = useDispatch();
  const [isCampBtnVisible, setIsCampBtnVisible] = useState(false);
  const router = useRouter();

  const {
    campRecord,
    currentCampNode,
    tree,
    selectedAlgorithm,
    is_camp_archive_checked,
    filteredScore,
    includeReview,
    is_checked,
    selectedAsOf,
    algorithms,
    openConsensusTreePopup,
  } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
    currentCampNode: state?.filters?.selectedCampNode,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
    is_camp_archive_checked: state?.utils?.archived_checkbox,
    includeReview: state?.filters?.filterObject?.includeReview,
    filteredScore: state?.filters?.filterObject?.filterByScore,
    is_checked: state?.utils?.score_checkbox,
    selectedAsOf: state?.filters?.filterObject?.asof,
    algorithms: state.homePage?.algorithms,
    openConsensusTreePopup: state.hotTopic.openConsensusTreePopup,
  }));

  const isMobile = window.matchMedia("(min-width: 1280px)").matches;

  useEffect(() => {
    if (isTopicPage) {
      dispatch(setManageSupportStatusCheck(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPrint = () => {
    const hiddenElem = document.querySelector(".currentCampRecords"),
      insideDiv = hiddenElem?.querySelector(".ant-collapse-item"),
      header: any = hiddenElem?.querySelector(".ant-collapse-header");

    if (!insideDiv?.classList?.contains("ant-collapse-item-active")) {
      header.click();
    }

    setTimeout(() => {
      if (insideDiv?.classList?.contains("ant-collapse-item-active")) {
        header.click();
      }
    }, 5000);
  };

  useEffect(() => {
    window.onbeforeprint = () => onPrint();
  }, []);

  const showDrawer = () => {
    dispatch(setOpenDrawer(true));
  };

  const showConsensusTree = () => {
    dispatch(setOpenConsensusTreePopup(!openConsensusTreePopup));
  };

  useEffect(() => {
    if (router?.pathname.includes("/topic/")) {
      setIsCampBtnVisible(true);
    }
  }, [router?.pathname]);

  const lable = algorithms?.find((obj) => {
    return obj.algorithm_key == selectedAlgorithm;
  });

  return (
    <div
      className={`${styles.topicDetailContentHead} ${styles.inforBarHEad} printHIde`}
    >
      <Spin spinning={false}>
        <div
          className={`${styles.topicDetailContentHead_Left} ${styles.rightPanel}`}
        >
          <div className="btnsWrap w-full">
            {isCampBtnVisible &&
            currentCampNode?._isDisabled == 0 &&
            currentCampNode?.parentIsOneLevel == 0 &&
            (campRecord?.is_archive == 0 ||
              campRecord?.is_archive == undefined) ? (
              <Tooltip
                title={
                  tree && !tree["1"]?.is_valid_as_of_time
                    ? K.exceptionalMessages.createNewCampTooltipMsg
                    : ""
                }
              >
                <div>{!isMobile && <CampDisclaimer />}</div>
              </Tooltip>
            ) : null}
            <div className="flex lg:gap-6 gap-4  items-center lg:flex-nowrap flex-wrap lg:mb-5 mb-7">
              <Button
                onClick={showConsensusTree}
                className="xl:w-[277px] text-canBlack border border-canGrey2 py-2.5 lg:px-5 !h-[44px] refine-btn lg:!text-sm !text-sm font-medium flex items-center justify-between gap-2.5 rounded-lg bg-canGray"
              >
                Consensus Tree
                <Image
                  src="/images/caret-icon.svg"
                  alt="svg"
                  height={7}
                  width={14}
                />
              </Button>
              <Button
                onClick={showDrawer}
                className="w-36 hover:!text-canBlack gap-5 relative text-canBlack py-2.5 lg:px-5 h-[44px] rounded-lg w-auto lg:text-sm text-sm font-medium  flex items-center justify-center !border !border-canGrey2"
              >
                <span>Refine</span>
                <RefineIcon className="w-[16px]" />
                {(router.query.algo &&
                  selectedAlgorithm &&
                  lable?.algorithm_label !== undefined) ||
                is_camp_archive_checked ||
                is_checked ||
                selectedAsOf == "bydate" ||
                includeReview ||
                router?.query?.asof === "review" ||
                filteredScore != 0 ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-canRed absolute -top-1.5 -right-1.5"></div>
                ) : null}
              </Button>
              {(router.query.algo &&
                selectedAlgorithm &&
                lable?.algorithm_label !== undefined) ||
              is_camp_archive_checked ||
              is_checked ||
              selectedAsOf == "bydate" ||
              includeReview ||
              router?.query?.asof === "review" ||
              filteredScore != 0 ? (
                <LatestFilter />
              ) : null}
            </div>
          </div>
          <div
            className={`${styles.topicDetailContentHead_Right} ${styles.leftPanel}`}
          >
            <Typography.Paragraph
              className={"mb-0 campInfoRight " + styles.topicTitleStyle}
            >
              {isTopicPage && <RefineFilter />}
            </Typography.Paragraph>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default InfoBar;
