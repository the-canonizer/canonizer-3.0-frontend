// import { createWrapper } from "next-redux-wrapper";

// import { store } from "../../store";
import GetStartedHeader from "../../components/common/headers/getStartedHeader";
import Footer from "../../components/common/footer";

function GetStartedLayout(props: any) {
  return (
    <>
      <div className="app-layout">
        <GetStartedHeader />
        <div className="app-content">{props.children}</div>
        <Footer />
      </div>
    </>
  );
}

// const makeStore = () => store;
// const wrapper = createWrapper(makeStore);

// export default Layout;
export default GetStartedLayout;
