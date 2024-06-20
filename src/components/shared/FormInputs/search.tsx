import { Input } from "antd";

import styales from "./Inputs.module.scss";

const SearchInputs = ({ className = "", ...props }: any) => {
  return (
    <Input.Search
      className={`font-normal text-14 hover:border-black focus:border-black ${styales.search} ${className} rounded-lg`}
      {...props}
    />
  );
};

export default SearchInputs;
