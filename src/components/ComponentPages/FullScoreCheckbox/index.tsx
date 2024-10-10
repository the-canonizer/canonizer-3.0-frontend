import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import styles from "./fullScore.module.scss";

import { RootState } from "src/store";
import { setScoreCheckBox } from "src/store/slices/utilsSlice";

type propVal = {
  loadingIndicator?: boolean;
};

const FullScoreCheckbox = ({ loadingIndicator = false }: propVal) => {
  const router = useRouter();
  const { is_checked, loading } = useSelector((state: RootState) => ({
    is_checked: state?.utils?.score_checkbox,
    loading: state?.loading?.loading,
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
      <Checkbox
        onChange={onChange}
        checked={isChecked}
        className="text-canBlack !text-sm leading-[24px] !font-normal [&_.ant-checkbox-inner]:!w-[22px] [&_.ant-checkbox-inner]:!h-[22px] [&_.ant-checkbox-inner]:!border-canBlue [&_.ant-checkbox-inner]:!rounded-md"
        disabled={
          !router?.asPath?.includes("topic") ? loading : loadingIndicator
        }
      >
        100% of canonized score on all supported camps
      </Checkbox>
    </div>
  );
};

export default FullScoreCheckbox;
