import Layout from "src/hoc/layout";
import TopicSearch from "@/components/ComponentPages/searchCanonizer/topic";

function SearchTopic() {
  return (
    <Layout>
      <TopicSearch />
    </Layout>
  );
}
SearchTopic.displayName = "SearchTopic";

export default SearchTopic;
