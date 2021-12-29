import Trees from "../components/ComponentPages/Trees";
import LoggedInLayout from "../hoc/loggedInLayout";

const TreesPage = () => {
  const meta = {
    title: "About Canonizer Trees",
    description: "Short description ",
    route: "tree",
  };

  const permissionRequired = "view_tree";

  return (
    <LoggedInLayout meta={meta} permission={permissionRequired}>
      <Trees />
    </LoggedInLayout>
  );
};

export default TreesPage;
