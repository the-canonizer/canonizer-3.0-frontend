import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { message } from "antd";
import { RootState } from "src/store";
import { showLoginModal } from "src/store/slices/uiSlice";
import { addSupport, removeSupportedCamps } from "src/network/api/userApi";
import { GetCheckSupportExists } from "src/network/api/topicAPI";
import { getTreesApi } from "src/network/api/campDetailApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import queryParams from "src/utils/queryParams";
import styles from "./respondTab.module.scss";

interface RespondTabProps {
  campStatement: any;
  campRecord: any;
}

interface SiblingCamp {
  camp_id: number;
  camp_name: string;
  score: number;
}

const getSiblingCamps = (tree: any, currentCampNum: number): SiblingCamp[] => {
  if (!tree) return [];
  const siblings: SiblingCamp[] = [];
  // The tree root is keyed by camp_id. Children of agreement (camp 1) are siblings.
  const root = tree["1"];
  if (!root?.children) return [];
  Object.keys(root.children).forEach((key) => {
    const camp = root.children[key];
    if (camp && camp.camp_id !== currentCampNum) {
      siblings.push({
        camp_id: camp.camp_id,
        camp_name: camp.camp_name || camp.title || "",
        score: camp.score || 0,
      });
    }
  });
  siblings.sort((a, b) => b.score - a.score);
  return siblings;
};

const RespondTab = ({ campStatement, campRecord }: RespondTabProps) => {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    isAuthenticated,
    userNickNames,
    topicRecord,
    currentCampRecord,
    tree,
    supportData,
    asof,
    algorithm,
    asofdate,
  } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth?.authenticated,
    userNickNames: state.auth?.userNickNames,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    currentCampRecord: state?.topicDetails?.currentCampRecord,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    supportData: state?.topicDetails?.currentGetCheckSupportExistsData,
    asof: state?.filters?.filterObject?.asof,
    algorithm: state?.filters?.filterObject?.algorithm,
    asofdate: state?.filters?.filterObject?.asofdate,
  }));

  const topicNum = topicRecord?.topic_num || +(router?.query?.camp?.[0]?.split("-")?.[0] || 0);
  const campNum = currentCampRecord?.camp_num || +(router?.query?.camp?.[1]?.split("-")?.[0] || 1);
  const nickNameId = (userNickNames as any)?.[0]?.id;
  const alreadySupports = supportData?.support_flag === 1;

  // Check support status on mount / when camp changes
  useEffect(() => {
    if (isAuthenticated && topicNum && campNum) {
      GetCheckSupportExists(queryParams({ topic_num: topicNum, camp_num: campNum }));
    }
  }, [isAuthenticated, topicNum, campNum]);

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      dispatch(showLoginModal());
      return false;
    }
    return true;
  };

  const refreshTree = async () => {
    const reqBody = {
      topic_num: topicNum,
      camp_num: campNum,
      asOf: asof,
      asofdate: asof === "default" || asof === "review" ? Date.now() / 1000 : asofdate,
      algorithm: algorithm,
      update_all: 1,
    };
    await getTreesApi(reqBody);
  };

  const handleSelect = (type: string) => {
    if (!requireAuth()) return;
    setActiveDrawer(activeDrawer === type ? null : type);
    setFeedbackText("");
  };

  // --- Support ---
  const handleSupport = async () => {
    if (!requireAuth() || submitting) return;
    setSubmitting(true);
    try {
      const body = {
        topic_num: topicNum,
        add_camp: { camp_num: campNum, support_order: 1 },
        remove_camps: [],
        type: "direct",
        action: "add",
        nick_name_id: nickNameId,
        order_update: [],
      };
      const res = await addSupport(body);
      if (res && res.status_code === 200) {
        message.success("You've joined this position!");
        setActiveDrawer(null);
        await refreshTree();
      } else {
        message.error(res?.message || res?.error || "Failed to add support");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Remove support ---
  const handleRemoveSupport = async () => {
    if (!requireAuth() || submitting) return;
    setSubmitting(true);
    try {
      const body = {
        topic_num: topicNum,
        remove_camps: [campNum],
        type: "direct",
        action: "all",
        nick_name_id: nickNameId,
        order_update: [],
      };
      const res = await removeSupportedCamps(body);
      if (res && res.status_code === 200) {
        message.success("Support removed");
        setActiveDrawer(null);
        await refreshTree();
      } else {
        message.error(res?.message || "Failed to remove support");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Almost There ---
  const handleAlmostThere = async () => {
    if (!requireAuth() || submitting) return;
    setSubmitting(true);
    try {
      const body = {
        topic_num: topicNum,
        add_camp: { camp_num: campNum, support_order: 1 },
        remove_camps: [],
        type: "direct",
        action: "partial",
        nick_name_id: nickNameId,
        order_update: [],
        reason_comment: feedbackText || "",
      };
      const res = await addSupport(body);
      if (res && res.status_code === 200) {
        message.success("Your feedback has been recorded!");
        setActiveDrawer(null);
        setFeedbackText("");
        await refreshTree();
      } else {
        message.error(res?.message || res?.error || "Failed to submit feedback");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Disagree: join a sibling camp ---
  const handleJoinSibling = async (siblingCampNum: number) => {
    if (!requireAuth() || submitting) return;
    setSubmitting(true);
    try {
      const body = {
        topic_num: topicNum,
        add_camp: { camp_num: siblingCampNum, support_order: 1 },
        remove_camps: [],
        type: "direct",
        action: "add",
        nick_name_id: nickNameId,
        order_update: [],
      };
      const res = await addSupport(body);
      if (res && res.status_code === 200) {
        message.success("You've joined this position!");
        setActiveDrawer(null);
        await refreshTree();
      } else {
        message.error(res?.message || res?.error || "Failed to join camp");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Scores from tree
  const currentCampScore = tree?.["1"]?.score || 0;
  const siblingCamps = getSiblingCamps(tree, campNum);

  // Build camp creation URL
  const topicName = topicRecord?.topic_name || "";
  const campName = currentCampRecord?.camp_name || "Agreement";
  const createCampUrl = `/camp/create/${topicNum}-${replaceSpecialCharacters(topicName, "-")}/${campNum}-${replaceSpecialCharacters(campName, "-")}`;

  return (
    <div className={styles.respondTabWrapper}>
      <div className={styles.respondHeader}>What do you think?</div>
      <div className={styles.respondSubheader}>
        Your response helps build a picture of where people agree and disagree.
      </div>

      <div className={styles.respondOptions}>
        {/* --- Support button --- */}
        <button
          className={`${styles.respondBtn} ${styles.respondAgree} ${
            activeDrawer === "agree" || alreadySupports ? styles.active : ""
          }`}
          type="button"
          onClick={() => handleSelect("agree")}
        >
          <span className={styles.respondCount}>
            {Math.round(currentCampScore)}
          </span>
          <span className={styles.thumbIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          </span>
          <span className={styles.respondBtnLabel}>
            {alreadySupports ? "You Support This" : "I Support This"}
          </span>
          <span className={styles.respondBtnDesc}>
            {alreadySupports ? "Click to manage" : "This reflects my view"}
          </span>
        </button>

        {/* --- Almost There button --- */}
        <button
          className={`${styles.respondBtn} ${styles.respondPartial} ${
            activeDrawer === "partial" ? styles.active : ""
          }`}
          type="button"
          onClick={() => handleSelect("partial")}
        >
          {/* TODO: Replace with real "almost" count when API provides per-type counts */}
          <span className={styles.respondCount}>&mdash;</span>
          <span className={styles.thumbIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </span>
          <span className={styles.respondBtnLabel}>Almost There</span>
          <span className={styles.respondBtnDesc}>I&apos;d support this if...</span>
        </button>

        {/* --- Disagree button --- */}
        <button
          className={`${styles.respondBtn} ${styles.respondDisagree} ${
            activeDrawer === "disagree" ? styles.active : ""
          }`}
          type="button"
          onClick={() => handleSelect("disagree")}
        >
          <span className={styles.respondCount}>{siblingCamps.length}</span>
          <span className={styles.thumbIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
              <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
            </svg>
          </span>
          <span className={styles.respondBtnLabel}>I Disagree</span>
          <span className={styles.respondBtnDesc}>I see it differently</span>
        </button>
      </div>

      {/* --- Support drawer --- */}
      {activeDrawer === "agree" && (
        <div className={`${styles.responseDrawer} ${styles.drawerAgree}`}>
          {alreadySupports ? (
            <>
              <div className={styles.drawerTitle}>You currently support this position</div>
              <div className={styles.drawerDesc}>
                Would you like to remove your support?
              </div>
              <div className={styles.drawerActions}>
                <button
                  className={`${styles.drawerBtn} ${styles.drawerBtnCancel}`}
                  onClick={() => setActiveDrawer(null)}
                >
                  Keep Supporting
                </button>
                <button
                  className={`${styles.drawerBtn} ${styles.drawerBtnSubmitRed}`}
                  disabled={submitting}
                  onClick={handleRemoveSupport}
                >
                  {submitting ? "Removing..." : "Remove Support"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.drawerTitle}>You support this position!</div>
              <div className={styles.drawerDesc}>
                Want to add a note about why? (Optional)
              </div>
              <textarea
                className={styles.drawerTextarea}
                placeholder="e.g., I've seen firsthand how algorithmic feeds affect..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
              <div className={styles.drawerActions}>
                <button
                  className={`${styles.drawerBtn} ${styles.drawerBtnCancel}`}
                  onClick={() => setActiveDrawer(null)}
                >
                  Skip
                </button>
                <button
                  className={`${styles.drawerBtn} ${styles.drawerBtnSubmit}`}
                  disabled={submitting}
                  onClick={handleSupport}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- Almost There drawer --- */}
      {activeDrawer === "partial" && (
        <div className={`${styles.responseDrawer} ${styles.drawerPartial}`}>
          <div className={styles.drawerTitle}>
            What would it take for you to fully support this?
          </div>
          <div className={styles.drawerDesc}>
            Your input helps AI identify where common ground can be built.
          </div>
          <textarea
            className={styles.drawerTextarea}
            placeholder="e.g., I agree algorithms are a problem, but..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <div className={styles.drawerActions}>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnCancel}`}
              onClick={() => setActiveDrawer(null)}
            >
              Cancel
            </button>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnSubmitOrange}`}
              disabled={submitting}
              onClick={handleAlmostThere}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      )}

      {/* --- Disagree drawer --- */}
      {activeDrawer === "disagree" && (
        <div className={`${styles.responseDrawer} ${styles.drawerDisagree}`}>
          <div className={styles.drawerTitle}>Join an alternative position</div>
          <div className={styles.drawerDesc}>
            {siblingCamps.length > 0
              ? "These positions offer different perspectives on this topic. You can join one, or create your own."
              : "No alternative positions exist yet. Be the first to create one."}
          </div>

          {siblingCamps.length > 0 && (
            <div className={styles.siblingList}>
              {siblingCamps.map((camp) => (
                <div key={camp.camp_id} className={styles.siblingItem}>
                  <div className={styles.siblingInfo}>
                    <span className={styles.siblingName}>{camp.camp_name}</span>
                    <span className={styles.siblingScore}>
                      Score: {camp.score.toFixed(1)}
                    </span>
                  </div>
                  <button
                    className={`${styles.drawerBtn} ${styles.drawerBtnSubmit}`}
                    disabled={submitting}
                    onClick={() => handleJoinSibling(camp.camp_id)}
                  >
                    {submitting ? "Joining..." : "Join"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.drawerActions}>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnCancel}`}
              onClick={() => setActiveDrawer(null)}
            >
              Cancel
            </button>
            <Link href={createCampUrl}>
              <a className={`${styles.drawerBtn} ${styles.drawerBtnSubmitRed}`}>
                Create My Own Position
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RespondTab;
