import { Input } from "antd";

const SearchInputs = ({ className = "", ...props }: any) => {
  return (
    <Input.Search
      className={`rounded font-normal text-base ${className}`}
      {...props}
    />
  );
};

export default SearchInputs;
