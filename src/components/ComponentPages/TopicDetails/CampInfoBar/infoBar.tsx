import { Spin, Tooltip, Typography, Button } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ApartmentOutlined } from "@ant-design/icons";

import styles from "../topicDetails.module.scss";

import { RootState } from "src/store";
import K from "src/constants";
import {
  setDisbaleApplyBtn,
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
  const router = useRouter();

  const {
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
  const [isInitialized, setIsInitialized] = useState(false);
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
    dispatch(setDisbaleApplyBtn(false));
  };
  useEffect(() => {
    if (!isInitialized) {
      const { is_tree_open } = router.query;
      dispatch(setOpenConsensusTreePopup(is_tree_open === "1"));
      setIsInitialized(true); // Prevent further updates from re-triggering the effect
    }
  }, [router.query.is_tree_open]);
  const showConsensusTree = () => {
    const newState = !openConsensusTreePopup;
    dispatch(setOpenConsensusTreePopup(newState));
  };

  const lable = algorithms?.find((obj) => {
    return obj.algorithm_key == selectedAlgorithm;
  });

  const TreeButton = ({ className = "" }) => (
    <Button
      id="info_bar_topic_detail_page_section_consesnus_tree_btn"
      onClick={showConsensusTree}
      className={`text-canBlack border border-${
        openConsensusTreePopup ? "canBlue" : "[#CCD4E7]"
      } py-2.5 lg:px-5 !h-[44px] refine-btn lg:!text-sm !text-sm font-medium flex items-center justify-between gap-2.5 rounded-lg bg-[#F8F8FC] [&_.blueText]:hover:fill-canBlue shadow-[0_10px_20px_0_#3150721A] ${className} `}
    >
      <span className="!flex items-center justify-start gap-2.5">
        <ApartmentOutlined className="text-canBlack" />
        <span className="text-canBlack">Consensus Tree</span>
      </span>
      <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          openConsensusTreePopup ? "!fill-canBlue" : "fill-canBlack"
        } blueText`}
      >
        <path d="M18.125 15.25C18.125 15.5938 17.8438 15.875 17.5 15.875H5V6.5H0V15.25C0 16.6289 1.12109 17.75 2.5 17.75H17.5C18.8789 17.75 20 16.6289 20 15.25V2.75C20 1.37109 18.8789 0.25 17.5 0.25H6.25V5.25H18.125V15.25ZM2.5 0.25C1.12109 0.25 0 1.37109 0 2.75V5.25H5V0.25H2.5ZM16.2031 8.61328C16.3008 8.37891 16.2461 8.10938 16.0664 7.93359L14.8164 6.68359C14.5742 6.44141 14.1758 6.44141 13.9336 6.68359L12.6836 7.93359C12.5039 8.11328 12.4531 8.38281 12.5469 8.61328C12.6406 8.84375 12.8711 9 13.125 9H13.75V10.875C13.75 11.2188 13.4688 11.5 13.125 11.5H11.25V10.875C11.25 10.6211 11.0977 10.3945 10.8633 10.2969C10.6289 10.1992 10.3594 10.2539 10.1836 10.4336L8.93359 11.6836C8.69141 11.9258 8.69141 12.3242 8.93359 12.5664L10.1836 13.8164C10.3633 13.9961 10.6328 14.0469 10.8633 13.9531C11.0938 13.8594 11.25 13.6289 11.25 13.375V12.75H13.125C14.1602 12.75 15 11.9102 15 10.875V9H15.625C15.8789 9 16.1055 8.84766 16.2031 8.61328Z" />
      </svg>
    </Button>
  );

  return (
    <div
      id="info_bar_topic_detail_page_section"
      className={`${styles.topicDetailContentHead} ${styles.inforBarHEad} printHIde`}
    >
      <Spin spinning={false}>
        <div
          id="info_bar_topic_detail_page_section_right_panel"
          className={`${styles.topicDetailContentHead_Left} ${styles.rightPanel}`}
        >
          <div
            className="btnsWrap w-full"
            id="info_bar_topic_detail_page_section_tooltip"
          >
            {tree?.["1"]?.is_valid_as_of_time ? (
              <Tooltip
                id="tooltip"
                title={
                  tree && !tree["1"]?.is_valid_as_of_time
                    ? K.exceptionalMessages.createNewCampTooltipMsg
                    : ""
                }
              >
                {!isMobile && (
                  <div>
                    <CampDisclaimer />
                  </div>
                )}
              </Tooltip>
            ) : null}
            <div
              className="flex lg:gap-6 gap-4  items-center lg:flex-nowrap flex-wrap lg:mb-5 mb-7"
              id="info_bar_topic_detail_page_section_btn"
            >
              <Button
                id="info_bar_topic_detail_page_section_refine_btn"
                onClick={showDrawer}
                className="w-36 hover:!text-canBlack gap-5 relative text-canBlack py-2.5 lg:px-5 h-[44px] rounded-lg w-auto lg:text-sm text-sm font-medium  flex items-center justify-center !border !border-canGrey2"
              >
                <span id="info_bar_topic_detail_page_section_refine_text">
                  Refine
                </span>
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
            <TreeButton className="w-[68%]" />
          </div>
          <div
            id="info_bar_topic_detail_page_section_refine_filter_area"
            className={`${styles.topicDetailContentHead_Right} ${styles.leftPanel}`}
          >
            <Typography.Paragraph
              id="info_bar_topic_detail_page_section_typography_area"
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
