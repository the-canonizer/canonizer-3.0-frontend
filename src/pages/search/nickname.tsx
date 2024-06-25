import Layout from "src/hoc/layout";
import NicknameSearch from "src/components/ComponentPages/searchCanonizer/nickname";

function SearchNickname() {
  return (
    <Layout>
      <NicknameSearch />
    </Layout>
  );
}
SearchNickname.displayName = "SearchNickname";

export default SearchNickname;
