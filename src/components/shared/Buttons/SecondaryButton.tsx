import { Button } from "antd";

const SecondaryButton = ({ className = "", ...props }: any) => {
  return (
    <Button
      className={`text-canBlack hover:text-canHoverBlue font-medium disabled:bg-disabled font-base leading-22 rounded-lg border-canBlue ${className}`}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default SecondaryButton;
