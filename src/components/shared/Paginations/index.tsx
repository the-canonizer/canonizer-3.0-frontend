import { Pagination } from "antd";

const Paginations = ({ className = "", size = "small", ...props }: any) => {
  return (
    <Pagination
      className={`text-base text-black font-normal ${className}`}
      size={size}
      {...props}
    />
  );
};

export default Paginations;
