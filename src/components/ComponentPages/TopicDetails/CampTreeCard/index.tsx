import { Collapse, Popover, Image, Typography, Select, Alert } from "antd";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import CampTree from "../CampTree";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import { useRouter } from "next/router";
import CustomSkelton from "../../../common/customSkelton";

import { store } from "src/store";
import { setTree } from "src/store/slices/campDetailSlice";
import {
  setCampWithScorevalue,
  setFilterCanonizedTopics,
} from "src/store/slices/filtersSlice";

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

const scoreOptions = [
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
];

const CampTreeCard = ({
  getTreeLoadingIndicator,
  scrollToCampStatement,
  setTotalCampScoreForSupportTree,
  setSupportTreeForCamp,
  backGroundColorClass,
  isForumPage = false,
}: any) => {
  const { asof, asofdate, campWithScore, tree, campExist,openDrawer } = useSelector(
    (state: RootState) => ({
      asofdate: state.filters?.filterObject?.asofdate,
      asof: state?.filters?.filterObject?.asof,
      campWithScore: state?.filters?.campWithScoreValue,
      tree: state?.topicDetails?.tree?.at(0),
      campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
      openDrawer: state.topicDetails.openDrawer,
    })
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const didMount = useRef(false);

  const [treeExpandValue, setTreeExpandValue] = useState<any>(campWithScore);

  const prevTreeValueRef = useRef(campWithScore || 10);

  useEffect(() => setTreeExpandValue(campWithScore), [campWithScore]);

  const onCreateTreeDate = () => {
    dispatch(
      setFilterCanonizedTopics({
        asofdate:
          Date.parse(moment.unix(tree["1"]?.created_date).endOf("day")["_d"]) /
          1000,
        asof: "bydate",
      })
    );
    router?.push(router, null, { shallow: true });
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
    dispatch(setCampWithScorevalue(value));
  };

  const onCreateCampDate = () => {
    dispatch(
      setFilterCanonizedTopics({
        asofdate:
          Date.parse(
            moment.unix(campExist && campExist?.created_at).endOf("day")["_d"]
          ) / 1000,
        asof: "bydate",
      })
    );
  };

  useEffect(() => {
    if (didMount.current) {
      return () => {
        store.dispatch(setTree([]));
      };
    } else didMount.current = true;
  }, []);

  useEffect(() => {
    if (
      router?.query?.filter === "undefined" ||
      router?.query?.filter === undefined
    ) {
      dispatch(setCampWithScorevalue("10"));
    } else if (
      router?.query?.filter &&
      router?.query?.filter !== "undefined" &&
      router?.query?.filter !== "null"
    ) {
      dispatch(setCampWithScorevalue(router?.query?.filter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.filter]);

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
          className={`topicDetailsCollapse ${styles.topicDetailsPanelNo} ${backGroundColorClass}`}
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
                  <Text>Collapse camps with less than</Text>
                  <Select
                    value={`${treeExpandValue}`}
                    defaultValue={`${treeExpandValue}`}
                    style={{ width: 80, margin: "0 5px" }}
                    onChange={handleChange}
                    options={scoreOptions}
                  />
                  <Text>of all support.</Text>
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
              !openDrawer ? (
                <CampTree
                  scrollToCampStatement={scrollToCampStatement}
                  setTotalCampScoreForSupportTree={setTotalCampScoreForSupportTree}
                  setSupportTreeForCamp={setSupportTreeForCamp}
                  treeExpandValue={treeExpandValue}
                  setTreeExpandValue={setTreeExpandValue}
                  prevTreeValueRef={prevTreeValueRef}
                  isForumPage={isForumPage}
                />
              ) : (
                ""
              )
            )}
          </Panel>
        </Collapse>
      )}

      {((tree &&
        tree["1"]?.is_valid_as_of_time &&
        tree["1"]?.created_date <=
          (asof == "default" || asof == "review"
            ? Date.now() / 1000
            : asofdate)) ||
        asof == "default") &&
        campExist &&
        !campExist?.camp_exist && (
          <Fragment>
            <Alert
              className="alert-camp-created-on"
              message="The camp was first created on"
              type="info"
              description={
                <span>
                  <AntLink
                    onClick={() => {
                      onCreateCampDate();
                    }}
                  >
                    {
                      new Date((campExist && campExist?.created_at) * 1000)
                        .toLocaleString()
                        ?.split(",")[0]
                    }
                  </AntLink>
                </span>
              }
            />
          </Fragment>
        )}
    </>
  );
};
export default CampTreeCard;
