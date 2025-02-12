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
import dynamic from "next/dynamic";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import styles from "./DirectSupportedCamps.module.scss";

import CustomSkelton from "../../../common/customSkelton";
import SupportRemovedModal from "../../../common/supportRemovedModal";
import { RootState } from "src/store";
import {
  setDisableSubmitButtonForDirectSupportedCamp,
  setOpenDrawerForDirectSupportedCamp,
} from "src/store/slices/campDetailSlice";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

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
  page,
  perPage,
  total,
  setPage,
  searchText,
  setSearchText,
}) {
  const [valData, setValData] = useState({});
  const [tagsDataArrValue, setTagsDataArrValue] = useState([]);
  const [tagsCampsOrderID, setTagsCampsOrderID] = useState("");
  const [displayList, setDisplayList] = useState([]);
  const [removeSupportSpinner, setRemoveSupportSpinner] = useState(false);
  const [currentCamp, setCurrentCamp] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [reOrderedTags, setReOrderedTags] = useState(null);

  const {
    openDrawerForDirectSupportedCamp,
    disableSubmitButtonForDirectSupportedCamp,
  } = useSelector((state: RootState) => ({
    openDrawerForDirectSupportedCamp:
      state.topicDetails.openDrawerForDirectSupportedCamp,
    disableSubmitButtonForDirectSupportedCamp:
      state.topicDetails.disableSubmitButtonForDirectSupportedCamp,
  }));

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
  const textMaxLimit = 30;
  const columns = [
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      render: (_, _d, idx) => {
        return (
          <span className="text-sm" id="direct_supported_camp_serial_number">
            {(page - 1) * perPage + idx + 1}
          </span>
        );
      },
    },
    {
      title: "Topics",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: RecordType) => (
        <div
          className="flex gap-2.5 line-clamp-1 cn-card-home"
          id="direct_supported_camp_title_link"
        >
          <Link href={record.title_link}>
            <a
              id="direct_supported_camp_link"
              className="text-sm font-medium flex items-center gap-2.5 text-canBlack"
              role="button" // Declare it as a button
              tabIndex={0} // Make it focusable with the Tab key
              onClick={() => {
                dispatch(
                  setFilterCanonizedTopics({
                    asofdate: Date.now() / 1000,
                    asof: "default",
                  })
                );
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault(); // Prevent scrolling when Space is pressed
                  dispatch(
                    setFilterCanonizedTopics({
                      asofdate: Date.now() / 1000,
                      asof: "default",
                    })
                  );
                }
              }}
              style={{ cursor: "pointer" }} // Provide visual feedback
            >
              {text.length > textMaxLimit
                ? text.substring(0, textMaxLimit) + "..."
                : text}
            </a>
          </Link>
          <Image
            id="direct_supported_camp_minus_img"
            onClick={() => {
              dispatch(setOpenDrawerForDirectSupportedCamp(true));
              removeCardSupportedCamps(record);
              dispatch(setDisableSubmitButtonForDirectSupportedCamp(false));
            }}
            className="cursor-pointer"
            src="/images/minus-user-icon.svg"
            width={20}
            height={20}
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
        <div id="direct_supported_camp_draggable_tags">
          <DraggableTags
            tags={camps}
            record={record}
            updateTagsOrder={tagsOrder}
            setReOrderedTags={setReOrderedTags}
            onClose={(tag) => {
              handleClose(tag, record.topic_num, record, []);
              setValData(tag);
              setRevertBack([]);
            }}
          />

          {showSaveChanges && idData === record.topic_num && (
            <div
              className="flex gap-2.5 mt-2"
              id="direct_supported_camp_save_change_btn"
            >
              <Button
                data-testid="save_change_btn"
                id="saveChangeBtn"
                className=" Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-6 hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-canBlue text-white text-base font-medium rounded-lg border-none justify-center focus:bg-canBlue focus:!text-white"
                onClick={() => {
                  setCurrentCamp(record.topic_num);
                  handleSupportedCampsOpen(record);
                  pageChange(page);
                  dispatch(setOpenDrawerForDirectSupportedCamp(true));
                  dispatch(setDisableSubmitButtonForDirectSupportedCamp(false));
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

  useEffect(() => {
    if (directSupportedCampsList) setDisplayList(directSupportedCampsList);
  }, [directSupportedCampsList]);

  const pageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const searchPageChange = (pageNumber) => {
    setPage(pageNumber);
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

  const displayContent =
    displayList.length > 0 ? (
      <>
        <Table
          id="direct_supported_camp_table_section"
          dataSource={displayList}
          columns={columns}
          pagination={false}
          rowKey="topic_num"
          className="[&_.ant-table-thead>tr>th]:!bg-canGray [&_.ant-table-cell]:max-w-[200px]"
        />
        {total > perPage ? (
          <Pagination
            hideOnSinglePage={true}
            total={total}
            pageSize={perPage}
            current={page}
            onChange={searchPageChange}
            showSizeChanger={false}
            className="mt-5"
          />
        ) : null}
      </>
    ) : (
      showEmpty("No Data Found")
    );

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
        <span id="direct_supported_camp_removeSupportCampsData_title_link">
          {modalPopupText ? (
            <Link href={{ pathname: removeSupportCampsData.title_link }}>
              <a className="text-canGreen lg:text-2xl text-base font-semibold">
                {removeSupportCampsData?.title?.length > textMaxLimit
                  ? removeSupportCampsData?.title?.substring(0, textMaxLimit) +
                    "..."
                  : removeSupportCampsData?.title}
              </a>
            </Link>
          ) : (
            removeCampLink?.map((val, index) => (
              <Link key={val?.camp_num} href={{ pathname: val?.camp_link }}>
                <a className="text-canGreen text-2xl font-semibold">
                  {(index ? ", " : "") +
                    (val.camp_name?.length > textMaxLimit
                      ? val?.camp_name.substring(0, textMaxLimit) + "..."
                      : val?.camp_name)}
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
      <p
        className="text-sm font-normal text-canRed mb-8"
        id="direct_supported_camp_change_order_text"
      >
        {isChangingOrder ? (
          "Note: You are about to change the order of your supported camps"
        ) : modalPopupText ? (
          <>
            Note: You are about to remove your support from all the camps from
            the topic:
            <span
              className="text-sm font-semibold"
              id="direct_supported_camp_removeSupportCampsData_title"
            >
              &quot;
              {removeSupportCampsData.title.length > textMaxLimit
                ? removeSupportCampsData.title.substring(0, textMaxLimit) +
                  "..."
                : removeSupportCampsData.title}
              &quot;
            </span>
            . You can optionally add a helpful reason, along with a citation
            link.
          </>
        ) : campIds?.length > 1 ? (
          "You are about to remove your support from the camps: "
        ) : (
          "You are about to remove your support from the camp: "
        )}
      </p>

      <SupportRemovedModal
        onFinish={onRemoveFinish}
        handleCancel={handleSupportedCampsCancel}
        form={removeForm}
        isOrderChange={isChangingOrder}
      />
    </>
  );

  let displayContentForMob;

  const hasDirectSupportedCampsForMob = displayList.length > 0;
  const hasFilteredArrayForMob = displayList.length > 0;

  if (hasDirectSupportedCampsForMob) {
    displayContentForMob = (
      <>
        {/* Search and Reset Section */}
        <div
          className="w-full flex justify-end mb-5"
          id="direct_supported_camp_reset_btn"
        >
          <div className="mr-2" id="direct_supported_camp_reset_btn_1">
            <PrimaryButton
              onClick={() => {
                setSearchText("");
                setPage(1);
              }}
            >
              Reset
            </PrimaryButton>
          </div>
          <Input
            id="direct_supported_camp_search_icon"
            suffix={
              <Image
                src="/images/search-icon.svg"
                width={15}
                height={15}
                alt=""
              />
            }
            data-testid="settingSearch"
            value={searchText}
            placeholder="Search via topic name"
            type="text"
            name="search"
            className="!h-10 rounded-lg border border-canGrey2 text-sm font-normal lg:w-auto w-full [&_.ant-input-affix-wrapper]:hover:!border-canGrey2 focus:!border-canGrey2 focus:shadow-none "
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Check if there is data to display */}
        {hasFilteredArrayForMob ? (
          <>
            {displayList.map((record) => (
              <Card
                key={record.topic_num}
                className="mb-5 bg-white shadow-none"
                id="direct_supported_camp_card_section"
              >
                <div
                  className="!border !border-canGrey2 rounded-lg"
                  id="direct_supported_camp_card_section_1"
                >
                  <div
                    className="flex justify-start items-start flex-col gap-1 border-b border-canGrey2 p-5"
                    id="direct_supported_camp_card_section_2"
                  >
                    <span
                      className="uppercase text-sm font-medium text-black text-opacity-85"
                      id="direct_supported_camp_card_section_heading"
                    >
                      Topic Name -
                    </span>
                    <div
                      className="flex gap-2.5 justify-between items-center w-full"
                      id="direct_supported_camp__title_link_mob"
                    >
                      <Link href={record.title_link}>
                        <a
                          id="direct_supported_camp_link_mob"
                          className="text-lg font-semibold text-canBlack"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault(); // Prevent scrolling when Space is pressed
                              dispatch(
                                setFilterCanonizedTopics({
                                  asofdate: Date.now() / 1000,
                                  asof: "default",
                                })
                              );
                            }
                          }}
                          style={{ cursor: "pointer" }} // Provide visual feedback
                          onClick={() => {
                            dispatch(
                              setFilterCanonizedTopics({
                                asofdate: Date.now() / 1000,
                                asof: "default",
                              })
                            );
                          }}
                        >
                          {record.title.length > textMaxLimit
                            ? record.title.substring(0, textMaxLimit) + "..."
                            : record.title}
                        </a>
                      </Link>
                      <Image
                        id="direct_supported_camp_minus_img_mob"
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
                  <div
                    className="p-5"
                    id="direct_supported_camp_supported_camps_mob"
                  >
                    <span className="uppercase text-sm font-medium text-black text-opacity-85 mb-2 flex">
                      Supported Camps -
                    </span>
                    <DraggableTags
                      tags={record?.camps}
                      record={record}
                      updateTagsOrder={tagsOrder}
                      setReOrderedTags={setReOrderedTags}
                      setActiveTopic={(record) => {
                        setActiveTopic(record.topic_num);
                      }}
                      onClose={(tag) => {
                        handleClose(tag, record.topic_num, record, []);
                        setValData(tag);
                        setRevertBack([]);
                        setActiveTopic(record.topic_num);
                      }}
                    />
                  </div>
                  {showSaveChanges && activeTopic === record.topic_num && (
                    <div
                      className="flex gap-2.5 px-5 pb-5"
                      id="direct_supported_camp_draggable_area_btn_mob_section"
                    >
                      <Button
                        id="saveChangeBtnmob"
                        className="bg-canBlue text-white text-base font-medium rounded-lg py-2.5 px-6 flex items-center focus:!bg-canBlue
                      focus:!text-canBlack"
                        onClick={() => {
                          setCurrentCamp(record.topic_num);
                          handleSupportedCampsOpen(record);
                          pageChange(page);
                          dispatch(setOpenDrawerForDirectSupportedCamp(true));
                          dispatch(
                            setDisableSubmitButtonForDirectSupportedCamp(false)
                          );
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        id="revertBtnmob"
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
              total={total}
              pageSize={perPage}
              current={page}
              onChange={pageChange}
              showSizeChanger={false}
              className="mt-5"
            />
          </>
        ) : (
          <Empty description="No Data Found" />
        )}
      </>
    );
  } else {
    displayContentForMob = <Empty description="No Data Found" />;
  }

  const isMobile = window.matchMedia("(min-width: 1280px)").matches;

  return (
    <div>
      <div
        className="lg:flex hidden w-full"
        id="direct_supported_camp_loader_section"
      >
        <div
          data-testid="directSupportUi"
          className="w-full"
          id="direct_supported_camp_loader_section_1"
        >
          {directSkeletonIndicator ? (
            <CustomSkelton
              id="direct_supported_camp_loader"
              skeltonFor="subscription_card"
              bodyCount={4}
              stylingClass=""
              isButton={false}
            />
          ) : (
            <div id="direct_supported_camp_upper_heading_title">
              <div
                className="flex lg:flex-row flex-col justify-between items-start mb-5 lg:gap-0 gap-2.5"
                id="direct_supported_camp_upper_heading_title_1"
              >
                <div
                  className="w-full flex-1"
                  id="direct_supported_camp_upper_heading_title_2"
                >
                  <h3
                    className="text-sm uppercase font-medium text-canBlack mb-5"
                    id="direct_supported_camp_upper_title"
                  >
                    DIRECT SUPPORTED CAMPS
                  </h3>
                  <p
                    className="text-sm font-normal text-canRed"
                    id="direct_supported_camp_upper_heading_note"
                  >
                    Note : To change support order of camp, drag & drop the camp
                    box on your choice position.
                  </p>
                </div>

                <div
                  className="lg:w-auto w-full flex justify-end gap-2.5 items-center"
                  id="direct_supported_camp_search_rest_btn"
                >
                  <PrimaryButton
                    onClick={() => {
                      setSearchText("");
                      setPage(1);
                    }}
                  >
                    Reset
                  </PrimaryButton>
                  <Input
                    id="direct_supported_camp_search_input"
                    suffix={
                      <Image
                        src="/images/search-icon.svg"
                        width={15}
                        height={15}
                        alt=""
                      />
                    }
                    data-testid="settingSearch"
                    value={searchText}
                    placeholder="Search via topic name"
                    type="text"
                    name="search"
                    className="!h-10 rounded-lg border border-canGrey2 text-sm font-normal lg:w-auto w-full [&_.ant-input-affix-wrapper]:hover:!border-canGrey2 focus:!border-canGrey2 focus:shadow-none "
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>
              {isMobile && displayContent}
            </div>
          )}

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
        <div className="lg:hidden flex flex-col">
          {directSkeletonIndicator ? (
            <CustomSkelton
              id="direct_supported_camp_loader"
              skeltonFor="subscription_card"
              bodyCount={4}
              isButton={false}
            />
          ) : (
            displayContentForMob
          )}
        </div>
      )}
    </div>
  );
}
