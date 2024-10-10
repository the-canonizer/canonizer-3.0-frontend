import Layout from "../hoc/layout";
import RecentActivities from "components/ComponentPages/Home/RecentActivities";

const RecentActivitiesPage = () => {
  return (
    <Layout routeName={"recent-activities"}>
      <RecentActivities />
    </Layout>
  );
};

RecentActivitiesPage.displayName = "RecentActivitiesPage";

export default RecentActivitiesPage;
