import { useState, useEffect } from "react";
import { Col, Form, Row, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { HomeOutlined } from "@ant-design/icons";

import { createTopic } from "src/network/api/topicAPI";
import {
  getNickNameList,
  globalSearchCanonizer,
} from "src/network/api/userApi";
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

const CreateNewTopic = () => {
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

  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { isUserAuthenticated } = isAuth();

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response.status_code === 200) {
      const resData = response.data;
      setNickNameList(resData);
      form.setFieldValue("nick_name", resData[0]?.id);
    }
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchNickNameList();
    }
    // eslint-disable-next-line
  }, [isUserAuthenticated]);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    const body = {
      topic_name: values.topic_name?.trim(),
      namespace: values.namespace,
      nick_name: values.nick_name,
      tags: selectedCats?.map((cat) => cat?.id),
    };

    const res = await createTopic(body);

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
        pathname: `/topic/${res.data.topic_num}-${replaceSpecialCharacters(
          res.data.topic_name,
          "-"
        )}/1-Agreement`,
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
    if (values?.topic_name) {
      getExistingList();
    }
  };

  return (
    <CustomSpinner key="create-topic-spinner" spinning={isLoading}>
      <Breadcrumbs
        items={[
          { icon: <HomeOutlined className="text-canBlack" />, href: "/" },
          { label: "Creating a New Topic" },
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
            isDisabled={isDisabled}
            categories={catTaga}
            selectedCats={selectedCats}
            onCatRemove={onCatRemove}
            onTagSelect={onTagSelect}
            onTopicNameBlur={onTopicNameBlur}
            onTopicChange={onTopicChange}
            values={values}
            isLoading={isLoading}
            editCampStatementData={null}
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

export default CreateNewTopic;
