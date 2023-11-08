import Layout from "src/hoc/layout";
import Search from "../../components/ComponentPages/searchCanonizer";

function SearchAll() {
  return (
    <Layout>
      <Search />
    </Layout>
  );
}
SearchAll.displayName = "Search";

export default SearchAll;
