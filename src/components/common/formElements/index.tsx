import { Form, Input } from "antd";

const FormItem = ({
  name,
  label,
  rules,
  placeholder,
  onKeyDown = (e) => {},
  type = "text",
  maxLength = null,
}) => {
  return (
    <Form.Item name={name} label={label} {...rules}>
      <Input
        type={type}
        placeholder={placeholder}
        autoComplete={"new-" + name}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
      />
    </Form.Item>
  );
};

export default FormItem;
