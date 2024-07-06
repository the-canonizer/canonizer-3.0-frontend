import { SearchOutlined } from "@ant-design/icons";

import styles from "./search.module.scss";

const SearchBars = ({ onSearchChange, onSearchKeyUp }) => {
  const onSearchClick = () => {
    document.querySelector(".searchInput")?.classList?.toggle("active");
    document.querySelector(".searchWrap")?.classList?.toggle("active");

    (document.querySelector(".searchInput") as HTMLInputElement)?.focus();
  };

  return (
    <div className={`searchWrap ${styles.wrap}`}>
      <input
        type="text"
        className={`searchInput ${styles.input}`}
        placeholder="Search..."
        onChange={onSearchChange}
        onKeyUp={onSearchKeyUp}
      />
      <SearchOutlined
        className={`text-sm ${styles.fa}`}
        onClick={onSearchClick}
      />
    </div>
  );
};

export default SearchBars;
