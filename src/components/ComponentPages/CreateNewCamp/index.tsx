import { Fragment, useState, useEffect } from "react";
import { Form, message } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import {
  createCamp,
  getAllParentsCamp,
  getAllCampNickNames,
  getAllUsedNickNames,
} from "../../../network/api/campDetailApi";
import { setCurrentTopic } from "../../../store/slices/topicSlice";
import messages from "../../../messages";

import CreateNewCampUI from "./UI/CampUI";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import isAuth from "../../../hooks/isUserAuthenticated";

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
  const [params, setParams] = useState({});
  const [options, setOptions] = useState([...messages.preventCampLabel]);

  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = isAuth();

  const getRouterParams = () => {
    const q = router?.query;

    const topicArr = (q?.camp[0] as string).split("-");
    const campArr = (q?.camp[1] as string).split("-");
    const topic_num = topicArr?.shift();
    const camp_num = campArr?.shift();
    const topic = topicArr?.join(" ");
    const camp = campArr?.join(" ");

    const pr = {
      topic_name: topic,
      topic_num: +topic_num,
      camp_name: camp,
      camp_num: +camp_num,
    };

    return pr;
  };

  useEffect(() => {
    const q = getRouterParams();

    const p = {
      topic: q?.topic_name,
      camp_num: q?.camp_num,
      topic_num: q?.topic_num,
      topic_name: q?.topic_name,
      camp_name: q?.camp_name,
    };

    setParams(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query]);

  const fetchNickNameList = async () => {
    const q = getRouterParams();
    const body = { topic_num: q?.topic_num };
    let response = await getAllUsedNickNames(body);
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
      return response.status_code;
    } else {
      return response.status ?? "";
    }
  };

  const fetchCampNickNameList = async () => {
    let response = await getAllCampNickNames();
    if (response && response.status_code === 200) {
      setCampNickName(response.data);
    }
  };

  const fetchParentsCampList = async () => {
    const q = getRouterParams();
    const body = { topic_num: q?.topic_num, parent_camp_num: q.camp_num };
    let res = await getAllParentsCamp(body);
    if (res && res.status_code === 200) {
      setParentCamps(res.data);
    }
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchCampNickNameList();
      fetchParentsCampList();
      fetchNickNameList();
    }
  }, [isUserAuthenticated]);

  const onFinish = async (values: any) => {
    if (!values.camp_name?.trim()) {
      form.setFields([
        {
          name: "camp_name",
          value: "",
        },
      ]);
      form.validateFields(["camp_name"]);
      return true;
    }

    const body = {
      camp_about_nick_id: values.camp_about_nick_id || "",
      camp_about_url: values.camp_about_url || "",
      camp_name: values.camp_name?.trim(),
      key_words: values.key_words || "",
      note: values.note?.trim() || "",
      parent_camp_num: values.parent_camp_num,
      nick_name: values.nick_name,
      topic_num: params["topic_num"],
    };

    options.map((op) => (body[op.id] = op.checked ? 1 : 0));

    const res = await createCamp(body);
    if (res && res.status_code === 200) {
      message.success(res.message);

      dispatch(
        setCurrentTopic({ message: res.message, camp_num: res.data.camp_num })
      );

      const { camp } = router.query;

      router.push({
        pathname: `/topic/${replaceSpecialCharacters(camp[0], "-")}/${
          res?.data?.camp_num
        }-${replaceSpecialCharacters(values.camp_name, "-")}`,
      });

      const oldOptions = [...options];
      await oldOptions.map((op) => {
        op.checked = false;
        op.disable = false;
      });
      setOptions(oldOptions);
    }

    if (res && res.status_code === 400) {
      if (res?.error) {
        const errors_key = Object.keys(res.error);

        if (errors_key?.length) {
          errors_key.forEach((key) => {
            form.setFields([
              {
                name: key,
                value: values[key],
                errors: [res.error[key]],
              },
            ]);
          });
        }
      }
    }
  };

  const onCancel = () => {
    const { camp } = router.query;
    router.push({
      pathname: `/topic/${replaceSpecialCharacters(
        camp[0],
        "-"
      )}/${replaceSpecialCharacters(camp[1], "-")}`,
    });
  };

  // checkbox
  useEffect(() => {
    return () => {
      const oldOptions = [...options];
      oldOptions.map((op) => {
        op.checked = false;
      });

      setOptions(oldOptions);
    };
  }, []);

  const onCheckboxChange = async (e: CheckboxChangeEvent) => {
    const oldOptions = [...options];

    await oldOptions.map((op) => {
      if (op.id === e.target.value) {
        op.checked = e.target.checked;
      } else {
        op.checked = false;
      }
    });

    setOptions(oldOptions);
  };

  const onParentCampChange = (value: any, currentOption: any) => {};

  return (
    <Fragment>
      <CreateNewCampUI
        onFinish={onFinish}
        onCancel={onCancel}
        form={form}
        initialValue={initialValue}
        topicData={params}
        nickNameList={nickNameList}
        parentCamp={parentCamp}
        campNickName={campNickName}
        options={options}
        onCheckboxChange={onCheckboxChange}
        onParentCampChange={onParentCampChange}
      />
    </Fragment>
  );
};

export default CreateNewCamp;
