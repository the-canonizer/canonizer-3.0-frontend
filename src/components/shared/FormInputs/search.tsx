import { Input } from "antd";

import styales from "./Inputs.module.scss";

const SearchInputs = ({ className = "", ...props }: any) => {
  return (
    <Input.Search
      className={`font-normal text-sm hover:border-canBlack focus:border-canBlack ${styales.search} ${className} rounded-lg`}
      {...props}
    />
  );
};

export default SearchInputs;
