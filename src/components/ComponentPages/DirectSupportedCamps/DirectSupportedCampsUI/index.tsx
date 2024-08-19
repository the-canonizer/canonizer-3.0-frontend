import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Empty, Spin, Modal, Form, Drawer } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { DraggableArea } from "react-draggable-tags";
import Link from "next/link";

import styles from "./DirectSupportedCamps.module.scss";

import messages from "../../../../messages";
import CustomSkelton from "../../../common/customSkelton";
import SupportRemovedModal from "../../../common/supportRemovedModal";
import Search from "antd/lib/transfer/search";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { setOpenDrawerForDirectSupportedCamp } from "src/store/slices/campDetailSlice";

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
  handleSupportedCampsOpen,
  modalPopupText,
  campIds,
  removeCampLink,
  isChangingOrder,
  setIsChangingOrder,
}: any) {
  const [valData, setValData] = useState({});
  const [tagsDataArrValue, setTagsDataArrValue] = useState([]);
  const [tagsCampsOrderID, setTagsCampsOrderID] = useState("");
  const [displayList, setDisplayList] = useState([]);
  const [removeSupportSpinner, setRemoveSupportSpinner] = useState(false);
  const [currentCamp, setCurrentCamp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);

  const { openDrawerForDirectSupportedCamp } = useSelector(
    (state: RootState) => ({
      openDrawerForDirectSupportedCamp: state.topicDetails.openDrawerForDirectSupportedCamp,
    })
  );
  const dispatch = useDispatch()
  interface Tag {
    id: number;
    camp_num: number;
    camp_name: string;
    camp_link: string;
    dis?: boolean;
  }

  interface RecordType {
    topic_num: number;
    title: string;
    title_link: string;
    camps: Tag[];
  }
  const columns = [
    {
      title: "Supported Topics",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: RecordType) => (
        <div className="flex gap-2.5">
          <Link href={record.title_link} >
            <a className="text-base font-semibold flex items-center gap-2.5 text-canBlack">{text}</a>
          </Link>
          <Image
            onClick={() => {dispatch(setOpenDrawerForDirectSupportedCamp(true)); removeCardSupportedCamps(record) }}
            src="/images/minus-user-icon.svg"
            width={24}
            height={24}
            alt=""
          />
        </div>

      ),
    },
    {
      title: "Supported Camps",
      dataIndex: "camps",
      key: "camps",
      render: (camps: Tag[], record: RecordType) => (
        <div>
          <DraggableArea
            tags={camps}
            render={({ tag }: { tag: Tag }) => (
              <div className={tag.dis ? "tag tags_disable" : "tag"}>
                <Button
                  id="campsBtn"
                  key={tag.camp_num}
                  className="bg-canLightGrey rounded-full border-none mb-2.5 flex items-center gap-2.5"
                  disabled={tag.dis}
                >
                  <div className={styles.btndiv}>
                    <span className="count">{tag.id}. </span>
                    <Link href={tag.camp_link}>
                      <a
                        className="text-sm text-canBlack font-semibold"
                        draggable="false"
                        onClick={() => false}
                      >
                        {tag.camp_name}
                      </a>
                    </Link>
                  </div>
                  <div
                    className="flex items-center"
                    onClick={() => {
                      handleClose(tag, record.topic_num, record, []);
                      setValData(tag);
                      setRevertBack([]);
                    }}
                  >
                    <Image
                      src="/images/minus-user-icon.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  </div>
                </Button>
              </div>
            )}
            onChange={(tags: Tag[]) => tagsOrder(record.topic_num, record, tags)}
          />


          {showSaveChanges && idData === record.topic_num && (
            <div className="flex gap-2.5">
              <Button
                data-testid="save_change_btn"
                id="saveChangeBtn"

                className=" Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-6 hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-canBlue text-white text-base font-medium rounded-lg border-none justify-center focus:bg-canBlue focus:!text-white"
                onClick={() => {
                  setCurrentCamp(record.topic_num);
                  handleSupportedCampsOpen(record);
                  pageChange(currentPage, 5);
                  dispatch(setOpenDrawerForDirectSupportedCamp(true));
                }}
              >
                Save Changes
              </Button>
              <Button
                data-testid="save_change_btn"
                id="revertBtn"
                className="Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-6  flex gap-2.5 items-center bg-[#98B7E6] bg-opacity-10 text-canBlack text-base font-medium rounded-lg border-canBlue justify-center "
                onClick={() => {
                  handleRevertBack(idData, record.camps);
                  setCardCamp_ID("");
                  setShowSaveChanges(false);
                }}
              >
                Revert
              </Button>
            </div>
          )}
        </div>
      ),
    },
    // {
    //   title: "",
    //   key: "action",
    //   render: (text: any, record: RecordType) => (
    //     <div
    //       className={styles.RemoveCardSupported}
    //       onClick={() => removeCardSupportedCamps(record)}
    //     >
    //       <CloseCircleOutlined /> Remove Support
    //     </div>
    //   ),
    // },
  ];

  const tagsOrder = (topic_num, data, tags) => {
    setTagsCampsOrderID(data.topic_num);
    setTagsDataArrValue(tags);
    handleClose({}, topic_num, data, tags);
    setValData({});
    setIsChangingOrder(true);
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

  const filteredArray = () => {
    if (search.trim() == "") {
      return displayList;
    } else {
      return directSupportedCampsList.filter((val: any) => {
        if (
          val.title.toLowerCase().trim().includes(search.toLowerCase().trim())
        ) {
          return val;
        }
      });
    }
  };

  useEffect(() => {
    pageChange(currentPage, 5);
  }, [directSupportedCampsList]);

  const pageChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setDisplayList(
      directSupportedCampsList.slice(startingPosition, endingPosition)
    );
  };

  const [removeForm] = Form.useForm();

  const onRemoveFinish = async (values) => {
    setRemoveSupportSpinner(true);
    if (showSaveChanges && idData == currentCamp) {
      await saveChanges(values);
    } else {
      await removeSupport(values);
    }
    removeForm.resetFields();
    setRemoveSupportSpinner(false);
  };
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };

  return (
    <div data-testid="directSupportUi">
      {directSkeletonIndicator ? (
        <CustomSkelton
          skeltonFor="subscription_card"
          bodyCount={4}
          stylingClass=""
          isButton={false}
        />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base uppercase font-semibold text-canBlack mb-5">
                DIRECT SUPPORTED CAMPS
              </h3>
              <p className="text-sm font-normal text-canBlack">
                Note : To change support order of camp, drag & drop the camp box
                on your choice position.
              </p>
            </div>
            {/* <div>
              {/ Uncomment if you want to add search functionality /}
              {/ <Search placeholder="Search via topic name" /> /}
            </div> */}
          </div>
          {directSupportedCampsList && directSupportedCampsList.length > 0 ? (
            filteredArray().length > 0 ? (
              <>
                <Table
                  dataSource={filteredArray()}
                  columns={columns}
                  pagination={false}
                  rowKey="topic_num"
                  bordered
                />
                <Pagination
                  hideOnSinglePage={true}
                  total={directSupportedCampsList.length}
                  pageSize={5}
                  defaultCurrent={currentPage}
                  onChange={pageChange}
                  showSizeChanger={false}
                  className="mt-5"
                />
              </>
            ) : (
              showEmpty("No Data Found")
            )
          ) : (
            showEmpty("No Data Found")
          )}
        </div>
      )}
      {/* <Modal
        className={styles.modal_cross}
        title={
          isChangingOrder
            ? "You are about to change the order of your supported camps"
            : modalPopupText
              ? `You are about to remove your support from all the camps from the topic: "${removeSupportCampsData.title}"`
              : campIds?.length > 1
                ? "You are about to remove your support from the camps: "
                : "You are about to remove your support from the camp: "
        }
        open={isSupportedCampsModalVisible}
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
            isOrderChange={isChangingOrder}
          />
        </Spin>
      </Modal> */}

      <Modal
        data-testid="closeModel"
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
      <Drawer
        open={openDrawerForDirectSupportedCamp}
        closeIcon={
          <Image onClick={() => {dispatch(setOpenDrawerForDirectSupportedCamp(false)); }} src="/images/refine-back-arrow.svg" width={16} height={24} />
        }
        // className="[&.ant-drawer-content-wrapper]:!w-[45rem]"
        width={730}
        title={
          <p id="all_camps_topics" className="text-2xl font-normal">
            {isChangingOrder
              ? "You are about to change the order of your supported camps"
              : modalPopupText
                ? "You are about to remove your support from all the camps from the topic: "
                : campIds?.length > 1
                  ? "You are about to remove your support from the camps: "
                  : "You are about to remove your support from the camp: "}
            {!isChangingOrder && (
              <span>
               
                {modalPopupText ? (
                  <Link
                    href={{
                      pathname: removeSupportCampsData.title_link,
                    }}
                  >
                    <a className="text-canGreen text-2xl font-semibold">{removeSupportCampsData.title}</a>
                  </Link>
                ) : (
                  removeCampLink?.map((val, index) => {
                    return (
                      <Link
                        key={index}
                        href={{
                          pathname: val.camp_link,
                        }}
                      >
                        <a className="text-canGreen text-2xl font-semibold">{(index ? ", " : "") + val.camp_name}</a>
                      </Link>
                    );
                  })
                )}
             
              </span>
            )}
         
            {/* You can optionally add a helpful reason, along with a citation link. */}
          </p>
        }

      >
        <p className="text-sm font-normal text-canRed mb-8">
          Note : You are about to remove your support from all the camps from the topic:<span className="text-sm font-semibold"> "Theories of consciousness"</span>. You can optionally add a helpful reason, along with a citation link.
        </p>
        <SupportRemovedModal
          onFinish={onRemoveFinish}
          handleCancel={handleSupportedCampsCancel}
          form={removeForm}
          isOrderChange={isChangingOrder}
        />


      </Drawer>
    </div>
  );

}
