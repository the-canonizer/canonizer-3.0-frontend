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
  const [isImageError, setIsImageError] = useState(false);
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
  const handleImageError = () => {
    setIsImageError(true);
  };
  return (
    <>
      {siblingCampData?.length ? (
        <div className="flex flex-col mt-14">
          <h3 className="font-semibold text-base text-canBlack uppercase">
            SIBLING CAMPS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-5">
            {siblingCampsData?.map((obj, index) => {
              return (
                <div
                  key={index}
                  className="bg-canGray px-4 py-5 rounded-xl flex flex-col gap-5"
                >
                  <h3 className="text-base text-canBlack font-medium">
                    {obj?.camp_name}
                  </h3>
                  <p className="text-canBlack opacity-80 text-base">
                    {obj?.statement}
                  </p>
                  <div className="flex items-center justify-between mt-auto gap-3 flex-wrap">
                    <div className="flex flex-col gap-5">
                      <div className="flex gap-1 items-center ">
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
                      <div className="flex gap-1 items-center">
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
                            className="z-0 w-[34px] h-[34px] rounded-full border-solid border-2 border-white flex justify-center items-center text-canBlack font-medium text-base bg-canBlue2 overflow-hidden -ml-4 first:m-[0px]"
                          >
                            {!isImageError ? (
                              <Image
                                src={val?.profile_picture_path}
                                alt={`${val?.first_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}${val?.last_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}`}
                                height={32}
                                width={32}
                                className="object-cover"
                                onError={handleImageError}
                              />
                            ) : (
                              `${val?.first_name
                                ?.charAt(0)
                                ?.toUpperCase()}${val?.last_name
                                ?.charAt(0)
                                ?.toUpperCase()}`
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* <div className="flex">
                      <div className="z-0 w-[32px] h-[32px] rounded-full border-solid border-2 border-white flex justify-center items-center bg-canBlue2 overflow-hidden first:m-[0px]">
                        <Image
                          src="/images/sibling-user.png"
                          alt="svg"
                          height={32}
                          width={32}
                          className="object-cover"
                        />
                      </div>
                  
                    </div> */}
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
