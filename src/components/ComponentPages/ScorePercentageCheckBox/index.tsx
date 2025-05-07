import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import styles from "./scorePercentageCheckbox.module.scss";

import { RootState } from "src/store";
import { setScorePercenategCheckBox } from "src/store/slices/utilsSlice";

const ScorePercentageCheckBox = ({ loadingIndicator = false }: any) => {
  const router = useRouter();
  const { is_score_percentage_checked, loading } = useSelector(
    (state: RootState) => ({
        is_score_percentage_checked: state?.utils?.score_percentage_checked,
      loading: state?.loading?.loading,
    })
  );
  const [isChecked, setIsChecked] = useState(is_score_percentage_checked);

  const dispatch = useDispatch();

  useEffect(
    () => setIsChecked(is_score_percentage_checked),
    [is_score_percentage_checked]
  );

  const setCheckboxStore = (val) => {
    dispatch(setScorePercenategCheckBox(val));
  };

  const onChange = (e: CheckboxChangeEvent) => {
    setCheckboxStore(e.target.checked);
  };

  return (
    <div className={styles.percentage_checkbox}>
      <Checkbox
        disabled={
          !router?.asPath?.includes("topic") ? loading : loadingIndicator
        }
        onChange={onChange}
        checked={isChecked}
        className=" text-canBlack !text-sm leading-[24px] font-normal mt-2 [&_.ant-checkbox-inner]:!w-[22px] [&_.ant-checkbox-inner]:!h-[22px] [&_.ant-checkbox-inner]:!border-canBlue [&_.ant-checkbox-inner]:!rounded-md   "
      >
        Show score in Percentage
      </Checkbox>
    </div>
  );
};

export default ScorePercentageCheckBox;
