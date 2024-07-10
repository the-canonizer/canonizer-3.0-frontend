import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { Image } from "antd";
import { latestThread } from "src/network/api/campForumApi";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";
function Campforum() {
const [thread,setThread]= useState([])
const router = useRouter()
const onFinishPost = async () => {

  const body = {
    topic_num: router?.query?.camp[0]?.split("-")[0],
    camp_num: router?.query?.camp[1]?.split("-")[0],
  };
let response = await latestThread(body)
setThread(response)
};

useEffect(()=>{
  onFinishPost()
},[])
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
    {thread?.length <= 0 ?(
       <div className="campfourm-nodata mb-[20px]">
       <h3 className="text-lg text-[#242B37] font-semibold mb-[20px] uppercase">
         Camp Forum
       </h3>
       <div className="bg-[#F7F8FC] py-[60px] rounded-[12px] flex flex-col items-center justify-center">
         <p className="mb-[16px] text-base text-[#242B37]">
           No threads have been started in the Camp Forum
         </p>
         <Button className="gap-2 flex items-center justify-center px-[85px] py-[10px] border border-[#5482C8] rounded-[10px] text-[#242B37] text-base leading-[22px] font-medium">
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
    ):(
      <div className="campfourm-withdata mb-[20px]">
      <div className="flex justify-between">
        <h3 className="text-lg text-[#242B37] font-semibold mb-[20px] uppercase">
          Camp Forum
        </h3>
        <a onClick={onCampForumClick} className="text-base text-[#5482C8] font-medium">See All Threads</a>
      </div>

      <div className=" bg-[#F7F8FC] py-[20px] px-[20px] rounded-[12px] flex flex-col  items-start justify-between">
        {thread?.length && thread?.map((obj,index)=>{
          return(
            <div key={index} className="cursor-pointer group flex justify-between w-full p-[12px] mb-[10px] hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-[10px]  border-b">
            <div>
              <p className="mb-[6px] text-base text-[#242B37] text-ellipsis">
               {obj.body}
              </p>
              <p className="text-[#242B3780] text-sm">{covertToTime(obj?.created_at)}</p>
            </div>
            <div className="flex gap-5 items-center">
              <div className="flex gap-2">
                <Image
                  src="/images/comment-icon.svg"
                  alt="svg"
                  height={24}
                  width={24}
                />
                <p className="text-xs text-[#777F93] font-medium">{obj.post_count}</p>
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
          )
        })}
        {/* <div className="cursor-pointer group flex justify-between w-full p-[12px] mb-[10px] hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-[10px]  border-b">
          <div>
            <p className="mb-[6px] text-base text-[#242B37] text-ellipsis">
              Can unify integrated information and global workspace with
              representation
            </p>
            <p className="text-[#242B3780] text-sm">15 Feb 2024, 11:23</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <Image
                src="/images/comment-icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
              <p className="text-xs text-[#777F93] font-medium">23 Replies</p>
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
        <div className="cursor-pointer group flex justify-between w-full p-[12px] mb-[10px] hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-[10px]  border-b">
          <div>
            <p className="mb-[6px] text-base text-[#242B37] text-ellipsis">
              Can unify integrated information and global workspace with
              representation
            </p>
            <p className="text-[#242B3780] text-sm">15 Feb 2024, 11:23</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <Image
                src="/images/comment-icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
              <p className="text-xs text-[#777F93] font-medium">23 Replies</p>
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
        <div className="cursor-pointer group flex justify-between w-full p-[12px] mb-[10px] hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-[10px]  border-b">
          <div>
            <p className="mb-[6px] text-base text-[#242B37] text-ellipsis">
              Can unify integrated information and global workspace with
              representation
            </p>
            <p className="text-[#242B3780] text-sm">15 Feb 2024, 11:23</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <Image
                src="/images/comment-icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
              <p className="text-xs text-[#777F93] font-medium">23 Replies</p>
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
          className="cursor-pointer group last:border-none flex justify-between w-full p-[12px] mb-[10px] hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-[10px]  border-b 
"
        >
          <div>
            <p className="mb-[6px] text-base text-[#242B37] text-ellipsis">
              Can unify integrated information and global workspace with
              representation
            </p>
            <p className="text-[#242B3780] text-sm">15 Feb 2024, 11:23</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <Image
                src="/images/comment-icon.svg"
                alt="svg"
                height={24}
                width={24}
              />
              <p className="text-xs text-[#777F93] font-medium">23 Replies</p>
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
