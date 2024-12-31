import { Fragment, useEffect, useState } from "react";
import { Form, Row, Col, Typography, Checkbox, Collapse } from "antd";
import {
  CloseOutlined,
  FileTextOutlined,
  FlagOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import {
  changeSlashToArrow,
  defaultNicknameData,
} from "src/utils/generalUtility";
import Inputs from "components/shared/FormInputs";
import SelectInputs from "components/shared/FormInputs/select";
import AlignIcon from "./alignIcon";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import CommonCards from "components/shared/Card";
import Tags from "components/shared/Tag";
import CustomSkelton from "components/common/customSkelton";
import { getCanonizedNameSpacesApi } from "src/network/api/homePageApi";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import { useDispatch } from "react-redux";

const { labels, placeholders, nickNmRule, topicNameRule, namespaceRule } =
  messages;
const { Panel } = Collapse;
const { Text } = Typography;

const CreateTopicFromUI = ({
  onFinish,
  form,
  nameSpaces,
  nickNameList,
  onCancel,
  isDisabled,
  categories,
  selectedCats,
  onCatRemove,
  onTagSelect,
  onTopicChange,
  onTopicNameBlur,
  values,
  isLoading,
  editCampStatementData,
  isEdit = false,
  isRankHidden,
  hideRankHandler,
}) => {
  useEffect(() => {
    if (nickNameList?.length) {
      const defaultNickName = defaultNicknameData(nickNameList);
      if (defaultNickName) {
        form.setFieldValue("nick_name", defaultNickName.id);
      }
    }
  }, [nickNameList]);

  const getNickNameInput = () => {
    // Determine the default nickname
    const defaultNickName =
      defaultNicknameData(nickNameList)?.nick_name ||
      values?.nick_name ||
      defaultNicknameData(nickNameList)?.id ||
      nickNameList[0]?.id;

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
      lastValue: form.getFieldValue("nick_name"),
      value: form.getFieldValue("nick_name") || defaultNickName,
    };

    if (nickNameList?.length) {
      selectInputProps.defaultValue = defaultNickName;
      selectInputProps.initialValue = defaultNickName;
      selectInputProps.key = "nickNamesWithKeyName";
    }

    return <SelectInputs {...selectInputProps} />;
  };

  const getAllNameSpaces = async () => {
    await getCanonizedNameSpacesApi();
  };

  useEffect(() => {
    getAllNameSpaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNameSpacesValue = () => {
    if (isEdit) {
      return values?.namespace;
    }

    return values?.namespace || nameSpaces[0]?.id;
  };
  const dispatch = useDispatch();
  return (
    <CommonCards className="border-0 bg-white" id="common-cards">
      <header className="mb-14" id="header">
        <Typography.Paragraph
          className="text-xl text-canBlack font-medium"
          id="header-paragraph"
        >
          {isEdit ? "Update Topic" : "Start a New Topic"}
        </Typography.Paragraph>
      </header>
      <Form
        form={form}
        onFinish={onFinish}
        name="create_new_topic"
        className={`[&_label]:text-sm [&_label]:font-medium [&_label]:text-canBlack [&_label_span]:ml-[4px] [&_label_span]:font-normal [&_label_span]:text-[#6e7880] [&_label_span]:text-[92%] [&_label]:before:absolute [&_label]:before:right-[-15px]`}
        layout={"vertical"}
        autoComplete="off"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        initialValues={{
          topic_name: "",
          nick_name: defaultNicknameData(nickNameList)?.nick_name
            ? defaultNicknameData(nickNameList)?.nick_name
            : values?.nick_name || defaultNicknameData(nickNameList)?.id
            ? defaultNicknameData(nickNameList)?.id
            : nickNameList[0]?.id,
          namespace: getNameSpacesValue(),
          tags: null,
        }}
        id="create-new-topic-form"
      >
        <Row gutter={15} id="form-row">
          <Col xs={24} sm={24} id="topic-name-col">
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id="topic-name-skeleton"
              />
            ) : (
              <Inputs
                name="topic_name"
                label={
                  <Fragment>
                    {labels.cr_topic_name}
                    <span className="required">*</span>
                    <span>(Limit 80 Chars)</span>
                  </Fragment>
                }
                rules={topicNameRule}
                placeholder={placeholders.topicName}
                size={"large"}
                maxLength={80}
                prefix={
                  <div className="pr-3">
                    <AlignIcon fill="#242B37" />
                  </div>
                }
                onKeyUp={onTopicChange}
                onBlur={onTopicNameBlur}
                dataid="topic-name"
                key="topic-name-key"
                id="topic-name-input"
              />
            )}
          </Col>
          <Col xs={24} sm={24} className="py-3 mb-4" id="nickname-label-col">
            <Typography.Paragraph
              className="text-canRed text-xs"
              id="nickname-label"
            >
              {labels.cr_nick_name_sp}
            </Typography.Paragraph>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12} id="nickname-input-col">
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id="nickname-skeleton"
              />
            ) : (
              getNickNameInput()
            )}
          </Col>
          {/* <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
            key={"namespaces_div"}
            id="namespace-input-col"
          >
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id="namespace-skeleton"
              />
            ) : (
              <SelectInputs
                label={
                  <Fragment>
                    {labels.cr_namespace}
                    <span className="required">*</span>
                  </Fragment>
                }
                extra={
                  <span className="text-[10px]">
                    (General is recommended, unless you know otherwise)
                  </span>
                }
                name="namespace"
                options={nameSpaces}
                placeholder={placeholders.namespace}
                allowClear
                size={"large"}
                dataid="canon-namespace"
                showSearch
                optionFilterProp="children"
                inputClassName="border-0"
                rules={namespaceRule}
                prefix={<FlagOutlined className="px-3 text-canBlack" />}
                defaultValue={getNameSpacesValue()}
                initialValue={getNameSpacesValue()}
                value={form.getFieldValue("namespace")}
                isLabelRequiredFormat={true}
                formatFunc={changeSlashToArrow}
                onSelect={(val) => form.setFieldValue("namespace", val)}
                key="canon-select"
                lastValue={form.getFieldValue("namespace")}
                id="namespace-select"
              />
            )}
          </Col> */}
          {/* <Col xs={24} sm={24} md={24} lg={24} xl={12} id="category-input-col">
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id="category-skeleton"
              />
            ) : (
              <SelectInputs
                label={labels.cateLabel}
                name="tags"
                options={categories}
                placeholder={placeholders.catSelect}
                allowClear
                size={"large"}
                dataid="topic-category"
                showSearch
                optionFilterProp="children"
                inputClassName="border-0"
                rules={null}
                nameKey="title"
                prefix={
                  <AlignIcon
                    className="flex items-center justify-center px-2"
                    fill="#242B37"
                  />
                }
                onSelect={onTagSelect}
                id="category-select"
              />
            )}
          </Col> */}
          <Collapse
            className="camp-accordion"
            ghost
            expandIconPosition="right"
            defaultActiveKey={["1"]}
            style={{ width: "100%" }}
          >
            <Panel
              header={
                <>
                  Advanced Settings<br></br>{" "}
                  <Text
                    className="block mt-1 text-xs text-[#777F93]"
                    id="keywords-text"
                  >
                    {labels.cr_keywords_sp}
                  </Text>
                </>
              }
              key="1"
            >
              <Row gutter={16} id="form-row-2">
                <Col xs={24} sm={24} xl={12} id="category-input-col">
                  {isLoading ? (
                    <CustomSkelton
                      skeltonFor="list"
                      bodyCount={1}
                      stylingClass="listSkeleton"
                      isButton={false}
                      id="category-skeleton"
                    />
                  ) : (
                    <SelectInputs
                      label={labels.cateLabel}
                      name="tags"
                      options={categories}
                      placeholder={placeholders.catSelect}
                      allowClear
                      size={"large"}
                      dataid="topic-category"
                      showSearch
                      optionFilterProp="children"
                      inputClassName="border-0"
                      rules={null}
                      nameKey="title"
                      prefix={
                        <AlignIcon
                          className="flex items-center justify-center px-2"
                          fill="#242B37"
                        />
                      }
                      onSelect={onTagSelect}
                      id="category-select"
                    />
                  )}
                  {selectedCats && selectedCats?.length > 0 && (
                    <>
                      {isLoading ? (
                        <CustomSkelton
                          skeltonFor="list"
                          bodyCount={1}
                          stylingClass="listSkeleton"
                          isButton={false}
                          id="selected-categories-skeleton"
                        />
                      ) : (
                        selectedCats?.map((cat) => (
                          <Tags
                            className="rounded-lg py-2 px-6 border-canGrey2 text-canBlue bg-canGray mt-0 mb-2 font-medium"
                            key={cat?.id}
                            id={`selected-category-tag-${cat?.id}`}
                          >
                            <span>{cat?.title}</span>
                            <CloseOutlined
                              className="mr-2 text-canLight"
                              onClick={(e) => onCatRemove(e, cat)}
                              id={`remove-category-icon-${cat?.id}`}
                            />
                          </Tags>
                        ))
                      )}
                    </>
                  )}
                </Col>

                <Col xs={24} sm={24} xl={12} id="nickname-input-col">
                  {isLoading ? (
                    <CustomSkelton
                      skeltonFor="list"
                      bodyCount={1}
                      stylingClass="listSkeleton"
                      isButton={false}
                      id="namespace-skeleton"
                    />
                  ) : (
                    <SelectInputs
                      label={
                        <Fragment>
                          {labels.cr_namespace}
                          <span className="required">*</span>
                        </Fragment>
                      }
                      extra={
                        <span className="text-[10px]">
                          (General is recommended, unless you know otherwise)
                        </span>
                      }
                      name="namespace"
                      options={nameSpaces}
                      placeholder={placeholders.namespace}
                      allowClear
                      size={"large"}
                      dataid="canon-namespace"
                      showSearch
                      optionFilterProp="children"
                      inputClassName="border-0"
                      rules={namespaceRule}
                      prefix={<FlagOutlined className="px-3 text-canBlack" />}
                      defaultValue={getNameSpacesValue()}
                      initialValue={getNameSpacesValue()}
                      value={form.getFieldValue("namespace")}
                      isLabelRequiredFormat={true}
                      formatFunc={changeSlashToArrow}
                      onSelect={(val) => form.setFieldValue("namespace", val)}
                      key="canon-select"
                      lastValue={form.getFieldValue("namespace")}
                      id="namespace-select"
                    />
                  )}
                </Col>
              </Row>
            </Panel>
          </Collapse>

          {isEdit && (
            <Col xs={24} xl={24} id="edit-summary-col">
              <Inputs
                name="edit_summary"
                label="Add Summary Of Changes"
                rules={messages.summaryRule}
                placeholder={messages.placeholders.editSummary}
                maxLength={100}
                prefix={<FileTextOutlined />}
                defaultValue={String(editCampStatementData)}
                id="edit-summary-input"
              />
            </Col>
          )}

          <Form.Item name="rank_hidden" valuePropName="checked">
            <Checkbox
              id="rank_hidden"
              className="hide-rank-checkbox mt-5"
              checked={isRankHidden}
              onChange={hideRankHandler}
            >
              <div className="text-canBlack font-medium">Hide the rank</div>
            </Checkbox>
          </Form.Item>
        </Row>

        {isLoading ? (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={1}
            stylingClass="listSkeleton"
            isButton={false}
            id="form-buttons-skeleton"
          />
        ) : (
          <div
            className="flex justify-start items-center"
            id="form-buttons-div"
          >
            <SecondaryButton
              onClick={onCancel}
              id="cancel-btn"
              data-testid="cancel-btn"
              className="mr-4 flex justify-center items-center py-5 px-6 w-[200px] border-canBlue"
            >
              Discard <CloseOutlined />
            </SecondaryButton>
            <PrimaryButton
              htmlType="submit"
              id="create-topic-btn"
              data-testid="create-topic-btn"
              disabled={!isDisabled}
              className="flex justify-center items-center py-5 px-6 w-[200px]"
              onClick={() => {
                dispatch(
                  setFilterCanonizedTopics({
                    algorithm: "blind_popularity",
                  })
                );
              }}
            >
              {isEdit ? "Update Topic" : "Save Topic"} <SaveOutlined />
            </PrimaryButton>
          </div>
        )}
      </Form>
    </CommonCards>
  );
};

export default CreateTopicFromUI;