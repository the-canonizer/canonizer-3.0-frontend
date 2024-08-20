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
      className={`text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 ${wrapperClassName}`}
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
          className={`text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput ${inputClassName}`}
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
          className={`text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput ${inputClassName}`}
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
