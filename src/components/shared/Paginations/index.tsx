import { Pagination } from "antd";

const Paginations = ({ className = "", size = "small", ...props }: any) => {
  return (
    <Pagination
      className={`text-14 text-black font-normal ${className}`}
      size={size}
      {...props}
    />
  );
};

export default Paginations;
