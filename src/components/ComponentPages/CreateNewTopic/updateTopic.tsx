import { useState, useEffect } from "react";
import { Col, Form, Row, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { HomeOutlined } from "@ant-design/icons";

import { globalSearchCanonizer } from "src/network/api/userApi";
import { RootState } from "src/store";
import isAuth from "src/hooks/isUserAuthenticated";
import {
  setFilterCanonizedTopics,
  setShowDrawer,
} from "src/store/slices/filtersSlice";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import Breadcrumbs from "components/shared/Breadcrumbs";
import CustomSpinner from "components/shared/CustomSpinner";
import FromUI from "./UI/FromUI";
import TopicInfoCard from "./UI/rightContent";
import ExistingTopicList from "./UI/existingTopicList";
import queryParams from "src/utils/queryParams";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import {
  getEditTopicApi,
  updateTopicApi,
} from "src/network/api/campManageStatementApi";

const UpdateTopic = () => {
  const { nameSpaces, catTaga } = useSelector((state: RootState) => ({
    // filterByScore: state.filters?.filterObject?.filterByScore,
    // filterObject: state?.filters?.filterObject,
    // viewThisVersion: state?.filters?.viewThisVersionCheck,
    nameSpaces: state.homePage.nameSpaces,
    catTaga: state?.tag?.tags,
  }));

  const [nickNameList, setNickNameList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedCats, setSelectedCats] = useState([]);
  const [existingTopics, setExistingTopics] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const [haveTopicExist, setHaveTopicExist] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isSubmitReq, setIsSubmitReq] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { isUserAuthenticated } = isAuth();

  const update = router?.query?.statement?.at(0)?.split("-")[1] == "update";

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const compareTags = (existedData, newData) => {
    const newIds = newData?.map((item) => item?.id);
    const areSame =
      existedData?.every((id) => newIds?.includes(id)) &&
      newIds?.every((id) => existedData?.includes(id));

    return areSame;
  };

  useEffect(() => {
    if (
      currentTopic?.topic_name?.trim() !== values?.topic_name?.trim() ||
      currentTopic?.submitter_nick_id !== values?.nick_name ||
      currentTopic?.namespace_id !== values?.namespace ||
      !compareTags(currentTopic?.tags, selectedCats)
    ) {
      setIsSubmitReq(true);
    } else {
      setIsSubmitReq(false);
    }
  }, [values, currentTopic, selectedCats]);

  useEffect(() => {
    if (currentTopic?.tags?.length) {
      const existedCats = catTaga?.filter((ct) =>
        currentTopic?.tags?.includes(ct?.id)
      );

      setSelectedCats(existedCats);
    }
  }, [currentTopic?.tags]);

  async function getTopicDetails() {
    setIsLoading(true);
    const topicPayload = {
      record_id: router?.query?.statement?.at(0)?.split("-")[0],
      event_type: "edit",
    };

    const res = await getEditTopicApi(topicPayload);

    if (res?.status_code == 200) {
      const topicData = res?.data?.topic;

      setCurrentTopic(topicData);

      const result = await getAllUsedNickNames({
        topic_num: topicData?.topic_num,
      });

      if (result?.status_code == 200) {
        const resData = result.data;

        await form.setFieldValue("nick_name", resData[0]?.id);
        await form.setFieldValue("topic_name", topicData?.topic_name);
        await form.setFieldValue("namespace", topicData?.namespace_id);

        setNickNameList(resData);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (isUserAuthenticated) {
      setIsLoading(true);
      getTopicDetails();
    } else {
      router?.push({
        pathname: "/login",
        query: { returnUrl: router?.asPath },
      });
    }
  }, [isUserAuthenticated]);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    const body = {
      topic_name: values.topic_name?.trim(),
      namespace: values.namespace,
      nick_name: values.nick_name,
      topic_num: currentTopic?.topic_num,
      topic_id: currentTopic?.id,
      namespace_id: values.namespace,
      submitter: currentTopic?.submitter_nick_id,
      tags: selectedCats?.map((cat) => cat?.id),
      event_type: update ? "edit" : "update",
      // camp_num: null,
      // note: null,
      // statement: "",
      // statement_id: null,
      // objection_reason: null,
      // statement_update: null,
      // camp_id: null,
      // camp_name: null,
      // key_words: null,
      // camp_about_url: null,
      // camp_about_nick_id: null,
      // parent_camp_num: null,
      // old_parent_camp_num: null,
      // camp_leader_nick_id: null,
    };

    const res = await updateTopicApi(body);

    if (res && res.status_code === 400) {
      if (res?.error) {
        const errors_key = Object.keys(res.error);

        if (errors_key.length) {
          if ("existed_topic_reference" in res.error) {
            form.setFields([
              {
                name: "topic_name",
                value: values?.topic_name,
                errors: res?.error?.topic_name,
              },
            ]);
            form.validateFields(["topic_name"]);
            setIsDisabled(false);
            setIsError(true);
            getExistingList();
          }

          errors_key.forEach((key) => {
            if (key !== "topic_name") {
              form.setFields([
                {
                  name: key,
                  value: values[key],
                  errors: [res.error[key]],
                },
              ]);
            }
          });
        }
      }
    }

    if (res && res.status_code === 200) {
      message.success(res.message);
      storeFilterClear();
      router?.push({
        pathname: `/topic/history/${
          currentTopic?.topic_num
        }-${replaceSpecialCharacters(currentTopic?.topic_name, "-")}`,
      });

      dispatch(setShowDrawer(true));
    }

    setIsLoading(false);
  };

  const storeFilterClear = () => {
    dispatch(setFilterCanonizedTopics({ filterByScore: "" }));
  };

  const onCancel = () => {
    router?.back();
  };

  const onTagSelect = (id) => {
    const currentitem = catTaga?.find((c) => c?.id == id);
    const isExist = selectedCats?.find((c) => c?.id == id);
    if (!isExist) {
      setSelectedCats((prev) => {
        const updatedCats = [...prev, currentitem];
        return updatedCats;
      });
    }
  };

  const onCatRemove = (e, item) => {
    e?.preventDefault();
    const isExist = selectedCats?.find((c) => c?.id == item?.id);

    if (isExist) {
      setSelectedCats((prev) => {
        const updatedCats = prev?.filter((p) => p?.id != item?.id);
        return updatedCats;
      });
    }
  };

  const getExistingList = async () => {
    const topicName = values?.topic_name,
      queryParamObj: any = {
        type: "topic",
        size: 5,
        page: 1,
        term: topicName,
      };

    const res = await globalSearchCanonizer(queryParams(queryParamObj)),
      resData = res?.data;

    if (res?.status_code === 200) {
      setHaveTopicExist(true);
      if (resData?.data?.topic) {
        setExistingTopics(resData?.data?.topic);
      }

      if (resData?.meta_data?.total > 5) {
        setIsShowMore(true);
      }
    }
  };

  const onTopicChange = () => {
    setHaveTopicExist(false);
  };

  const onTopicNameBlur = () => {
    setIsError(false);
    if (
      values?.topic_name &&
      currentTopic?.topic_name?.trim() !== values?.topic_name?.trim()
    ) {
      getExistingList();
    }
  };

  return (
    <CustomSpinner key="create-topic-spinner" spinning={isLoading}>
      <Breadcrumbs
        items={[
          { icon: <HomeOutlined className="text-canBlack" />, href: "/" },
          {
            href: `/topic/history/${
              currentTopic?.topic_num
            }-${replaceSpecialCharacters(currentTopic?.topic_name, "-")}`,
            label: "Topic History",
          },
          { label: "Update Topic" },
        ]}
      />

      <Row gutter={20} className="mb-5">
        <Col lg={12}>
          <FromUI
            onFinish={onFinish}
            form={form}
            nameSpaces={nameSpaces || []}
            nickNameList={nickNameList || []}
            onCancel={onCancel}
            isDisabled={isDisabled && isSubmitReq}
            categories={catTaga}
            selectedCats={selectedCats}
            onCatRemove={onCatRemove}
            onTagSelect={onTagSelect}
            onTopicNameBlur={onTopicNameBlur}
            onTopicChange={onTopicChange}
            isEdit={true}
            values={values}
            isLoading={isLoading}
          />
        </Col>
        <Col lg={12}>
          {haveTopicExist ? (
            <ExistingTopicList
              topicName={values?.topic_name}
              data={existingTopics}
              isShowMore={isShowMore}
              isError={isError}
            />
          ) : (
            <TopicInfoCard />
          )}
        </Col>
      </Row>
    </CustomSpinner>
  );
};

export default UpdateTopic;