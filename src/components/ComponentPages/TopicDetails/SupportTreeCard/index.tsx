import { useEffect, useState } from "react";
import CustomButton from "../../../common/button";
import { Button, Typography, Collapse, Popover, Modal, Form, Spin } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import isAuth from "../../../../hooks/isUserAuthenticated";
import K from "../../../../constants";
import { setDelegatedSupportClick } from "../../../../store/slices/supportTreeCard";
import CustomSkelton from "../../../common/customSkelton";
import {
  setManageSupportStatusCheck,
  setManageSupportUrlLink,
} from "../../../../store/slices/campDetailSlice";
import { getNickNameList } from "../../../../network/api/userApi";
const { Paragraph } = Typography;
import { Tree } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

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
  getCheckSupportStatus,
  removeApiSupport,
  // fetchTotalScore,
  removeSupport,
  topicList,
  removeSupportForDelegate,
  isSupportTreeCardModal,
  setIsSupportTreeCardModal,
  handleSupportTreeCardCancel,
  removeSupportSpinner,
  supportTreeForCamp,
  totalCampScoreForSupportTree,
}: any) => {
  const { currentGetCheckSupportExistsData, is_checked } = useSelector(
    (state: RootState) => ({
      currentGetCheckSupportExistsData:
        state.topicDetails.currentGetCheckSupportExistsData,
      is_checked: state?.utils?.score_checkbox,
    })
  );
  const { isUserAuthenticated } = isAuth();
  const router = useRouter();
  const [userNickNameList, setUserNickNameList] = useState([]);
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
  }, [isUserAuthenticated]);
  useEffect(() => {
    dispatch(setDelegatedSupportClick({ delegatedSupportClick: false }));
    dispatch(setManageSupportStatusCheck(false));
  }, []);

  //Delegate Support Camp
  const handleDelegatedClick = () => {
    dispatch(setManageSupportStatusCheck(true));
    dispatch(
      setDelegatedSupportClick({
        delegatedSupportClick: true,
      })
    );
  };
  const handleClickSupportCheck = () => {
    dispatch(setManageSupportUrlLink(manageSupportPath));
    dispatch(setManageSupportStatusCheck(true));
  };

  const manageSupportPath = router.asPath.replace("/topic/", "/support/");

  // const { campSupportingTree, asof } = useSelector((state: RootState) => ({
  //   campSupportingTree: state?.topicDetails?.campSupportingTree,
  //   asof: state?.filters?.filterObject?.asof,
  // }));
  const { campSupportingTree, asof } = useSelector((state: RootState) => ({
    campSupportingTree: supportTreeForCamp,
    asof: state?.filters?.filterObject?.asof,
  }));
  useEffect(() => {
    if (campSupportingTree?.length > 0) {
      getDelegateNicknameId(campSupportingTree);
    }
  }, [campSupportingTree]);
  const [loadMore, setLoadMore] = useState(false);
  const [modalData, setModalData] = useState<any>({});
  const [delegateNickNameId, setDelegateNickNameId] = useState<number>();
  const { topicRecord, campRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  const getDelegateNicknameId = (delegates) => {
    delegates.forEach((element) => {
      if (userNickNameList.includes(element?.nick_name_id)) {
        setDelegateNickNameId(element?.delegate_nick_name_id);
      } else if (element?.delegates?.length > 0) {
        getDelegateNicknameId(element?.delegates);
      }
    });
  };
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
          return (
            <>
              <TreeNode
                title={
                  <>
                    <div
                      className={
                        "treeListItem " + styles.topicDetailsTreeListItem
                      }
                    >
                      {/* <span
                        className={
                          "treeListItemTitle " + styles.treeListItemTitle
                        }
                      > */}
                      <Link
                        href={{
                          pathname: `/user/supports/${data[item].nick_name_id}`,
                          query: {
                            topicnum: topicRecord?.topic_num,
                            campnum: topicRecord?.camp_num,
                            namespace: topicRecord?.namespace_id,
                          },
                        }}
                      >
                        {
                          <div>
                            <span className={styles.Bluecolor}>
                              {data[item].support_order}:
                            </span>
                            <span>{data[item].nick_name}</span>
                          </div>
                        }
                      </Link>

                      {/* </span> */}
                      <span
                        className={
                          "treeListItemNumber " + styles.treeListItemNumber
                        }
                      >
                        {is_checked && isUserAuthenticated
                          ? data[item].full_score?.toFixed(2)
                          : data[item].score?.toFixed(2)}
                        {/* {data[item].score?.toFixed(2)} */}
                      </span>
                      {isUserAuthenticated ? (
                        !userNickNameList.includes(data[item].nick_name_id) ? (
                          <Link
                            href={
                              manageSupportPath + `_${data[item].nick_name_id}`
                            }
                          >
                            {loggedInUserDelegate ||
                            (loggedInUserChild &&
                              delegateNickNameId !=
                                data[item].delegate_nick_name_id) ||
                            data[item].delegates?.findIndex((obj) =>
                              userNickNameList.includes(obj.nick_name_id)
                            ) > -1 ? (
                              ""
                            ) : (
                              <Button
                                id="supportTreeDelegateYourSupport"
                                disabled={asof == "bydate"}
                                onClick={handleDelegatedClick}
                                className="delegate-support-style"
                              >
                                {"Delegate Your Support"}
                              </Button>
                            )}
                          </Link>
                        ) : (
                          <a>
                            <Button
                              id="supportTreeRemoveSupport"
                              disabled={asof == "bydate"}
                              onClick={() => {
                                setIsSupportTreeCardModal(true);
                                setModalData(data[item]);
                              }}
                              className="delegate-support-style"
                            >
                              {"Remove Your Support"}
                            </Button>
                          </a>
                        )
                      ) : (
                        ""
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
      //return <TreeNode key={data[item].key} {...data[item]} />;
    });
  };
  return loadingIndicator ? (
    <CustomSkelton
      skeltonFor="card"
      titleName='Support Tree for "Agreement" Camp'
      bodyCount={3}
      stylingClass="test"
      isButton={false}
    />
  ) : (
    <>
      <Collapse
        defaultActiveKey={["1"]}
        expandIconPosition="end"
        className="topicDetailsCollapse"
      >
        <Panel
          header={
            <h3>
              Support Tree for &quot;
              {campRecord?.camp_name}&quot; Camp
            </h3>
          }
          key="1"
          extra={
            <Popover content={supportContent} placement="left">
              <i className="icon-info tooltip-icon-style"></i>
            </Popover>
          }
        >
          <Paragraph>
            Total Support for This Camp (including sub-camps):
            <span className="number-style">
              {totalCampScoreForSupportTree?.toFixed(2)}
            </span>
          </Paragraph>

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
            <p>No Camp Tree Found</p>
          )}

          {campSupportingTree?.length > supportLength && (
            <CustomButton
              type="primary"
              ghost
              className="load-more-btn"
              onClick={() => {
                // handleLoadMoreSupporters();
                setLoadMore(!loadMore);
              }}
            >
              {!loadMore ? "Load More" : "Load Less"}
            </CustomButton>
          )}

          <div
            className="topicDetailsCollapseFooter"
            onClick={handleClickSupportCheck}
          >
            <Link href={manageSupportPath}>
              <CustomButton className="btn-orange" disabled={asof == "bydate"}>
                {/* {K?.exceptionalMessages?.directJoinSupport} */}
                {getCheckSupportStatus?.is_delegator == 1 ||
                getCheckSupportStatus?.support_flag != 1
                  ? K?.exceptionalMessages?.directJoinSupport
                  : K?.exceptionalMessages?.manageSupport}
              </CustomButton>
            </Link>
          </div>
        </Panel>
      </Collapse>
      <Modal
        className={styles.modal_cross}
        title="Remove Support"
        open={isSupportTreeCardModal}
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
    </>
  );
};
export default SupportTreeCard;
