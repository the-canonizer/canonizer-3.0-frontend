import { Row, Col } from "antd";
import Layout from "../hoc/layout";
import SideBar from "../components/ComponentPages/Home/SideBar";
const TopicsList = dynamic(
  () => import("../components/ComponentPages/Home/TopicsList"),
  { ssr: false }
);
import { useDispatch } from "react-redux";
import { setCurrentDate } from "src/store/slices/filtersSlice";
import dynamic from "next/dynamic";

const BrowsePage = ({ current_date }: any) => {
  const dispatch = useDispatch();
  // dispatch(setCanonizedNameSpaces(nameSpacesList));
  // dispatch(setCanonizedAlgorithms(algorithms));

  dispatch(setCurrentDate(current_date));

  return (
    <>
      <Layout routeName={"browse"}>
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
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
  const currentDate = new Date().valueOf();

  return {
    props: {
      current_date: currentDate,
    },
  };
}

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
