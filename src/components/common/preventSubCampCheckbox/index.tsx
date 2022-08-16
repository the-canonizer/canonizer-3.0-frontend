import { Checkbox, Tooltip } from "antd";
import { Fragment } from "react";

const PreventSubCamps = ({ options, onCheckboxChange }) => (
  <Fragment>
    {options.map((option) => (
      <Tooltip title={option.tooltip} key={option.id}>
        <Checkbox
          onChange={onCheckboxChange}
          name={option.id}
          value={option.id}
          checked={option.checked}
          id={option.id}
        >
          {option.label}
        </Checkbox>
      </Tooltip>
    ))}
  </Fragment>
);

export default PreventSubCamps;
