import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const CreateTopic = ({ className = "", isWithIcon = false }) => {
  const router = useRouter();

  return router?.pathname !== "/topic/[...camp]" && (
    <Link href="/create/topic" key="create-topic-btn">
      <a className={`${className} px-2`}>
        <span className="sm:text-[13px]">Start a Topic </span>
        {isWithIcon && <PlusOutlined className="lg:ml-2 sm:ml-0" />}
      </a>
    </Link>
  );
};

export default CreateTopic;
