import { Form, Input } from "antd";

const Inputs = ({
  name,
  label,
  rules,
  placeholder,
  onKeyDown,
  onKeyUp,
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
  disabled = false,
}: // ...resProps
any) => {
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
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          maxLength={maxLength}
          inputMode={inputMode}
          disabled={disabled}
          // {...resProps}
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
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          maxLength={maxLength}
          inputMode={inputMode}
          disabled={disabled}
          // {...resProps}
        />
      )}
    </Form.Item>
  );
};

export default Inputs;
