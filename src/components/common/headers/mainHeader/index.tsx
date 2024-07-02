import { Fragment } from "react";

import Logo from "../logoHeader";
import HeaderMenu from "../HeaderMenu";
import SearchHeader from "../search";
import useAuthentication from "src/hooks/isUserAuthenticated";
import Router, { useRouter } from "next/router";
import Image from "next/image";

const LoggedOutHeader = () => {
  const { isUserAuthenticated } = useAuthentication();

  const isMobile = window.matchMedia("(min-width: 1024.98px)").matches;
  const router = useRouter();

  // const isMobile = window.matchMedia("(min-width: 1280px)").matches;

  return (
    <Fragment>
     <div className="flex sm:justify-between md:justify-between justify-between items-center z-10 w-100 py-2">
        {!isMobile && router?.pathname == "/topic/[...camp]" && (
          <h3 className=" text-[18px] text-[#242B37] leading-[26px] font-medium flex items-center">
            <Image src="/images/left-caret.svg" alt="" height={24} width={24} />
            Camp Details</h3>
        )}
        {isMobile && router?.pathname == "/topic/[...camp]" ?  <Logo /> : ""}

        {isMobile && router?.pathname == "/topic/[...camp]" && (
          <SearchHeader className="ml-5" />
        )}

        <HeaderMenu
          className="ml-auto lg:ml-1"
          isUserAuthenticated={isUserAuthenticated}
        />
      </div>  
    

      {/* <SearchSection /> */}
      {/* <DisclaimerMsg />
      <ArchivedCampMsg />
      <LoginModal />
      <RegistrationModal />
      <ForgotModal /> */}
    </Fragment>
  );
};

export default LoggedOutHeader;
