import { useEffect, useState } from "react";
import CustomButton from "../../../common/button";
import {
  Card,
  Button,
  Typography,
  List,
  Collapse,
  Popover,
  message,
} from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import isAuth from "../../../../hooks/isUserAuthenticated";
import K from "../../../../constants";
import { setDelegatedSupportClick } from "../../../../store/slices/supportTreeCard";
import { setManageSupportStatusCheck } from "../../../../store/slices/campDetailSlice";
import { addSupport, getNickNameList } from "../../../../network/api/userApi";
const { Paragraph } = Typography;

const { Panel } = Collapse;

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
  handleLoadMoreSupporters,
  getCheckSupportStatus,
  removeSupport,
  fetchTotalScore,
  totalSupportScore,
}) => {
  const isLogin = isAuth();
  const router = useRouter();
  const [userNickNameList, setUserNickNameList] = useState([]);
  const dispatch = useDispatch();
  const arr = [];
  const getNickNameListData = async () => {
    const res = await getNickNameList();
    res.data?.map((value, key) => {
      arr.push(value.id);
    });
    setUserNickNameList(arr);
  };
  useEffect(() => {
    if (isLogin) {
      getNickNameListData();
    }
  }, [isLogin]);
  useEffect(() => {
    dispatch(setDelegatedSupportClick({ delegatedSupportClick: false }));
    dispatch(setManageSupportStatusCheck(false));
  }, []);
  console.log(arr);
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
    dispatch(setManageSupportStatusCheck(true));
  };

  const manageSupportPath = router.asPath.replace("/topic/", "/support/");
  const { campSupportingTree } = useSelector((state: RootState) => ({
    campSupportingTree: state?.topicDetails?.campSupportingTree,
  }));
  const [loadMore, setLoadMore] = useState(false);
  const { topicRecord, campRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

  const supportLength = 15;
  return (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
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
          <span className="number-style">{totalSupportScore?.toFixed(2)}</span>
        </Paragraph>
        <List className={"can-card-list "}>
          {campSupportingTree?.length > 0 &&
            campSupportingTree.map((supporter, index) => {
              if ((!loadMore && index < supportLength) || loadMore) {
                return (
                  <List.Item key={index}>
                    <Link
                      href={{
                        pathname: `/user/supports/${supporter.nick_name_id}`,
                        query: {
                          topicnum: topicRecord?.topic_num,
                          campnum: topicRecord?.camp_num,
                          namespace: topicRecord?.namespace_id,
                        },
                      }}
                    >
                      <a>
                        {supporter.nick_name}
                        <span className="number-style">{supporter.score}</span>
                      </a>
                    </Link>

                    {isLogin ? (
                      !userNickNameList.includes(supporter.nick_name_id) ? (
                        <Link
                          href={
                            manageSupportPath + `_${supporter.nick_name_id}`
                          }
                        >
                          <a>
                            <span
                              onClick={handleDelegatedClick}
                              className="delegate-support-style"
                            >
                              {"Delegate Your Support"}
                            </span>
                          </a>
                        </Link>
                      ) : (
                        <a>
                          <span
                            onClick={() => {
                              removeSupport(supporter.nick_name_id);
                            }}
                            className="delegate-support-style"
                          >
                            {"Remove Your Support"}
                          </span>
                        </a>
                      )
                    ) : (
                      ""
                    )}
                  </List.Item>
                );
              }
            })}
        </List>
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
        <Link href={manageSupportPath}>
          <a>
            <div
              className="topicDetailsCollapseFooter"
              onClick={handleClickSupportCheck}
            >
              <CustomButton className="btn-orange">
                {/* {K?.exceptionalMessages?.directJoinSupport} */}
                {getCheckSupportStatus?.support_flag == 1
                  ? K?.exceptionalMessages?.manageSupport
                  : K?.exceptionalMessages?.directJoinSupport}
              </CustomButton>
            </div>
          </a>
        </Link>
      </Panel>
    </Collapse>
  );
};
export default SupportTreeCard;
