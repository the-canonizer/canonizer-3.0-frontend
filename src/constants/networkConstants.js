const NetworkConstants = {
  URL: {
    Base: process.env.REACT_APP_BASE_URL,
    // BaseAPI: process.env.REACT_APP_BASE_API_URL,
    BaseAPI: "http://localhost:8000",
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
    GetCanonizedTopics: "/api/v1/topic/getAll",
    GetHelpCardContent: "/api/help_card",

    //footer

    GetFooterSocialLinks: "/api/v1/socialLinks",
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
      Authorization: "Bearer " + token,
    }),
    Type: {
      Json: "json",
      multipartFormData: "multipart/form-data",
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
