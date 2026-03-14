import { Button, Typography } from "antd";
import GoogleAd from "components/googleAds";
import React from "react";
import { historyTitle } from "src/utils/generalUtility";

export default function SideNavigationTabs({
  handleBackButton,
  historyOf,
  selectedTopic,
  campHistory,
  onCompareClick,
  renderButtons,
}: any) {
  return (
    <div className="statement-status-sider">
      <Button
        type="link"
        id="history-page-back-button"
        className="text-xl text-canBlack p-1 mb-14 gap-5 flex items-center max-lg:hidden leading-none"
        icon={<i className="icon-back"></i>}
        onClick={handleBackButton}
      >
        {`${historyTitle(historyOf)} History`}
      </Button>
      <Typography.Paragraph
        id="history-page-title"
        className="mb-6 text-base font-medium"
      >
        {`${historyTitle(historyOf).toUpperCase()} HISTORY BASED ON STATUS`}
      </Typography.Paragraph>
      <div className="sider-btn pr-0 md:pr-8">
        {renderButtons && renderButtons()}
      </div>
      <Button
        size="large"
        id="history-page-compare-button"
        className="flex items-center justify-center rounded-xl text-sm gap-3.5 leading-none mt-12"
        disabled={
          !(
            selectedTopic?.length >= 2 &&
            !selectedTopic?.includes(campHistory?.id)
          )
        }
        onClick={onCompareClick}
      >
        Compare {`${historyTitle(historyOf)}s`}
        <i className="icon-compare-statement"></i>
      </Button>
      <div className="mt-5">
        <GoogleAd />
      </div>
    </div>
  );
}
