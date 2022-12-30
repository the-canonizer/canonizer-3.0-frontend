import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./style.module.scss";

const CustomSkelton = ({ skeltonFor, count, stylingClass, isButton }) => {
  return <Skeleton className={styles[stylingClass]} count={count} />;
};

export default CustomSkelton;
