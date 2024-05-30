import Link from "next/link";
import { Image } from "antd";

const LogoHeader = () => {
  return (
    <div className="w-auto h-auto flex items-center">
      <Link href="/" className="w-full max-w-full">
        <Image
          src={`/images/logo.svg`}
          alt="Picture of the author"
          preview={false}
        />
      </Link>
    </div>
  );
};

export default LogoHeader;
