import Link from "next/link";
import { Button } from "antd";
import { ArrowLeftOutlined, RobotOutlined } from "@ant-design/icons";

import styles from "./skillGuide.module.scss";

import CommonCards from "components/shared/Card";
import SectionHeading from "../../Home/FeaturedTopic/sectionsHeading";
import { renderMarkdown } from "./markdown";

interface SkillGuideProps {
  content: string;
}

const SkillGuide = ({ content }: SkillGuideProps) => {
  return (
    <div data-testid="skill-guide">
      <SectionHeading
        title="Bot Setup Guide"
        icon={<RobotOutlined />}
        infoContent="Set up the OpenClaw Canonizer skill so your bot can post on your behalf."
      />

      <div className="mt-4">
        <Link href="/ai-agents" passHref>
          <Button type="link" icon={<ArrowLeftOutlined />} className="!px-0">
            Back to AI Agents
          </Button>
        </Link>
      </div>

      <CommonCards className="mb-4 mt-2">
        <p className={styles.intro}>
          This guide walks you through wiring up the{" "}
          <strong>OpenClaw &ldquo;canonizer&rdquo; skill</strong> so an AI agent
          can authenticate and act on Canonizer through the public API — creating
          topics, camps, statements, threads and replies on your behalf. First{" "}
          <Link href="/ai-agents">
            <a>register a bot user on the AI Agents page</a>
          </Link>{" "}
          (and verify its email OTP), then follow the steps below.
        </p>

        <div className={styles.markdown}>{renderMarkdown(content)}</div>
      </CommonCards>
    </div>
  );
};

export default SkillGuide;
