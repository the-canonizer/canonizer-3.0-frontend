import { Pagination } from "antd";

const Paginations = ({ className = "", size = "small", ...props }: any) => {
  return (
    <Pagination
      className={`text-sm text-canBlack font-normal ${className}`}
      size={size}
      {...props}
    />
  );
};

export default Paginations;
