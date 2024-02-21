import React from "react";
import { Button, Input } from "antd";

import styles from "./searchSection.module.scss";

const { Search } = Input;
const googleSearch = process.env.NEXT_PUBLIC_SITE_NAME;
const SearchSection = () => {
  return (
    <>
      <section className={`${styles.wrap} printHIde`}>
        <div className={styles.container}>
          <form
            method="get"
            action="https://www.google.com/custom"
            target="_top"
          >
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
                    defaultValue={process.env.NEXT_PUBLIC_SITE_NAME}
                    id="ss1"
                    defaultChecked
                  />
                  <label htmlFor="ss1" title={googleSearch}>
                    canonizer.com
                  </label>
                </div>
              </div>
              <Search
                placeholder="Google Search for"
                size="large"
                className={styles.formInput}
                name="q"
                id="sbi"
                required
              />
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                className={styles.btnSearch}
              >
                <i className="icon-search"></i> Search
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default SearchSection;
