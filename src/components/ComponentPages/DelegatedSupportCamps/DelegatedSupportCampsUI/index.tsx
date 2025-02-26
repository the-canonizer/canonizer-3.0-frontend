import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  Modal,
  Button,
  Form,
  Pagination,
  Empty,
  Card,
  Row,
  Col,
  Input,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import styles from "./DelegatedSupportedCamps.module.scss";
import messages from "../../../../messages";
import CustomSkelton from "src/components/common/customSkelton";
import Image from "next/image";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

export default function DelegatedSupportCampsUI({
  removeCardDelegatedSupportedCamps,
  handleSupportedCampsCancel,
  isRemoveSupportModalVisible,
  handelViewMoreModalCancel,
  showViewMoreModal,
  viewMoreDataValue,
  viewMoreModalVisible,
  delegatedSupportCampsList,
  removeSupport,
  removeSupportCampsData,
  delegateSupportedSkeleton,
  page,
  perPage,
  total,
  setPage,
  searchText,
  setSearchText,
}: any) {
  const [displayList, setDisplayList] = useState([]);
  const limit = delegatedSupportCampsList?.length;
  console.log(viewMoreModalVisible, "viewMoreModalVisible");

  useEffect(() => {
    if (delegatedSupportCampsList) setDisplayList(delegatedSupportCampsList);
  }, [delegatedSupportCampsList]);

  const pageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const searchPageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const renderResetButton = (isMobile = false) => (
    <PrimaryButton
      onClick={() => {
        setSearchText("");
        setPage(1);
      }}
      id={
        isMobile
          ? "delagate_supported_camp_mob_btn_reset"
          : "delegated_supported_camp_reset_btn"
      }
    >
      Reset
    </PrimaryButton>
  );

  const renderSearchInput = (isMobile = false) => (
    <Input
      id={
        isMobile
          ? "delagate_supported_camp_mob_search_input"
          : "delegated_supported_camp_search_input"
      }
      suffix={
        <Image src="/images/search-icon.svg" width={15} height={15} alt="" />
      }
      data-testid="settingSearch"
      value={searchText}
      placeholder="Search via topic name"
      type="text"
      name="search"
      className={`!h-10 rounded-lg border border-canGrey2 text-sm font-normal ${
        isMobile ? "lg:w-auto w-full" : "w-full"
      }`}
      onChange={(e) => {
        setSearchText(e.target.value);
        setPage(1);
      }}
    />
  );

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
      render: (text, record) => (
        <div className="max-w-[300px] cn-card-home">
          <Link href={record.title_link}>
            <a
              className="text-sm font-medium text-canBlack"
              id="delegated_supported_columns_title_link"
            >
              {text.length > 30 ? text.substring(0, 20) + "..." : text}
            </a>
          </Link>
        </div>
      ),
    },
    {
      title: "Supported Camps",
      dataIndex: "camps",
      key: "camps",
      render: (camps, _record) =>
        camps?.map((camp, i) => (
          <p
            id="delegated_supported_columns_camp_name"
            key={camp.camp_num}
            className="max-w-[250px] w-full line-clamp-3 break-words gap-1 flex items-center justify-start"
          >
            {camp.support_order}.{" "}
            <Link
              href={camp.camp_link}
              id="delegated_supported_columns_camp_link"
            >
              <a
                className="text-sm font-medium text-canBlue underline"
                id="delegated_supported_columns_link"
              >
                {camp.camp_name.length > 30
                  ? camp.camp_name.substring(0, 20) + "..."
                  : camp.camp_name}
              </a>
            </Link>
          </p>
        )),
    },
    {
      title: "Delegated To",
      dataIndex: "delegated_to_nick_name",
      key: "delegated_to_nick_name",
      render: (text, record) => (
        <Link
          href={record.delegated_to_nick_name_link}
          id="delegated_supported_columns_nickname_link"
        >
          <a
            className="text-sm font-medium text-canBlue underline"
            id="delegated_supported_columns_nickname_link_1"
          >
            {text}
          </a>
        </Link>
      ),
    },
    {
      title: "Nickname",
      dataIndex: "my_nick_name",
      key: "my_nick_name",
      render: (text, record) => (
        <Link
          href={record.my_nick_name_link}
          id="delegated_supported_columns_my_nickname_link"
        >
          <a
            className="text-sm font-medium text-canBlue underline"
            id="delegated_supported_columns_my_nickname_link_1"
          >
            {text}
          </a>
        </Link>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_text, record) => (
        <Button
          id="delegated_supported_columns_minus_btn"
          type="link"
          onClick={() => removeCardDelegatedSupportedCamps(record)}
        >
          <Image
            id="delegated_supported_columns_minus_img"
            src="/images/minus-user-icon.svg"
            alt=""
            width={20}
            height={20}
          />
        </Button>
      ),
    },
  ];
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };

  function CardTitle(props: any) {
    return (
      <div className="flex flex-col">
        <span
          className="uppercase text-sm font-medium mb-1"
          id="delegated_supported_card_title_for_topic"
        >
          {messages.labels.fortopic} -
        </span>
        <span id="delegated_supported_card_title_for_topic_prop_value">
          <Link
            href={props.title_link}
            id="delegated_supported_card_title_for_topic_prop_value_link"
          >
            <a className="text-sm font-medium">{props.value}</a>
          </Link>
        </span>
      </div>
    );
  }

  function CurrentSupportedCamps(props: any) {
    return (
      <p>
        <span>{props.id_data}</span>
        <Link href={props.camp_link}>
          <a className="text-canBlue text-sm font-medium">{props.value}</a>
        </Link>
      </p>
    );
  }

  function SupportedCampsTo(props: any) {
    return (
      <div className="">
        <p className="border-b py-3 flex flex-col">
          <span className="uppercase text-sm font-medium">Delegated To:</span>
          <Link href={props.supportedto_link}>
            <a className="text-canBlue text-sm font-medium">
              {props.supportedto}
            </a>
          </Link>
        </p>
        <p className="border-b py-3 flex flex-col">
          <b className="uppercase text-sm font-medium">Nickname:</b>
          <Link href={props.NickNameLink}>
            <a className="text-canBlue text-sm font-medium">{props.NickName}</a>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="hidden lg:flex w-full [&_#delegated_supported_camp_loader_section>div]:!w-full"
        id="delegated_supported_camp_loader_section"
      >
        {delegateSupportedSkeleton ? (
          <div className="w-full">
            <CustomSkelton
              id="delegated_supported_camp_loader"
              skeltonFor="delegateSupportedCampListCard"
              bodyCount={4}
              stylingClass=""
              isButton={false}
            />
          </div>
        ) : (
          <div className="w-full" id="delegated_supported_camp_upper_heading_1">
            <div
              className="flex lg:flex-row flex-col justify-between items-center mb-5 lg:gap-0 gap-2.5"
              id="delegated_supported_camp_upper_heading_2"
            >
              <div
                className="w-full"
                id="delegated_supported_camp_upper_heading_3"
              >
                <h3
                  className="text-sm font-medium text-canBlack"
                  id="delegated_supported_camp_upper_heading_text"
                >
                  DELEGATED SUPPORTED CAMPS
                </h3>
              </div>
              <div
                className="w-full flex justify-end gap-2.5 items-center"
                id="delegated_supported_camp_reset_btn"
              >
                {renderResetButton()}
                {renderSearchInput()}
              </div>
            </div>

            {displayList && displayList.length > 0 ? (
              <>
                <Table
                  columns={columns}
                  dataSource={displayList}
                  pagination={false}
                  rowKey={(record) => record.title}
                  scroll={{ x: "1060" }}
                  className="[&_.ant-table-thead>tr>th]:!bg-canGray [&_.ant-table-cell:nth-child(3)]:before:!hidden [&_.ant-table-cell:nth-child(3)]:!border-l  [&_.ant-table-cell:nth-child(3)]:!border-black [&_.ant-table-cell:nth-child(3)]:!border-opacity-5  [&_.ant-table-cell:nth-child(4)]:!border-l  [&_.ant-table-cell:nth-child(4)]:!border-black [&_.ant-table-cell:nth-child(4)]:!border-opacity-5 [&_.ant-table-cell:nth-child(4)]:before:!hidden [&_.ant-table-cell:nth-child(5)]:before:!hidden 
                [&_.ant-table-cell:nth-child(2)]:before:!hidden 
                 [&_.ant-table-cell:nth-child(5)]:!border-l  [&_.ant-table-cell:nth-child(5)]:!border-black [&_.ant-table-cell:nth-child(5)]:!border-opacity-5  [&_.ant-table-thead>tr>th:nth-child(5)]:!border-l-0 [&_.ant-table-thead>tr>th:nth-child(6)]:!border-l-0"
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
              <Empty description="No Data Found" />
            )}
          </div>
        )}
        <Modal
          className="[&_.ant-modal-content]:!rounded-xl [&_.ant-modal-header]:rounded-tl-xl [&_.ant-modal-header]:rounded-tr-xl"
          title={<span className="text-lg font-medium">Remove Support</span>}
          open={isRemoveSupportModalVisible}
          onOk={handleSupportedCampsCancel}
          onCancel={handleSupportedCampsCancel}
          footer={null}
          closeIcon={<CloseCircleOutlined />}
        >
          <Form id="delegated_supported_camp_form_section">
            <Form.Item
              style={{ marginBottom: "0px" }}
              id="form_for_deleagted_supported_camp"
            >
              <p
                id="remove_confirmation"
                className="text-sm text-canBlack font-normal"
              >
                Are you sure, you want to remove your delegate support given to{" "}
                <span>
                  &quot;
                  <Link
                    id="delegated_supported_form_delegated_to_nick_name_link"
                    href={removeSupportCampsData.delegated_to_nick_name_link}
                  >
                    <a
                      className={styles.Bluecolor}
                      id="delegated_supported_form_delegated_to_nick_name_link_1"
                    >
                      {removeSupportCampsData.delegated_to_nick_name}
                    </a>
                  </Link>
                  &quot;
                </span>{" "}
                under the topic{" "}
                <span
                  className={styles.Bluecolor}
                  id="delegated_supported_form_title_blue_clr"
                >
                  &quot;
                  <Link
                    href={removeSupportCampsData.title_link}
                    id="delegated_supported_form_title_blue_clr_link"
                  >
                    <a id="delegated_supported_form_title_blue_clr_1">
                      {removeSupportCampsData.title}
                    </a>
                  </Link>
                  &quot;
                </span>{" "}
                ?
              </p>
            </Form.Item>
            <Form.Item className="" id="form_for_delegate_btn_section">
              <div
                className="flex gap-4 justify-center items-center mt-10"
                id="form_for_delegate_btn_section_1"
              >
                <Button
                  id="cancelBtn"
                  onClick={handleSupportedCampsCancel}
                  type="default"
                  className="Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-12 hover:text-canBlack flex gap-2.5 items-center bg-btnBg bg-opacity-10 text-canBlack text-base font-medium rounded-lg border-canBlue justify-center w-[11.25rem] hover:bg- hover:!border-canBlue hover:bg-btnBg hover:bg-opacity-10"
                >
                  Cancel
                  <Image
                    src="/images/cross-dark.svg"
                    width={16}
                    height={16}
                    alt="no image"
                  />
                </Button>
                <Button
                  id="removeBtn"
                  onClick={removeSupport}
                  type="primary"
                  className=" Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-6 hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-canBlue text-white text-base font-medium rounded-lg border-none justify-center w-[11.25rem]"
                >
                  Remove
                </Button>
              </div>
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
              For Topic{" "}
              <span
                className={styles.Bluecolor}
                id="delagate_supported_camp_modal_title"
              >
                &quot;{" "}
                <Link
                  href={viewMoreDataValue.title_link}
                  id="delagate_supported_camp_modal_title_link"
                >
                  <a id="delagate_supported_camp_modal_title_link_1">
                    {viewMoreDataValue.title}
                  </a>
                </Link>{" "}
                &quot;
              </span>{" "}
            </h3>
            <div
              className={styles.topic_content}
              id="delagate_supported_camp_modal_count"
            >
              <p id="delagate_supported_camp_modal_count_text">
                {messages.labels.supportdelegatedto}{" "}
                <Link
                  href={viewMoreDataValue.delegated_to_nick_name_link}
                  id="delagate_supported_camp_modal_delegated_to_nick_name_link"
                >
                  <a
                    id="delagate_supported_camp_modal_delegated_to_nick_name_link_1"
                    className={styles.Bluecolor}
                  >
                    {viewMoreDataValue.delegated_to_nick_name}
                  </a>
                </Link>
              </p>
              <p id="delagate_supported_camp_modal_my_nick_name_text">
                {messages.labels.nickname}{" "}
                <Link
                  href={viewMoreDataValue.my_nick_name_link}
                  id="delagate_supported_camp_modal_my_nick_name_text_link"
                >
                  <a
                    className={styles.Bluecolor}
                    id="delagate_supported_camp_modal_my_nick_name_text_link_1"
                  >
                    {viewMoreDataValue.my_nick_name}
                  </a>
                </Link>
              </p>
            </div>
            <h3 id="ListOfCurrentSupportedCamps" className={styles.marginTop}>
              List of current supported camps
            </h3>
            <div
              className={styles.list_Content}
              id="delagate_supported_camp_modal_list_content"
            >
              {viewMoreDataValue.camps?.map((val, i) => {
                return (
                  <p
                    key={val.camp_num}
                    id="delagate_supported_camp_modal_list_content_camp_num"
                  >
                    {val.support_order}.{" "}
                    <Link
                      href={val.camp_link}
                      id="delagate_supported_camp_modal_list_content_camp_num_link"
                    >
                      <a
                        className={styles.Bluecolor}
                        id="delagate_supported_camp_modal_list_content_camp_num_link_1"
                      >
                        {val.camp_name}
                      </a>
                    </Link>
                  </p>
                );
              })}
            </div>
          </>
        </Modal>
      </div>

      {/* Mobile Device */}
      <div
        className="lg:hidden flex w-full [&_.ant-typography]:!m-0 [&_.ant-card-head-wrapper]:!gap-2"
        id="delagate_supported_camp_mob_btn_section"
      >
        {delegateSupportedSkeleton ? (
          <div className="w-full">
            <CustomSkelton
              id="delagate_supported_camp_loader"
              skeltonFor="delegateSupportedCampListCard"
              bodyCount={4}
              stylingClass=""
              isButton={false}
            />
          </div>
        ) : (
          <div
            className="w-full"
            id="delagate_supported_camp_mob_btn_section_1"
          >
            <div
              className="w-full flex justify-end mb-5"
              id="delagate_supported_camp_mob_btn_section_2"
            >
              <div
                className="mr-2"
                id="delagate_supported_camp_mob_btn_section_reset"
              >
                {renderResetButton(true)}
              </div>
              {renderSearchInput(true)}
            </div>
            {displayList && displayList.length > 0
              ? displayList.map((data, i) => (
                  <div
                    id="delagate_supported_camp_mob_card_section"
                    key={data.topic_num}
                    className="!border !border-canGrey2 rounded-lg mb-5 last:mb-0 px-2.5"
                  >
                    <Card
                      id="delagate_supported_camp_mob_card"
                      className="[&_.ant-card-head]:!px-0 [&_.ant-card-head]:!bg-transparent !w-full [&_.ant-card-head]:!border-none"
                      type="inner"
                      size="default"
                      title={
                        <CardTitle
                          id="delagate_supported_camp_mob_card_title"
                          title_link={data.title_link}
                          value={
                            data.title.length > 50
                              ? data.title.substring(0, 50) + "..."
                              : data.title
                          }
                        />
                      }
                      style={{ width: 360, marginBottom: 16 }}
                    >
                      <div id="delagate_supported_camp_mob_camp_section">
                        <Row id="delagate_supported_camp_mob_camp_section_row">
                          <Col
                            span={24}
                            id="delagate_supported_camp_mob_camp_section_col"
                          >
                            <div
                              className="border-y py-3"
                              id="delagate_supported_camp_mob_camp_section_currentSupportedCamps"
                            >
                              <span
                                id="currentSupportedCamp"
                                className="uppercase text-sm font-medium text-canBlack"
                              >
                                {messages.labels.currentSupportedCamps}
                              </span>
                              {data.camps?.slice(0, limit).map((val, i) => (
                                <CurrentSupportedCamps
                                  key={i}
                                  value={
                                    val.camp_name.length > 30
                                      ? val.camp_name.substring(0, 30) + "..."
                                      : val.camp_name
                                  }
                                  id_data={val.support_order + "."}
                                  camp_link={val.camp_link}
                                />
                              ))}
                            </div>
                            {data.camps.length > limit && (
                              <a
                                id="delagate_supported_camp_mob_camp_view_more"
                                className={styles.mrgn_left}
                                onClick={(e) => showViewMoreModal(e, data)}
                              >
                                {messages.labels.viewMore}
                              </a>
                            )}
                          </Col>
                          <Col
                            span={24}
                            id="delagate_supported_camp_mob_col_SupportedCampsTo"
                          >
                            <SupportedCampsTo
                              supportedto={data.delegated_to_nick_name}
                              supportedto_link={
                                data.delegated_to_nick_name_link
                              }
                              NickName={data.my_nick_name}
                              NickNameLink={data.my_nick_name_link}
                            />
                          </Col>
                        </Row>
                      </div>
                      <Button
                        id="delagate_supported_camp_mob_remove_btn"
                        className="bg-btnBg bg-opacity-10 rounded-lg py-2.5  w-full mt-5 flex items-center justify-center gap-2.5 text-base font-medium"
                        onClick={() => removeCardDelegatedSupportedCamps(data)}
                      >
                        Remove Support
                        <Image
                          id="delagate_supported_camp_mob_remove_img"
                          src="/images/minus-user-icon.svg"
                          alt=""
                          width={24}
                          height={24}
                        />
                      </Button>
                    </Card>
                  </div>
                ))
              : showEmpty("No Data Found")}
            <Pagination
              hideOnSinglePage={true}
              total={total}
              pageSize={perPage}
              current={page}
              onChange={pageChange}
              showSizeChanger={false}
              className="mt-5"
            />
          </div>
        )}
      </div>
    </div>
  );
}
