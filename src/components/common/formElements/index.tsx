import { Form, Input } from "antd";

const FormItem = ({ name, label, rules, placeholder, type = "text" }) => {
  return (
    <Form.Item name={name} label={label} {...rules}>
      <Input
        type={type}
        placeholder={placeholder}
        autoComplete={"new-" + name}
      />
    </Form.Item>
  );
};

export default FormItem;
