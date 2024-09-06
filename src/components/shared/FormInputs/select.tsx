import { Form, Select } from "antd";
import { useState } from "react";

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
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Form.Item
      className={`text-sm text-canBlack font-medium [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 ${wrapperClassName}`}
      name={name}
      label={label}
      data-id={dataid}
      initialValue={initialValue}
      {...rules}
    >
      <div
        className={`outerDiv flex border rounded ${
          isFocused
            ? "border-[#40a9ff] shadow-[0 0 0 2px rgba(24, 144, 255, 0.2)"
            : ""
        } ${prefixClassName}`}
      >
        {prefix}
        <Select
          className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack ${inputClassName}`}
          onFocus={(...rest) => {
            setIsFocused(true);
            if (onFocus) onFocus(...rest);
          }}
          onBlur={(...rest) => {
            setIsFocused(false);
            if (onBlur) onBlur(...rest);
          }}
          defaultValue={defaultValue}
          key={name + "_select"}
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

export default SelectInputs;
