import { Checkbox } from "antd";

const CustomCheckbox = ({ className = "", ...props }: any) => {
  return (
    <Checkbox
      className={`${
        props.checked
          ? props.onlyCheckbox
            ? "[&>_.ant-checkbox-checked>span]:bg-green"
            : "border-green bg-green30 [&>_.ant-checkbox-checked>span]:bg-green"
          : "border-greyBr bg-white [&>_.ant-checkbox>span]:border-greyBr2"
      } border-2 py-1 px-3 rounded-md [&>span]:rounded-full [&>_.ant-checkbox>span]:rounded-full [&>span]:overflow-hidden [&>span:nth-child(2)]:order-1 [&>span:nth-child(1)]:order-2 [&>span:nth-child(2)]:pl-0 [&>span:nth-child(2)]:text-14 [&>span:nth-child(2)]:font-regular [&>span:nth-child(2)]:text-black [&>_.ant-checkbox-checked>span]:!border-green ${className}`}
      checked={props.checked}
      {...props}
    >
      {props.children}
    </Checkbox>
  );
};

export default CustomCheckbox;

// [&>_.ant-checkbox>span]:border-transparent
