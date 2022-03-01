import SideBar from "../Home/SideBar";
import CampTree from "./CampTree";
const TopicDetails = (props) => {
  return (
    <>
      <aside className="leftSideBar miniSideBar">
        <SideBar />
        <CampTree />
      </aside>
      <div className="pageContentWrap">hello</div>
    </>
  );
};

export default TopicDetails;
