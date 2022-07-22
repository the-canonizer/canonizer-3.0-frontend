import Layout from "../hoc/layout";
import NotificationsListComponent from "../components/ComponentPages/Notifications";

function NotificationsListPage() {
  return (
    <Layout>
      <NotificationsListComponent />
    </Layout>
  );
}

NotificationsListPage.displayName = "NotificationsListPage";

export default NotificationsListPage;
