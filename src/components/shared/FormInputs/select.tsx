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
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Form.Item
      className={`font-14 text-canBlack font-medium ${wrapperClassName}`}
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
          className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none ${inputClassName}`}
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
          {options.map((op) => (
            <Option key={name + "_" + op.id} value={op[valueKey]}>
              {isLabelRequiredFormat ? formatFunc(op[nameKey]) : op[nameKey]}
            </Option>
          ))}
        </Select>
      </div>
    </Form.Item>
  );
};

export default SelectInputs;