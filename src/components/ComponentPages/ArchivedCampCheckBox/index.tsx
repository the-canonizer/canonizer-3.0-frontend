import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import styles from "./archivedCamps.module.scss";

import { RootState } from "src/store";
import {
  setScoreCheckBox,
  setArchivedCheckBox,
} from "src/store/slices/utilsSlice";

const ArchivedCampCheckBox = () => {
  const { is_checked } = useSelector((state: RootState) => ({
    is_checked: state?.utils?.archived_checkbox,
  }));
  const [isChecked, setIsChecked] = useState(is_checked);

  const dispatch = useDispatch();

  useEffect(() => setIsChecked(is_checked), [is_checked]);

  const setCheckboxStore = (val) => {
    dispatch(setArchivedCheckBox(val)), console.log(val, "val");
  };

  const onChange = (e: CheckboxChangeEvent) => {
    setCheckboxStore(e.target.checked);
  };

  return (
    <div className={styles.archived_checkbox}>
      <Checkbox onChange={onChange} checked={isChecked}>
        Show archived camps
      </Checkbox>
    </div>
  );
};

export default ArchivedCampCheckBox;
