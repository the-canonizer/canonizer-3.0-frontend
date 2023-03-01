import React, { useState, useEffect } from "react";
import { Card, Modal, Button, Form, Empty, Pagination } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { DraggableArea } from "react-draggable-tags";
import styles from "./DirectSupportedCamps.module.scss";
import Link from "next/link";
import messages from "../../../../messages";
import CustomSkelton from "../../../common/customSkelton";

export default function DirectSupportedCampsUI({
  removeCardSupportedCamps,
  handleSupportedCampsCancel,
  isSupportedCampsModalVisible,
  directSupportedCampsList,
  setDirectSupportedCampsList,
  search,
  setCardCamp_ID,
  removeSupport,
  handleClose,
  saveChanges,
  showSaveChanges,
  setShowSaveChanges,
  setRevertBack,
  handleRevertBack,
  visible,
  idData,
  handleOk,
  handleCancel,
  removeSupportCampsData,
  directSkeletonIndicator,
}: any) {
  const [valData, setValData] = useState({});
  const [tagsDataArrValue, setTagsDataArrValue] = useState([]);
  const [tagsCampsOrderID, setTagsCampsOrderID] = useState("");
  const [displayList, setDisplayList] = useState([]);
  // const [noMore, setNoMore] = useState(true);

  let tagsArrayList = [];
  const CardTitle = (props: any) => {
    return (
      <div className={styles.card_heading_title}>
        {messages.labels.fortopic}
        <span>
          {" "}
          &quot;
          <Link href={props.title_link}>{props.value}</Link>
          &quot;
        </span>
      </div>
    );
  };

  const tagsOrder = (topic_num, data, tags) => {
    setTagsCampsOrderID(data.topic_num);
    setTagsDataArrValue(tags);
    handleClose({}, topic_num, data, tags);
    setValData({});
  };

  useEffect(() => {
    if (tagsDataArrValue.length > 0) {
      let newData = directSupportedCampsList.map((val: any) => {
        if (val.topic_num == tagsCampsOrderID) {
          return { ...val, camps: tagsDataArrValue };
        } else {
          return val;
        }
      });
      setDirectSupportedCampsList(newData);
    }
  }, [tagsDataArrValue]);

  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };
  const filteredArray = () => {
    return displayList.filter((val: any) => {
      if (search.trim() == "") {
        return val;
      } else if (
        val.title.toLowerCase().trim().includes(search.toLowerCase().trim())
      ) {
        return val;
      }
    });
  };
  useEffect(() => {
    pageChange(1, 5);
  }, [directSupportedCampsList]);

  const pageChange = (pageNumber, pageSize) => {
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setDisplayList(
      directSupportedCampsList.slice(startingPosition, endingPosition)
    );
  };
  return (
    <div>
      {directSkeletonIndicator ? (
        <CustomSkelton
          skeltonFor="subscription_card"
          bodyCount={4}
          stylingClass=""
        />
      ) : (
        <div>
          {directSupportedCampsList && directSupportedCampsList.length > 0
            ? filteredArray().length > 0
              ? filteredArray()?.map((data) => {
                  tagsArrayList = data.camps;
                  tagsArrayList.forEach((obj, index) => {
                    obj.id = index + 1;
                  });
                  return (
                    <>
                      <Card
                        key={data.topic_num}
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
                            className={styles.RemoveCardSupported}
                            onClick={() => removeCardSupportedCamps(data)}
                          >
                            <CloseCircleOutlined />{" "}
                            {messages.labels.removeSupport}{" "}
                          </div>
                        }
                        style={{ width: 760, marginBottom: 16 }}
                      >
                        <DraggableArea
                          tags={tagsArrayList}
                          render={({ tag }) => (
                            <div
                              className={tag.dis ? "tag tags_disable" : "tag"}
                            >
                              <Button
                                id="campsBtn"
                                key={tag.camp_num}
                                className={styles.tag_btn}
                                disabled={tag.dis}
                              >
                                <div className={styles.btndiv}>
                                  {" "}
                                  <span className="count">{tag.id}. </span>
                                  <Link
                                    href={tag.camp_link}
                                    className={styles.Bluecolor}
                                    draggable="false"
                                  >
                                    {" "}
                                    {tag.camp_name}
                                  </Link>
                                </div>
                                <CloseCircleOutlined
                                  onClick={() => {
                                    handleClose(tag, data.topic_num, data, []),
                                      setValData(tag),
                                      setRevertBack([]);
                                  }}
                                />
                              </Button>
                            </div>
                          )}
                          onChange={(tags) => {
                            tagsOrder(data.topic_num, data, tags);
                          }}
                        />

                        {showSaveChanges && idData == data.topic_num ? (
                          <div className={styles.tag_Changes}>
                            <Button
                              id="saveChangeBtn"
                              className={styles.save_Changes_Btn}
                              onClick={saveChanges}
                            >
                              Save Changes
                            </Button>
                            <Button
                              id="revertBtn"
                              className={styles.revert_Btn}
                              onClick={() => {
                                handleRevertBack(idData, data.camps);
                                setCardCamp_ID("");
                                setShowSaveChanges(false);
                              }}
                            >
                              Revert
                            </Button>
                          </div>
                        ) : (
                          ""
                        )}
                      </Card>
                    </>
                  );
                })
              : showEmpty("No Data Found ")
            : showEmpty("No Data Found ")}
          {directSupportedCampsList && directSupportedCampsList.length > 0 ? (
            <Pagination
              hideOnSinglePage={true}
              total={directSupportedCampsList.length}
              pageSize={5}
              onChange={pageChange}
              showSizeChanger={false}
            />
          ) : (
            ""
          )}
        </div>
      )}
      <Modal
        className={styles.modal_cross}
        title="Remove Support"
        open={isSupportedCampsModalVisible}
        onOk={handleSupportedCampsCancel}
        onCancel={handleSupportedCampsCancel}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
      >
        <Form>
          <Form.Item style={{ marginBottom: "0px" }}>
            <p id="all_camps_topics">
              Your Support for all the camps under the Topics{" "}
              <span>
                &quot;
                <Link href={removeSupportCampsData.title_link}>
                  {removeSupportCampsData.title}
                </Link>
                &quot;
              </span>{" "}
              will be removed. Are you sure you want to continue?
            </p>
          </Form.Item>
          <Form.Item
            id="directCampsModalForm"
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
        className={styles.modal}
        title={null}
        open={visible}
        onOk={() => {
          handleOk(idData, valData);
        }}
        onCancel={handleCancel}
      >
        <h1 id="changesWillBeReverted">Changes will be reverted ?</h1>
      </Modal>
    </div>
  );
}
