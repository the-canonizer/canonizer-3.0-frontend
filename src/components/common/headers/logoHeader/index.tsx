import Link from "next/link";
import { Image } from "antd";

const LogoHeader = () => {
  return (
    <Link href="/" className="w-full max-w-full" role="Picture of the author">
      <div className="w-auto h-auto flex items-center cursor-pointer">
        <Image
          src={`/images/logo.svg`}
          alt="Picture of the author"
          preview={false}
          width={150}
        />
      </div>
    </Link>
  );
};

export default LogoHeader;
