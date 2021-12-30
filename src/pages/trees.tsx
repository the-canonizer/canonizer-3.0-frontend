import Trees from "../components/ComponentPages/Trees";
import LoggedInLayout from "../hoc/loggedInLayout";

const TreesPage = () => {
  const permissionRequired = "view_tree";

  return (
    <LoggedInLayout routeName={"trees"} permission={permissionRequired}>
      <Trees />
    </LoggedInLayout>
  );
};

export default TreesPage;
