import { Collapse, Popover } from "antd";
import CampTree from "../CampTree";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import styles from "../topicDetails.module.scss";
import { useRouter } from "next/router";

const { Panel } = Collapse;

const addContent = (
  <>
    <div className={styles.addSupportText}>
      {/* <Title level={5}>Score Value </Title> */}
      <p>
        This section is a table of contents for this topic. It is in outline or
        tree form, with supporting sub camps indented from the parent camp. If
        you are in a sub camp, you are also counted in all parent camps
        including the agreement camp at the top. The numbers are canonized
        scores derived from the people in the camps based on your currently
        selected canonizer on the side bar. The camps are sorted according to
        these canonized scores. Each entry is a link to the camp page which can
        contain a statement of belief. The green line indicates the camp page
        you are currently on and the statement below is for that camp.
      </p>
    </div>
  </>
);

const CampTreeCard = ({
  scrollToCampStatement,
  setTotalCampScoreForSupportTree,
  setSupportTreeForCamp
}) => {
  const { tree, is_admin } = useSelector((state: RootState) => ({
    tree: state?.topicDetails?.tree?.at(0),

    is_admin: state?.auth?.loggedInUser?.is_admin,
  }));

  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();
  return (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        disabled
        header={<h3>Canonizer Sorted Camp Tree</h3>}
        key="1"
        extra={
          <>
            <div
              className="ant-checkbox-wrapper"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {isUserAuthenticated && is_admin && tree && (
                <Link
                  href={{ pathname: router.asPath.replace("topic", "addnews") }}
                >
                  <a
                    className={styles.addNew}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <i className={"icon-fi-document " + styles.iconMr} />
                    Add News
                  </a>
                </Link>
              )}
              <Popover content={addContent} placement="left">
                <i className="icon-info tooltip-icon-style"></i>
              </Popover>
            </div>
          </>
        }
      >
        <CampTree
          scrollToCampStatement={scrollToCampStatement}
          setTotalCampScoreForSupportTree={setTotalCampScoreForSupportTree}
          setSupportTreeForCamp={setSupportTreeForCamp}
        />
      </Panel>
    </Collapse>
  );
};
export default CampTreeCard;
