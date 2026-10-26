import { Fragment, useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import Link from "next/link";

import { getCampBreadCrumbApi } from "src/network/api/campDetailApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import CustomSkelton from "src/components/common/customSkelton";

type BreadCrumbCamp = {
  camp_num: number;
  camp_name: string;
};

type EditPageBreadcrumbsProps = {
  topicNum: number | string;
  campNum?: number | string;
  currentLabel?: string;
  className?: string;
};

export const getCampPageURL = (
  topicNum: number | string,
  topicName: string,
  campNum: number | string = 1,
  campName: string = "Agreement"
) =>
  `/topic/${topicNum}-${replaceSpecialCharacters(
    topicName || "",
    "-"
  )}/${campNum}-${replaceSpecialCharacters(campName || "", "-")}`;

// Full topic > camp > ... > camp path for topic, camp and statement edit pages.
// Every crumb links straight to its camp page, never to a manage/history view.
function EditPageBreadcrumbs({
  topicNum,
  campNum = 1,
  currentLabel = "",
  className = "",
}: EditPageBreadcrumbsProps) {
  const [loading, setLoading] = useState(true);
  const [topicName, setTopicName] = useState("");
  const [camps, setCamps] = useState<BreadCrumbCamp[]>([]);

  useEffect(() => {
    if (!topicNum) return;
    let isActive = true;

    async function getBreadCrumb() {
      setLoading(true);
      const res = await getCampBreadCrumbApi({
        topic_num: topicNum,
        camp_num: campNum || 1,
        as_of: "default",
        as_of_date: Date.now() / 1000,
      });
      if (!isActive) return;
      if (res?.status_code == 200) {
        setTopicName(res?.data?.topic_name || "");
        setCamps(res?.data?.bread_crumb || []);
      }
      setLoading(false);
    }

    getBreadCrumb();
    return () => {
      isActive = false;
    };
  }, [topicNum, campNum]);

  if (!topicNum) return null;

  return (
    <Breadcrumb
      aria-label="Breadcrumb"
      className={`cn-breadcrumbs ${className}`}
      separator={<i className="icon-angle-right-arrow !leading-[0]"></i>}
    >
      {loading ? (
        <Breadcrumb.Item>
          <CustomSkelton skeltonFor="topicName" bodyCount={1} />
        </Breadcrumb.Item>
      ) : (
        <Fragment>
          <Breadcrumb.Item className="flex items-center gap-1.5">
            <Link href={getCampPageURL(topicNum, topicName)}>
              <a className="!break-all hover:!text-canHoverBlue">{topicName}</a>
            </Link>
          </Breadcrumb.Item>
          {camps
            // Agreement (camp 1) is the topic crumb above.
            ?.filter((camp) => camp?.camp_num != 1)
            ?.map((camp) => (
              <Breadcrumb.Item
                key={camp?.camp_num}
                className="flex items-center gap-1.5"
              >
                <Link
                  href={getCampPageURL(
                    topicNum,
                    topicName,
                    camp?.camp_num,
                    camp?.camp_name
                  )}
                >
                  <a className="!text-canGreen !break-all hover:!text-canHoverBlue">
                    {camp?.camp_name}
                  </a>
                </Link>
              </Breadcrumb.Item>
            ))}
          {!!currentLabel && (
            <Breadcrumb.Item className="flex items-center gap-1.5">
              <span aria-current="page">{currentLabel}</span>
            </Breadcrumb.Item>
          )}
        </Fragment>
      )}
    </Breadcrumb>
  );
}

export default EditPageBreadcrumbs;
