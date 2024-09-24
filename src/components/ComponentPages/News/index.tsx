import React, { Fragment, useEffect, useState } from "react";
import { Form, Checkbox, Row, Col, Typography, Input, message } from "antd";
import { useRouter } from "next/router";
import {
  CloseOutlined,
  LinkOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

import {
  addNewsFeedApi,
  getEditCampNewsFeedApi,
  updateNewsFeedApi,
} from "src/network/api/campNewsApi";
import CustomSkelton from "components/common/customSkelton";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import K from "src/constants";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import CommonCards from "components/shared/Card";
import CustomSpinner from "components/shared/CustomSpinner";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import Inputs from "components/shared/FormInputs";
import SelectInputs from "components/shared/FormInputs/select";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

const { Text } = Typography;

function AddOrEdit({ edit }) {
  const router = useRouter();

  const [form] = Form.useForm();

  const { isUserAuthenticated } = useAuthentication();

  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [errors, setErrors] = useState({
    urlError: false,
    urlErrorMsg: "",
    displayTextError: false,
    displayTextErrorMsg: "",
  });
  const [nickNameData, setNickNameData] = useState([]);
  const [dataToUpdate, setDataToUpdate] = useState({
    id: null,
    submitter_nick_id: null,
  });

  const { is_admin } = useSelector((state: RootState) => ({
    is_admin: state?.auth?.loggedInUser?.is_admin,
  }));

  const goBack = () => {
    if (edit) {
      router?.push(
        `/topic/${replaceSpecialCharacters(
          router?.query?.camp[0],
          "-"
        )}/${replaceSpecialCharacters(router?.query?.camp[1], "-")}`
      );
    } else {
      router?.push(router?.asPath.replace("addnews", "topic"));
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    let res;
    edit
      ? (res = await updateNewsFeedApi({
          newsfeed_id: dataToUpdate?.id,
          display_text: values.display_text,
          link: values.link.trim(),
          available_for_child: values.available_for_child,
          submitter_nick_id: nickNameData[0]?.id,
        }))
      : (res = await addNewsFeedApi({
          topic_num: +router?.query?.camp[0]?.split("-")[0],
          camp_num: +router?.query?.camp[1]?.split("-")[0],
          available_for_child: values?.available_for_child,
          link: values?.link.trim(),
          display_text: values?.display_text,
          submitter_nick_id: values?.nick_name,
        }));
    if (res?.status_code == 200) {
      if (edit) {
        router?.push(
          `/topic/${replaceSpecialCharacters(
            router?.query?.camp[0],
            "-"
          )}/${replaceSpecialCharacters(router?.query?.camp[1], "-")}`
        );
        return;
      } else {
        router?.push(router?.asPath.replace("addnews", "topic"));
        return;
      }
    } else if (res?.status_code == 400) {
      if (Object.keys(res?.error).includes("link")) {
        setErrors((err) => {
          return {
            ...err,
            urlError: true,
            urlErrorMsg: res?.error?.link[0],
          };
        });
      } else {
        setErrors((err) => {
          return {
            ...err,
            urlError: false,
            urlErrorMsg: "",
          };
        });
      }
      if (Object.keys(res?.error).includes("display_text")) {
        setErrors((err) => {
          return {
            ...err,
            displayTextError: true,
            displayTextErrorMsg: res?.error?.display_text[0],
          };
        });
      } else {
        setErrors((err) => {
          return {
            ...err,
            displayTextError: false,
            displayTextErrorMsg: "",
          };
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setScreenLoading(true);
    async function nickNameListApiCall() {
      if (edit) {
        const reqBody = {
          newsfeed_id: +router?.query?.camp[2]?.split("-")[2],
        };
        const res = await getEditCampNewsFeedApi(reqBody);
        const news = (res && res[0]) || {};
        setDataToUpdate(news);
        form.setFieldsValue({
          display_text: news?.display_text,
          link: news?.link,
          available_for_child: news?.available_for_child,
        });
        const reqBodyNickName = {
          topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        };
        const result = await getAllUsedNickNames(reqBodyNickName);
        form.setFieldsValue({
          nick_name: result?.data[0]?.id,
        });
        setNickNameData(result?.data);
        setScreenLoading(false);
      } else {
        const reqBody = {
          topic_num: +router?.query?.camp?.at(0)?.split("-")[0],
        };
        const result = await getAllUsedNickNames(reqBody);
        form.setFieldsValue({
          nick_name: result?.data[0]?.id,
        });
        setNickNameData(result?.data);
        setScreenLoading(false);
      }
    }
    if (isUserAuthenticated && is_admin) {
      nickNameListApiCall();
    } else if (!is_admin) {
      openNotificationWithIcon("only admin can add/edit news", "error");
      router?.push("/");
    } else {
      router?.push("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CustomSpinner key="news-spinner" spinning={loading}>
      <CommonCards
        title={
          <SectionHeading title={edit ? "Edit News" : "Add News"} icon={null} />
        }
        className="w-full tab:w-8/12 mx-auto mt-6"
      >
        <Form
          form={form}
          layout={"vertical"}
          initialValues={{ available_for_child: 0 }}
          onFinish={onFinish}
        >
          <Row gutter={20}>
            <Col xl={8} md={12} xs={24}>
              {screenLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                <SelectInputs
                  label={
                    <Fragment>
                      Nickname
                      <span className="required text-canRed pl-1">*</span>
                    </Fragment>
                  }
                  name="nick_name"
                  options={nickNameData}
                  placeholder="Select Nickname"
                  allowClear
                  size={"large"}
                  dataid="topic-category"
                  showSearch
                  optionFilterProp="children"
                  inputClassName="border-0"
                  rules={{
                    rules: [
                      {
                        required: true,
                        message: "Please select Nickname",
                      },
                    ],
                  }}
                  nameKey="nick_name"
                  prefix={
                    <UserOutlined className="flex items-center justify-center px-2" />
                  }
                  defaultValue={nickNameData?.at(0)?.id}
                  initialValue={nickNameData?.at(0)?.id}
                  value={form.getFieldValue("nick_name")}
                  key="canon-select"
                  lastValue={form.getFieldValue("nick_name")}
                  onSelect={(val) => form.setFieldValue("nick_name", val)}
                />
              )}
            </Col>
            <Col xl={8} md={12} xs={24}>
              {screenLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                <Inputs
                  name="link"
                  label={
                    <Fragment>
                      Link <span className="required text-canRed pl-1">*</span>
                    </Fragment>
                  }
                  rules={{
                    rules: [
                      {
                        required: true,
                        message: "Link is required.",
                      },
                      {
                        pattern: /[^ \s]/,
                        message: "Enter a valid link",
                      },
                    ],
                  }}
                  placeholder="Enter Link"
                  onKeyDown={(e) =>
                    e.key === " " && e.keyCode === 32 && e.preventDefault()
                  }
                  maxLength={2000}
                  prefix={<LinkOutlined />}
                  wrapperClassName={`${errors.urlErrorMsg ? "!mb-1" : ""}`}
                />
              )}
              {errors.urlError && (
                <Text type="danger">{errors.urlErrorMsg}</Text>
              )}
            </Col>
            <Col xl={8} md={12} xs={24}>
              {screenLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                <Form.Item
                  className="[&_.ant-form-item-label]:hidden xl:[&_.ant-form-item-label]:block"
                  name="available_for_child"
                  valuePropName="checked"
                  label={<></>}
                >
                  <Checkbox>Available for child camps</Checkbox>
                </Form.Item>
              )}
            </Col>
            <Col xl={24} md={24} xs={24}>
              <Form.Item
                className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
                name="display_text"
                label={
                  <>
                    Display Text <span className="required">*</span>
                  </>
                }
                rules={[
                  {
                    required: true,
                    message: "Display text is required",
                  },
                  {
                    pattern: /[^ \s]/,
                    message: "Display text is required",
                  },
                ]}
              >
                {screenLoading ? (
                  <CustomSkelton
                    bodyCount
                    stylingClass
                    isButton
                    height={180}
                    skeltonFor="video"
                  />
                ) : (
                  <Input.TextArea
                    size="large"
                    placeholder={K?.exceptionalMessages?.addNewsTextPlaceHolder}
                    maxLength={256}
                    rows={7}
                    className="text-canBlack font-normal rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                  />
                )}
              </Form.Item>

              {errors.displayTextError && (
                <Text type="danger">{errors.displayTextErrorMsg}</Text>
              )}
            </Col>
          </Row>

          <Form.Item>
            {screenLoading ? (
              <div className="manage-form-btnwrap">
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              </div>
            ) : (
              <div className="flex gap-4">
                <PrimaryButton
                  className="flex items-center justify-center h-auto py-2 w-[150px]"
                  htmlType="submit"
                  disabled={loading}
                  id="create-news-btn"
                >
                  {edit ? "Submit" : " Create News"}
                  <SaveOutlined />
                </PrimaryButton>
                <SecondaryButton
                  htmlType="button"
                  className="flex items-center justify-center h-auto py-2 w-[150px]"
                  id="cancel-news-btn"
                  onClick={goBack}
                >
                  Cancel <CloseOutlined />
                </SecondaryButton>
              </div>
            )}
          </Form.Item>
        </Form>
      </CommonCards>
    </CustomSpinner>
  );
}

export default AddOrEdit;
