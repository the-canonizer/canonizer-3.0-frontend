import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Tree,
  Button,
  Typography,
  Collapse,
  Popover,
  Modal,
  Form,
  Spin,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import styles from "../topicDetails.module.scss";

import CustomButton from "../../../common/button";
import { RootState } from "src/store";
import isAuth from "../../../../hooks/isUserAuthenticated";
import K from "../../../../constants";
// import { setCurrentCampRecord } from "../../../../store/slices/campDetailSlice";
import { setDelegatedSupportClick } from "../../../../store/slices/supportTreeCard";
import CustomSkelton from "../../../common/customSkelton";
import {
  setManageSupportStatusCheck,
  setManageSupportUrlLink,
} from "../../../../store/slices/campDetailSlice";
import { getNickNameList } from "../../../../network/api/userApi";
import SupportRemovedModal from "src/components/common/supportRemovedModal";
import ManageSupport from "../../ManageSupport";
import { getTreesApi } from "src/network/api/campDetailApi";
import { setIsSupportModal } from "src/store/slices/topicSlice";
import { showLoginModal } from "src/store/slices/uiSlice";
import Image from "next/image";
import support_image from "../../../../../public/images/support-tree-avatar.svg";
import { setOpenConsensusTreePopup } from "src/store/slices/hotTopicSlice";

const { Paragraph } = Typography;
const { Panel } = Collapse;
const { TreeNode } = Tree;

const supportContent = (
  <>
    <div className={styles.addSupportText}>
      <p>
        Supporters can delegate their support to others. Direct supporters
        receive email notifications of proposed camp changes, while delegated
        supporters don’t. People delegating their support to others are shown
        below and indented from their delegates in an outline form. If a
        delegate changes camp, everyone delegating their support to them will
        change camps with them.
      </p>
    </div>
  </>
);

const SupportTreeCard = ({
  loadingIndicator,
  isRemovingSupport,
  getCheckSupportStatus,
  removeApiSupport,
  removeSupport,
  topicList,
  removeSupportForDelegate,
  isSupportTreeCardModal,
  setIsSupportTreeCardModal,
  handleSupportTreeCardCancel,
  removeSupportSpinner,
  supportTreeForCamp,
  totalCampScoreForSupportTree,
  isDelegateSupportTreeCardModal,
  setIsDelegateSupportTreeCardModal,
  backGroundColorClass,
  getCheckStatusAPI,
  GetActiveSupportTopicList,
}: any) => {
  const {
    currentGetCheckSupportExistsData,
    is_checked,
    topicRecord,
    campRecord,
    algorithms,
    algorithm,
    asofdate,
    isModalOpenSupportCamps,
    selectedAlgorithm,
  } = useSelector((state: RootState) => ({
    currentGetCheckSupportExistsData:
      state.topicDetails.currentGetCheckSupportExistsData,
    is_checked: state?.utils?.score_checkbox,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    filterData: state?.filters?.filterObject,
    algorithms: state.homePage?.algorithms,
    algorithm: state.filters?.filterObject?.algorithm,
    asofdate: state.filters?.filterObject?.asofdate,
    isModalOpenSupportCamps: state?.topic?.isModalOpenSupportCamps,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
  }));
  const { manageSupportStatusCheck } = useSelector((state: RootState) => ({
    manageSupportStatusCheck: state.topicDetails.manageSupportStatusCheck,
  }));
  const { isUserAuthenticated } = isAuth();

  const router = useRouter();

  const [userNickNameList, setUserNickNameList] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [modalData, setModalData] = useState<any>({});
  const [delegateNickNameId, setDelegateNickNameId] = useState<number>();
  const [currentAlgo, setCurrentAlgo] = useState<string>("");
  const [selectNickId, setSelectNickId] = useState(null);
  const [mainComponentKey, setMainComponentKey] = useState(0);
  const [loadingIndicatorSupport, setLoadingIndicatorSupport] = useState(false);
  const [
    getManageSupportLoadingIndicator,
    setGetManageSupportLoadingIndicator,
  ] = useState(true);
  const showModalSupportCamps = () => {
    dispatch(setIsSupportModal(true));
  };
  const handleOkSupportCamps = () => {
    dispatch(setIsSupportModal(false));
  };
  const getSupportTreeApi = async () => {
    const reqBodyForService = {
      topic_num: +router?.query?.camp[0]?.split("-")[0],
      camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
      asOf: asof,
      asofdate:
        asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
      algorithm: algorithm,
      update_all: 1,
      fetch_topic_history: +router?.query?.topic_history,
    };
    await getTreesApi(reqBodyForService);
  };
  const handleCancelSupportCamps = async ({ isCallApiStatus = false }) => {
    dispatch(setIsSupportModal(false));
    setGetManageSupportLoadingIndicator(true);
    setLoadingIndicatorSupport(true);

    if (isCallApiStatus == true) {
      await getCheckStatusAPI();
    }
    if (isCallApiStatus == true) {
      await getSupportTreeApi();
      GetActiveSupportTopicList();
    }

    setSelectNickId(null);
    setLoadingIndicatorSupport(false);
    setTimeout(() => setMainComponentKey(mainComponentKey + 1), 500);
    // setComponentKey2(componentKey2 + 1);
  };
  useEffect(() => {
    const filteredAlgo = algorithms?.filter(
      (a: { algorithm_key: string }) =>
        a.algorithm_key === (selectedAlgorithm || router?.query?.algo)
    );
    if (filteredAlgo?.length) setCurrentAlgo(filteredAlgo[0]?.algorithm_label);
  }, [algorithms, router?.query?.algo, selectedAlgorithm]);

  const dispatch = useDispatch();
  const arr = [];

  const getNickNameListData = async () => {
    const res = await getNickNameList();
    res?.data?.map((value) => {
      arr.push(value.id);
    });
    setUserNickNameList(arr);
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      getNickNameListData();
    }
    if (manageSupportStatusCheck == false) {
      dispatch(setIsSupportModal(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  useEffect(() => {
    dispatch(setDelegatedSupportClick({ delegatedSupportClick: false }));
    dispatch(setManageSupportStatusCheck(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainComponentKey]);

  //Delegate Support Camp
  const handleDelegatedClick = (data) => {
    if (isUserAuthenticated) {
      dispatch(setManageSupportStatusCheck(true));
      dispatch(
        setDelegatedSupportClick({
          delegatedSupportClick: true,
        })
      );
      setSelectNickId(data);
      showModalSupportCamps();
    }
  };

  const handleClickSupportCheck = () => {
    const q: any = router?.query;
    if (isUserAuthenticated) {
      dispatch(setManageSupportUrlLink(manageSupportPath));
      dispatch(setManageSupportStatusCheck(true));
      setSelectNickId(null);
      q && q.from && q.from.includes("notify_")
        ? null
        : showModalSupportCamps();
    } else {
      dispatch(showLoginModal());
    }
  };

  useEffect(() => {
    const q: any = router?.query;
    if (
      q &&
      q.from &&
      q.from.includes("notify_") &&
      q?.n_type?.toLowerCase() === "support"
    ) {
      const fArr = (q.from as String).split("_");
      if (+fArr[1]) {
        handleClickSupportCheck();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const manageSupportPath = router?.asPath.replace("/topic/", "/support/");
  const { campSupportingTree, asof } = useSelector((state: RootState) => ({
    campSupportingTree: supportTreeForCamp,
    asof: state?.filters?.filterObject?.asof,
  }));
  useEffect(() => {
    if (campSupportingTree?.length > 0) {
      getDelegateNicknameId(campSupportingTree);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campSupportingTree]);

  const getDelegateNicknameId = (delegates) => {
    delegates.forEach((element) => {
      if (userNickNameList.includes(element?.nick_name_id)) {
        setDelegateNickNameId(element?.delegate_nick_name_id);
      } else if (element?.delegates?.length > 0) {
        getDelegateNicknameId(element?.delegates);
      }
    });
  };
  useEffect(() => {
    // setTimeout(()=>{
    //   debugger;
    //   dispatch(setOpenConsensusTreePopup(false))
    // },100);
    // debugger;
    // (async()=>{
    // dispatch(setOpenConsensusTreePopup(true))
    // // await getSupportTreeApi()
    // setTimeout(()=>{
    //   dispatch(setOpenConsensusTreePopup(false))
    // },100);
    // })()
  }, []);
  const supportLength = 15;
  const renderTreeNodes = (
    data: any,
    isDisabled = 0,
    isOneLevel = 0,
    loggedInUserDelegate = false,
    loggedInUserChild = false
  ) => {
    return Object.keys(data).map((item, index) => {
      if (userNickNameList.includes(data[item].nick_name_id))
        loggedInUserChild = true;
      const parentIsOneLevel = isOneLevel;
      isOneLevel = data[item].is_one_level == 1 || isOneLevel == 1 ? 1 : 0;
      //isDisabled = data[item].is_disabled == 1 || isDisabled == 1 ? 1 : 0;
      if ((!loadMore && index < supportLength) || loadMore) {
        if (data[item].delegates) {
          /* eslint-disable */
          /* eslint-enable */

          return (
            <>
              <TreeNode
                className="[&_.ant-tree-node-content-wrapper]:!w-full [&_.ant-tree-switcher]:!hidden !bg-transparent border-b hover:[&_.ant-tree-node-content-wrapper]:!bg-transparent !w-full"
                title={
                  <>
                    <div className="group w-full">
                      {/* <span
                        className={
                          "treeListItemTitle " + styles.treeListItemTitle
                        }
                      > */}
                      <div className="flex gap-1 items-center  boder-b py-2.5 w-full flex-wrap">
                        <Link
                          className="flex flex-wrap"
                          href={{
                            pathname: `/user/supports/${data[item].nick_name_id}`,
                            query: {
                              canon: topicRecord?.namespace_id,
                            },
                          }}
                        >
                          <a className="flex gap-1 items-center flex-wrap">
                            <span className="text-canBlack text-base font-medium">
                              {" "}
                              #{data[item].support_order}{" "}
                            </span>
                            <div className="w-[32px] h-[32px] rounded-full overflow-hidden">
                              <Image
                                src={support_image}
                                alt="svg"
                                height={32}
                                width={32}
                              />
                            </div>{" "}
                            <span className="text-canBlack lg:text-base text-xs font-medium">
                              {" "}
                              {data[item].nick_name}
                            </span>
                          </a>
                        </Link>

                        <div className="flex bg-canOrange px-2.5 py-1 rounded-md gap-1 items-center">
                          <Image
                            src="/images/hand-icon.svg"
                            alt="svg"
                            height={15}
                            width={12}
                          />
                          <span className="lg:text-sm text-xs text-white font-medium flex items-center leading-[16px]">
                            {campRecord?.is_archive
                              ? 0
                              : is_checked && isUserAuthenticated
                              ? data[item].full_score?.toFixed(2)
                              : data[item].score?.toFixed(2)}
                            {/* {data[item].score?.toFixed(2)} */}
                          </span>
                        </div>
                      </div>

                      {/* </span> */}

                      {(userNickNameList?.length > 0 &&
                        !userNickNameList.includes(data[item].nick_name_id)) ||
                      !isUserAuthenticated ? (
                        <>
                          {loggedInUserDelegate ||
                          (loggedInUserChild &&
                            delegateNickNameId !=
                              data[item].delegate_nick_name_id) ||
                          data[item].delegates?.findIndex((obj) =>
                            userNickNameList.includes(obj.nick_name_id)
                          ) > -1 ? (
                            ""
                          ) : (
                            <Popover
                              placement="right"
                              content={
                                !isUserAuthenticated
                                  ? "Log in to participate"
                                  : ""
                              }
                            >
                              <a className="printHIde custom-btn group">
                                <Button
                                  id="supportTreeDelegateYourSupport"
                                  disabled={
                                    asof == "bydate" ||
                                    !isUserAuthenticated ||
                                    campRecord?.is_archive == 1
                                  }
                                  onClick={() =>
                                    handleDelegatedClick(
                                      data[item].nick_name_id
                                    )
                                  }
                                  className="hidden group-hover:flex mb-2  items-center gap-1 justify-center bg-canLightBlue text-canBlue text-base rounded-lg font-medium h-[44px] w-full "
                                >
                                  <Image
                                    src="/images/user-minus-regular.svg"
                                    alt="svg"
                                    height={24}
                                    width={24}
                                  />
                                  {"Delegate Your Suppport"}
                                </Button>
                              </a>
                            </Popover>
                          )}
                        </>
                      ) : (
                        <a className="printHIde  custom-btn hidden group-hover:flex">
                          <Button
                            id="supportTreeRemoveSupport"
                            disabled={
                              asof == "bydate" ||
                              isRemovingSupport ||
                              !isUserAuthenticated ||
                              campRecord?.is_archive
                            }
                            onClick={() => {
                              currentGetCheckSupportExistsData.is_delegator
                                ? setIsDelegateSupportTreeCardModal(true)
                                : topicList.length <= 1
                                ? setIsSupportTreeCardModal(true)
                                : setIsSupportTreeCardModal(true);

                              setModalData(data[item]);
                            }}
                            className="mb-2 flex items-center gap-1 justify-center bg-canLightRed text-canRed text-base rounded-lg font-medium h-[44px] w-full"
                          >
                            <Image
                              src="/images/user-minus-red.svg"
                              alt="svg"
                              height={24}
                              width={24}
                            />
                            Remove Your Support
                          </Button>
                        </a>
                      )}
                    </div>
                  </>
                }
                key={data[item].camp_id}
                data={{ ...data[item], parentIsOneLevel, isDisabled }}
              >
                {renderTreeNodes(
                  data[item].delegates,
                  isDisabled,
                  isOneLevel,
                  userNickNameList.includes(data[item].nick_name_id),
                  loggedInUserChild
                )}
              </TreeNode>
            </>
          );
        }
      }
    });
  };

  // remove support popup added.

  const [removeForm] = Form.useForm();

  const onRemoveFinish = (values) => {
    currentGetCheckSupportExistsData.is_delegator
      ? removeSupportForDelegate(values)
      : topicList.length <= 1
      ? removeApiSupport(modalData?.nick_name_id, values)
      : removeSupport(modalData?.nick_name_id, values);
    setModalData({});
    removeForm.resetFields();
  };
  let title = `Support Tree for "${campRecord?.camp_name}" Camp`;

  // remove support popup added.

  return loadingIndicator || loadingIndicatorSupport ? (
    <CustomSkelton
      skeltonFor="card"
      titleName={title}
      bodyCount={3}
      stylingClass="test"
      isButton={false}
    />
  ) : (
    <>
      <div
        // defaultActiveKey={["1"]}
        // expandIconPosition="right"
        className="topicDetailsCollapse"
      >
        <div className=" support-tree-sec">
          {/* <Paragraph className="position-relative">
            Total Support for This Camp (including sub-camps):
            <span className="number-style">
              {campRecord?.is_archive
                ? 0
                : totalCampScoreForSupportTree?.toFixed(2)}
            </span>
          </Paragraph> */}

          {campSupportingTree?.length > 0 ? (
            <Tree
              className={"Parent_Leaf"}
              showLine={false}
              showIcon={false}
              defaultExpandedKeys={[
                +router?.query?.camp?.at(1)?.split("-")?.at(0) == 1
                  ? 2
                  : +router?.query?.camp?.at(1)?.split("-")?.at(0),
              ]}
              defaultExpandAll={true}
            >
              {campSupportingTree && renderTreeNodes(campSupportingTree)}
            </Tree>
          ) : (
            <p> No direct supporters of this camp</p>
          )}

          {campSupportingTree?.length > supportLength && (
            <CustomButton
              type="primary"
              ghost
              className="load-more-btn"
              onClick={() => setLoadMore(!loadMore)}
            >
              {!loadMore ? "Load More" : "Load Less"}
            </CustomButton>
          )}
        </div>
        <div className="topicDetailsCollapseFooter printHIde mt-3 w-full">
          <CustomButton
            onClick={handleClickSupportCheck}
            className="w-full justify-center bg-canGreen hover:!bg-canGreen hover:!text-white hover:!border-transparent !border-transparent h-[44px] px-11 text-white flex items-center rounded-lg font-medium text-base gap-2"
            disabled={asof == "bydate" || campRecord?.is_archive == 1}
            id="manage-support-btn"
          >
            {getCheckSupportStatus?.is_delegator == 1 ||
            getCheckSupportStatus?.support_flag != 1
              ? K?.exceptionalMessages?.directJoinSupport
              : K?.exceptionalMessages?.manageSupport}
            <Image
              src="/images/hand-icon.svg"
              alt="svg"
              height={16}
              width={12}
            />
          </CustomButton>
        </div>
      </div>

      <Modal
        className={styles.modal_cross}
        title={
          <p id="all_camps_topics" className={styles.modalTitle}>
            You are about to remove your support from the camp:{" "}
            <span>
              &quot;
              <Link
                href={{
                  pathname: `/topic/${topicRecord?.topic_num}-${topicRecord?.topic_name}/${campRecord?.camp_num}-${campRecord?.camp_name}`,
                }}
              >
                <a>{campRecord?.camp_name}.</a>
              </Link>
              &quot;
            </span>{" "}
            You can optionally add a helpful reason, along with a citation link.
          </p>
        }
        open={isSupportTreeCardModal}
        onOk={handleSupportTreeCardCancel}
        onCancel={handleSupportTreeCardCancel}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
      >
        <Spin spinning={removeSupportSpinner} size="small">
          <SupportRemovedModal
            onFinish={onRemoveFinish}
            handleCancel={() => setIsSupportTreeCardModal(false)}
            form={removeForm}
          />
        </Spin>
      </Modal>

      {/* delegateremove */}
      <Modal
        className={styles.modal_cross}
        title="Remove Support"
        open={isDelegateSupportTreeCardModal}
        onOk={handleSupportTreeCardCancel}
        onCancel={handleSupportTreeCardCancel}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
      >
        <Form>
          <Form.Item style={{ marginBottom: "0px" }}>
            <p>Are you sure you want to remove your support?</p>
          </Form.Item>
          <Form.Item
            id="supportTreeModalForm"
            className={styles.text_right}
            style={{ marginBottom: "0px" }}
          >
            <Spin spinning={removeSupportSpinner} size="small">
              <div className="text-right">
                <Button
                  id="supportTreeModalRemoveApi"
                  disabled={asof == "bydate"}
                  onClick={() => {
                    currentGetCheckSupportExistsData.is_delegator
                      ? removeSupportForDelegate()
                      : topicList.length <= 1
                      ? removeApiSupport(modalData?.nick_name_id)
                      : removeSupport(modalData?.nick_name_id);
                    setModalData({});
                  }}
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
                  id="supportTreeModalCancel"
                  onClick={handleSupportTreeCardCancel}
                  type="default"
                  style={{
                    marginTop: 10,
                  }}
                  className="ant-btn"
                >
                  Cancel
                </Button>
              </div>
            </Spin>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className={styles.modal_cross}
        title="Support Camps"
        open={isModalOpenSupportCamps}
        onOk={handleOkSupportCamps}
        onCancel={() => handleCancelSupportCamps({ isCallApiStatus: false })}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
        width={700}
        destroyOnClose={true}
      >
        <ManageSupport
          handleCancelSupportCamps={handleCancelSupportCamps}
          selectNickId={selectNickId}
          setGetManageSupportLoadingIndicator={
            setGetManageSupportLoadingIndicator
          }
          getManageSupportLoadingIndicator={getManageSupportLoadingIndicator}
          getCheckStatusAPI={getCheckStatusAPI}
        />
      </Modal>
    </>
  );
};
export default SupportTreeCard;
