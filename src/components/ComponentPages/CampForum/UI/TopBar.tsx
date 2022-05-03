import { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import styles from "./Forum.module.scss";

export default function TopBar({ topicRecord, campRecord }) {
  const router = useRouter();

  return (
    <Fragment>
      <div className={`${styles.upperTitle}`}>
        <p>
          <strong>Topic: </strong> {topicRecord && topicRecord?.topic_name}
        </p>
        <p>
          <strong>Camp: </strong>
          {campRecord
            ? campRecord.parentCamps?.map((camp, index) => {
                return (
                  <Link
                    href={`/topic/${router.query.topic}/${
                      camp?.camp_num
                    }-${camp?.camp_name?.split(" ").join("-")}`}
                    key={camp?.camp_num}
                  >
                    <a>
                      {index !== 0 && "/ "}
                      {`${camp?.camp_name}`}
                    </a>
                  </Link>
                );
              })
            : null}
        </p>
      </div>
    </Fragment>
  );
}
