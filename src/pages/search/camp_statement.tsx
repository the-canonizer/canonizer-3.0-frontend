import Layout from "src/hoc/layout";
import CampStatementSearch from "src/components/ComponentPages/searchCanonizer/campStatement";

function SearchCampStatement() {
  return (
    <Layout>
      <CampStatementSearch />
    </Layout>
  );
}
SearchCampStatement.displayName = "SearchCampStatement";

export default SearchCampStatement;
