import { store } from "../../store";
import { createWrapper } from "next-redux-wrapper";
import GetStartedHeader from "../../components/common/headers/getStartedHeader";

function GetStartedLayout(props) {
  return (
    <>
      <div className="app-layout">
        <GetStartedHeader />

        <div className="app-content">{props.children}</div>
      </div>
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

// export default Layout;
export default wrapper.withRedux(GetStartedLayout);
