import { Fragment } from "react";

import Logo from "../logoHeader";
import HeaderMenu from "../HeaderMenu";
import SearchHeader from "../search";
import useAuthentication from "src/hooks/isUserAuthenticated";

const LoggedOutHeader = () => {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <Fragment>
      <div className="flex justify-start items-center z-10 w-100 py-5">
        <Logo />
        <SearchHeader className="header-search-bar" />
        <HeaderMenu
          className="ml-1 lg:ml-auto"
          isUserAuthenticated={isUserAuthenticated}
        />
      </div>
    </Fragment>
  );
};

export default LoggedOutHeader;
