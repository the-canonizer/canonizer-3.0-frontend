import Link from "next/link";
import { Image } from "antd";

const LogoHeader = () => {
  return (
    <Link
      href="/"
      className="w-full max-w-full"
      role="Picture of the author"
      id="logo-link"
    >
      <div
        className="w-auto h-auto flex items-center cursor-pointer"
        id="logo-container"
      >
        <Image
          src={`/images/logo.svg`}
          alt="Picture of the author"
          preview={false}
          width={150}
          id="logo-image"
        />
      </div>
    </Link>
  );
};

export default LogoHeader;
