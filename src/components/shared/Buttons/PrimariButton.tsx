import { Button } from "antd";

const PrimaryButton = ({ className = "", ...rest }: any) => {
  return (
    <Button
      className={`bg-canBlue border-canBlue hocus:border-canHoverBlue hocus:bg-canHoverBlue hocus:text-white font-medium text-white disabled:!text-white disabled:!bg-canDisabled disabled:!border-canDisabled font-base leading-22 rounded-lg ${className}`}
      {...rest}
    >
      {rest.children}
    </Button>
  );
};

export default PrimaryButton;
