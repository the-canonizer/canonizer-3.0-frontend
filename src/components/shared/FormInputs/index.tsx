import { Form, Input } from "antd";

const Inputs = ({
  name,
  label,
  rules,
  placeholder,
  onKeyDown,
  prefix = "",
  suffix = "",
  type = "text",
  maxLength = null,
  dataid = "",
}: any) => {
  return (
    <Form.Item
      className="font-14 text-black font-medium"
      name={name}
      label={label}
      data-id={dataid}
      {...rules}
    >
      <Input
        prefix={prefix}
        suffix={suffix}
        type={type}
        placeholder={placeholder}
        className="text-black font-normal"
        autoComplete="off"
        onKeyDown={onKeyDown}
        maxLength={maxLength}
      />
    </Form.Item>
  );
};

export default Inputs;
