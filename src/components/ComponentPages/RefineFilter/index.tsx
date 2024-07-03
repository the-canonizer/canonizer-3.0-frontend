import React, { useRef, useState } from 'react';
import { Button, Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import {
    setOpenDrawer
  } from "../../../store/slices/campDetailSlice";
import FilterWithTree from "../../common/topicsFilter/filterWithTree";

const RefineFilter=() => {
  const [open, setOpen] = useState(false);
  const { openDrawer } = useSelector((state: RootState) => ({
    openDrawer: state.topicDetails.openDrawer,
  }));

  const dispatch = useDispatch()
  const isMobile = window.matchMedia("(min-width: 1280px)").matches;
  let myRefToCampStatement = useRef(null);


  const onClose = () => {
    dispatch(setOpenDrawer(false))
  };
  const scrollToCampStatement = () => {
    myRefToCampStatement.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Drawer placement={!isMobile ? 'bottom' : 'right'} title="Refine" onClose={onClose} open={openDrawer} height={600} closable={false} className='custom-collapse'>
       <FilterWithTree 
       getTreeLoadingIndicator={false}
       scrollToCampStatement={scrollToCampStatement}
       setTotalCampScoreForSupportTree={()=>{}}
       setSupportTreeForCamp={()=>{}}
      //  backGroundColorClass={}
      //  loadingIndicator={}
      //  isForumPage={false}
       />
      </Drawer>
    </>
  );
};

export default RefineFilter;