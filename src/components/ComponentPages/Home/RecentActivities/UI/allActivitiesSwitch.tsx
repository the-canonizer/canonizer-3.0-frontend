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
      className={`text-sm flex items-center justify-between ${className}`}
    >
      <span>Show all user activities</span>
      {isShowAllLoading ? (
        <Spin size="small" />
      ) : (
        <Switch
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
