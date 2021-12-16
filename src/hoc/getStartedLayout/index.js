import { store } from "../../store";
import { createWrapper } from "next-redux-wrapper";
import HeadContent from "../headContent";
import GetStartedHeader from "../../components/common/headers/getStartedHeader";

function GetStartedLayout(props) {
  return (
    <>
      <HeadContent
        title={props.meta.title}
        description={props.meta.description}
        route={props.meta.route}
        image_url={props.meta.image_url}
      />
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
