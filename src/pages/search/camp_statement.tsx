import Layout from "src/hoc/layout";
import CampStatementSearch from "@/components/ComponentPages/searchCanonizer/campStatement";

function SearchCampStatement() {
  return (
    <Layout>
      <CampStatementSearch />
    </Layout>
  );
}
SearchCampStatement.displayName = "SearchCampStatement";

export default SearchCampStatement;
