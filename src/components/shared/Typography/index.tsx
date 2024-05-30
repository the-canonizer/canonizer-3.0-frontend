import { Typography } from "antd";

const { Title } = Typography;

const Headings = ({ className = "", ...rest }: any) => {
  if (rest.h1) {
    return (
      <Title className={`text-xl text-black ${className}`} {...rest}>
        {rest?.children}
      </Title>
    );
  }
  if (rest.h2) {
    return (
      <Title className={`text-large text-black ${className}`} {...rest}>
        {rest?.children}
      </Title>
    );
  }

  if (rest.h3) {
    return (
      <Title className={`text-medium text-black ${className}`} {...rest}>
        {rest?.children}
      </Title>
    );
  }

  return (
    <Title className={`text-base text-black ${className}`} {...rest}>
      {rest?.children}
    </Title>
  );
};

export default Headings;
