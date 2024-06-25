import { Button } from "antd";

const PrimaryButton = ({ className = "", ...rest }: any) => {
  return (
    <Button
      className={`bg-canBlue hover:bg-canHoverBlue hover:text-white font-medium text-white disabled:bg-disabled font-base leading-22 rounded-xl ${className}`}
      {...rest}
    >
      {rest.children}
    </Button>
  );
};

export default PrimaryButton;
