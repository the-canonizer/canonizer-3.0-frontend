"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Row, Col } from "antd";

import Layout from "../../hoc/layout";
import SideBar from "../../components/ComponentPages/Home/SideBar/sideBarApp";
const TopicsList = dynamic(
  () => import("../../components/ComponentPages/Home/TopicsList/topicListApp"),
  { ssr: false }
);
import { setCurrentDate } from "src/store/slices/filtersSlice";
import dynamic from "next/dynamic";

const BrowsePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // dispatch(setCanonizedNameSpaces(nameSpacesList));
  // dispatch(setCanonizedAlgorithms(algorithms));

  dispatch(setCurrentDate(new Date().valueOf));

  // useEffect(() => {
  //   let queries = router.query;
  //   if ("namespace" in queries) {
  //     const { namespace, ...rest } = queries;
  //     rest.canon = namespace;
  //     router.query = rest;
  //     router.replace(router, null, { shallow: true });
  //   }
  // }, []);

  return (
    <>
      
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <Row gutter={16}>
            <Col xs={24} sm={24} xl={24}>
              <TopicsList />
            </Col>
          </Row>
        </div>
     
    </>
  );
};

// export async function getServerSideProps() {
//   const currentDate = new Date().valueOf();

//   return {
//     props: {
//       current_date: currentDate,
//     },
//   };
// }

// export async function getServerSideProps() {
//   const [nameSpaces, canonizedAlgorithms] = await Promise.all([
//     getCanonizedNameSpacesApi(),
//     getCanonizedAlgorithmsApi(),
//   ]);

//   return {
//     props: {
//       nameSpacesList: nameSpaces || [],
//       algorithms: canonizedAlgorithms || [],
//     },
//   };
// }

BrowsePage.displayName = "BrowsePage";

export default BrowsePage;
