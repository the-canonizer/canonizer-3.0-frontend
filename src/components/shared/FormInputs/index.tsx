import { Form, Input } from "antd";

const Inputs = ({
  name,
  label,
  rules,
  placeholder,
  onKeyDown,
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
      className={`font-14 text-black font-medium ${wrapperClassName}`}
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
          className={`text-black font-normal h-[40px] ${inputClassName}`}
          autoComplete="off"
          onKeyDown={onKeyDown}
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
          className={`text-black font-normal h-[40px] ${inputClassName}`}
          autoComplete="off"
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          inputMode={inputMode}
        />
      )}
    </Form.Item>
  );
};

export default Inputs;
