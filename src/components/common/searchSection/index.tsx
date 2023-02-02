import React from "react";
import { Button, Radio, Input } from "antd";

import styles from "./searchSection.module.scss";

const { Search } = Input;

const SearchSection = () => {
  return (
    <>
      <section className={styles.wrap}>
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
                  <label htmlFor="ss1" title="Search canonizer3.canonizer.com">
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
          <p>
            (This is a free{" "}
            <a
              href="https://github.com/the-canonizer/canonizer-3.0-frontend"
              rel="noreferrer"
              target="_blank"
            >
              {" "}
              open source{" "}
            </a>
            prototype being developed by volunteers. Please be patient with what
            we have so far and/or be willing to help.)
          </p>
        </div>
      </section>
    </>
  );
};

export default SearchSection;
