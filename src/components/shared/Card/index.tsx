import { Card } from "antd";

const CommonCards = ({ className = "", ...rest }: any) => {
  return (
    <Card
      className={`bg-canGray font-medium text-white font-base leading-22 rounded-xl ${className}`}
      {...rest}
    >
      {rest.children}
    </Card>
  );
};

export default CommonCards;
