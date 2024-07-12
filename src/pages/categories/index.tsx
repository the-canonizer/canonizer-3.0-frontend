import Layout from "src/hoc/layout";
import AllCats from "components/ComponentPages/AllCategories";

const AllUserCategories = () => {
  return (
    <Layout className="min-h-screen">
      <AllCats />
    </Layout>
  );
};

AllUserCategories.displayName = "AllCategories";

export default AllUserCategories;
