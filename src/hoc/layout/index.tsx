import { Layout } from "antd";
import { Fragment } from "react";
import { useRouter } from "next/router";

import styles from "./layout.module.scss";

import useAuthentication from "src/hooks/isUserAuthenticated";
import LoggedInHeader from "src/components/common/headers/loggedInHeader";
import LoggedOutHeader from "src/components/common/headers/loggedOutHeader";
import FooterComp from "src/components/common/footer";
import GoogleAd from "src/components/googleAds";

const { Header, Footer, Sider, Content } = Layout;

function CustomLayout(props: any) {
  const router = useRouter();

  const { isUserAuthenticated } = useAuthentication();

  return (
    <Fragment>
      <Layout className={`w-100 ${styles.pageWrap}`}>
        {props?.campInfoBar ? props?.campInfoBar : null}
        <Header
          className={`px-3.5 bg-white shadow-lg printHIde`}
          data-testid="loggedOutHeader"
        >
          <LoggedOutHeader />
        </Header>
        <Layout className={`${styles.contentWrap}`}>
          {props?.leftSidebar ? (
            <Sider className={styles.leftSidebar}>
              <GoogleAd
                ad_client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}
                ad_slot={process.env.NEXT_PUBLIC_GOOGLE_ADS_RIGHT_SLOT}
              />
            </Sider>
          ) : null}
          <Content className={`${styles.contentArea}`}>
            {props.children}
          </Content>
          {props?.rightSidebar ? (
            <Sider className={styles.rightSidebar}>
              <GoogleAd
                ad_client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}
                ad_slot={process.env.NEXT_PUBLIC_GOOGLE_ADS_RIGHT_SLOT}
              />
            </Sider>
          ) : null}
        </Layout>
        <Footer className={`p-0 ${styles.footerArea}`}>
          <FooterComp />
        </Footer>
      </Layout>

      <br />
      <hr />
      <hr />
      <br />

      <div className={styles.pageWrap}>
        {isUserAuthenticated ? <LoggedInHeader /> : <LoggedOutHeader />}
        {props?.campInfoBar ? props?.campInfoBar : null}
        <div className={styles.contentWrap}>
          <div
            className={
              styles.contentArea +
              " " +
              styles.eventListArea +
              " " +
              `${
                router?.asPath.includes("timelinetest")
                  ? styles.timelineLayout
                  : ""
              }`
            }
          >
            {props.children}{" "}
          </div>

          {!router?.asPath.includes("eventline") && (
            <aside className={styles.rightSidebar}>
              <GoogleAd
                ad_client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}
                ad_slot={process.env.NEXT_PUBLIC_GOOGLE_ADS_RIGHT_SLOT}
              />
            </aside>
          )}
        </div>
        <FooterComp />
      </div>
    </Fragment>
  );
}

export default CustomLayout;
