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
  // search,
  removeSupport,
  removeSupportCampsData,
  delegateSupportedSkeleton,
}: any) {
  const [displayList, setDisplayList] = useState([]);
  const limit = delegatedSupportCampsList.length;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    pageChange(1, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegatedSupportCampsList]);

  const pageChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setDisplayList(
      delegatedSupportCampsList?.slice(startingPosition, endingPosition)
    );
  };
  const pageSize = 5;
  const columns = [
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      render: (_text, _record, index) => (
        <span className="text-sm bg-canGrey2 rounded-full h-5 w-6 flex items-center justify-center">
          {/* Calculate Sr. based on the current page */}
          {index + 1 + (currentPage - 1) * pageSize}
        </span>
      ),
    },
    {
      title: "Topics",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="line-clamp-1 max-w-[300px]">
          <Link href={record.title_link}>
            <a className="text-sm font-medium text-canBlack">{text}</a>
          </Link>
        </div>
      ),
    },
    {
      title: "Supported Camps",
      dataIndex: "camps",
      key: "camps",
      render: (camps, _record) =>
        camps.slice(0, limit).map((camp, i) => (
          <p
            key={camp.camp_num}
            className="max-w-[250px] w-full line-clamp-3 break-words gap-1 flex items-center justify-start"
          >
            {camp.support_order}.{" "}
            <Link href={camp.camp_link}>
              <a className="text-sm font-medium text-canBlue underline">
                {camp.camp_name}
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
        <Link href={record.delegated_to_nick_name_link}>
          <a className="text-sm font-medium text-canBlue underline">{text}</a>
        </Link>
      ),
    },
    {
      title: "Nickname",
      dataIndex: "my_nick_name",
      key: "my_nick_name",
      render: (text, record) => (
        <Link href={record.my_nick_name_link}>
          <a className="text-sm font-medium text-canBlue underline">{text}</a>
        </Link>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_text, record) => (
        <Button
          type="link"
          onClick={() => removeCardDelegatedSupportedCamps(record)}
        >
          <Image
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
        <span className="uppercase text-sm font-medium mb-1">
          {messages.labels.fortopic} -
        </span>
        <span>
          <Link href={props.title_link}>
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

  const filteredArray = useMemo(() => {
    if (search.trim() == "") {
      return displayList;
    } else {
      return delegatedSupportCampsList.filter((val: any) => {
        return val.title
          .toLowerCase()
          .trim()
          .includes(search.toLowerCase().trim());
      });
    }
  }, [search, displayList, delegatedSupportCampsList]);

  useEffect(() => {
    pageChange(1, 5);
  }, [delegatedSupportCampsList]);

  return (
    <div>
      <div className="hidden lg:flex w-full">
        {delegateSupportedSkeleton ? (
          <CustomSkelton
            skeltonFor="delegateSupportedCampListCard"
            bodyCount={4}
            stylingClass=""
            isButton={false}
          />
        ) : (
          <div className="w-full">
            <div className="flex lg:flex-row flex-col justify-between items-center mb-5 lg:gap-0 gap-2.5">
              <div className="w-full">
                <h3 className="text-sm font-medium text-canBlack">
                  DELEGATED SUPPORTED CAMPS
                </h3>
              </div>
              <div className="w-full flex justify-end gap-2.5 items-center">
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
                      width={15}
                      height={15}
                      alt=""
                    />
                  }
                  data-testid="settingSearch"
                  value={search}
                  placeholder="Search via topic name"
                  type="text"
                  name="search"
                  className="!h-10 rounded-lg border border-canGrey2 text-sm font-normal lg:w-auto w-full"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>

            {delegatedSupportCampsList &&
            delegatedSupportCampsList.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredArray}
                pagination={false}
                rowKey={(record) => record.title}
                scroll={{ x: "1060" }}
                className="[&_.ant-table-thead>tr>th]:!bg-canGray [&_.ant-table-cell:nth-child(3)]:before:!hidden [&_.ant-table-cell:nth-child(3)]:!border-l  [&_.ant-table-cell:nth-child(3)]:!border-black [&_.ant-table-cell:nth-child(3)]:!border-opacity-5  [&_.ant-table-cell:nth-child(4)]:!border-l  [&_.ant-table-cell:nth-child(4)]:!border-black [&_.ant-table-cell:nth-child(4)]:!border-opacity-5 [&_.ant-table-cell:nth-child(4)]:before:!hidden [&_.ant-table-cell:nth-child(5)]:before:!hidden 
                [&_.ant-table-cell:nth-child(2)]:before:!hidden 
                 [&_.ant-table-cell:nth-child(5)]:!border-l  [&_.ant-table-cell:nth-child(5)]:!border-black [&_.ant-table-cell:nth-child(5)]:!border-opacity-5  [&_.ant-table-thead>tr>th:nth-child(5)]:!border-l-0 [&_.ant-table-thead>tr>th:nth-child(6)]:!border-l-0"
              />
            ) : (
              <Empty description="No Data Found" />
            )}
            {delegatedSupportCampsList &&
            delegatedSupportCampsList.length > 0 &&
            search.length === 0 ? (
              <Pagination
                hideOnSinglePage={true}
                total={delegatedSupportCampsList.length}
                pageSize={5}
                onChange={pageChange}
                showSizeChanger={false}
                className="mt-5"
              />
            ) : (
              ""
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
          <Form>
            <Form.Item style={{ marginBottom: "0px" }}>
              <p
                id="remove_confirmation"
                className="text-sm text-canBlack font-normal"
              >
                Are you sure, you want to remove your delegate support given to{" "}
                <span>
                  &quot;
                  <Link
                    href={removeSupportCampsData.delegated_to_nick_name_link}
                  >
                    <a className={styles.Bluecolor}>
                      {removeSupportCampsData.delegated_to_nick_name}
                    </a>
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
            <Form.Item className="">
              <div className="flex gap-4 justify-center items-center mt-10">
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
                  <p key={val.camp_num}>
                    {val.support_order}.{" "}
                    <Link href={val.camp_link}>
                      <a className={styles.Bluecolor}>{val.camp_name}</a>
                    </Link>
                  </p>
                );
              })}
            </div>
          </>
        </Modal>
      </div>

      <div className="lg:hidden flex w-full">
        {delegateSupportedSkeleton ? (
          <CustomSkelton
            skeltonFor="delegateSupportedCampListCard"
            bodyCount={4}
            stylingClass=""
            isButton={false}
          />
        ) : (
          <div className="w-full">
            <div className="w-full flex justify-end mb-5">
              <Input
                suffix={
                  <Image
                    src="/images/search-icon.svg"
                    width={15}
                    height={15}
                    alt=""
                  />
                }
                data-testid="settingSearch"
                value={search}
                placeholder="Search via topic name"
                type="text"
                name="search"
                className="!h-10 rounded-lg border border-canGrey2 text-sm font-normal lg:w-auto w-full [&_.ant-input-affix-wrapper]:hover:!border-canGrey2 focus:!border-canGrey2 focus:!shadow-none "
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            {displayList && displayList.length > 0
              ? displayList.map((data, i) => (
                  <div
                    key={data.topic_num}
                    className="!border !border-canGrey2 rounded-lg mb-5 last:mb-0 px-2.5"
                  >
                    <Card
                      className="[&_.ant-card-head]:!px-0 [&_.ant-card-head]:!bg-transparent !w-full [&_.ant-card-head]:!border-none"
                      type="inner"
                      size="default"
                      title={
                        <CardTitle
                          title_link={data.title_link}
                          value={data.title}
                        />
                      }
                      style={{ width: 360, marginBottom: 16 }}
                    >
                      <div>
                        <Row>
                          <Col span={24}>
                            <div className="border-y py-3">
                              <span
                                id="currentSupportedCamp"
                                className="uppercase text-sm font-medium text-canBlack"
                              >
                                {messages.labels.currentSupportedCamps}
                              </span>
                              {data.camps?.slice(0, limit).map((val, i) => (
                                <CurrentSupportedCamps
                                  key={i}
                                  value={val.camp_name}
                                  id_data={val.support_order + "."}
                                  camp_link={val.camp_link}
                                />
                              ))}
                            </div>
                            {data.camps.length > limit && (
                              <a
                                className={styles.mrgn_left}
                                onClick={(e) => showViewMoreModal(e, data)}
                              >
                                {messages.labels.viewMore}
                              </a>
                            )}
                          </Col>
                          <Col span={24}>
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
                        className="bg-btnBg bg-opacity-10 rounded-lg py-2.5  w-full mt-5 flex items-center justify-center gap-2.5 text-base font-medium"
                        onClick={() => removeCardDelegatedSupportedCamps(data)}
                      >
                        Remove Support
                        <Image
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

            {delegatedSupportCampsList &&
              delegatedSupportCampsList.length > 0 &&
              search.length === 0 && (
                <Pagination
                  hideOnSinglePage={true}
                  total={delegatedSupportCampsList.length}
                  pageSize={5}
                  onChange={pageChange}
                  showSizeChanger={false}
                  className="mt-5"
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
}
