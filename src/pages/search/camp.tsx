import Layout from "src/hoc/layout";
import CampSearch from "@/components/ComponentPages/searchCanonizer/camp";

function SearchCamp() {
  return (
    <Layout>
      <CampSearch />
    </Layout>
  );
}
SearchCamp.displayName = "SearchCamp";

export default SearchCamp;
