import { SearchOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import styles from "./search.module.scss";

const propTypes = {
  onSearchChange: PropTypes.func,
  onSearchKeyUp: PropTypes.func,
};

const SearchBars = ({ onSearchChange, onSearchKeyUp }) => {
  const onSearchClick = () => {
    document.querySelector(".searchInput")?.classList?.toggle("active");
    document.querySelector(".searchWrap")?.classList?.toggle("active");

    (document.querySelector(".searchInput") as HTMLInputElement)?.focus();
  };

  return (
    <div id="searchWrap" className={`searchWrap ${styles.wrap}`}>
      <input
        id="searchInput"
        type="text"
        className={`searchInput ${styles.input}`}
        placeholder="Search..."
        onChange={onSearchChange}
        onKeyUp={onSearchKeyUp}
      />
      <SearchOutlined
        id="searchIcon"
        className={`text-sm ${styles.fa}`}
        onClick={onSearchClick}
      />
    </div>
  );
};

SearchBars.propTypes = propTypes;

export default SearchBars;
