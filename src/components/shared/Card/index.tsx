import { Card } from "antd";

const CommonCards = ({ className = "", ...rest }: any) => {
  return (
    <Card
      className={`bg-gr hover:shadow-md hover:bg-white hover:text-black hover:shadow-md font-medium text-white font-base leading-22 rounded-10 ${className}`}
      {...rest}
    >
      {rest.children}
    </Card>
  );
};

export default CommonCards;
