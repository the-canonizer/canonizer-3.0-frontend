import Add from "components/ComponentPages/News";
import Layout from "src/hoc/layout";

function AddNewsPage() {
  return (
    <Layout>
      <Add edit={false} />
    </Layout>
  );
}

AddNewsPage.displayName = "AddNewsPage";

export default AddNewsPage;
