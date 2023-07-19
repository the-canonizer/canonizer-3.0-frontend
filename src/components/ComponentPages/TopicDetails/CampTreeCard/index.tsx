import { Collapse, Popover, Image, Typography, Button, Select } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { RightOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import CampTree from "../CampTree";
import { RootState } from "src/store";
import useAuthentication from "src/hooks/isUserAuthenticated";
import styles from "../topicDetails.module.scss";
import { useRouter } from "next/router";
import CustomSkelton from "../../../common/customSkelton";

import { store } from "src/store";
import { setTree } from "src/store/slices/campDetailSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

import { fallBackSrc } from "src/assets/data-images";

const { Panel } = Collapse;
const { Link: AntLink, Text } = Typography;

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
  getTreeLoadingIndicator,
  scrollToCampStatement,
  setTotalCampScoreForSupportTree,
  setSupportTreeForCamp,
  backGroundColorClass,
}) => {
  const { asof, asofdate } = useSelector((state: RootState) => ({
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state?.filters?.filterObject?.asof,
  }));
  const { tree, is_admin } = useSelector((state: RootState) => ({
    tree: state?.topicDetails?.tree?.at(0),

    is_admin: state?.auth?.loggedInUser?.is_admin,
  }));

  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();
  const eventLinePath = router?.asPath.replace("topic", "eventline");
  const [treeExpandValue, setTreeExpandValue] = useState<any>(
    router?.query?.filter || 50
  );
  const didMount = useRef(false);
  const prevTreeValueRef = useRef(router?.query?.filter || 50);
  const dispatch = useDispatch();
  const onCreateTreeDate = () => {
    dispatch(
      setFilterCanonizedTopics({
        asofdate:
          Date.parse(moment.unix(tree["1"]?.created_date).endOf("day")["_d"]) /
          1000,
        asof: "bydate",
      })
    );
  };
  const handleChange = (value) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, ...{ filter: value } },
      },
      undefined,
      { shallow: true }
    );
    setTreeExpandValue(value);
  };
  useEffect(() => {
    if (didMount.current) {
      return () => {
        store.dispatch(setTree([]));
      };
    } else didMount.current = true;
  }, []);

  return (
    <>
      {tree &&
        (!tree["1"]?.is_valid_as_of_time ||
          (tree["1"]?.is_valid_as_of_time &&
            !(
              tree["1"]?.created_date <=
              (asof == "default" || asof == "review"
                ? Date.now() / 1000
                : asofdate)
            ))) && (
          <div className={styles.imageWrapper}>
            <div>
              <Image
                preview={false}
                alt="No topic created"
                src={"/images/empty-img-default.png"}
                fallback={fallBackSrc}
                width={200}
                id="forgot-modal-img"
              />
              <p>
                The topic was created on
                <AntLink
                  onClick={() => {
                    onCreateTreeDate();
                  }}
                >
                  {" "}
                  {
                    new Date((tree && tree["1"]?.created_date) * 1000)
                      .toLocaleString()
                      ?.split(",")[0]
                  }
                </AntLink>
              </p>
            </div>
          </div>
        )}

      {((tree &&
        tree["1"]?.is_valid_as_of_time &&
        tree["1"]?.created_date <=
          (asof == "default" || asof == "review"
            ? Date.now() / 1000
            : asofdate)) ||
        asof == "default") && (
        <Collapse
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          className={`topicDetailsCollapse ${styles.topicDetailsPanelNo}`}
        >
          <Panel
            disabled
            className={`header-bg-color-change ${backGroundColorClass}`}
            header={
              <h3>
                Consensus Tree{" "}
                {/* <Button
                  type={"primary"}
                  size="small"
                  className={styles.eventLineBtn}
                  href={eventLinePath}
                >
                  Event Line
                </Button> */}
                <Popover content={addContent} placement="left">
                  <i className="icon-info tooltip-icon-style"></i>
                </Popover>
              </h3>
            }
            key="1"
            extra={
              <>
                <div
                  className="ant-checkbox-wrapper"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <Text>
                    {`Show camps with score`}
                    <RightOutlined className="rightOutlined" />
                  </Text>
                  <Select
                    // value={treeExpandValue}
                    defaultValue={`${router?.query?.filter || 50}%`}
                    style={{ width: 80 }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "0",
                        label: "0%",
                      },
                      {
                        value: "10",
                        label: "10%",
                      },
                      {
                        value: "20",
                        label: "20%",
                      },
                      {
                        value: "50",
                        label: "50%",
                      },
                      {
                        value: "70",
                        label: "70%",
                      },
                      {
                        value: "80",
                        label: "80%",
                      },
                      {
                        value: "90",
                        label: "90%",
                      },
                    ]}
                  />
                </div>
              </>
            }
          >
            {getTreeLoadingIndicator || !tree ? (
              <CustomSkelton
                skeltonFor="tree"
                bodyCount={4}
                isButton={false}
                stylingClass=""
              />
            ) : (
              <CampTree
                scrollToCampStatement={scrollToCampStatement}
                setTotalCampScoreForSupportTree={
                  setTotalCampScoreForSupportTree
                }
                setSupportTreeForCamp={setSupportTreeForCamp}
                treeExpandValue={treeExpandValue}
                setTreeExpandValue={setTreeExpandValue}
                prevTreeValueRef={prevTreeValueRef}
              />
            )}
          </Panel>
        </Collapse>
      )}
    </>
  );
};
export default CampTreeCard;
