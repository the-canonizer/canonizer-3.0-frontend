import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Empty,
  Modal,
  Form,
  Drawer,
  Input,
  Card,
} from "antd";
import { DraggableArea } from "react-draggable-tags";
import Link from "next/link";

import styles from "./DirectSupportedCamps.module.scss";

import CustomSkelton from "../../../common/customSkelton";
import SupportRemovedModal from "../../../common/supportRemovedModal";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { setOpenDrawerForDirectSupportedCamp } from "src/store/slices/campDetailSlice";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import dynamic from "next/dynamic";
const DraggableTags = dynamic(() => import("./draggable"), { ssr: false });

export default function DirectSupportedCampsUI({
  removeCardSupportedCamps,
  handleSupportedCampsCancel,
  directSupportedCampsList,
  setDirectSupportedCampsList,
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
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState(null);
  const [reOrderedTags, setReOrderedTags] = useState(null);

  const { openDrawerForDirectSupportedCamp } = useSelector(
    (state: RootState) => ({
      openDrawerForDirectSupportedCamp:
        state.topicDetails.openDrawerForDirectSupportedCamp,
    })
  );
  const dispatch = useDispatch();
  interface Tag {
    id: number;
    camp_num: number;
    camp_name: string;
    camp_link: string;
    dis?: boolean;
    support_order: number;
  }

  interface RecordType {
    topic_num: number;
    title: string;
    title_link: string;
    camps: Tag[];
  }
  const columns = [
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",

      render: (text, record, index) => (
        <span className="bg-canGrey2 rounded-full h-5 w-6 flex items-center justify-center">
          {" "}
          {index + 1}
        </span>
      ),
    },
    {
      title: "Supported Topics",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: RecordType) => (
        <div className="flex gap-2.5 line-clamp-1">
          <Link href={record.title_link}>
            <a className="text-base font-semibold flex items-center gap-2.5 text-canBlack">
              {text}
            </a>
          </Link>
          <Image
            onClick={() => {
              dispatch(setOpenDrawerForDirectSupportedCamp(true));
              removeCardSupportedCamps(record);
            }}
            className="cursor-pointer"
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
          {/* <DraggableArea
            tags={camps}
            render={(props: { tag: Tag }) => {
              const { tag } = props;
              
              return (
                <>
                  <div
                    className={`tag ${tag.dis ? "tags_disable" : ""} ${
                      camps.length > 1 ? "mb-2.5" : ""
                    } flex items-center`}
                  >
                    <Button
                      id="campsBtn"
                      className="bg-canLightGrey rounded-full border-none flex items-center gap-2.5"
                      disabled={tag.dis}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = tag.camp_link;
                      }}
                    >
                      <div className={styles.btndiv}>
                        <span className="count">{tag.support_order}. </span>
                        <Link href={tag.camp_link}>
                          <a
                            className="text-sm text-canBlack font-semibold"
                            draggable="false"
                            onClick={(e) => e.preventDefault()} // Prevent default drag behavior
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
                          className="cursor-pointer"
                          src="/images/minus-user-icon.svg"
                          width={24}
                          height={24}
                          alt=""
                        />
                      </div>
                    </Button>
                  </div>
                  </>
              );
            }}
            onChange={(tags) => tagsOrder(record.topic_num, record, tags)}
            /> */}

          <DraggableTags
            tags={camps}
            record={record}
            updateTagsOrder={tagsOrder}
            setReOrderedTags={setReOrderedTags}
            onClose={() => {
              handleClose(reOrderedTags, record.topic_num, record, []);
              setValData(reOrderedTags);
              setRevertBack([]);
            }}
          />

          {showSaveChanges && idData === record.topic_num && (
            <div className="flex gap-2.5 mt-2">
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
                className="Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-6  flex gap-2.5 items-center bg-btnBg bg-opacity-10 text-canBlack text-base font-medium rounded-lg border-canBlue justify-center "
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
  ];

  const tagsOrder = (topic_num, data, tags) => {
    setTagsCampsOrderID(data.topic_num);
    setTagsDataArrValue(tags); // Update the state with the new order
    handleClose({}, topic_num, data, tags);
    setValData({});
    setIsChangingOrder(true);
  };

  useEffect(() => {
    if (tagsDataArrValue.length > 0) {
      const newData = directSupportedCampsList.map((val) => {
        if (val.topic_num === tagsCampsOrderID) {
          return { ...val, camps: tagsDataArrValue }; // Update camps with new order
        }
        return val;
      });
      setDirectSupportedCampsList(newData); // Update the list
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
  const hasDirectSupportedCamps =
    directSupportedCampsList && directSupportedCampsList.length > 0;
  const hasFilteredArray = filteredArray().length > 0;
  let displayContent;

  if (hasDirectSupportedCamps) {
    if (hasFilteredArray) {
      displayContent = (
        <Table
          dataSource={filteredArray()}
          columns={columns}
          pagination={false}
          rowKey="topic_num"
          className="[&_.ant-table-thead>tr>th]:!bg-canGray [&_.ant-table-cell]:max-w-[200px]"
        />
      );
    } else {
      displayContent = showEmpty("No Data Found");
    }
  } else {
    displayContent = showEmpty("No Data Found");
  }

  const drawerTitle = (
    <p id="all_camps_topics" className="lg:text-2xl text-base font-normal">
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
            <Link href={{ pathname: removeSupportCampsData.title_link }}>
              <a className="text-canGreen lg:text-2xl text-base font-semibold">
                {removeSupportCampsData.title}
              </a>
            </Link>
          ) : (
            removeCampLink?.map((val, index) => (
              <Link key={val.camp_num} href={{ pathname: val.camp_link }}>
                <a className="text-canGreen text-2xl font-semibold">
                  {(index ? ", " : "") + val.camp_name}
                </a>
              </Link>
            ))
          )}
        </span>
      )}
    </p>
  );

  // Extracted Content
  const drawerContent = (
    <>
      <p className="text-sm font-normal text-canRed mb-8">
        Note: You are about to remove your support from all the camps from the
        topic:
        <span className="text-sm font-semibold">
          &quot;{removeSupportCampsData.title}&quot;
        </span>
        . You can optionally add a helpful reason, along with a citation link.
      </p>
      <SupportRemovedModal
        onFinish={onRemoveFinish}
        handleCancel={handleSupportedCampsCancel}
        form={removeForm}
        isOrderChange={isChangingOrder}
      />
    </>
  );
  const [filteredArrayForMob, setFilteredArrayForMob] = useState([]);

  useEffect(() => {
    setFilteredArrayForMob(
      search.trim() === ""
        ? directSupportedCampsList
        : directSupportedCampsList.filter((val) =>
            val.title.toLowerCase().includes(search.toLowerCase().trim())
          )
    );
  }, [search, directSupportedCampsList]);

  let displayContentForMob;

  const hasDirectSupportedCampsForMob =
    directSupportedCampsList && directSupportedCampsList.length > 0;
  const hasFilteredArrayForMob = filteredArrayForMob.length > 0;

  if (hasDirectSupportedCampsForMob) {
    if (hasFilteredArrayForMob) {
      displayContentForMob = (
        <>
          {filteredArrayForMob.map((record) => (
            <Card key={record.topic_num} className="mb-5 bg-white shadow-none ">
              <div className=" !border !border-canGrey2  rounded-lg ">
                <div className="flex justify-start items-start flex-col gap-1 border-b border-canGrey2 p-5">
                  <span className="uppercase text-sm font-medium text-black text-opacity-85">
                    {" "}
                    Topic Name -
                  </span>
                  <div className="flex gap-2.5 justify-between items-center w-full">
                    <Link href={record.title_link}>
                      <a className="text-lg font-semibold text-canBlack">
                        {record.title}
                      </a>
                    </Link>
                    <Image
                      onClick={() => {
                        dispatch(setOpenDrawerForDirectSupportedCamp(true));
                        removeCardSupportedCamps(record);
                      }}
                      src="/images/minus-user-icon.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  </div>
                </div>
                <div className="p-5">
                  <span className="uppercase text-sm font-medium text-black text-opacity-85 mb-2 flex">
                    Supported Camps -
                  </span>
                  <DraggableArea<Tag>
                    tags={record.camps}
                    render={(props) => {
                      const { tag } = props;

                      return (
                        <div
                          className={`tag ${tag.dis ? "tags_disable" : ""} ${
                            record.camps.length > 1 ? "mb-2.5" : ""
                          } flex w-full items-center`}
                        >
                          <Button
                            id="campsBtn"
                            className="bg-canLightGrey rounded-full border-none flex items-center gap-2.5"
                            disabled={tag.dis}
                          >
                            <div className={styles.btndiv}>
                              <span className="count">{tag.id}. </span>
                              <Link href={tag.camp_link}>
                                <a
                                  className="text-sm text-canBlack font-semibold"
                                  draggable="false"
                                  onClick={(e) => e.preventDefault()}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      // Add your click handling logic here
                                    }
                                  }}
                                  onTouchStart={(e) => e.preventDefault()} // Optional: if you need to support touch events
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
                                setActiveTopic(record.topic_num);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleClose(
                                    tag,
                                    record.topic_num,
                                    record,
                                    []
                                  );
                                  setValData(tag);
                                  setRevertBack([]);
                                  setActiveTopic(record.topic_num);
                                }
                              }}
                              onTouchStart={(e) => e.preventDefault()}
                            >
                              <Image
                                className="cursor-pointer"
                                src="/images/minus-user-icon.svg"
                                width={24}
                                height={24}
                                alt=""
                              />
                            </div>
                          </Button>
                        </div>
                      );
                    }}
                    onChange={(tags) => {
                      tagsOrder(record.topic_num, record, tags);
                      setShowSaveChanges(true);
                      setActiveTopic(record.topic_num);
                    }}
                  />
                </div>
                {showSaveChanges && activeTopic == record.topic_num && (
                  <div className="flex gap-2.5 px-5 pb-5 ">
                    <Button
                      id="saveChangeBtn"
                      className="bg-canBlue text-white text-base font-medium rounded-lg py-2.5 px-6 flex items-center focus:!bg-canBlue
                      focus:!text-canBlack"
                      onClick={() => {
                        handleSupportedCampsOpen(record);
                        dispatch(setOpenDrawerForDirectSupportedCamp(true));
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      id="revertBtn"
                      className="bg-btnBg bg-opacity-10 text-canBlack text-base font-medium rounded-lg py-2.5 px-6 flex items-center"
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
            </Card>
          ))}

          <Pagination
            hideOnSinglePage={true}
            total={directSupportedCampsList.length}
            pageSize={5}
            current={currentPage}
            onChange={pageChange}
            showSizeChanger={false}
            className="mt-5"
          />
        </>
      );
    } else {
      displayContent = <Empty description="No Data Found" />;
    }
  } else {
    displayContent = <Empty description="No Data Found" />;
  }
  const isMobile = window.matchMedia("(min-width: 1280px)").matches;

  return (
    <div>
      <div className="lg:flex hidden w-full">
        <div data-testid="directSupportUi" className="w-full">
          {directSkeletonIndicator ? (
            <CustomSkelton
              skeltonFor="subscription_card"
              bodyCount={4}
              stylingClass=""
              isButton={false}
            />
          ) : (
            <div>
              <div className="flex lg:flex-row flex-col justify-between items-start mb-5 lg:gap-0 gap-2.5">
                <div className="w-full flex-1">
                  <h3 className="text-base uppercase font-semibold text-canBlack mb-5">
                    DIRECT SUPPORTED CAMPS
                  </h3>
                  <p className="text-sm font-normal text-canRed">
                    Note : To change support order of camp, drag & drop the camp
                    box on your choice position.
                  </p>
                </div>

                <div className="lg:w-auto w-full flex justify-end gap-2.5 items-center">
                  <PrimaryButton
                    onClick={() => {
                      setSearch("");
                    }}
                  >
                    Reset
                  </PrimaryButton>
                  <Input
                    suffix={
                      <Image
                        src="/images/search-icon.svg"
                        width={20}
                        height={20}
                        alt=""
                      />
                    }
                    data-testid="settingSearch"
                    value={search}
                    placeholder="Search via topic name"
                    type="text"
                    name="search"
                    className="!h-10 rounded-lg border border-canGrey2 text-base font-normal lg:w-auto w-full [&_.ant-input-affix-wrapper]:hover:!border-canGrey2 focus:!border-canGrey2 focus:shadow-none "
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
              </div>
              {isMobile && (
                <>
                  {displayContent}
                  {search.length === 0 && (
                    <Pagination
                      hideOnSinglePage={true}
                      total={directSupportedCampsList.length}
                      pageSize={5}
                      defaultCurrent={currentPage}
                      onChange={pageChange}
                      showSizeChanger={false}
                      className="mt-5"
                    />
                  )}
                </>
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
            className="lg:flex hidden [&_.ant-drawer-header-title]:!items-start [&_.ant-drawer-close]:!mt-2 [&_.ant-drawer-body]:!p-14 "
            open={openDrawerForDirectSupportedCamp}
            closeIcon={
              <Image
                className="mt-1"
                onClick={() =>
                  dispatch(setOpenDrawerForDirectSupportedCamp(false))
                }
                src="/images/refine-back-arrow.svg"
                width={16}
                height={18}
                alt=""
              />
            }
            width={730}
            title={drawerTitle}
          >
            {drawerContent}
          </Drawer>

          <Drawer
            className="lg:hidden flex [&_.ant-drawer-header-title]:!items-start [&_.ant-drawer-close]:!mt-2 "
            open={openDrawerForDirectSupportedCamp}
            closeIcon={
              <Image
                onClick={() =>
                  dispatch(setOpenDrawerForDirectSupportedCamp(false))
                }
                src="/images/refine-back-arrow.svg"
                width={16}
                height={24}
                alt=""
              />
            }
            width={320}
            title={drawerTitle}
          >
            {drawerContent}
          </Drawer>
        </div>
      </div>

      {!isMobile && (
        <div className="lg:hidden flex flex-col">{displayContentForMob}</div>
      )}
    </div>
  );
}
