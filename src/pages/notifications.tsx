import Layout from "src/hoc/layout";
import NotificationsListComponent from "src/components/ComponentPages/Notifications";

function NotificationsListPage() {
  return (
    <Layout className="min-h-screen">
      <NotificationsListComponent />
    </Layout>
  );
}

NotificationsListPage.displayName = "NotificationsListPage";

export default NotificationsListPage;
