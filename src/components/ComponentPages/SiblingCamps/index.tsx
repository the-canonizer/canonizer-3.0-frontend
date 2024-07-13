import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getSiblingCamp } from "src/network/api/campForumApi";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { setSiblingCampData } from "src/store/slices/campDetailSlice";
const SiblingCamps = () => {
  const router = useRouter();
  const { campStatement, siblingCampData, history, campRecord } = useSelector(
    (state: RootState) => ({
      campStatement: state?.topicDetails?.campStatement,
      siblingCampData: state?.topicDetails?.siblingCampData,
      history: state?.topicDetails?.history,
      campRecord: state?.topicDetails?.currentCampRecord,
    })
  );
  const secondToLastElement =
    campRecord?.parentCamps[campRecord?.parentCamps.length - 2];
  const parentCampNum = secondToLastElement ? secondToLastElement.camp_num : 1;
  const [siblingCampsData, setSiblingCampsData] = useState([]);
  const [campHistory, setCampHistory] = useState(history);
  const dispatch = useDispatch();
  const siblingCampsFunction = async () => {
    let body = {
      topic_num: router?.query?.camp[0]?.split("-")[0],
      camp_num: router?.query?.camp[1]?.split("-")[0],
      parent_camp_num: parentCampNum,
    };
    let response = await getSiblingCamp(body);
    setSiblingCampsData(response?.data);
    dispatch(setSiblingCampData(response?.data));
  };

  useEffect(() => {
    siblingCampsFunction();
  }, []);
  useEffect(() => {
    setCampHistory(history);
  }, [history]);
  return (
    <>
      {siblingCampData?.length ? (
        <div className="flex flex-col mt-14">
          <h3 className="font-semibold text-base text-canBlack uppercase">
            SIBLING CAMPS
          </h3>
          <div className="sibling-camps flex xl:flex-row lg:flex-row md:flex-row  flex-col gap-4 my-5">
            {siblingCampsData?.map((obj, index) => {
              return (
                <div key={index} className="bg-canGray p-5 rounded-lg">
                  <h3 className="text-base text-canBlack font-medium mb-3.5">
                    {obj?.camp_name}
                  </h3>
                  <p className="font-normal text-canBlack  leading-[26px] mb-3 text-base ">
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
                        <p className="text-canBlue text-base font-medium leading-[22px]">
                          {obj?.namespace}
                        </p>
                      </div>
                      <div className="flex gap-1 mt-1">
                        <Image
                          src="/images/eyeicon.svg"
                          alt="svg"
                          height={24}
                          width={24}
                        />
                        <p className="text-canLight text-base font-medium  leading-[22px]">
                          {obj?.views}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {obj.supporterData.map((val, index) => {
                        return (
                          <div
                            key={index}
                            className="z-0 w-[32px] h-[32px] rounded-full border-solid border-2 border-white flex justify-center items-center bg-canBlue2 overflow-hidden first:m-[0px]"
                          >
                            <Image
                              src={val?.profile_picture_path}
                              alt="svg"
                              height={32}
                              width={32}
                              className="object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default SiblingCamps;
