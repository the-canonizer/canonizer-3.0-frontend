import { Row, Col } from "antd";
import Layout from "../hoc/layout";
import SideBar from "../components/ComponentPages/Home/SideBar";
import TopicsList from "../components/ComponentPages/Home/TopicsList";
import {
  getCanonizedAlgorithmsApi,
  getCanonizedNameSpacesApi,
} from "../network/api/homePageApi";
import {
  setCanonizedAlgorithms,
  setCanonizedNameSpaces,
} from "../store/slices/homePageSlice";
import { useDispatch } from "react-redux";
const BrowsePage = () => {
  // const dispatch = useDispatch();
  // dispatch(setCanonizedNameSpaces(nameSpacesList));
  // dispatch(setCanonizedAlgorithms(algorithms));
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
