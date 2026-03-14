import { Checkbox, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import { Fragment } from "react";

const { Text } = Typography;
const PreventSubCamps = ({
  options,
  onCheckboxChange,
  shouldDisableOneLevelAndAdditionalCheckbox,
}: any) => {
  const router = useRouter();
  const filterLabels = options.filter((obj) => {
    return obj.id != "is_archive";
  });
  return (
    router?.asPath.includes("/camp/create") ? filterLabels : options
  )?.map((option) => (
    <Fragment key={"fragment_" + option.id}>
      <Checkbox
        onChange={onCheckboxChange}
        name={option.id}
        value={option.id}
        checked={option.checked}
        id={option.id}
        data-testid={option.id}
        disabled={
          option?.id !== "is_archive"
            ? shouldDisableOneLevelAndAdditionalCheckbox || option.disable
            : option?.disable
        }
        className="!mb-2 [&_span]:!text-sm [&_span]:!font-semibold"
      >
        <Tooltip title={option.tooltip} key={option.id} className="d-flex">
          {option?.label?.replace(/\.$/, "")}
        </Tooltip>
        {option?.id !== "is_archive" &&
          shouldDisableOneLevelAndAdditionalCheckbox && (
            <Tooltip
              title="The parent camp does not allow the creation of multiple sub-camps."
              key="camp_subscribed_icon"
            >
              <Text
                className="text-xs text-[#777F93] d-inline-block"
                id="disable-checkbox-text"
              >
                <i className="icon-info"></i>
              </Text>
            </Tooltip>
          )}
      </Checkbox>
    </Fragment>
  ));
};

export default PreventSubCamps;
