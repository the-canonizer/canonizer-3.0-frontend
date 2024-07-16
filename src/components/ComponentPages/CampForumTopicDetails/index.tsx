import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { Image } from "antd";
import { latestThread } from "src/network/api/campForumApi";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";
function Campforum() {
  const [thread, setThread] = useState([]);
  const router = useRouter();
  const onFinishPost = async () => {
    const body = {
      topic_num: router?.query?.camp[0]?.split("-")[0],
      camp_num: router?.query?.camp[1]?.split("-")[0],
    };
    let response = await latestThread(body);
    setThread(response);
  };

  useEffect(() => {
    onFinishPost();
  }, []);
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  const onCampForumClick = () => {
    router?.push({
      pathname: `/forum/${router?.query?.camp[0]}/${
        router?.query?.camp[1] || "1"
      }/threads`,
    });
  };
  return (
    <>
      {thread?.length <= 0 ? (
        <div className="campfourm-nodata mb-5">
          <h3 className="text-sm lg:text-base text-canBlack font-semibold uppercase mb-6">
            Camp Forum
          </h3>
          <div className="bg-canGray py-14 px-4 rounded-lg flex flex-col items-center justify-center">
            <p className="mb-2.5 font-normal lg:mb-4 text-[13px] lg:text-base text-canBlack">
              No threads have been started in the Camp Forum
            </p>
            <Button className="h-[44px] gap-2 flex items-center justify-center px-20 py-2.5 border border-canBlue bg-transparent rounded-lg text-canBlack text-base leading-[22px] font-medium">
              Start A Thread
              <Image
                src="/images/plus-Icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="campfourm-withdata">
          <div className="flex justify-between lg:mb-6 mb-5">
            <h3 className="text-sm lg:text-base text-canBlack font-semibold uppercase">
              Camp Forum
            </h3>
            <a
              onClick={onCampForumClick}
              className="text-base text-canBlue font-medium"
            >
              See All Threads
            </a>
          </div>

          <div className=" lg:bg-canGray lg:py-8  rounded-lg flex flex-col  items-start justify-between">
            {thread?.length &&
              thread?.map((obj, index) => {
                return (
                  <div
                    key={index}
                    className="bg-canGray lg:bg-transparent cursor-pointer last:border-none  py-3 px-5 group flex justify-between w-full hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-xl  lg:border-b lg:mb-0 mb-2.5 lg:rounded-none rounded-lg"
                  >
                    <div className="w-full">
                      <p className="mb-1.5 text-base text-canBlack text-ellipsis font-medium">
                        {obj.body}
                      </p>
                      <p className="text-canBlack text-opacity-50 font-medium lg:text-xs text-[10px] hidden lg:flex ">
                        {covertToTime(obj?.created_at)}
                      </p>
                      <div className="">
                        <div className="flex gap-2.5 items-center lg:hidden w-full justify-between">
                          <p className="text-canBlack font-normal text-opacity-80 lg:text-sm text-[10px] flex-1 flex w-full whitespace-nowrap">
                            {covertToTime(obj?.created_at)}
                          </p>
                          <div className="w-full flex justify-end gap-3">
                            <Image
                              src="/images/comment-icon.svg"
                              alt="svg"
                              height={15}
                              width={18}
                            />
                            <p className="text-xs text-canLightBlack flex items-center gap-1 font-medium">
                              {obj.post_count} <span> Replies</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" gap-10 items-center hidden lg:flex">
                      <div className="flex gap-2.5 items-center">
                        <Image
                          src="/images/comment-icon.svg"
                          alt="svg"
                          height={15}
                          width={18}
                        />
                        <p className="text-xs text-canLightBlack flex items-center gap-1 font-medium">
                          {obj.post_count} <span> Replies</span>
                        </p>
                      </div>

                      <div className="hidden group-hover:block">
                        <Image
                          src="/images/camp-caret.svg"
                          alt="svg"
                          height={14}
                          width={7}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            {/* <div className="cursor-pointer group flex justify-between w-full p-3  mb-2.5 hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-lg  border-b">
          <div>
            <p className="mb-[6px] text-base text-canBlack text-ellipsis">
              Can unify integrated information and global workspace with
              representation
            </p>
            <p className="text-canBlack text-sm">15 Feb 2024, 11:23</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <Image
                src="/images/comment-icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
              <p className="text-xs text-canLightfont-medium">23 Replies</p>
            </div>

            <div className="hidden group-hover:block">
              <Image
                src="/images/camp-caret.svg"
                alt="svg"
                height={14}
                width={7}
              />
            </div>
          </div>
        </div>
        <div className="cursor-pointer group flex justify-between w-full p-3  mb-2.5 hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-lg  border-b">
          <div>
            <p className="mb-[6px] text-base text-canBlack text-ellipsis">
              Can unify integrated information and global workspace with
              representation
            </p>
            <p className="text-canBlack text-sm">15 Feb 2024, 11:23</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <Image
                src="/images/comment-icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
              <p className="text-xs text-canLightfont-medium">23 Replies</p>
            </div>

            <div className="hidden group-hover:block">
              <Image
                src="/images/camp-caret.svg"
                alt="svg"
                height={14}
                width={7}
              />
            </div>
          </div>
        </div>
        <div className="cursor-pointer group flex justify-between w-full p-3  mb-2.5 hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-lg  border-b">
          <div>
            <p className="mb-[6px] text-base text-canBlack text-ellipsis">
              Can unify integrated information and global workspace with
              representation
            </p>
            <p className="text-canBlack text-sm">15 Feb 2024, 11:23</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <Image
                src="/images/comment-icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
              <p className="text-xs text-canLightfont-medium">23 Replies</p>
            </div>

            <div className="hidden group-hover:block">
              <Image
                src="/images/camp-caret.svg"
                alt="svg"
                height={14}
                width={7}
              />
            </div>
          </div>
        </div> */}
            {/* <div
          className="cursor-pointer group last:border-none flex justify-between w-full p-3  mb-2.5 hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-lg  border-b 
"
        >
          <div>
            <p className="mb-[6px] text-base text-canBlack text-ellipsis">
              Can unify integrated information and global workspace with
              representation
            </p>
            <p className="text-canBlack text-sm">15 Feb 2024, 11:23</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <Image
                src="/images/comment-icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
              <p className="text-xs text-canLightfont-medium">23 Replies</p>
            </div>

            <div className="hidden group-hover:block">
              <Image
                src="/images/camp-caret.svg"
                alt="svg"
                height={14}
                width={7}
              />
            </div>
          </div>
        </div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default Campforum;
