import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getSiblingCamp } from "src/network/api/campForumApi";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { setSiblingCampData } from "src/store/slices/campDetailSlice";
const SiblingCamps = () => {
  const [siblingCampsData,setSiblingCampsData] = useState([])
  const router = useRouter()
  const { campStatement,siblingCampData } = useSelector(
    (state: RootState) => ({
      campStatement: state?.topicDetails?.campStatement,
      siblingCampData:state?.topicDetails?.siblingCampData,
    })
  );
  const dispatch = useDispatch()
  console.log(siblingCampData,"statement")
  const siblingCampsFunction = async()=>{
    let body = {
       topic_num:88,
      camp_num:1,
      parent_camp_num:3

    }
    let response = await getSiblingCamp(body)
    setSiblingCampsData(response?.data)
    dispatch(setSiblingCampData(response?.data))
  }

  useEffect(()=>{
    siblingCampsFunction()
  },[])
  return (
    <>
      <div className="flex flex-col">
                  <h3 className="font-semibold text-base text-[#242B37] uppercase">SIBLING CAMPS</h3>
                  <div className="sibling-camps flex xl:flex-row sm:flex-col gap-4 my-[20px]">
                    {siblingCampsData?.map((obj,index)=>{
                      return(
                        <div key={index} className="bg-[#F7F8FC] p-[20px] rounded-[12px]">
                        <h3 className="text-base text-[#242B37] font-medium mb-[15px]">
                         {obj?.camp_name}
                        </h3>
                        <p className="font-normal text-[#242B37]  leading-[26px] mb-[13px] text-base ">
                         {obj?.statement}
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <div className="flex gap-1">
                              <Image
                                src="/images/flagicon.svg"
                                alt="svg"
                                height={24}
                                width={24}
                              />
                              <p className="text-[#5482C8] text-base font-medium leading-[22px]">
                               {obj?.namespace}
                              </p>
                            </div>
                            <div className="flex gap-1 mt-[5px]">
                              <Image
                                src="/images/eyeicon.svg"
                                alt="svg"
                                height={24}
                                width={24}
                              />
                              <p className="text-[#777F93] text-base font-medium  leading-[22px]">
                                123
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="z-0 w-[32px] h-[32px] rounded-full border-solid border-2 border-white flex justify-center items-center bg-[#D0D8F4] overflow-hidden first:m-[0px]">
                              <Image
                                src="/images/sibling-user.png"
                                alt="svg"
                                height={32}
                                width={32}
                                className="object-cover"
                              />
                            </div>
                            <div className="z-10 w-[32px] h-[32px] rounded-full border-2 border-white flex justify-center items-center bg-[#D0D8F4] ml-[-12px]">
                              T
                            </div>
                            <div className="z-10 w-[32px] h-[32px] rounded-full border-2 border-white flex justify-center items-center bg-[#D0D8F4] ml-[-12px]">
                              T
                            </div>
                            <div className="z-10 w-[32px] h-[32px] rounded-full border-2 border-white flex justify-center items-center bg-[#D0D8F4] ml-[-12px]">
                              T
                            </div>
                            <div className="z-10 w-[32px] h-[32px] rounded-full border-2 border-white flex justify-center items-center bg-[#D0D8F4] ml-[-12px]">
                              T
                            </div>
                          </div>
                        </div>
                      </div>
                      )
                     
                    })}
                   
                  </div>
                </div>
    </>
  )
};
export default SiblingCamps;
