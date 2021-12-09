const NetworkConstants = {
  URL: {
    Base: process.env.REACT_APP_BASE_URL,
    BaseAPI: process.env.REACT_APP_BASE_API_URL,
    Timeout: process.env.REACT_APP_TIMEOUT,

    // User
    LoginUser: "/login",
    UpdateUser: "/users/",
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
      File: "file",
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
