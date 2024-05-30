import { Button } from "antd";

const PrimaryButton = ({ className = "", ...rest }: any) => {
  return (
    <Button
      className={`bg-blue hover:bg-hblue hover:text-white font-medium text-white disabled:bg-disabled font-base leading-22 rounded-10 ${className}`}
      {...rest}
    >
      {rest.children}
    </Button>
  );
};

export default PrimaryButton;
