import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";

const CreateTopic = ({ className = "", isWithIcon = false }) => {
  return (
    <Link href="/create/topic" key="create-topic-btn">
      <a className={`${className}`}>
        <span>Start a Topic </span>
        {isWithIcon && <PlusOutlined className="ml-2" />}
      </a>
    </Link>
  );
};

export default CreateTopic;
