import { useState } from "react";
import { Form, Select } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;

const SelectInputs = ({
  rules,
  label,
  name = "",
  options = [],
  className = "",
  valueKey = "id",
  nameKey = "label",
  dataid = "",
  wrapperClassName = "",
  inputClassName = "",
  prefix = null,
  prefixClassName = "",
  suffix = "",
  isLabelRequiredFormat = false,
  formatFunc = null,
  onFocus = null,
  onBlur = null,
  initialValue = null,
  defaultValue = null,
  isDefaultOption = true,
  optionsData = null,
  lastValue = null,
  mode = null,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [lastSelectedValue, setLastSelectedValue] = useState(null);

  return (
    <Form.Item
      className={`text-sm text-canBlack font-medium [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 ${wrapperClassName}`}
      name={name}
      key={`item_` + name}
      label={label}
      data-id={dataid}
      initialValue={initialValue}
      {...rules}
    >
      <div
        className={`outerDiv flex border rounded ${
          isFocused
            ? "border-[#40a9ff] shadow-[0 0 0 2px rgba(24, 144, 255, 0.2)]"
            : ""
        } ${prefixClassName}`}
      >
        {prefix}
        <Select
          className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack ${inputClassName}`}
          onFocus={(...rest) => {
            setIsFocused(true);
            if (onFocus) onFocus(...rest);
            setLastSelectedValue(lastValue);
          }}
          onBlur={(...rest) => {
            setIsFocused(false);
            if (onBlur) onBlur(...rest);
          }}
          defaultValue={defaultValue}
          key={name + "_select"}
          mode={mode}
          onSearch={(val) => {
            if (!val) {
              props.onSelect(lastSelectedValue);
            }
          }}
          {...props}
        >
          {isDefaultOption
            ? options.map((op) => (
                <Option key={name + "_" + op[valueKey]} value={op[valueKey]}>
                  {isLabelRequiredFormat
                    ? formatFunc(op[nameKey])
                    : op[nameKey]}
                </Option>
              ))
            : optionsData}
        </Select>
      </div>
    </Form.Item>
  );
};

SelectInputs.propTypes = {
  rules: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  valueKey: PropTypes.string,
  nameKey: PropTypes.string,
  dataid: PropTypes.string,
  wrapperClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  prefix: PropTypes.node,
  prefixClassName: PropTypes.string,
  suffix: PropTypes.string,
  isLabelRequiredFormat: PropTypes.bool,
  formatFunc: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  initialValue: PropTypes.any,
  defaultValue: PropTypes.any,
  isDefaultOption: PropTypes.bool,
  optionsData: PropTypes.node,
  lastValue: PropTypes.string,
  mode: PropTypes.string, // Specify the mode for selection (multiple/tags)
};

export default SelectInputs;
