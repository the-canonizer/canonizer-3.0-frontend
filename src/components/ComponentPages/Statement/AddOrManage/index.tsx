import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card, Modal, Spin, Input, Select } from "antd";
import { useRouter } from "next/router";
import "antd/dist/antd.css";
import styles from "../addEditNews.module.scss";
import K from "../../../../constants";
import { getAllUsedNickNames } from "../../../../network/api/campDetailApi";
import useAuthentication from "../../../../hooks/isUserAuthenticated";
import { getEditStatementApi } from "../../../../network/api/campManageStatementApi";
import { updateStatementApi } from "../../../../network/api/campManageStatementApi";
import SideBarNoFilter from "../../../ComponentPages/Home/SideBarNoFilter";
import CampInfoBar from "../../TopicDetails/CampInfoBar";

export default function AddOrManage({ add }) {
  const isLogin = useAuthentication();
  const router = useRouter();
  const [editStatementData, setEditStatementData] = useState({ data: null });

  const [modalVisible, setModalVisible] = useState(false);
  const [nickNameData, setNickNameData] = useState([]);
  const [screenLoading, setScreenLoading] = useState(false);
  const [payloadBreadCrumb, setPayloadBreadCrumb] = useState({});
  const [form] = Form.useForm();
  let objection = router?.query?.statement[1]?.split("-")[1] == "objection";
  let update = router?.query?.statement[1]?.split("-")[1] == "update";
  console.log("objection ", objection);

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
        let route = `${editInfo?.topic?.topic_num}-${editInfo?.topic?.topic_name
          ?.split(" ")
          .join("-")}/${
          parent_camp[parent_camp?.length - 1]?.camp_num
        }-${parent_camp[parent_camp?.length - 1]?.camp_name
          ?.split(" ")
          .join("-")}`;
        router.push(`/statement/history/${route}`);
      }
    }
    setScreenLoading(false);
  };
  // const objectionStatemnent = async (values) => {
  //   let editInfo = editStatementData?.data;
  //   let parent_camp = editInfo?.parent_camp;
  //   let reqBody = {
  //     topic_num: parent_camp[parent_camp?.length - 1]?.topic_num,
  //     parent_camp_num: editInfo?.parent_camp_num,
  //     camp_num: parent_camp[parent_camp?.length - 1]?.camp_num,
  //     submitter: editInfo?.statement?.submitter_nick_id,
  //     objection: "1",
  //     statement_id: router?.query?.statement[1]?.split("-")[0],
  //     nick_name: values?.nick_name,
  //     statement: values?.statement?.trim(),
  //     objection_reason: values?.objection_reason,
  //   };
  //   console.log("objection ", reqBody);
  //   let res = await updateStatementApi(reqBody);
  //   return res;
  // };

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
        : parent_camp[parent_camp?.length - 1]?.topic_num,
      camp_num: add
        ? router?.query?.statement[1]?.split("-")[0]
        : parent_camp[parent_camp?.length - 1]?.camp_num,
      nick_name: values?.nick_name,
      note: values?.edit_summary?.trim(),
      submitter: add
        ? res_for_add?.statement?.submitter_nick_id
        : editInfo?.statement?.submitter_nick_id,
      statement: values?.statement?.trim(),
      objection: objection ? "1" : null,
      statement_id: !!(objection || update)
        ? router?.query?.statement[1]?.split("-")[0]
        : null,
      objection_reason: objection ? values?.objection_reason : null,
      statement_update: update ? 1 : null,
    };
    console.log("-------------reqbody", reqBody);
    let res = await updateStatementApi(reqBody);
    return res;
  };

  useEffect(() => {
    setScreenLoading(true);
    async function nickNameListApiCall() {
      let res;
      if (!add) {
        res = await getEditStatementApi(
          router?.query?.statement[1]?.split("-")[0]
        );
        // console.log("req body", router?.query?.statement[1]?.split("-")[0]);
        setEditStatementData(res);
        setPayloadBreadCrumb({
          camp_num: res?.data?.statement?.camp_num,
          topic_num: res?.data?.statement?.topic_num,
          topic_name: res?.data?.topic?.topic_name,
        });
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
            : !!(objection || update)
            ? {
                nick_name: res?.data?.nick_name[0]?.id,
                statement: res?.data?.statement?.parsed_value?.replace(
                  /<[^>]+>/g,
                  ""
                ),
                edit_summary: res?.data?.statement?.note,
              }
            : {
                nick_name: res?.data?.nick_name[0]?.id,
                statement: res?.data?.statement?.parsed_value?.replace(
                  /<[^>]+>/g,
                  ""
                ),
              }
        );
        setNickNameData(result?.data);
      }
      setScreenLoading(false);
    }
    isLogin ? nickNameListApiCall() : router.push("/login");
  }, []);

  console.log("data is nick name", nickNameData);
  console.log("payload breaaad crub", payloadBreadCrumb);
  console.log("edit sattement data", editStatementData);
  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        {payloadBreadCrumb && <CampInfoBar payload={payloadBreadCrumb} />}

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
                  ? K?.exceptionalMessages?.statementUpdate
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
                    <Form.Item
                      className={styles.formItem}
                      label={<>Nick Name</>}
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
                  <Col xs={24} xl={24}>
                    <Form.Item
                      className={`${styles.formItem} mb-2`}
                      name="statement"
                      label={<>Statement</>}
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
                      <a>click here</a>.
                    </small>
                  </Col>
                  <Col xs={24} xl={24}>
                    {objection ? (
                      <Form.Item
                        className={styles.formItem}
                        name="objection_reason"
                        label={
                          <>
                            Your Objection Reason{" "}
                            <small>(Limit 100 Char)</small>
                          </>
                        }
                      >
                        <Input.TextArea size="large" rows={1} maxLength={100} />
                      </Form.Item>
                    ) : (
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
                            onClick={() => {}}
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
        onOk={form?.submit}
        okText={
          add
            ? K?.exceptionalMessages?.submitStatementButton
            : K?.exceptionalMessages?.submitUpdateButton
        }
      >
        <p>{form?.getFieldValue("statement")}</p>
        <p>Edit Summary: {form?.getFieldValue("edit_summary")} </p>
        <p>
          Submitter Nick Name:{" "}
          {
            nickNameData?.find(
              (id) => id.id == form?.getFieldValue("nick_name")
            )?.nick_name
          }
        </p>
      </Modal>
    </>
  );
}
