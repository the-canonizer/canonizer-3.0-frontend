import { Button } from "antd";

const SecondaryButton = ({ className = "", ...props }: any) => {
  return (
    <Button
      className={`text-canBlack bg-[#98b7e61a] hover:bg-white hover:text-canHoverBlue hover:shadow-camp-light font-medium disabled:bg-white disabled:text-disabled disabled:border-disabled font-base leading-22 rounded-lg border-canBlue ${className}`}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default SecondaryButton;
