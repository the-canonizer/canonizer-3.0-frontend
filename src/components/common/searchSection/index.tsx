import React from "react";
import { Button, Radio, Input } from "antd";

import styles from "./searchSection.module.scss";

const { Search } = Input;
const googleSearch = process.env.NEXT_PUBLIC_SITE_NAME;
const SearchSection = () => {
  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        <form method="get" action="https://www.google.com/custom" target="_top">
          <div className={styles.form}>
            <div className={styles.formRadio}>
              <div className={styles.formItem}>
                <input type="radio" name="sitesearch" value="" id="ss0" />
                <label htmlFor="ss0" title="Search the Web">
                  Web
                </label>
              </div>
              <div className={styles.formItem}>
                <input
                  type="radio"
                  name="sitesearch"
                  defaultValue={googleSearch}
                  id="ss1"
                  defaultChecked
                />
                <label htmlFor="ss1" title={googleSearch}>
                  canonizer.com
                </label>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default SearchSection;
