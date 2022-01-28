import NetworkCall from "../networkCall";
import { message } from "antd";
import { store } from "../../store";
import HomePageRequests from "../request/homePageRequests";
import { setCanonizedTopics } from "../../store/slices/homePageSlice";
import FooterRequests from "../request/footerRequests";

export const getFooterSocialLinksApi = async () => {
  try {
    const links = await NetworkCall.fetch(
      FooterRequests.getFooterSocialLinks()
    );

    return links?.data;
  } catch (error) {
    message.error(error.message);
  }
};
