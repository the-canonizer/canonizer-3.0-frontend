import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { RootState } from "src/store";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import styles from "./CategoryChips.module.scss";

const EMOJI_MAP: Record<string, string> = {
  general: "\uD83C\uDF10",
  corporations: "\uD83C\uDFE2",
  "crypto currency": "\uD83E\uDE99",
  mind: "\uD83E\uDDE0",
  science: "\uD83D\uDD2C",
  technology: "\uD83D\uDCBB",
  politics: "\uD83C\uDFDB\uFE0F",
  philosophy: "\uD83D\uDCDA",
  society: "\uD83C\uDF0D",
  education: "\uD83C\uDF93",
  health: "\u2764\uFE0F",
  environment: "\uD83C\uDF3F",
  religion: "\uD83D\uDD4A\uFE0F",
  economics: "\uD83D\uDCC8",
  law: "\u2696\uFE0F",
};

const getEmoji = (label: string): string => {
  const lower = label?.toLowerCase() || "";
  for (const key in EMOJI_MAP) {
    if (lower.includes(key)) return EMOJI_MAP[key];
  }
  return "\uD83D\uDCCC";
};

const CategoryChips = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { nameSpaces, filterNameSpaceId } = useSelector(
    (state: RootState) => ({
      nameSpaces: state.homePage?.nameSpaces,
      filterNameSpaceId: String(state?.filters?.filterObject?.namespace_id),
    })
  );

  const handleChipClick = (id: number, label: string) => {
    if (id?.toString() !== "1") {
      router.query.canon = String(id);
      delete router?.query?.namespace;
      router?.replace(router, undefined, { shallow: true });
    } else {
      const params = router?.query;
      delete params.canon;
      delete params.namespace;
      router.query = params;
      router.replace(router, undefined, { shallow: true });
    }

    dispatch(
      setFilterCanonizedTopics({
        namespace_id: String(id),
        nameSpace: label,
      })
    );
  };

  if (!nameSpaces?.length) return null;

  return (
    <div className={styles.wrapper} data-testid="category-chips">
      <div className={styles.chipRow}>
        {nameSpaces.map((ns: any) => (
          <button
            key={ns.id}
            className={`${styles.chip} ${
              String(ns.id) === filterNameSpaceId ? styles.chipActive : ""
            }`}
            onClick={() => handleChipClick(ns.id, ns.label)}
          >
            <span className={styles.emoji}>{getEmoji(ns.label)}</span>
            {ns.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;
