import { Form, Input } from "antd";

const FormItem = ({
  name,
  label,
  rules,
  placeholder,
  onKeyDown = (e) => {},
  type = "text",
  maxLength = null,
  dataid = "",
}) => {
  return (
    <Form.Item name={name} label={label} {...rules} data-id={dataid}>
      <Input
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        onKeyDown={onKeyDown}
        maxLength={maxLength}
      />
    </Form.Item>
  );
};

export default FormItem;
