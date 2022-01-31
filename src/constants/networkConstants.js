const NetworkConstants = {
  URL: {
    Base: process.env.REACT_APP_BASE_URL,
    // BaseAPI: process.env.REACT_APP_BASE_API_URL,
    BaseAPI: "",
    Timeout: process.env.REACT_APP_TIMEOUT,
    Client: {
      BaseHost: process.env.REACT_APP_CLIENT_BASE_HOST,
      BasePort: process.env.REACT_APP_CLIENT_BASE_PORT,
    },
    // User
    LoginUser: "/login",
    LogoutUser: "/logout",
    UpdateUser: "/users/",

    // Tree

    GetTree: "/api/unknown",

    // HomePage
    GetCanonizedTopics: "http://codedistrictem.com:7010/api/v1/topic/getAll",
    GetHelpCardContent: "/api/help_card",
    GetCanonizedNameSpaces:
      "http://codedistrictem.com:7020/api/v3/get_all_namespaces",
    GetWhatsNewContent:
      "http://codedistrictem.com:7020/api/v3/get_whats_new_content",

    //footer

    GetFooterSocialLinks:
      "http://codedistrictem.com:7020/api/v3/get_social_media_links",
  },
  Method: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
  },
  Header: {
    ContentType: "Content-Type",
    ApplicationJson: "application/json",
    Default: (token = "") => ({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    }),
    Authorization: (token = "") => ({
      // Authorization: "Bearer " + token,
      // "Content-Type": "multipart/form-data",
      // Accept: "application/json",
      "Content-Type": "application/json",
    }),
    Type: {
      Json: "json",
      File: "file",
      formData: "multipart/form-data",
    },
  },
  Default: {
    Error: "Opps, an error occurred!",
  },
  StatusCode: {
    Unauthorized: 401,
    Invalid: 401,
    NotFound: 404,
  },
};
export default NetworkConstants;
