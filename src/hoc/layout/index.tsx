import { Layout } from "antd";

import styles from "./layout.module.scss";

import MainHeader from "src/components/common/headers/mainHeader";
import FooterComp from "src/components/common/footer";
import RegistrationModal from "src/components/ComponentPages/Registration/registrationModal";
import DisclaimerMsg from "src/components/common/disclaimer";
import ArchivedCampMsg from "src/components/common/ArchivedCampMsg";
// import GoogleAd from "src/components/googleAds";

const { Header, Footer } = Layout;

function CustomLayout(props: any) {
  const getCls = () => {
    if (props?.leftSidebar && props?.rightSidebar) {
      return styles.withBothsideBar;
    }

    if (props?.leftSidebar) {
      return styles.withLeftsideBar;
    }

    if (props?.rightSidebar) {
      return styles.withRightsideBar;
    }

    return "";
  };

  return (
    <Layout className={`w-100 ${props?.className}`}>
      {!props?.withOutHeader ? (
        <Header
          className={`px-4 md:px-7 h-auto bg-white shadow-lg mb-10 printHIde`}
          data-testid="main_header"
        >
          <MainHeader />
        </Header>
      ) : null}

      <DisclaimerMsg />
      <ArchivedCampMsg />
      <RegistrationModal />

      {props?.afterHeader ? (
        <div className="px-4 md:px-7 my-3 mb-10">{props?.afterHeader}</div>
      ) : null}

      <Layout
        className={`px-4 md:px-7 max-w-full ${styles.contentArea} ${getCls()}`}
      >
        {props?.leftSidebar ? (
          <aside className={`${styles.leftSidebar} md:mr-7`}>
            {props?.leftSidebar}
          </aside>
        ) : null}

        <main className={`${styles.contentBox}`}>{props.children}</main>

        {props?.rightSidebar ? (
          <aside className={`${styles.rightSidebar} lg:ml-7`}>
            {props?.rightSidebar}
          </aside>
        ) : null}
      </Layout>
      {/* <div className="ad_area p-4">
        <GoogleAd
          ad_client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}
          ad_slot={process.env.NEXT_PUBLIC_GOOGLE_ADS_RIGHT_SLOT}
        />
      </div> */}
      <Footer className={`p-0`}>
        <FooterComp />
      </Footer>
    </Layout>
  );
}

export default CustomLayout;
