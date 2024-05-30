import { Button } from "antd";

const SecondaryButton = ({ className = "", ...props }: any) => {
  return (
    <Button
      className={`text-black hover:text-hblue font-medium disabled:bg-disabled font-base leading-22 rounded-10 ${className}`}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default SecondaryButton;
