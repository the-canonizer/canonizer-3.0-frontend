import React, { useRef, useState } from "react";
import { Button, Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { setAsOfValues, setClearAlgoFromRefineFilter, setClearScoreFromRefineFilter, setOpenDrawer } from "../../../store/slices/campDetailSlice";
import FilterWithTree from "../../common/topicsFilter/filterWithTree";
import Image from "next/image";

const RefineFilter = () => {
  const [open, setOpen] = useState(false);
  const { openDrawer } = useSelector((state: RootState) => ({
    openDrawer: state.topicDetails.openDrawer,
  }));

  const dispatch = useDispatch();
  const isMobile = window.matchMedia("(min-width: 1280px)").matches;
  let myRefToCampStatement = useRef(null);

  const onClose = () => {
    dispatch(setOpenDrawer(false));
  };
  const scrollToCampStatement = () => {
    myRefToCampStatement.current?.scrollIntoView({ behavior: "smooth" });
  };
  const clearAllFilter = ()=>{
    dispatch(setAsOfValues(2))
    dispatch(setClearAlgoFromRefineFilter("blind_popularity"))
    dispatch(setClearScoreFromRefineFilter(0))
  }
  return (
    <>
      <Drawer
        closeIcon={
          <Image src="/images/refine-back-arrow.svg" width={16} height={24} />
        }
        placement={!isMobile ? "bottom" : "right"}
        title="Refine"
        onClose={onClose}
        open={openDrawer}
        height={700}
        width={490}
        extra={<span onClick={()=>(clearAllFilter())}>Clear all</span>}
        // closable={false}
        className="custom-collapse pt-14 lg:[&_.ant-drawer-header]:pl-8 [&_.ant-drawer-header]:pl-4 [&_.ant-drawer-header-title]:gap-5 [&_.ant-drawer-close]:!hidden lg:[&_.ant-drawer-close]:!flex lg:[&_.ant-drawer-close]:!m-0 [&_.ant-drawer-header-title]:!flex [&_.ant-drawer-header-title]:!items-center  lg:[&_.ant-drawer-title]:text-24 [&_.ant-drawer-title]:text-sm [&_.ant-drawer-title]:font-medium [&_.ant-drawer-title]:text-canBlack lg:[&_.ant-drawer-content]:pt-16 [&_.ant-drawer-content]:pt-8 
        lg:[&_.ant-drawer-header-title]:pb-9 [&_.ant-drawer-title]:pb-0 lg:[&_.ant-drawer-header]:!border-none [&_.ant-drawer-header]:!border-canLightgrey4
      [&_.ant-drawer-body]:!w-full [&_.ant-drawer-body]:p-0 [&_.ant-drawer-content]:!rounded-tl-2xl md:[&_.ant-drawer-content]:!rounded-tl-2xl xl:[&_.ant-drawer-content]:!rounded-tl-[0px] xl:[&_.ant-drawer-content]:!rounded-tr-[0px] lg:[&_.ant-drawer-content]:!rounded-tr-[0px] lg:[&_.ant-drawer-content]:!rounded-tl-[0px] [&_.ant-drawer-content]:!rounded-tr-2xl [&_.ant-drawer-body]:overflow-hidden lg:[&_.ant-drawer-extra]:hidden [&_.ant-drawer-extra]:block [&_.ant-drawer-extra]:text-canRed [&_.ant-drawer-extra]:text-sm [&_.ant-drawer-extra]:font-semibold"
      >
       
        <div className="lg:hidden flex w-[90px] h-[4px] bg-canBlack absolute top-4 rounded-full left-2/4 transform -translate-x-1/2"></div>
        
      
        <FilterWithTree
          getTreeLoadingIndicator={false}
          scrollToCampStatement={scrollToCampStatement}
          setTotalCampScoreForSupportTree={() => {}}
          setSupportTreeForCamp={() => {}}
          //  backGroundColorClass={}
          //  loadingIndicator={}
          //  isForumPage={false}
        />
      </Drawer>
    </>
  );
};

export default RefineFilter;
