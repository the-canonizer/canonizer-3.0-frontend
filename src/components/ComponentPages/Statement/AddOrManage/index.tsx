import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Spin,
  Input,
  Select,
  Descriptions,
} from "antd";
import { useRouter } from "next/router";
import "antd/dist/antd.css";
import styles from "../addEditNews.module.scss";
import K from "../../../../constants";
import {
  getAllUsedNickNames,
  getAllParentsCamp,
  getAllCampNickNames,
} from "../../../../network/api/campDetailApi";
import useAuthentication from "../../../../hooks/isUserAuthenticated";
import {
  getEditStatementApi,
  getEditCampApi,
  getEditTopicApi,
} from "../../../../network/api/campManageStatementApi";
import {
  updateStatementApi,
  updateTopicApi,
  updateCampApi,
} from "../../../../network/api/campManageStatementApi";

import { getCanonizedNameSpacesApi } from "../../../../network/api/homePageApi";
// "../../../network/api/homePageApi";
import SideBarNoFilter from "../../../ComponentPages/Home/SideBarNoFilter";
import CampInfoBar from "../../TopicDetails/CampInfoBar";
import { RootState } from "../../../../store";

import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";

export default function AddOrManage({ add }) {
  const isLogin = useAuthentication();
  const router = useRouter();
  const [editStatementData, setEditStatementData] = useState({ data: null });

  const [modalVisible, setModalVisible] = useState(false);
  const [nickNameData, setNickNameData] = useState([]);
  const [screenLoading, setScreenLoading] = useState(false);
  const [payloadBreadCrumb, setPayloadBreadCrumb] = useState({});
  const [parentCamp, setParentCamps] = useState([]);
  const [errors, setErrors] = useState({
    CampNameError: false,
    campNameMsg: "",
    displayTextError: false,
    displayTextErrorMsg: "",
  });

  const [campNickName, setCampNickName] = useState([]);
  const [canNameSpace, setCanNameSpace] = useState([]);

  const [form] = Form.useForm();
  let objection = router?.query?.statement[0]?.split("-")[1] == "objection";
  let update = router?.query?.statement[0]?.split("-")[1] == "update";
  let manageFormOf = router?.asPath.split("/")[2];

  const onFinish = async (values: any) => {
    setScreenLoading(true);
    let res;
    let editInfo = editStatementData?.data;
    let parent_camp = editInfo?.parent_camp;
    res = await addOrManageStatement(values);

    if (res?.status_code == 200) {
      if (add) {
        router.push(
          router.asPath.replace("create/statement", "statement/history")
        );
      } else {
        let route =
          manageFormOf == "topic"
            ? `${editInfo?.topic?.topic_num}-${editInfo?.topic?.topic_name
                ?.split(" ")
                .join("-")}`
            : `${editInfo?.topic?.topic_num}-${editInfo?.topic?.topic_name
                ?.split(" ")
                .join("-")}/${
                parent_camp[parent_camp?.length - 1]?.camp_num
              }-${parent_camp[parent_camp?.length - 1]?.camp_name
                ?.split(" ")
                .join("-")}`;
        if (manageFormOf == "camp") {
          router.push(`/camp/history/${route}`);
        } else if (manageFormOf == "statement") {
          router.push(`/statement/history/${route}`);
        } else if (manageFormOf == "topic") {
          router.push(`/topic/history/${route}`);
        }
      }
    } else if (res?.status_code == 400) {
      // console.log("error in res =>", res);
    }
    setScreenLoading(false);
  };

  const addOrManageStatement = async (values) => {
    let res_for_add;
    if (add) {
      let res = await getEditStatementApi(values?.nick_name);
      res_for_add = res?.data;
    }
    let editInfo = editStatementData?.data;
    let parent_camp = editInfo?.parent_camp;
    let reqBody = {
      topic_num: add
        ? router?.query?.statement[0]?.split("-")[0]
        : manageFormOf == "topic"
        ? editInfo?.topic?.topic_num
        : parent_camp[parent_camp?.length - 1]?.topic_num,
      topic_id: manageFormOf == "topic" ? editInfo?.topic?.id : null,
      topic_name: manageFormOf == "topic" ? values?.topic_name : null,
      namespace_id:
        manageFormOf == "topic"
          ? values?.name_space
            ? values?.name_space
            : editInfo?.topic?.namespace_id
          : null,
      camp_num: add
        ? router?.query?.statement[1]?.split("-")[0]
        : manageFormOf == "topic"
        ? null
        : parent_camp[parent_camp?.length - 1]?.camp_num,
      nick_name: values?.nick_name,
      note: values?.edit_summary?.trim(),
      submitter: add
        ? res_for_add?.statement?.submitter_nick_id
        : manageFormOf == "camp"
        ? editInfo?.camp?.submitter_nick_id
        : manageFormOf == "topic"
        ? editInfo?.topic?.submitter_nick_id
        : editInfo?.statement?.submitter_nick_id,
      statement: values?.statement?.trim(),
      event_type: add
        ? "create"
        : update
        ? "edit"
        : objection
        ? "objection"
        : "update",
      statement_id: !!((objection || update) && manageFormOf == "statement")
        ? router?.query?.statement[0]?.split("-")[0]
        : null,
      objection_reason: objection ? values?.objection_reason : null,
      statement_update: update && manageFormOf == "statement" ? 1 : null,
      camp_id: manageFormOf == "camp" ? editInfo?.camp?.id : null,
      camp_name: manageFormOf == "camp" ? values.camp_name : null,
      keywords: manageFormOf == "camp" ? values.keywords : null,
      camp_about_url: manageFormOf == "camp" ? values?.camp_about_url : null,
      camp_about_nick_id:
        manageFormOf == "camp"
          ? objection
            ? editInfo?.camp?.camp_about_nick_id
            : values?.camp_about_nick_name
          : null,
      parent_camp_num:
        manageFormOf == "camp" && editInfo?.parent_camp.length > 1
          ? values?.parent_camp_num
          : null,
      old_parent_camp_num:
        manageFormOf == "camp" ? editInfo?.camp?.parent_camp_num : null,
    };
    let res;
    if (manageFormOf == "camp") {
      res = await updateCampApi(reqBody);
    } else if (manageFormOf == "statement") {
      res = await updateStatementApi(reqBody);
    } else if (manageFormOf == "topic") {
      res = await updateTopicApi(reqBody);
    }
    return res;
  };
  const fetchCampNickNameList = async () => {
    let response = await getAllCampNickNames();
    if (response && response.status_code === 200) {
      setCampNickName(response.data);
    }
  };
  const fetchNameSpaceList = async () => {
    let response = await getCanonizedNameSpacesApi();
    if (response && response.status_code === 200) {
      setCanNameSpace(response.data);
    }
  };

  const fetchParentsCampList = async (topic_num: number, parent_camp_num) => {
    const body = { topic_num: topic_num };
    let res = await getAllParentsCamp(body);
    if (res && res.status_code === 200) {
      setParentCamps(res.data);
    }
  };

  useEffect(() => {
    setScreenLoading(true);
    async function nickNameListApiCall() {
      let res;
      if (!add) {
        if (manageFormOf == "statement") {
          res = await getEditStatementApi(
            router?.query?.statement[0]?.split("-")[0]
          );
          setPayloadBreadCrumb({
            camp_num: res?.data?.statement?.camp_num,
            topic_num: res?.data?.statement?.topic_num,
            topic_name: res?.data?.topic?.topic_name,
          });
        } else if (manageFormOf == "camp") {
          res = await getEditCampApi(
            router?.query?.statement[0]?.split("-")[0]
          );
          fetchCampNickNameList();
          fetchParentsCampList(
            res?.data?.camp?.topic_num,
            res?.data?.camp?.parent_camp_num
          );
          setPayloadBreadCrumb({
            camp_num: res?.data?.camp?.camp_num,
            topic_num: res?.data?.camp?.topic_num,
            topic_name: res?.data?.topic?.topic_name,
          });
        } else if (manageFormOf == "topic") {
          res = await getEditTopicApi(
            router?.query?.statement[0]?.split("-")[0]
          );

          fetchNameSpaceList();
          setPayloadBreadCrumb({
            topic_num: res?.data?.topic?.topic_num,
            topic_name: res?.data?.topic?.topic_name,
          });
        } else {
          res = await getEditStatementApi(
            router?.query?.statement[0]?.split("-")[0]
          );
        }
        if (res && res.status_code === 200) {
          setEditStatementData(res);
        }
      } else {
        setPayloadBreadCrumb({
          camp_num: router?.query?.statement[1].split("-")[0],
          topic_num: router?.query?.statement[0].split("-")[0],
          topic_name: router?.query?.statement[0].split("-").slice(1).join(" "),
        });
      }
      const reqBody = {
        topic_num: add
          ? router?.query?.statement[0]?.split("-")[0]
          : res?.data?.topic?.topic_num,
      };
      const result = await getAllUsedNickNames(reqBody);
      if (result?.status_code == 200) {
        form.setFieldsValue(
          add
            ? {
                nick_name: result?.data[0].id,
              }
            : !!((objection || update) && manageFormOf == "statement")
            ? {
                nick_name: res?.data?.nick_name[0]?.id,
                parent_camp_num: res?.data?.statement?.camp_num,
                statement: res?.data?.statement?.value,
                edit_summary: res?.data?.statement?.note,
              }
            : manageFormOf == "camp"
            ? {
                nick_name: res?.data?.nick_name[0]?.id,
                statement: res?.data?.camp?.note,
                parent_camp_num: res?.data?.camp?.parent_camp_num,
                camp_name: res?.data?.camp?.camp_name,
                keywords: res?.data?.camp?.key_words,
                camp_about_url: res?.data?.camp?.camp_about_url,
                camp_about_nick_name:
                  res?.data?.camp?.camp_about_nick_id > 0
                    ? res?.data?.camp?.camp_about_nick_id
                    : null,
                edit_summary: update ? res?.data?.camp?.note : null,
              }
            : manageFormOf == "topic"
            ? {
                nick_name: res?.data?.nick_name[0]?.id,
                topic_name: res?.data?.topic?.topic_name,
                name_space: res?.data?.topic?.namespace_id,
              }
            : {
                nick_name: res?.data?.nick_name[0]?.id,
                statement: res?.data?.statement?.value,
                parent_camp_num: res?.data?.statement?.camp_num,
              }
        );
        setNickNameData(result?.data);
      }
      setScreenLoading(false);
    }
    isLogin ? nickNameListApiCall() : router.push("/login");
  }, []);

  let formTitle = () => {
    let update: string;
    if (manageFormOf == "statement") {
      update = "Statement Update";
    } else if (manageFormOf == "camp") {
      update = "Camp Update";
    } else if (manageFormOf == "topic") {
      update = "Topic Update";
    }
    return update;
  };
  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        {payloadBreadCrumb && (
          <CampInfoBar
            payload={payloadBreadCrumb}
            isTopicHistoryPage={manageFormOf == "topic" ? true : false}
          />
        )}

        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>

        <div className="pageContentWrap">
          <Spin spinning={screenLoading} size="large">
            <Card
              title={
                add
                  ? K?.exceptionalMessages?.addCampStatement
                  : !objection
                  ? formTitle()
                  : K?.exceptionalMessages?.objectionStatementHeading
              }
              className={styles.card}
            >
              <Form
                form={form}
                layout={"vertical"}
                initialValues={{
                  available_for_child: 0,
                }}
                onFinish={onFinish}
              >
                <Row gutter={28}>
                  <Col xs={24} sm={24} xl={12}>
                    {/* Nick name=================================================================== */}
                    <Form.Item
                      className={styles.formItem}
                      label={
                        <>
                          Nick Name <span className="required">*</span>
                        </>
                      }
                      name="nick_name"
                      rules={[
                        {
                          required: true,
                          message:
                            K?.exceptionalMessages?.selectNickNameErrorMsg,
                        },
                      ]}
                    >
                      <Select value={nickNameData[0]?.id} size="large">
                        {!!nickNameData &&
                          nickNameData?.map((names) => (
                            <Select.Option value={names.id} key={names?.id}>
                              {names?.nick_name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* paraent Camp -----------------------===============--------------------------*/}
                  {manageFormOf == "camp" && (
                    <>
                      {parentCamp.length > 1 && (
                        <Col xs={24} sm={24} xl={12}>
                          <Form.Item
                            className={`${styles.formItem} mb-2`}
                            label={
                              <>
                                Parent Camp <span className="required">*</span>
                              </>
                            }
                            name="parent_camp_num"
                            rules={[
                              {
                                required: true,
                                message:
                                  K?.exceptionalMessages
                                    ?.selectNickNameErrorMsg,
                              },
                            ]}
                          >
                            <Select
                              size={"large"}
                              placeholder="Parent camp"
                              // data-id="parent-camp"
                              disabled={objection}
                            >
                              {parentCamp.map((camp) =>
                                camp?.camp_num !==
                                editStatementData?.data?.camp?.camp_num ? (
                                  <Select.Option
                                    value={camp.camp_num}
                                    key={camp.id}
                                  >
                                    {camp.camp_name}
                                  </Select.Option>
                                ) : (
                                  ""
                                )
                              )}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                      {/* camp name -------------------------------------------------------- -----------------------*/}
                      <Col xs={24} sm={24} xl={12}>
                        <Form.Item
                          className={`${styles.formItem} mb-2`}
                          label={
                            <>
                              Camp Name <span className="required">*</span>
                              <span>(Limit 30 Chars)</span>
                            </>
                          }
                          name="camp_name"
                          rules={[
                            {
                              required: true,
                              message: K?.exceptionalMessages?.campNameReqErr,
                            },
                            {
                              pattern: /[^ \s]/,
                              message: K?.exceptionalMessages?.campNameReqErr,
                            },
                          ]}
                        >
                          <Input
                            disabled={!!(parentCamp.length <= 1 || objection)}
                            maxLength={30}
                          />
                        </Form.Item>
                      </Col>
                      {/* keywords  --------------------------------------------------- */}
                      <Col xs={24} sm={24} xl={12}>
                        {!objection && (
                          <Form.Item
                            className={`${styles.formItem} mb-2`}
                            label={<>Keywords</>}
                            name="keywords"
                            rules={[
                              {
                                required: true,
                                message:
                                  K?.exceptionalMessages
                                    ?.selectNickNameErrorMsg,
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        )}
                      </Col>
                    </>
                  )}
                  {/* Topic name =========================================== */}
                  {manageFormOf == "topic" && (
                    <>
                      <Col xs={24} sm={24} xl={12}>
                        <Form.Item
                          className={`${styles.formItem} mb-2`}
                          label={
                            <>
                              Topic Name <span className="required">*</span>
                              <span>(Limit 30 Chars)</span>
                            </>
                          }
                          name="topic_name"
                          rules={[
                            {
                              required: true,
                              message: K?.exceptionalMessages?.campNameReqErr,
                            },
                            {
                              pattern: /[^ \s]/,
                              message: K?.exceptionalMessages?.campNameReqErr,
                            },
                          ]}
                        >
                          <Input disabled={objection} maxLength={30} />
                        </Form.Item>

                        {/* Name space -------------------------------------------------------------------- */}
                        {!objection && (
                          <Form.Item
                            className={`${styles.formItem} mb-2`}
                            label={
                              <>
                                Namespace <span className="required">*</span>
                                <span>
                                  (General is recommended, unless you know
                                  otherwise)
                                </span>
                              </>
                            }
                            name="name_space"
                            rules={[
                              {
                                required: true,
                                message:
                                  K?.exceptionalMessages
                                    ?.selectNickNameErrorMsg,
                              },
                            ]}
                          >
                            <Select size={"large"} placeholder="Name Space">
                              {canNameSpace.map((camp) => (
                                <Select.Option value={camp.id} key={camp.id}>
                                  {camp.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        )}
                      </Col>
                    </>
                  )}

                  {/* statement================================================================================ */}
                  {manageFormOf == "statement" && (
                    <Col xs={24} xl={24}>
                      <Form.Item
                        className={`${styles.formItem} mb-2`}
                        name="statement"
                        label={
                          <>
                            Statement <span className="required">*</span>
                          </>
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              K?.exceptionalMessages?.statementRequiredErrorMsg,
                          },
                          {
                            pattern: /[^ \s]/,
                            message:
                              K?.exceptionalMessages?.statementRequiredErrorMsg,
                          },
                        ]}
                      >
                        <Input.TextArea
                          size="large"
                          rows={7}
                          disabled={objection}
                        />
                      </Form.Item>
                      <small className="mb-3 d-block">
                        {K?.exceptionalMessages?.wikiMarkupSupportMsg}{" "}
                        <Link
                          href={
                            "/topic/132-Help/5-Canonizer-wiki-text-formatting"
                          }
                        >
                          <a>click here.</a>
                        </Link>
                      </small>
                    </Col>
                  )}
                  <Col xs={24} xl={24}>
                    {/* object reason  =================================================================================? */}
                    {objection ? (
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message:
                              K?.exceptionalMessages?.objectionRequireErrorMsg,
                          },
                          {
                            pattern: /[^ \s]/,
                            message: K?.exceptionalMessages?.objectionIsRequire,
                          },
                        ]}
                        className={styles.formItem}
                        name="objection_reason"
                        label={
                          <>
                            Your Objection Reason{" "}
                            <span className="required">*</span>{" "}
                            <small>(Limit 100 Char) </small>
                          </>
                        }
                      >
                        <Input.TextArea size="large" rows={1} maxLength={100} />
                      </Form.Item>
                    ) : (
                      <>
                        {/* edit sumaruy ========================================================================================= */}
                        <Form.Item
                          className={styles.formItem}
                          name="edit_summary"
                          label={
                            <>
                              Edit Summary{" "}
                              <small>(Briefly describe your changes)</small>
                            </>
                          }
                        >
                          <Input.TextArea size="large" rows={7} />
                        </Form.Item>
                        {/* Camp about url ===================================================== ----------------- */}
                        {manageFormOf == "camp" && (
                          <>
                            <Form.Item
                              className={`${styles.formItem} mb-2`}
                              label={
                                <>
                                  Camp About URL
                                  <span>(Limit 1024 Chars)</span>
                                </>
                              }
                              name="camp_about_url"
                              rules={[
                                {
                                  pattern: /[^ \s]/,
                                  message: "Enter a valid link",
                                },
                              ]}
                            >
                              <Input maxLength={1024} />
                            </Form.Item>
                            {/* cmap about nick name ========================================== --------------------- */}
                            <Form.Item
                              className={`${styles.formItem} mb-2`}
                              label={<>Camp About Nick Name</>}
                              name="camp_about_nick_name"
                            >
                              <Select
                                size={"large"}
                                placeholder="--Select Camp About Nick Name"
                                // data-id="parent-camp"
                              >
                                {campNickName.map((camp) => (
                                  <Select.Option value={camp.id} key={camp.id}>
                                    {camp.nick_name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </>
                        )}
                      </>
                    )}
                  </Col>
                  <Col xs={24} xl={24}>
                    <Form.Item className="mb-0">
                      <Button
                        size="large"
                        className={`btn-orange mr-3 ${styles.btnSubmit}`}
                        htmlType="submit"
                      >
                        {add
                          ? K?.exceptionalMessages?.submitStatementButton
                          : !objection
                          ? K?.exceptionalMessages?.submitUpdateButton
                          : "Submit Objection"}
                      </Button>
                      {!objection && (
                        <>
                          <Button
                            htmlType="button"
                            className="cancel-btn mr-3"
                            type="ghost"
                            size="large"
                            onClick={() => {
                              let backdata = editStatementData?.data;
                              setScreenLoading(true);
                              add
                                ? router.push(
                                    `/topic/${router?.query?.statement[0].replace(
                                      " ",
                                      "-"
                                    )}/${router?.query?.statement[1].replace(
                                      " ",
                                      "-"
                                    )}`
                                  )
                                : router?.push(
                                    manageFormOf == "camp"
                                      ? `/camp/history/${
                                          backdata?.topic?.topic_num
                                        }-${backdata?.topic?.topic_name
                                          ?.split(" ")
                                          ?.join("-")}/${
                                          backdata?.parent_camp[
                                            backdata?.parent_camp.length - 1
                                          ].camp_num
                                        }-${backdata?.parent_camp[
                                          backdata?.parent_camp.length - 1
                                        ].camp_name
                                          ?.split(" ")
                                          ?.join("-")}`
                                      : manageFormOf == "statement"
                                      ? `/statement/history/${
                                          backdata?.topic?.topic_num
                                        }-${backdata?.topic?.topic_name
                                          ?.split(" ")
                                          ?.join("-")}/${
                                          backdata?.parent_camp[
                                            backdata?.parent_camp.length - 1
                                          ].camp_num
                                        }-${backdata?.parent_camp[
                                          backdata?.parent_camp.length - 1
                                        ].camp_name
                                          ?.split(" ")
                                          ?.join("-")}`
                                      : `/topic/history/${
                                          backdata?.topic?.topic_num
                                        }-${backdata?.topic?.topic_name
                                          ?.split(" ")
                                          ?.join("-")}`
                                  );
                            }}
                          >
                            Cancel
                          </Button>

                          <Button
                            htmlType="button"
                            className="cancel-btn"
                            type="primary"
                            size="large"
                            onClick={() => setModalVisible(true)}
                          >
                            Preview
                          </Button>
                        </>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Spin>
        </div>
      </div>
      <Modal
        title="Statement preview"
        style={{
          top: 20,
        }}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          form?.submit();
          setModalVisible(false);
        }}
        okText={
          add
            ? K?.exceptionalMessages?.submitStatementButton
            : K?.exceptionalMessages?.submitUpdateButton
        }
      >
        <Descriptions
          className="statementPreviewModal"
          size="small"
          column={{ xxl: 1, lg: 1 }}
          // layout="vertical"
        >
          {manageFormOf == "statement" && (
            <Descriptions.Item label="Statement">
              {form?.getFieldValue("statement")}
            </Descriptions.Item>
          )}
          {manageFormOf == "topic" && (
            <>
              <Descriptions.Item label="Topic Name">
                {form?.getFieldValue("topic_name")}
              </Descriptions.Item>
              <Descriptions.Item label="Namespace">
                {
                  canNameSpace?.find(
                    (id) => id?.id == form?.getFieldValue("name_space")
                  )?.label
                  // form?.getFieldValue("name_space")
                }
              </Descriptions.Item>
            </>
          )}
          {manageFormOf == "camp" && (
            <>
              <Descriptions.Item label="Camp Name">
                {form?.getFieldValue("camp_name")}
              </Descriptions.Item>

              {parentCamp.length > 1 && (
                <Descriptions.Item label="parent Camp Num">
                  {
                    parentCamp?.find(
                      (parent) =>
                        parent?.camp_num ==
                        form?.getFieldValue("parent_camp_num")
                    )?.camp_name
                  }
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Keywords">
                {form?.getFieldValue("keywords")}
              </Descriptions.Item>

              <Descriptions.Item label="Camp About Url">
                {form?.getFieldValue("camp_about_url")}
              </Descriptions.Item>

              <Descriptions.Item label="Camp About Nick Name">
                {
                  campNickName?.find(
                    (id) =>
                      id?.id == form?.getFieldValue("camp_about_nick_name")
                  )?.nick_name
                }
              </Descriptions.Item>
            </>
          )}

          <Descriptions.Item label="Edit Summary">
            {" "}
            {form?.getFieldValue("edit_summary")}
          </Descriptions.Item>
          <Descriptions.Item label="Submitter Nick Name">
            {" "}
            {
              nickNameData?.find(
                (id) => id?.id == form?.getFieldValue("nick_name")
              )?.nick_name
            }
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
}
