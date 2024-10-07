import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";

const CreateTopic = ({ className = "", isWithIcon = false }) => {
  return (
    <Link href="/create/topic" key="create-topic-btn">
      <a className={`${className} px-2`}>
        <span>Start a Topic </span>
        {isWithIcon && <PlusOutlined className="lg:ml-2 sm:ml-0" />}
      </a>
    </Link>
  );
};

export default CreateTopic;
