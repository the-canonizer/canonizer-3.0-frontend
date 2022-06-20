import { Fragment } from "react";
import { Card } from "antd";

import styles from "./User.module.scss";

import SideBar from "../../CampForum/UI/sidebar";

const UserSupportsUI = () => {
  return (
    <Fragment>
      <div className="d-flex">
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <Card title={<h1>User Profile</h1>}>
            <h1>Nick Name</h1>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};

export default UserSupportsUI;
