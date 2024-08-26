import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { Col, Form, Row, message } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";

import type { CheckboxChangeEvent } from "antd/es/checkbox";

import {
  getAllParentsCamp,
  getAllCampNickNames,
  getAllUsedNickNames,
} from "src/network/api/campDetailApi";
import { setCurrentTopic } from "src/store/slices/topicSlice";
import messages from "src/messages";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import isAuth from "src/hooks/isUserAuthenticated";
import { setShowDrawer } from "src/store/slices/filtersSlice";
import { RootState } from "src/store";
import DataNotFound from "../DataNotFound/dataNotFound";
import CustomSpinner from "components/shared/CustomSpinner";
import ExistingCampList from "./UI/existingCampList";
import CampInfoCard from "./UI/rightContent";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import FormUI from "./UI/FormUI";
import { globalSearchCanonizer } from "src/network/api/userApi";
import queryParams from "src/utils/queryParams";
import SimilarCampPopup from "./UI/similarCampsPopup";
import { findSimilarNames } from ".";
import {
  getEditCampApi,
  updateCampApi,
} from "src/network/api/campManageStatementApi";

const CreateNewCamp = () => {
  const { filterByScore, filterObject, viewThisVersion } = useSelector(
    (state: RootState) => ({
      filterByScore: state.filters?.filterObject?.filterByScore,
      filterObject: state?.filters?.filterObject,
      viewThisVersion: state?.filters?.viewThisVersionCheck,
    })
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = isAuth();

  const [form] = Form.useForm();

  const values = Form.useWatch([], form);

  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [parentCamp, setParentCamps] = useState([]);
  const [campExist, setCampExist] = useState(true);
  const [campNickName, setCampNickName] = useState([]);
  const [params, setParams] = useState({});
  const [options, setOptions] = useState([...messages.preventCampLabel]);
  const [isLoading, setIsLoading] = useState(false);
  const [haveCampExist, setHaveCampExist] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [existingCamps, setExistingCamps] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSimPopOpen, setIsSimPopOpen] = useState(false);
  const [initialOptions, setInitialOptions] = useState([]);
  const [payload, setPayloadBreadCrumb] = useState({
    camp_num: "",
    topic_num: "",
  });
  const [campLeaderData, setCampLeaderData] = useState([]);
  const [editStatementData, setEditStatementData] = useState({ data: null });
  const [currentCampLeader, setCurrentCampLeader] = useState(null);
  const [originalData, setOriginalData] = useState({ name_space: null });
  const [submitIsDisableCheck, setSubmitIsDisableCheck] = useState(true);
  const [isSubmitReq, setIsSubmitReq] = useState(false);
  const [isTopicLoading, setIsopicLoading] = useState(false);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  // Helper function to check if a value has changed
  const hasChanged = (originalValue, newValue) => {
    return originalValue?.trim() !== newValue?.trim();
  };

  // Helper function to check if an option has changed
  const isOptionChanged = (currentValue, option) => {
    return !!currentValue !== !!option?.checked;
  };

  const isValueChanged = () => {
    const currentCamp = editStatementData?.data?.camp;

    const isDisabled = options?.find((op) => op?.id === "is_disabled");
    const isOneLevel = options?.find((op) => op?.id === "is_one_level");
    const isArchived = options?.find((op) => op?.id === "is_archive");

    return (
      isOptionChanged(currentCamp?.is_archive, isArchived) ||
      isOptionChanged(currentCamp?.is_disabled, isDisabled) ||
      isOptionChanged(currentCamp?.is_one_level, isOneLevel)
    );
  };

  useEffect(() => {
    const currentCamp = editStatementData?.data?.camp;

    if (
      hasChanged(currentCamp?.camp_name, values?.camp_name) ||
      currentCamp?.submitter_nick_id !== values?.nick_name ||
      currentCamp?.camp_about_nick_id !== values?.camp_about_nick_id ||
      currentCamp?.camp_about_url !== values?.camp_about_url ||
      currentCamp?.camp_leader_nick_id !== values?.camp_leader_nick_id ||
      currentCamp?.parent_camp_num !== values?.parent_camp_num ||
      currentCamp?.note !== values?.note ||
      currentCamp?.edit_summary !== values?.edit_summary ||
      isValueChanged()
    ) {
      setIsSubmitReq(true);
    } else {
      setIsSubmitReq(false);
    }
  }, [values, editStatementData?.data?.camp]);

  const getExistingList = async (val = values?.camp_name) => {
    setIsopicLoading(true);
    const topicName = val,
      queryParamObj: any = {
        type: "camp",
        size: 5,
        page: 1,
        term: topicName,
      };

    const res = await globalSearchCanonizer(queryParams(queryParamObj)),
      resData = res?.data;

    if (res?.status_code === 200) {
      if (resData?.data?.camp && resData?.data?.camp?.length > 0) {
        setExistingCamps(resData?.data?.camp);
        setHaveCampExist(true);
      }

      if (resData?.meta_data?.total > 5) {
        setIsShowMore(true);
      }
    }
    setIsopicLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    async function nickNameListApiCall() {
      const getDataPayload = {
        record_id: router?.query?.camp?.at(0)?.split("-")[0],
        event_type: "edit",
      };

      const res = await getEditCampApi(getDataPayload),
        resData = res?.data;

      fetchCampNickNameList();

      if (res && res?.status_code == 404) {
        setCampExist(true);
      }

      if (resData?.camp?.parent_camp_num) {
        fetchParentsCampList(
          res?.data?.camp?.topic_num,
          res?.data?.camp?.parent_camp_num,
          res?.data?.camp?.camp_num
        );
      }

      if (
        res?.status_code == 200 &&
        resData?.eligible_camp_leaders?.length > 0
      ) {
        setCampLeaderData([
          {
            nick_name_id: null,
            nick_name: "No Camp Leader",
          },
          ...res?.data?.eligible_camp_leaders,
        ]);
      }

      if (res && res.status_code === 200) {
        setEditStatementData(res);
        setPayloadBreadCrumb({
          camp_num: res?.data?.camp?.camp_num ?? "1",
          topic_num: res?.data?.camp?.topic_num,
        });
      }

      // if (!add) {
      // } else {
      //   await getCurrentTopicRecordApi({
      //     topic_num: router?.query?.statement?.at(0).split("-")[0],
      //     camp_num: router?.query?.statement?.at(1).split("-")[0] ?? "1",
      //   });
      //   setPayloadBreadCrumb({
      //     camp_num: router?.query?.statement?.at(1).split("-")[0] ?? "1",
      //     topic_num: router?.query?.statement?.at(0).split("-")[0],
      //   });
      // }

      const result = await getAllUsedNickNames({
        topic_num: resData?.topic?.topic_num,
      });

      if (result?.status_code == 200) {
        setCurrentCampLeader(result?.data[0]);

        const fieldSValuesForForm = {
          camp_name: resData?.camp?.camp_name,
          nick_name: resData?.nick_name?.at(0)?.id,
          parent_camp_num: resData?.camp?.parent_camp_num,
          camp_about_url: resData?.camp?.camp_about_url,
          camp_about_nick_id:
            resData?.camp?.camp_about_nick_id > 0
              ? resData?.camp?.camp_about_nick_id
              : null,
          camp_about_nick_name:
            resData?.camp?.camp_about_nick_id > 0
              ? resData?.camp?.camp_about_nick_id
              : null,
          keywords: resData?.camp?.key_words,
          edit_summary: resData?.camp?.note || null,
          note: resData?.camp?.note || null,
          camp_leader_nick_id: resData?.camp?.camp_leader_nick_id,
        };

        form.setFieldsValue(fieldSValuesForForm);

        setInitialValues(form?.getFieldsValue());

        Object.keys(fieldSValuesForForm)?.forEach((field_name) =>
          form.setFieldValue(field_name, fieldSValuesForForm[field_name])
        );

        // await form.setFieldValue("camp_name", topicData?.topic_name);
        // await form.setFieldValue("nick_name", resData[0]?.id);
        // await form.setFieldValue("namespace", topicData?.namespace_id);
        // await form.setFieldValue("edit_summary", topicData?.edit_summary);

        // form.validateFields();

        const og: any = { ...fieldSValuesForForm };

        setOriginalData(og);

        setNickNameList(result?.data);

        const oldOptions = [...options];

        await oldOptions.map((op) => {
          if (op.id === "is_disabled") {
            op.checked = resData?.camp?.is_disabled === 1 ? true : false;
          }
          if (op.id === "is_one_level") {
            op.checked = resData?.camp?.is_one_level === 1 ? true : false;
          }
          if (op.id === "is_archive") {
            op.checked = resData?.camp?.is_archive === 1 ? true : false;
            op.tooltip = op.checked
              ? "Unarchive the camp."
              : "Archive the camp.";
            if (
              resData?.camp?.direct_archive === 0 &&
              resData?.camp?.is_archive === 0
            )
              op.disable = false;
            else if (
              resData?.camp?.direct_archive === 0 &&
              resData?.camp?.is_archive === 1
            ) {
              op.disable = true;
            } else if (
              resData?.camp?.direct_archive === 1 &&
              resData?.camp?.is_archive === 1
            ) {
              op.disable = false;
            }
          }
        });

        setOptions(oldOptions);
        setInitialOptions([
          {
            checked: oldOptions[0]?.checked,
            disable: oldOptions[0]?.disable,
          },
          {
            checked: oldOptions[1]?.checked,
            disable: oldOptions[1]?.disable,
          },
          {
            checked: oldOptions[2]?.checked,
            disable: oldOptions[2]?.disable,
          },
        ]);
      }

      setIsLoading(false);
    }

    if (isUserAuthenticated) {
      nickNameListApiCall();
    } else {
      router?.push({
        pathname: "/login",
        query: { returnUrl: router?.asPath },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCampNickNameList = async () => {
    setIsLoading(true);
    let response = await getAllCampNickNames();
    if (response && response.status_code === 200) {
      setCampNickName(response.data);
    }
    setIsLoading(false);
  };

  const fetchParentsCampList = async (topic_num, parent_camp_num, camp_num) => {
    setIsLoading(true);
    const body = { topic_num, parent_camp_num, camp_num };

    const res = await getAllParentsCamp(body);

    if (res && res.status_code === 200) {
      const resData = res?.data || [];
      setParentCamps(resData);
    }
    setIsLoading(false);
  };

  const isSimilarAvaiable = () => {
    const namesList = existingCamps?.map((cmp) =>
      cmp?.type_value?.toLowerCase()
    );

    const similarNames = findSimilarNames(
      values?.camp_name?.toLowerCase(),
      namesList
    );

    return !!similarNames?.length;
  };

  const submitCampData = async (values) => {
    // const blocks = editorState;
    const editInfo = editStatementData?.data;
    const parent_camp = editInfo?.parent_camp;
    const reqBody = {
      topic_num:
        // add
        //   ? router?.query?.statement[0]?.split("-")[0]
        //   : manageFormOf == "topic"
        //   ? editInfo?.topic?.topic_num
        //   :
        parent_camp[parent_camp?.length - 1]?.topic_num,
      // topic_id: manageFormOf == "topic" ? editInfo?.topic?.id : null,
      // topic_name: manageFormOf == "topic" ? values?.topic_name : null,
      // namespace_id:
      //   manageFormOf == "topic"
      //     ? values?.name_space
      //       ? values?.name_space
      //       : editInfo?.topic?.namespace_id
      //     : null,
      camp_num:
        //  add
        //   ? router?.query?.statement[1]?.split("-")[0]
        //   : manageFormOf == "topic"
        //   ? null
        //   :
        parent_camp[parent_camp?.length - 1]?.camp_num,
      nick_name: values?.nick_name,
      note: values?.edit_summary?.trim(),
      submitter: editInfo?.camp?.submitter_nick_id,
      // add
      //   ? nickNameData[0]?.id
      //   : manageFormOf == "camp"
      //   ? editInfo?.camp?.submitter_nick_id
      //   : manageFormOf == "topic"
      //   ? editInfo?.topic?.submitter_nick_id
      //   : editInfo?.statement?.submitter_nick_id,
      // // statement: blocks, //JSON.stringify(convertToRaw(contentState)),//values?.statement?.blocks[0].text.trim(),
      event_type: "edit",
      // ? "create"
      // : update
      // ? "edit"
      // : objection
      // ? "objection"
      // : "update",
      // statement_id:
      //   (objection || update) && manageFormOf == "statement"
      //     ? router?.query?.statement[0]?.split("-")[0]
      //     : null,
      // objection_reason: objection ? values?.objection_reason : null,
      // statement_update: update && manageFormOf == "statement" ? 1 : null,
      camp_id: editInfo?.camp?.id,
      camp_name: values.camp_name,
      key_words: values.keywords,
      camp_about_url: values?.camp_about_url,
      camp_about_nick_id:
        // manageFormOf == "camp"
        //   ? objection
        //     ? editInfo?.camp?.camp_about_nick_id
        values?.camp_about_nick_name,
      //   : null,
      parent_camp_num:
        editInfo?.parent_camp.length > 1 ? values?.parent_camp_num : null,
      old_parent_camp_num: editInfo?.camp?.parent_camp_num,
      camp_leader_nick_id: values?.camp_leader_nick_id ?? null,
    };

    options.map((op) => (reqBody[op.id] = op.checked ? 1 : 0));

    const res = await updateCampApi(reqBody);

    console.log("submit err----", res);

    // if (res.status_code == 200) {
    // setStatementResponseDisable(true);
    // }
    // if (manageFormOf == "camp") {
    // } else if (manageFormOf == "statement") {
    //   res = await updateStatementApi(reqBody);
    //   if (res.status_code == 200) {
    //     // setStatementResponseDisable(true);
    //   }
    // } else if (manageFormOf == "topic") {
    //   res = await updateTopicApi(reqBody);
    //   if (res.status_code == 200) {
    //     // setStatementResponseDisable(true);
    //   }

    //   // if (res?.status_code == 400) {
    //   //   let url = null;

    //   //   if ("existed_topic_reference" in res.error) {
    //   //     let topicId = res?.error?.existed_topic_reference?.topic_num;
    //   //     let topicName = replaceSpecialCharacters(
    //   //       res?.error?.existed_topic_reference?.topic_name,
    //   //       "_"
    //   //     );
    //   //     url = `/topic/${topicId}-${topicName}/1-Agreement`;

    //   //     setExistedTopic({
    //   //       ...existedTopic,
    //   //       data: res?.error?.topic_name,
    //   //       url: url,
    //   //       status: true,
    //   //       topicName: topicName,
    //   //     });
    //   //   }
    //   // }
    // }

    return res;
  };

  const onFinalSubmit = async () => {
    setIsLoading(true);
    const editInfo = editStatementData?.data;
    const parent_camp = editInfo?.parent_camp;
    options.map((op) => (values[op.id] = op.checked ? 1 : 0));

    if (!values.camp_name?.trim()) {
      form.setFields([
        {
          name: "camp_name",
          value: "",
        },
      ]);
      form.validateFields(["camp_name"]);
      setIsLoading(false);
      return true;
    }

    let payload = {
      ...values,
      camp_leader: campLeaderData?.at(1)?.nick_name,
    };

    const res = await submitCampData(payload);

    if (res && res.status_code === 200) {
      message.success(res.message);

      dispatch(
        setCurrentTopic({ message: res.message, camp_num: res.data.camp_num })
      );

      const route = `${editInfo?.topic?.topic_num}-${replaceSpecialCharacters(
        editInfo?.topic?.topic_name,
        "-"
      )}/${
        parent_camp[parent_camp?.length - 1]?.camp_num
      }-${replaceSpecialCharacters(
        parent_camp[parent_camp?.length - 1]?.camp_name,
        "-"
      )}`;

      router?.push(`/camp/history/${route}`);

      const oldOptions = [...options];
      await oldOptions.map((op) => {
        op.checked = false;
        op.disable = false;
      });
      setOptions(oldOptions);
      dispatch(setShowDrawer(true));
      localStorage.removeItem("topicPath");
      return;
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
            if (
              key === "camp_name" &&
              res.error[key][0] === "The camp name has already been taken."
            ) {
              form.validateFields(["camp_name"]);
              setIsDisabled(false);
              setIsError(true);
              setIsSimPopOpen(false);
              getExistingList();
            }
          });
        }
      }
    }

    setIsSimPopOpen(false);

    setIsLoading(false);
  };

  const onFinish = async () => {
    setIsLoading(true);
    const isSimAvalable = isSimilarAvaiable();

    if (isSimAvalable) {
      setIsSimPopOpen(true);
    } else {
      await onFinalSubmit();
    }

    setIsLoading(false);
  };

  const onCancel = () => {
    const editInfo = editStatementData?.data;
    const parent_camp = editInfo?.parent_camp;

    const route = `${editInfo?.topic?.topic_num}-${replaceSpecialCharacters(
      editInfo?.topic?.topic_name,
      "-"
    )}/${
      parent_camp[parent_camp?.length - 1]?.camp_num
    }-${replaceSpecialCharacters(
      parent_camp[parent_camp?.length - 1]?.camp_name,
      "-"
    )}`;

    router?.push(`/camp/history/${route}`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCheckboxChange = async (e: CheckboxChangeEvent) => {
    const oldOptions = [...options];

    await oldOptions.map((op) => {
      if (op.id === e.target.value) {
        op.checked = e.target.checked;
      } else {
        op.checked = false;
      }
      op.tooltip =
        op.id === "is_archive"
          ? op.checked
            ? "Unarchive the camp."
            : "Archive the camp."
          : op.tooltip;
    });
    setOptions(oldOptions);

    if (
      oldOptions[0]?.checked == initialOptions[0]?.checked &&
      oldOptions[0]?.disable == initialOptions[0]?.disable &&
      oldOptions[1]?.checked == initialOptions[1]?.checked &&
      oldOptions[1]?.disable == initialOptions[1]?.disable &&
      oldOptions[2]?.checked == initialOptions[2]?.checked &&
      oldOptions[2]?.disable == initialOptions[2]?.disable
    ) {
      setSubmitIsDisableCheck(true);
    } else {
      setSubmitIsDisableCheck(false);
    }
  };

  const onCampChange = useCallback(
    debounce((e) => {
      const enteredValues = e?.target?.value;
      if (enteredValues && enteredValues?.length > 2) {
        setIsopicLoading(true);
        setHaveCampExist(true);
        getExistingList(enteredValues);
      } else {
        setHaveCampExist(false);
      }
    }, 900),
    []
  );

  const onCampNameBlur = () => {
    setIsError(false);
  };

  const onContributeCLick = (item, e) => {
    e?.preventDefault();
    const bd = JSON.parse(item?.breadcrumb_data);
    router?.push({ pathname: "/" + bd[0][1]?.camp_link });
  };

  const onClosePopup = () => setIsSimPopOpen(false);

  const onFtContriClick = (e) => {
    e?.preventDefault();
    setIsLoading(true);
    onClosePopup();
    router?.push({ pathname: "/search/camp", query: { q: values?.camp_name } });
  };

  return (
    <CustomSpinner key="create-topic-spinner" spinning={isLoading}>
      {!!payload?.camp_num && <CampInfoBar payload={payload} />}

      <Row gutter={20} className="mb-5">
        {campExist ? (
          <Fragment>
            <Col lg={12}>
              <FormUI
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
                isLoading={isLoading}
                isEdit={true}
                isDisabled={isDisabled && isSubmitReq}
                onCampChange={onCampChange}
                onCampNameBlur={onCampNameBlur}
                values={values}
                campLeaderData={campLeaderData}
              />
            </Col>
            <Col lg={12}>
              {haveCampExist ? (
                <ExistingCampList
                  campName={values?.camp_name}
                  data={existingCamps}
                  isShowMore={isShowMore}
                  isError={isError}
                  onContributeCLick={onContributeCLick}
                  isLoading={isTopicLoading}
                />
              ) : (
                <CampInfoCard />
              )}
            </Col>
          </Fragment>
        ) : (
          <Col lg={24}>
            <DataNotFound
              name={"Camp"}
              message={"Camp not found"}
              backURL={"/"}
              goBack={true}
            />
          </Col>
        )}
      </Row>
      <SimilarCampPopup
        campName={values?.camp_name}
        data={existingCamps}
        isOpen={isSimPopOpen}
        onContributeCLick={onContributeCLick}
        handleCancel={onClosePopup}
        loading={false}
        onFtContriClick={onFtContriClick}
        onCreateCamp={onFinalSubmit}
      />
    </CustomSpinner>
  );
};

export default CreateNewCamp;
