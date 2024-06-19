import { Input } from "antd";

const SearchInputs = ({ className = "", ...props }: any) => {
  return (
    <Input.Search
      className={`rounded font-normal text-14 ${className}`}
      {...props}
    />
  );
};

export default SearchInputs;
