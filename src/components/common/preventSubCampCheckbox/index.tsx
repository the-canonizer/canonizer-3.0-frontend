import { Checkbox, Tooltip } from "antd";
import { useRouter } from "next/router";
import { Fragment } from "react";

const PreventSubCamps = ({ options, onCheckboxChange }) => {
  const router = useRouter();
  const filterLabels = options.filter((obj) => {
    return obj.id != "is_archive";
  });
  return (
    <Fragment>
      {(router?.asPath.includes("/camp/create") ? filterLabels : options)?.map(
        (option) => (
          <Tooltip title={option.tooltip} key={option.id}>
            <Checkbox
              onChange={onCheckboxChange}
              name={option.id}
              value={option.id}
              checked={option.checked}
              id={option.id}
              disabled={option.disable}
            >
              {option?.label?.replace(/\.$/, "")}
            </Checkbox>
          </Tooltip>
        )
      )}
    </Fragment>
  );
};

export default PreventSubCamps;
