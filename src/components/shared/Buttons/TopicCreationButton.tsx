import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";

const CreateTopic = ({ className = "", isWithIcon = false }) => {
  return (
    <Link href="/create/topic" key="create-topic-btn">
      <a id="create-topic-link" className={`${className} px-2`}>
        <span id="create-topic-text">Start a Topic </span>
        {isWithIcon && (
          <PlusOutlined id="create-topic-icon" className="lg:ml-2 sm:ml-0" />
        )}
      </a>
    </Link>
  );
};

export default CreateTopic;
