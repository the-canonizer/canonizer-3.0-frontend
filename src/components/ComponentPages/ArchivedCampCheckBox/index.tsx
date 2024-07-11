import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import styles from "./archivedCamps.module.scss";

import { RootState } from "src/store";
import { setArchivedCheckBox } from "src/store/slices/utilsSlice";

const ArchivedCampCheckBox = ({ loadingIndicator = false }: any) => {
  const router = useRouter();
  const { is_camp_archive_checked, loading } = useSelector(
    (state: RootState) => ({
      is_camp_archive_checked: state?.utils?.archived_checkbox,
      loading: state?.loading?.loading,
    })
  );
  const [isChecked, setIsChecked] = useState(is_camp_archive_checked);

  const dispatch = useDispatch();

  useEffect(
    () => setIsChecked(is_camp_archive_checked),
    [is_camp_archive_checked]
  );

  const setCheckboxStore = (val) => {
    dispatch(setArchivedCheckBox(val));
  };

  const onChange = (e: CheckboxChangeEvent) => {
    setCheckboxStore(e.target.checked);
  };

  return (
    <div className={styles.archived_checkbox}>
      <Checkbox
        disabled={
          !router?.asPath?.includes("topic") ? loading : loadingIndicator
        }
        onChange={onChange}
        checked={isChecked}
        className="text-canBlack text-sm leading-[24px] font-medium"
      >
        Show archived camps
      </Checkbox>
    </div>
  );
};

export default ArchivedCampCheckBox;
