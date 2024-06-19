import { Typography } from "antd";

const Headings = ({ className = "", h1, h2, h3, ...rest }: any) => {
  if (h1) {
    return (
      <h1 className={`text-xl text-black font-medium ${className}`} {...rest}>
        {rest?.children}
      </h1>
    );
  }
  if (h2) {
    return (
      <h2 className={`text-large text-black ${className}`} {...rest}>
        {rest?.children}
      </h2>
    );
  }

  if (h3) {
    return (
      <h3 className={`text-medium text-black ${className}`} {...rest}>
        {rest?.children}
      </h3>
    );
  }

  return (
    <Typography.Title className={`text-14 text-black ${className}`} {...rest}>
      {rest?.children}
    </Typography.Title>
  );
};

export default Headings;
