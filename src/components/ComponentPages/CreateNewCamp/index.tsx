import { Fragment, useState, useEffect } from "react";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import {
  createCamp,
  getAllParentsCamp,
  getAllCampNickNames,
  getAllUsedNickNames,
} from "../../../network/api/campDetailApi";
import { RootState } from "../../../store";
import {
  setCurrentTopic,
  resetCurrentTopic,
} from "../../../store/slices/topicSlice";

import CreateNewCampUI from "./UI/CampUI";

const CreateNewCamp = ({
  nickNames = [],
  parentCamps = [],
  campNickNames = [],
  initialValues = {},
}) => {
  const [nickNameList, setNickNameList] = useState(nickNames);
  const [initialValue, setInitialValues] = useState(initialValues);
  const [parentCamp, setParentCamps] = useState(parentCamps);
  const [campNickName, setCampNickName] = useState(campNickNames);
  const [crCamp, setCrCamp] = useState({});

  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const topicData = useSelector((state: RootState) => state.topic.currentTopic);

  const fetchNickNameList = async () => {
    const body = {
      topic_num: topicData.topic_num,
    };
    let response = await getAllUsedNickNames(body);
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
    }
  };

  const fetchCampNickNameList = async () => {
    let response = await getAllCampNickNames();
    if (response && response.status_code === 200) {
      setCampNickName(response.data);
    }
  };

  useEffect(() => {
    fetchNickNameList();
    fetchCampNickNameList();
  }, []);

  const fetchParentsCampList = async () => {
    const body = {
      topic_num: topicData?.topic_num || "",
    };
    let res = await getAllParentsCamp(body);
    if (res && res.status_code === 200) {
      setParentCamps(res.data);
    }
  };

  useEffect(() => {
    fetchParentsCampList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: any) => {
    const body = {
      camp_about_nick_id: values.camp_about_nick_id || "",
      camp_about_url: values.camp_about_url || "",
      camp_name: values.camp_name,
      key_words: values.key_words || "",
      note: values.note || "",
      parent_camp_num: values.parent_camp_num,
      nick_name: values.nick_name,
      topic_num: topicData?.topic_num,
    };

    const res = await createCamp(body);
    if (res && res.status_code === 200) {
      dispatch(
        setCurrentTopic({ message: res.message, camp_num: res.data.camp_num })
      );
      router.push(`/camp-list`);
    }

    if (res && res.status_code === 400 && res.error.camp_name) {
      form.setFields([
        {
          name: "camp_name",
          value: values.camp_name,
          errors: [res.error.camp_name],
        },
      ]);
    }
  };

  const onCancel = () => {
    router.push("/");
  };

  const onValuesChange = (changed, all) => {
    if (changed.parent_camp_num) {
      const currentCamp = parentCamp.filter(
        (c) => c.camp_num === changed.parent_camp_num
      );
      setCrCamp(currentCamp[0]);
    }
  };

  return (
    <Fragment>
      <CreateNewCampUI
        onFinish={onFinish}
        onCancel={onCancel}
        form={form}
        initialValue={initialValue}
        topicData={topicData}
        nickNameList={nickNameList}
        parentCamp={parentCamp}
        campNickName={campNickName}
        onValuesChange={onValuesChange}
        crCamp={crCamp}
      />
    </Fragment>
  );
};

export default CreateNewCamp;
