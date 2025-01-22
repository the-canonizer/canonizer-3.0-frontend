import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const My404 = () => {
  const router = useRouter();
  const goBack = () => {
    router.push({
      pathname: "/browse",
    });
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center text-center">
          <p className="mb-12 font-medium text-[24px] md:text-[32px] leading-relaxed font-inter">
            {`The page you’re looking for isn’t in the consensus.`}
          </p>
          <div className="w-full flex justify-center mb-8">
            <Image
              src={"/images/404-page-img2.png"}
              alt="404 page"
              width={650}
              height={400}
              layout="intrinsic"
              className="max-w-full h-auto"
            />
          </div>
          <div>
            <p className="mb-3 font-medium text-[20px] md:text-[24px] leading-relaxed font-inter">
              {`Let’s get you back on track.`}
            </p>
            <Button
              type="primary"
              className="rounded-lg px-20 md:px-24 py-5 font-medium flex items-center justify-center"
              onClick={goBack}
            >
              Browse Topics <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default My404;
