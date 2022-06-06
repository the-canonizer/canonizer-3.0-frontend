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
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setScreenLoading(true);
    let res_for_add;
    if (add) {
      res_for_add = await getEditStatementApi(values?.nick_name);
    }
    let res = await updateStatementApi({
      topic_num: add
        ? router?.query?.statement[0]?.split("-")[0]
        : editStatementData?.data?.parent_camp[
            editStatementData?.data?.parent_camp?.length - 1
          ]?.topic_num,
      camp_num: add
        ? router?.query?.statement[1]?.split("-")[0]
        : editStatementData?.data?.parent_camp[
            editStatementData?.data?.parent_camp?.length - 1
          ]?.camp_num,
      nick_name: values?.nick_name,
      note: values?.edit_summary,
      parent_camp_num: add
        ? res_for_add?.data?.parentcampnum
        : editStatementData?.data?.parentcampnum,
      submitter: add
        ? res_for_add?.data?.statement?.submitter_nick_id
        : editStatementData?.data?.statement?.submitter_nick_id,
      statement: values?.statement,
    });
    if (add) {
      router.push(
        router.asPath.replace("create/statement", "statement/history")
      );
    } else {
      let route = `${
        editStatementData?.data?.topic?.topic_num
      }-${editStatementData?.data?.topic?.topic_name?.split(" ").join("-")}/${
        editStatementData?.data?.parent_camp[
          editStatementData?.data?.parent_camp?.length - 1
        ]?.camp_num
      }-${editStatementData?.data?.parent_camp[
        editStatementData?.data?.parent_camp?.length - 1
      ]?.camp_name
        ?.split(" ")
        .join("-")}`;
      router.push(`/statement/history/${route}`);
    }
    setScreenLoading(false);
  };

  useEffect(() => {
    setScreenLoading(true);
    async function nickNameListApiCall() {
      let res;
      if (!add) {
        res = await getEditStatementApi(router?.query?.statement[1]);
        setEditStatementData(res);
      }

      const reqBody = {
        topic_num: add
          ? router?.query?.statement[0]?.split("-")[0]
          : res?.data?.topic?.topic_num,
      };
      const result = await getAllUsedNickNames(reqBody);
      if (add) {
        form.setFieldsValue({
          nick_name: result?.data[0].id,
        });
      } else {
        form.setFieldsValue({
          nick_name: res?.data?.nick_name[0]?.id,
          statement: res?.data?.statement?.value,
        });
      }
      setNickNameData(result?.data);
      setScreenLoading(false);
    }
    if (isLogin) {
      nickNameListApiCall();
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <CampInfoBar isStatementBar={true} payload={null} />

        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>

        <div className="pageContentWrap">
          <Spin spinning={screenLoading} size="large">
            <Card
              title={add ? "Add Camp Statement" : "Topic Update"}
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
                        {nickNameData &&
                          nickNameData?.map((names) => (
                            <Select.Option value={names.id} key={names?.id}>
                              {names?.nick_name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} xl={24}>
                    <Row gutter={24}>
                      <Col xs={24} xl={12}>
                        <Form.Item
                          className={styles.formItem}
                          name="statement"
                          label={<>Statement </>}
                          rules={[
                            {
                              required: true,
                              message:
                                K?.exceptionalMessages
                                  ?.statementRequiredErrorMsg,
                            },
                          ]}
                        >
                          <Input.TextArea size="large" rows={7} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col xs={24} xl={12}>
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
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} xl={24}>
                    <Form.Item className="mb-0 text-right">
                      <Button
                        size="large"
                        className={`btn-orange ${styles.btnSubmit}`}
                        htmlType="submit"
                      >
                        {add
                          ? K?.exceptionalMessages?.submitStatementButton
                          : K?.exceptionalMessages?.submitUpdateButton}
                      </Button>

                      <Button
                        htmlType="button"
                        className="cancel-btn"
                        type="ghost"
                        size="large"
                        onClick={() => setModalVisible(true)}
                      >
                        Preview
                      </Button>
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
