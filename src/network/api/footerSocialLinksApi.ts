import NetworkCall from "../networkCall";
import { message } from "antd";
import { store } from "../../store";
import HomePageRequests from "../request/homePageRequests";
import { setCanonizedTopics } from "../../store/slices/homePageSlice";
import FooterRequests from "../request/footerRequests";

export const getFooterSocialLinksApi = async () => {
  try {
    // const links = await NetworkCall.fetch(
    //   FooterRequests.getFooterSocialLinks()
    // );
    const linksMock = {
      facebook: "https://www.facebook.com",
      twitter: "https://www.twitter.com",
      instagram: "https://www.instagram.com/",
      youtube: "https://www.youtube.com",
      linkedIn: "https://www.linkedin.com",
    };
    return linksMock;
    // return links;
  } catch (error) {
    message.error(error.message);
  }
};
