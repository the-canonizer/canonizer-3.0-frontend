import { Layout } from "antd";

import styles from "./layout.module.scss";

import MainHeader from "src/components/common/headers/mainHeader";
import FooterComp from "src/components/common/footer";
import GoogleAd from "src/components/googleAds";

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
    <Layout className={`w-100`}>
      <Header
        className={`px-4 h-auto bg-white shadow-lg mb-4 printHIde`}
        data-testid="main_header"
      >
        <MainHeader />
      </Header>

      {props?.afterHeader ? (
        <div className="px-4 my-3">{props?.afterHeader}</div>
      ) : null}

      <Layout className={`px-4 max-w-full ${styles.contentArea} ${getCls()}`}>
        {props?.leftSidebar ? (
          <aside className={`mr-5 ${styles.leftSidebar} md:mr-0`}>
            {props?.leftSidebar}
          </aside>
        ) : null}

        <main className={`${styles.contentBox}`}>{props.children}</main>

        {props?.rightSidebar ? (
          <aside className={`ml-5 ${styles.rightSidebar} md:ml-0`}>
            {props?.rightSidebar}
          </aside>
        ) : null}
      </Layout>
      <div className="ad_area p-4">
        <GoogleAd
          ad_client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}
          ad_slot={process.env.NEXT_PUBLIC_GOOGLE_ADS_RIGHT_SLOT}
        />
      </div>
      <Footer className={`p-0`}>
        <FooterComp />
      </Footer>
    </Layout>
  );
}

export default CustomLayout;
