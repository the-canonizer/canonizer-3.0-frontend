import { createWrapper } from "next-redux-wrapper";

import { store } from "../../store";
import GetStartedHeader from "../../components/common/headers/getStartedHeader";
import Footer from "../../components/common/footer";
import DisclaimerMsg from "../../components/common/disclaimer";

function GetStartedLayout(props) {
  return (
    <>
      <div className="app-layout">
        <GetStartedHeader />
        <DisclaimerMsg />
        <div className="app-content">{props.children}</div>
        <Footer />
      </div>
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

// export default Layout;
export default wrapper.withRedux(GetStartedLayout);
