import { Breadcrumb, Button } from "antd";
// import "./breadcrumbs.scss";

import { HomeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCampBreadCrumbApi } from "src/network/api/campDetailApi";
import { useRouter } from "next/router";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
import moment from "moment";
import { getCookies } from "src/utils/generalUtility";

function Breadcrumbs({ compareMode = false }) {

  const router = useRouter();
  const historyOf = router?.asPath.split("/")[1];

  const { history, currentCampNode, asofdate, algorithm, asof } = useSelector(
    (state: RootState) => ({
      history: state?.topicDetails?.history,
      currentCampRecord: state.topicDetails.currentCampRecord,
      currentCampNode: state?.filters?.selectedCampNode,
      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,
      asof: state?.filters?.filterObject?.asof,
    })
  );

  let payload = history && {
    camp_num: router?.query?.camp?.at(1)?.split("-")?.at(0) ?? "1",
    topic_num: router?.query?.camp?.at(0)?.split("-")?.at(0),
  };

  const [breadCrumbRes, setBreadCrumbRes] = useState({
    topic_name: "",
    bread_crumb: [],
  });
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  useEffect(() => {
    async function getBreadCrumbApiCall() {
      setLoadingIndicator(true);
      let reqBody = {
        topic_num: payload?.topic_num,
        camp_num: payload?.camp_num,
        as_of: router?.pathname == "/topic/[...camp]" ? asof : "default",
        as_of_date:
          asof == "default" || asof == "review"
            ? Date.now() / 1000
            : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
      };

      let res = await getCampBreadCrumbApi(reqBody);
      setBreadCrumbRes(res?.data);
      setLoadingIndicator(false);
    }

    if (
      (payload && Object.keys(payload).length > 0,
        !!(getCookies() as any)?.loginToken)
    ) {
      getBreadCrumbApiCall();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let historyTitle = () => {
    let title: string;
    if (historyOf == "statement") {
      title = "Statement History";
    } else if (historyOf == "camp") {
      title = "Camp History";
    } else if (historyOf == "topic") {
      title = "Topic History";
    }
    return title;
  };

  return (
    <>
      <div className="max-md:mx-[-1rem] max-md:shadow-[0px_10px_10px_0px_#0000001A] md:bg-[#F4F5FAB2] p-[1.5rem] md:rounded-[1.25rem] flex items-center justify-between gap-2 ">
        <Breadcrumb
          className="cn-breadcrumbs"
          separator={
            <>
              <i className="icon-angle-right-arrow"></i>
            </>
          }
        >
          <Breadcrumb.Item href="">
            <i className="icon-home"></i>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">(Canon) General</Breadcrumb.Item>
          <Breadcrumb.Item href="">
            Topic:  {breadCrumbRes && breadCrumbRes?.topic_name}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{
            historyTitle() == "Statement History" ? "Statement" :
              historyTitle() == "Topic History" ? "Topic" :
                historyTitle() == "Camp History" ? "Camp" : null
          } History</Breadcrumb.Item>
        </Breadcrumb>
        {!compareMode &&
          <Button
            size="large"
            type="primary"
            className="flex items-center justify-center rounded-[10px] max-lg:hidden gap-3.5 leading-none"
          >
            Update Current {
              historyTitle() == "Statement History" ? "Statement" :
                historyTitle() == "Topic History" ? "Topic" :
                  historyTitle() == "Camp History" ? "Camp" : null
            }
            <i className="icon-edit"></i>
          </Button>
        }
      </div >
    </>
  );
}

export default Breadcrumbs;
