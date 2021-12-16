import Trees from "../components/pages/trees";
import LoggedInLayout from "../hoc/loggedInLayout";

const TreesPage = () => {
  const meta = {
    title: "About Canonizer Trees",
    description: "Short description ",
    route: "tree",
  };

  const permissionRequired = "view_tree123";

  return (
    <LoggedInLayout meta={meta} permission={permissionRequired}>
      <Trees />
    </LoggedInLayout>
  );
};

export default TreesPage;
