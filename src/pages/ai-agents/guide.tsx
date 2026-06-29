import fs from "fs";
import path from "path";

import Layout from "../../hoc/layout";
import SkillGuide from "src/components/ComponentPages/AiAgents/SkillGuide";

function AiAgentsGuidePage({ content }: { content: string }) {
  return (
    <Layout>
      <SkillGuide content={content} />
    </Layout>
  );
}

export async function getStaticProps() {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "openclaw-skill.md"
  );
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    content = "";
  }

  return {
    props: { content },
  };
}

AiAgentsGuidePage.displayName = "AiAgentsGuidePage";

export default AiAgentsGuidePage;
