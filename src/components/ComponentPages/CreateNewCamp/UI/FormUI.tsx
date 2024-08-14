import { Fragment, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Typography,
  Tooltip,
} from "antd";

import messages from "../../../../messages";
import PreventSubCamps from "../../../common/preventSubCampCheckbox";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useRouter } from "next/router";
import CommonCards from "components/shared/Card";
import CustomSkelton from "components/common/customSkelton";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import {
  CloseOutlined,
  LinkOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";
import AlignIcon from "components/ComponentPages/CreateNewTopic/UI/alignIcon";
import SelectInputs from "components/shared/FormInputs/select";
import StructureIcon from "components/ComponentPages/CreateNewTopic/UI/structureIcon";

const { Option } = Select;
const { Text } = Typography;

const {
  labels,
  placeholders,
  nickNmRule,
  summaryRule,
  campNameRule,
  campAboutUrlRule,
  parentCampRule,
  keywordsRule,
} = messages;

const CreateCampFormUI = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  topicData,
  nickNameList,
  parentCamp,
  campNickName,
  options,
  onCheckboxChange,
  onParentCampChange,
  isLoading,
  isEdit,
  isDisabled,
  onCampChange,
  onCampNameBlur,
  values,
}) => {
  const router = useRouter();
  const { campRecord, topicRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
    topicRecord: state?.topicDetails?.currentTopicRecord,
  }));

  // const toolTipContent = "This camp is under review";
  const archiveToolTipContent = "This camp is archived";
  useEffect(() => {
    campRecord?.is_archive && router.pathname == "/camp/create/[...camp]"
      ? router?.back()
      : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNickNameInput = () => {
    const selectInputProps: any = {
      label: (
        <Fragment>
          {labels.cr_nick_name}
          <span className="required">*</span>
        </Fragment>
      ),
      key: "nickNamesKeyName",
      name: "nick_name",
      options: nickNameList,
      nameKey: "nick_name",
      placeholder: placeholders.nickName,
      allowClear: true,
      size: "large",
      dataid: "nick-name",
      showSearch: true,
      optionFilterProp: "children",
      inputClassName:
        "border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto",
      rules: nickNmRule,
      prefix: <UserOutlined className="px-3 text-canBlack" />,
      onSelect: (val) => form.setFieldValue("nick_name", val),
    };

    if (nickNameList?.length) {
      selectInputProps.defaultValue = values?.nick_name || nickNameList[0]?.id;
      selectInputProps.initialValue = values?.nick_name || nickNameList[0]?.id;
      selectInputProps.key = "nickNamesWithKeyName";
    }
    return <SelectInputs {...selectInputProps} />;
  };

  // const getCampAboutNickNameInput = () => {
  //   const selectInputProps: any = {
  //     label: (
  //       <Fragment>
  //         {labels.cr_nick_name_about}
  //         <span className="required">*</span>
  //       </Fragment>
  //     ),
  //     key: "campAboutNickNamesKeyName",
  //     name: "camp_about_nick_id",
  //     options: campNickName,
  //     nameKey: "nick_name",
  //     placeholder: placeholders.campAboutNickName,
  //     allowClear: true,
  //     size: "large",
  //     dataid: "camp-about-nick-id",
  //     id: "camp-about-nick-dropdown",
  //     showSearch: true,
  //     optionFilterProp: "children",
  //     inputClassName:
  //       "border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto",
  //     rules: nickNmRule,
  //     prefix: <UserOutlined className="px-3 text-canBlack" />,
  //     onSelect: (val) => form.setFieldValue("camp_about_nick_id", val),
  //   };

  //   if (campNickName?.length) {
  //     selectInputProps.defaultValue =
  //       values?.camp_about_nick_id || campNickName[0]?.id;
  //     selectInputProps.initialValue =
  //       values?.camp_about_nick_id || campNickName[0]?.id;
  //     selectInputProps.key = "campAboutNickNamesWithKeyName";
  //   }
  //   return <SelectInputs {...selectInputProps} />;
  // };

  // const getParentCampInput = () => {
  //   const selectInputProps: any = {
  //     label: (
  //       <Fragment>
  //         {labels.cr_parent_camp}
  //         <span className="required">*</span>
  //       </Fragment>
  //     ),
  //     key: "campAboutNickNamesKeyName",
  //     name: "parent_camp_num",
  //     options: parentCamp,
  //     nameKey: "camp_name",
  //     valueKey: "camp_num",
  //     placeholder: "Parent camp",
  //     allowClear: true,
  //     size: "large",
  //     dataid: "parent-camp",
  //     id: "parent-camp-dropdown",
  //     showSearch: true,
  //     optionFilterProp: "children",
  //     inputClassName:
  //       "border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto",
  //     rules: parentCampRule,
  //     initialValue: topicData?.camp_num,
  //     // disabled: camp.is_archive,
  //     // filterOption: (input, option) =>
  //     //   ((option?.children as any)?.props?.children ?? "")
  //     //     .toLowerCase()
  //     //     .includes(input.toLowerCase()),
  //     prefix: (
  //       <StructureIcon
  //         className="flex items-center justify-center px-2"
  //         fill="#242B37"
  //       />
  //     ),
  //     onSelect: (val) => form.setFieldValue("parent_camp_num", val),
  //   };

  //   if (parentCamp?.length) {
  //     selectInputProps.defaultValue =
  //       values?.parent_camp_num || parentCamp[0]?.camp_num;
  //     selectInputProps.initialValue =
  //       values?.parent_camp_num || parentCamp[0]?.camp_num;
  //     selectInputProps.key = "campAboutNickNamesWithKeyName";
  //   }
  //   return <SelectInputs {...selectInputProps} />;
  // };

  return (
    <Fragment>
      <CommonCards className="border-0 bg-white">
        <header className="mb-14">
          <Typography.Paragraph className="text-xl text-canBlack font-medium">
            {isEdit ? "Update Camp" : "Creating a New Camp"}
          </Typography.Paragraph>
          <Typography.Paragraph className="text-canBlack opacity-80 mt-3">
            Input information required to create a camp.
          </Typography.Paragraph>
        </header>
        <Form
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          name="create_new_camp"
          className={`[&_label]:text-sm [&_label]:font-semibold [&_label]:text-canBlack [&_label_span]:ml-[4px] [&_label_span]:font-normal [&_label_span]:text-[#6e7880] [&_label_span]:text-[92%] [&_label]:before:absolute [&_label]:before:right-[-15px]`}
          layout={"vertical"}
          scrollToFirstError
          validateTrigger={messages.formValidationTypes()}
          initialValues={{
            ...initialValue,
          }}
        >
          <Row gutter={16}>
            <Col md={24}>
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                <Inputs
                  label={
                    <Fragment>
                      {labels.cr_camp_name}
                      <span className="required">*</span>
                      <span>(Limit 30 Chars)</span>
                    </Fragment>
                  }
                  name="camp_name"
                  rules={campNameRule}
                  placeholder="Camp name"
                  size={"large"}
                  maxLength={30}
                  prefix={
                    <div className="pr-3">
                      <AlignIcon fill="#242B37" />
                    </div>
                  }
                  onKeyDown={onCampChange}
                  onBlur={onCampNameBlur}
                />
              )}
            </Col>
            <Col xs={24} sm={12}>
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                getNickNameInput()
              )}

              {/* {nickNameList?.length > 0 ? (
                <Form.Item
                  label={
                    <>
                      {labels.cr_nick_name}
                      <span className="required">*</span>
                    </>
                  }
                  name="nick_name"
                  {...nickNmRule}
                  initialValue={nickNameList[0]?.id}
                >
                  <Select
                    placeholder={placeholders.nickName}
                    allowClear
                    size={"large"}
                    data-id="nick-name"
                    showSearch
                    optionFilterProp="children"
                    id="nickname-dropdown"
                  >
                    {nickNameList.map((nick, idx) => (
                      <Option
                        key={nick.id}
                        value={nick.id}
                        id={`nick-name-${idx}`}
                      >
                        {nick.nick_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null} */}
            </Col>
            <Col xs={24} sm={12}>
              {/* {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                getParentCampInput()
              )} */}
              {parentCamp?.length > 0 ? (
                <Form.Item
                  label={
                    <>
                      {labels.cr_parent_camp}
                      <span className="required">*</span>
                    </>
                  }
                  name="parent_camp_num"
                  {...parentCampRule}
                  initialValue={topicData?.camp_num}
                  className={`font-14 text-canBlack font-medium`}
                >
                  <div
                    className={`outerDiv flex border rounded ${
                      false
                        ? "border-[#40a9ff] shadow-[0 0 0 2px rgba(24, 144, 255, 0.2)"
                        : ""
                    }`}
                  >
                    <StructureIcon
                      className="flex items-center justify-center px-2"
                      fill="#242B37"
                    />
                    <Select
                      showSearch
                      size={"large"}
                      placeholder="Parent camp"
                      data-id="parent-camp"
                      onChange={onParentCampChange}
                      optionFilterProp="children"
                      id="parent-camp-dropdown"
                      filterOption={(input, option) =>
                        ((option?.children as any)?.props?.children ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto`}
                    >
                      {parentCamp.map((camp) => (
                        <Option
                          value={camp.camp_num}
                          key={camp.id}
                          id={`parent-camp-${camp.id}`}
                          camp={camp}
                          disabled={camp.is_archive ? true : false}
                        >
                          <Tooltip
                            title={
                              camp.is_archive ? archiveToolTipContent : null
                            }
                          >
                            {camp.camp_name}
                          </Tooltip>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Form.Item>
              ) : null}
              {parentCamp?.length <= 0 ? (
                <Form.Item
                  label={labels.cr_parent_camp}
                  name="parent_camp_num"
                  {...parentCampRule}
                  initialValue={topicData?.camp_num}
                  className={`font-14 text-canBlack font-medium`}
                >
                  <Select
                    allowClear
                    size={"large"}
                    placeholder="Parent camp"
                    data-id="parent-camp"
                    showSearch
                    optionFilterProp="children"
                    id="parent-camp-dropdown"
                    className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none`}
                  >
                    <Option
                      value={topicData?.camp_num}
                      id={`parent-camp-${topicData?.camp_num}`}
                    >
                      {topicData?.camp_name}
                    </Option>
                  </Select>
                </Form.Item>
              ) : null}
            </Col>
            {/* <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Fragment>
                    {labels.cr_camp_name}
                    <span className="required">*</span>
                    <span>(Limit 30 Chars)</span>
                  </Fragment>
                }
                name="camp_name"
                {...campNameRule}
              >
                <Input size={"large"} placeholder="Camp name" maxLength={30} />
              </Form.Item>
            </Col> */}
            {/* <Col xs={24} sm={12}>
              <Form.Item
                label={labels.cr_keywords}
                name="key_words"
                {...keywordsRule}
              >
                <Input size={"large"} placeholder="Keywords" />
              </Form.Item>
            </Col> */}
            {/* <Col span={24}>
              <Form.Item
                className={styles.edit_summary_input}
                label={
                  <Fragment>
                    {labels.cr_edit_summary}
                    <span>{labels.brief}</span>
                  </Fragment>
                }
                name="note"
                {...summaryRule}
              >
                <Input.TextArea
                  rows={6}
                  placeholder={placeholders.editSummary}
                />
              </Form.Item>
              <Form.Item noStyle>
                <Text className={styles.advanceuser}>
                  {labels.cr_keywords_sp}
                </Text>
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={12}>
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                <Inputs
                  label={
                    <Fragment>
                      {labels.cr_camp_url}
                      <span>(Limit 30 Chars)</span>
                    </Fragment>
                  }
                  name="camp_about_url"
                  rules={campAboutUrlRule}
                  placeholder="Enter Here"
                  size={"large"}
                  maxLength={1024}
                  prefix={
                    <div className="pr-3">
                      <LinkOutlined />
                    </div>
                  }
                  // onKeyDown={onCampChange}
                  // onBlur={onCampNameBlur}
                />
              )}
              {/* <Form.Item
                label={
                  <Fragment>
                    {labels.cr_camp_url}
                    <span>(Limit 1024 Chars)</span>
                  </Fragment>
                }
                name="camp_about_url"
                {...campAboutUrlRule}
              >
                <Input
                  placeholder={placeholders.campURL}
                  size={"large"}
                  maxLength={1024}
                />
              </Form.Item> */}
            </Col>

            <Col xs={24} sm={12}>
              {/* {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                getCampAboutNickNameInput()
              )} */}

              {campNickName?.length > 0 ? (
                <Form.Item
                  label={labels.cr_nick_name_about}
                  name="camp_about_nick_id"
                  className={`font-14 text-canBlack font-medium`}
                >
                  <Select
                    placeholder={placeholders.campAboutNickName}
                    allowClear
                    size={"large"}
                    data-id="camp-about-nick-id"
                    showSearch
                    optionFilterProp="children"
                    id="camp-about-nick-dropdown"
                    className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none`}
                  >
                    <Option value="" id="camp-about-nick-custom">
                      {placeholders.campAboutNickName}
                    </Option>
                    {campNickName.map((nc) => (
                      <Option
                        value={nc.id}
                        key={nc.id}
                        id={`camp-about-nick-${nc.id}`}
                      >
                        {nc.nick_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  label={labels.cr_nick_name_about}
                  name="camp_about_nick_id"
                >
                  <Select
                    placeholder={placeholders.campAboutNickName}
                    allowClear
                    size={"large"}
                    data-id="camp-about-nick-id"
                    showSearch
                    optionFilterProp="children"
                    id="camp-about-nick-dropdown"
                  >
                    <Option value="" id="camp-about-nick-custom">
                      {placeholders.campAboutNickName}
                    </Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
            <Col
              md={24}
              className="flex flex-col [&_.ant-checkbox-wrapper]:ml-0 [&_.ant-checkbox-wrapper]:mb-4 [&_.ant-checkbox-wrapper>span]:text-canBlack [&_.ant-checkbox-wrapper>span]:text-sm [&_.ant-checkbox-wrapper>span]:font-medium"
            >
              <PreventSubCamps
                options={options}
                onCheckboxChange={onCheckboxChange}
              />
            </Col>
          </Row>

          {isLoading ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass="listSkeleton"
              isButton={false}
            />
          ) : (
            <div className="mt-4 flex justify-start items-center">
              <SecondaryButton
                onClick={onCancel}
                id="cancel-btn"
                data-testid="cancel-btn"
                className="mr-4 flex justify-center items-center py-5 px-6"
              >
                Discard <CloseOutlined />
              </SecondaryButton>
              <PrimaryButton
                htmlType="submit"
                id="crate-camp-btn"
                data-testid="btn"
                disabled={!isDisabled}
                className="flex justify-center items-center py-5 px-6"
              >
                {isEdit ? "Update Camp" : "Create Camp"} <SaveOutlined />
              </PrimaryButton>
            </div>
          )}
        </Form>
        {/* </Card> */}
      </CommonCards>
    </Fragment>
  );
};

export default CreateCampFormUI;
