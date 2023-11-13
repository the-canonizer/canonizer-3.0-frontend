import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Modal, Row, Col, Form, Empty, Pagination, Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import styles from "./DelegatedSupportedCamps.module.scss";
import messages from "../../../../messages";
import CustomSkelton from "src/components/common/customSkelton";
// import SupportRemovedModal from "src/components/common/supportRemovedModal";

export default function DelegatedSupportCampsUI({
  removeCardDelegatedSupportedCamps,
  handleSupportedCampsCancel,
  isRemoveSupportModalVisible,
  handelViewMoreModalCancel,
  showViewMoreModal,
  viewMoreDataValue,
  viewMoreModalVisible,
  delegatedSupportCampsList,
  search,
  removeSupport,
  removeSupportCampsData,
  // statusFlag,
  delegateSupportedSkeleton,
}: any) {
  const [displayList, setDisplayList] = useState([]);
  // const [removeSupportSpinner, setRemoveSupportSpinner] = useState(false);
  const limit = 3;

  function CardTitle(props: any) {
    return (
      <div className={styles.card_heading_title}>
        {messages.labels.fortopic}
        <span>
          {" "}
          &quot;
          <Link href={props.title_link}>
            <a>{props.value}</a>
          </Link>
          &quot;
        </span>
      </div>
    );
  }

  function CurrentSupportedCamps(props: any) {
    return (
      <>
        <p>
          {props.id_data} &nbsp;
          <Link href={props.camp_link}>
            <a className={styles.Bluecolor}>{props.value}</a>
          </Link>
        </p>
      </>
    );
  }

  function SupportedCampsTo(props: any) {
    return (
      <>
        <div className={styles.line_height}>
          <p>
            Support Delegated To:{" "}
            <Link href={props.supportedto_link}>
              <a className={styles.Bluecolor}>{props.supportedto}</a>
            </Link>
          </p>
          <p>
            Nickname:{" "}
            <Link href={props.NickNameLink}>
              <a className={styles.Bluecolor}>{props.NickName}</a>
            </Link>
          </p>
        </div>
      </>
    );
  }

  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };

  const filteredArray = () => {
    // return displayList.filter((val) => {
    //   if (search.trim() == "") {
    //     return val;
    //   } else if (
    //     val.title.toLowerCase().trim().includes(search.toLowerCase().trim())
    //   ) {
    //     return val;
    //   }
    // });
    if (search.trim() == "") {
      return displayList;
    } else {
      return delegatedSupportCampsList.filter((val: any) => {
        if (
          val.title.toLowerCase().trim().includes(search.toLowerCase().trim())
        ) {
          return val;
        }
      });
    }
  };

  useEffect(() => {
    pageChange(1, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegatedSupportCampsList]);

  const pageChange = (pageNumber, pageSize) => {
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setDisplayList(
      delegatedSupportCampsList.slice(startingPosition, endingPosition)
    );
  };

  // remove support popup added.

  // const [removeForm] = Form.useForm();

  // const onRemoveFinish = (values) => {
  //   setRemoveSupportSpinner(true);

  //   removeSupport(values);

  //   removeForm.resetFields();
  //   setRemoveSupportSpinner(false);
  // };

  // remove support popup added.

  return (
    <div>
      {delegateSupportedSkeleton ? (
        <CustomSkelton
          skeltonFor="delegateSupportedCampListCard"
          bodyCount={4}
          stylingClass=""
          isButton={false}
        />
      ) : (
        <div>
          {delegatedSupportCampsList && delegatedSupportCampsList.length > 0
            ? filteredArray().length > 0
              ? filteredArray()?.map((data, i) => {
                  return (
                    <Card
                      key={i}
                      className={styles.cardBox_tags}
                      type="inner"
                      size="default"
                      title={
                        <CardTitle
                          title_link={data.title_link}
                          value={data.title}
                        />
                      }
                      extra={
                        <div
                          data-testid="removeCardDelegatedSupportedCamps"
                          className={styles.RemoveCardSupported}
                          onClick={() =>
                            removeCardDelegatedSupportedCamps(data)
                          }
                        >
                          <CloseCircleOutlined />{" "}
                          {messages.labels.removeSupport}{" "}
                        </div>
                      }
                      style={{ width: 760, marginBottom: 16 }}
                    >
                      <div>
                        <Row className={styles.flex_wrap}>
                          <Col span={12} className={styles.flex_wrap_col}>
                            <>
                              <SupportedCampsTo
                                supportedto={data.delegated_to_nick_name}
                                supportedto_link={
                                  data.delegated_to_nick_name_link
                                }
                                NickName={data.my_nick_name}
                                NickNameLink={data.my_nick_name_link}
                              />
                            </>
                          </Col>
                          <Col span={12} className={styles.border_left}>
                            <div className={styles.line_height1}>
                              <p>
                                <b id="currentSupportedCamp">
                                  {messages.labels.currentSupportedCamps}
                                </b>
                              </p>

                              {data.camps?.slice(0, limit).map((val, i) => {
                                return (
                                  <CurrentSupportedCamps
                                    key={i}
                                    value={val.camp_name}
                                    id_data={val.support_order + "."}
                                    camp_link={val.camp_link}
                                  />
                                );
                              })}
                            </div>
                            {data.camps.length > limit ? (
                              <a
                                className={styles.mrgn_left}
                                onClick={(e) => showViewMoreModal(e, data)}
                              >
                                {messages.labels.viewMore}
                              </a>
                            ) : (
                              ""
                            )}
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  );
                })
              : showEmpty("No Data Found")
            : showEmpty("No Data Found")}
          {delegatedSupportCampsList &&
          delegatedSupportCampsList.length > 0 &&
          search.length == 0 ? (
            <Pagination
              hideOnSinglePage={true}
              total={delegatedSupportCampsList.length}
              pageSize={5}
              onChange={pageChange}
              showSizeChanger={false}
            />
          ) : (
            ""
          )}
        </div>
      )}
      {/* <Modal
        className={styles.modal_cross}
        title={
          <p id="remove_confirmation" className={styles.modalTitle}>
            You are about to remove your support from the camp:{" "}
            <span className={styles.Bluecolor}>
              &quot;
              <Link href={removeSupportCampsData.title_link}>
                <a>{removeSupportCampsData.title}</a>
              </Link>
              &quot;
            </span>{" "}
            You can optionally add a helpful reason, along with a citation link.
          </p>
        }
        open={isRemoveSupportModalVisible}
        onOk={handleSupportedCampsCancel}
        onCancel={handleSupportedCampsCancel}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
      >
        <Spin spinning={removeSupportSpinner} size="small">
          <SupportRemovedModal
            onFinish={onRemoveFinish}
            handleCancel={handleSupportedCampsCancel}
            form={removeForm}
          />
        </Spin>
      </Modal> */}
      <Modal
        className={styles.modal_cross}
        title="Remove Support"
        open={isRemoveSupportModalVisible}
        onOk={handleSupportedCampsCancel}
        onCancel={handleSupportedCampsCancel}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
      >
        <Form>
          <Form.Item style={{ marginBottom: "0px" }}>
            <p id="remove_confirmation">
              Are you sure, you want to remove your delegate support given to{" "}
              <span>
                &quot;
                <Link href={removeSupportCampsData.delegated_to_nick_name_link}>
                  <a>{removeSupportCampsData.delegated_to_nick_name}</a>
                </Link>
                &quot;
              </span>{" "}
              under the topic{" "}
              <span className={styles.Bluecolor}>
                &quot;
                <Link href={removeSupportCampsData.title_link}>
                  <a>{removeSupportCampsData.title}</a>
                </Link>
                &quot;
              </span>{" "}
              ?
            </p>
          </Form.Item>
          <Form.Item
            className={styles.text_right}
            style={{ marginBottom: "0px" }}
          >
            <Button
              id="removeBtn"
              onClick={removeSupport}
              type="primary"
              style={{
                marginTop: 10,
                marginRight: 10,
              }}
              className="ant-btn ant-btn-orange"
            >
              Remove
            </Button>
            <Button
              id="cancelBtn"
              onClick={handleSupportedCampsCancel}
              type="default"
              style={{
                marginTop: 10,
              }}
              className="ant-btn"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<h3 id="currentSupportedCamps">Current Supported Camps:</h3>}
        footer={null}
        open={viewMoreModalVisible}
        onOk={handelViewMoreModalCancel}
        onCancel={handelViewMoreModalCancel}
        closeIcon={<CloseCircleOutlined />}
      >
        <>
          <h3 id="forTopic">
            {" "}
            For Topic{" "}
            <span className={styles.Bluecolor}>
              &quot;{" "}
              <Link href={viewMoreDataValue.title_link}>
                <a>{viewMoreDataValue.title}</a>
              </Link>{" "}
              &quot;
            </span>{" "}
          </h3>
          <div className={styles.topic_content}>
            <p>
              {messages.labels.supportdelegatedto}{" "}
              <Link href={viewMoreDataValue.delegated_to_nick_name_link}>
                <a className={styles.Bluecolor}>
                  {viewMoreDataValue.delegated_to_nick_name}
                </a>
              </Link>
            </p>
            <p>
              {messages.labels.nickname}{" "}
              <Link href={viewMoreDataValue.my_nick_name_link}>
                <a className={styles.Bluecolor}>
                  {viewMoreDataValue.my_nick_name}
                </a>
              </Link>
            </p>
          </div>
          <h3 id="ListOfCurrentSupportedCamps" className={styles.marginTop}>
            List of current supported camps
          </h3>
          <div className={styles.list_Content}>
            {viewMoreDataValue.camps?.map((val, i) => {
              return (
                <CurrentSupportedCamps
                  key={i}
                  value={val.camp_name}
                  id_data={val.support_order + "."}
                  camp_link={val.camp_link}
                />
              );
            })}
          </div>
        </>
      </Modal>
    </div>
  );
}
