import React from 'react';
import { Button, Radio, Input } from 'antd';

import styles from "./searchSection.module.scss";

const { Search } = Input;

const SearchSection = () => {
  return (
    <>
      <section className={styles.wrap}>
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.formRadio}>
                    <Radio.Group>
                        <Radio value={1} checked>Web</Radio>
                        <Radio value={2}>Canonizer.com</Radio>
                    </Radio.Group>
                </div>
                <Search placeholder="Google Search for" size='large' className={styles.formInput} />
                <Button type="primary" size='large' className={styles.btnSearch}><i className="icon-search"></i> Search</Button>
            </div>
            <p>(This is a free open source prototype being developed by volunteers. Please be patient with what we have so far and/or be willing to help.)</p>
        </div>
      </section>
    </>
  );
};

export default SearchSection;
