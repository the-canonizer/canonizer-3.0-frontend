import { Form, Input } from "antd";

const FormItem = ({
  name,
  label,
  rules,
  placeholder,
  onKeyDown,
  type = "text",
  maxLength = null,
  dataid = "",
}: any) => {
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
