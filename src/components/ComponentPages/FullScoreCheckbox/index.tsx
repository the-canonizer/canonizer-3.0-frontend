import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import styles from "./fullScore.module.scss";

import { RootState } from "src/store";
import { setScoreCheckBox } from "src/store/slices/utilsSlice";

const FullScoreCheckbox = () => {
  const { is_checked } = useSelector((state: RootState) => ({
    is_checked: state?.utils?.score_checkbox,
  }));

  const [isChecked, setIsChecked] = useState(is_checked);

  const dispatch = useDispatch();

  useEffect(() => setIsChecked(is_checked), [is_checked]);

  const setCheckboxStore = (val) => dispatch(setScoreCheckBox(val));

  const onChange = (e: CheckboxChangeEvent) => {
    setCheckboxStore(e.target.checked);
  };

  return (
    <div className={styles.score_checkbox}>
      <Checkbox onChange={onChange} checked={isChecked}>
        100% of canonized score on all supported camps
      </Checkbox>
    </div>
  );
};

export default FullScoreCheckbox;
