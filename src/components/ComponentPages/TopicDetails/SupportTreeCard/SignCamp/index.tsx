import React, { useState, useEffect } from "react";
import { Card, Select, Button } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../../../ManageSupport/ManageSupportUI/ManageSupport.module.scss";
import messages from "../../../../../messages";
import { RootState } from "src/store";
import CustomSkelton from "src/components/common/customSkelton";
import {
  campSignApi,
  getAllUsedNickNames,
  getTreesApi,
} from "src/network/api/campDetailApi";

const { placeholders } = messages;

const SignCamp = ({ setSignModalOpen, setLoadingIndicatorSupport }: any) => {
  const router = useRouter();

  const [nickNameList, setNickNameList] = useState([]);
  const [selectedtNickname, setSelectedtNickname] = useState("");
  const [loadingNickname, setLoadingNickname] = useState(false);

  const { algorithm, asofdate, asof } = useSelector((state: RootState) => ({
    algorithm: state.filters?.filterObject?.algorithm,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state.filters?.filterObject?.asof,
  }));

  const getCanonizedNicknameList = async () => {
    setLoadingNickname(true);
    const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };
    let res = await getAllUsedNickNames(topicNum && body);
    if (res?.status_code == 200 && res?.data?.length > 0) {
      setNickNameList(res.data);
      setSelectedtNickname(res?.data[0]?.id);
    }
    setLoadingNickname(false);
  };

  const handleSubmit = async () => {
    setLoadingNickname(true);
    setLoadingIndicatorSupport(true);
    let topic_num: any = router?.query?.camp[0]?.split("-")[0];
    let camp_num: any = router?.query?.camp[1]?.split("-")[0] ?? 1;
    let reqBody = {
      topic_num,
      camp_num,
      nick_name_id: selectedtNickname,
    };
    let res = await campSignApi(reqBody);
    if (res?.status_code == 200) {
      const reqBodyForService = {
        topic_num: +router?.query?.camp[0]?.split("-")[0],
        camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
        asOf: asof,
        asofdate:
          asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
        algorithm: algorithm,
        update_all: 1,
        fetch_topic_history: +router?.query?.topic_history,
      };
      await getTreesApi(reqBodyForService);
    }
    setSignModalOpen(false);
    setLoadingNickname(false);
    setLoadingIndicatorSupport(false);
  };
  const handleCancel = () => {
    setSignModalOpen(false);
  };

  useEffect(() => {
    getCanonizedNicknameList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loadingNickname ? (
    <CustomSkelton
      skeltonFor="manageSupportCard"
      bodyCount={5}
      stylingClass=""
      isButton={true}
    />
  ) : (
    <>
      <div>
        <Card className={styles.margin_top} type="inner">
          <div className={styles.card_heading}>
            <p id="nickNameToSupport">Nickname To Support Above Camps</p>
          </div>
          <Select
            data-testid="select-option"
            placeholder={placeholders.nickName}
            size="large"
            className={styles.dropdown}
            value={selectedtNickname}
            onChange={(value) => {
              setSelectedtNickname(value);
            }}
            showSearch
            optionFilterProp="children"
          >
            {nickNameList?.map((nick) => {
              return (
                <Select.Option key={nick.id} value={nick.id}>
                  {nick.nick_name}
                </Select.Option>
              );
            })}
          </Select>
          <div className={styles.Upload_Cancel_Btn}>
            <Button
              id="uploadBtn"
              htmlType="submit"
              className={styles.Upload_Btn}
              onClick={handleSubmit}
            >
              Submit
            </Button>

            <Button
              id="cancelBtn"
              htmlType="button"
              className={styles.cancel_Btn}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SignCamp;
