import Link from "next/link";
import { Image } from "antd";

const LogoHeader = () => {
  return (
    <div className="w-auto h-auto flex items-center cursor-pointer">
      <Link href="/" className="w-full max-w-full" role="Picture of the author">
        <Image
          src={`/images/logo.svg`}
          alt="Picture of the author"
          preview={false}
          width={200}
        />
      </Link>
    </div>
  );
};

export default LogoHeader;
