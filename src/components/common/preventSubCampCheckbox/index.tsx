import { Checkbox, Tooltip } from "antd";
import { useRouter } from "next/router";

const PreventSubCamps = ({ options, onCheckboxChange }: any) => {
  const router = useRouter();
  const filterLabels = options.filter((obj) => {
    return obj.id != "is_archive";
  });
  return (
    router?.asPath.includes("/camp/create") ? filterLabels : options
  )?.map((option) => (
    <Tooltip title={option.tooltip} key={option.id}>
      <Checkbox
        onChange={onCheckboxChange}
        name={option.id}
        value={option.id}
        checked={option.checked}
        id={option.id}
        data-testid={option.id}
        disabled={option.disable}
      >
        {option?.label?.replace(/\.$/, "")}
      </Checkbox>
    </Tooltip>
  ));
};

export default PreventSubCamps;
