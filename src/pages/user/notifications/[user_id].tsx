import { Card } from "antd";

import Layout from "../../../hoc/layout";
import NotificationsListComponent from "../../../components/ComponentPages/Notifications";

function NotificationsList() {
  return (
    <Layout>
      <NotificationsListComponent />
    </Layout>
  );
}

NotificationsList.displayName = "NotificationsList";

export default NotificationsList;
