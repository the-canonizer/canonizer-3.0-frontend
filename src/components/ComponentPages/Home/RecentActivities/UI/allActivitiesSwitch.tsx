import { Typography, Spin, Switch } from "antd";

function AllActivitiesSwitch({
  userData,
  hasCampOrTopicNum,
  isShowAllLoading,
  isChecked,
  onChange,
  className = "",
}) {
  return userData?.is_admin && !hasCampOrTopicNum ? (
    <Typography.Paragraph
      id="all-activities-paragraph"
      className={`text-sm flex items-center justify-between ${className}`}
    >
      <span id="all-activities-span">Show all user activities</span>
      {isShowAllLoading ? (
        <Spin size="small" />
      ) : (
        <Switch
          id="all-activities-switch"
          checked={isChecked}
          className="text-sm"
          size="small"
          onChange={onChange}
        />
      )}
    </Typography.Paragraph>
  ) : null;
}

export default AllActivitiesSwitch;
