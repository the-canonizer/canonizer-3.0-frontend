import { Form, Input } from "antd";

const Inputs = ({
  name,
  label,
  rules,
  placeholder,
  onKeyDown,
  onBlur = null,
  prefix = "",
  suffix = "",
  addonBefore = "",
  type = "text",
  maxLength = null,
  dataid = "",
  wrapperClassName = "",
  inputClassName = "",
  inputMode = "",
}: any) => {
  return (
    <Form.Item
      className={`font-14 text-canBlack font-medium ${wrapperClassName}`}
      name={name}
      label={label}
      data-id={dataid}
      {...rules}
    >
      {type === "password" ? (
        <Input.Password
          prefix={prefix}
          suffix={suffix}
          addonBefore={addonBefore}
          type={type}
          placeholder={placeholder}
          className={`text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 ${inputClassName}`}
          autoComplete="off"
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          maxLength={maxLength}
          inputMode={inputMode}
        />
      ) : (
        <Input
          prefix={prefix}
          suffix={suffix}
          addonBefore={addonBefore}
          type={type}
          placeholder={placeholder}
          className={`text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 ${inputClassName}`}
          autoComplete="off"
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          maxLength={maxLength}
          inputMode={inputMode}
        />
      )}
    </Form.Item>
  );
};

export default Inputs;
