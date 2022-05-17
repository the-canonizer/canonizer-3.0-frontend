import Layout from "../hoc/layout";
import UserProfiles from "../components/ComponentPages/UserProfile";

function UserProfile() {
  return (
    <Layout>
      <UserProfiles />
    </Layout>
  );
}
UserProfile.displayName = "userProfile";

export default UserProfile;
