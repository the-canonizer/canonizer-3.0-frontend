import { store } from "../../store";
import { createWrapper } from "next-redux-wrapper";
import HeadContent from "../headContent";
import GetStartedHeader from "../../components/common/headers/getStartedHeader";
import MetaTags from "../../MetaTags";
import { useState } from "react";

function GetStartedLayout(props) {
  // const meta = MetaTags[props.routeName];

  const [meta] = useState(MetaTags[props.routeName]);

  return (
    <>
      <HeadContent
        title={meta?.title}
        description={meta?.description}
        route={meta?.route}
        image_url={meta?.image_url}
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
