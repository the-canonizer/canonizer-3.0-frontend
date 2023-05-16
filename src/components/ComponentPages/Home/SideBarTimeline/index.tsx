import { useState, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Drawer } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";

import TimelineFilter from "../../../common/timelineFilter";
import useAuthentication from "src/hooks/isUserAuthenticated";
import Events from "../../eventLine/Events";

export default function SideBarTimeline({ timelineDescript }: any) {
  const { isUserAuthenticated } = useAuthentication();

  /* eslint-disable */
  const [isAuth, setIsAuth] = useState(isUserAuthenticated);
  /* eslint-enable */

  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => setIsAuth(isUserAuthenticated), [isUserAuthenticated]);

  return (
    <Fragment>
      {" "}
      {typeof window !== "undefined" && window.innerWidth > 767 ? (
        <TimelineFilter />
      ) : (
        <Fragment>
          <Button type="primary" onClick={showDrawer} className="btnFilter">
            <AppstoreAddOutlined />
          </Button>
          <Drawer
            title="Filters"
            placement="right"
            onClose={onClose}
            visible={visible}
          >
            <TimelineFilter />
          </Drawer>
        </Fragment>
      )}
      {typeof window !== "undefined" && router.asPath.includes("eventline") && (
        <Fragment>{<Events timelineDescript={timelineDescript} />}</Fragment>
      )}
    </Fragment>
  );
}
