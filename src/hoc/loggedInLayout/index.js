import { store } from "../../store";
import HeadContent from "../headContent";
import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import { useEffect, useState } from "react";
import usePermission from "../../hooks/usePermissions";
import MetaTags from "../../MetaTags";

function LoggedInLayout(props) {
  const { auth } = store.getState();
  const { isAllowed } = usePermission();
  const [meta, setMeta] = useState(MetaTags[props.routeName]);

  useEffect(() => {
    if (!auth.token) {
      window.location.href = "/login";
    } else if (props.permission) {
      if (!isAllowed(props.permission)) {
        window.location.href = "/required-permission";
      }
    }
    // set default meta tags
    if (!props.routeName || !meta || Object.keys(meta).length === 0) {
      setMeta({
        title: "About Canonizer",
        description: "Short description ",
        route: "about",
      });
      console.log(
        `${
          props.routeName
            ? `${props.routeName} -- this route name is not matched with any Object's key in MetaTags file`
            : "routeName is not passed to layout as props"
        } `
      );
    }
  }, []);

  return (
    <>
      <HeadContent
        title={meta?.title}
        description={meta?.description}
        route={meta?.route}
        image_url={meta?.image_url}
      />
      <div className="app-layout">
        <LoggedInHeader />
        <div className="app-content">{props.children}</div>
      </div>
    </>
  );
}

// const makeStore = () => store;
// const wrapper = createWrapper(makeStore);

export default LoggedInLayout;
// export default wrapper.withRedux(LoggedInLayout);
