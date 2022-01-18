const NetworkConstants = {
  URL: {
    Base: process.env.NEXT_PUBLIC_BASE_URL,
    BaseAPI: process.env.NEXT_PUBLIC_BASE_API_URL,
    Timeout: process.env.NEXT_PUBLIC_TIMEOUT,
    Client: {
      BaseHost: process.env.NEXT_PUBLIC_CLIENT_BASE_HOST,
      BasePort: process.env.NEXT_PUBLIC_CLIENT_BASE_PORT,
    },
    // User
    CreateToken: "/client_token",
    LoginUser: "/user/login",
    LogoutUser: "/user/logout",
    RegisterUser: "/register",
    VerifyRegisterUser: "/verifyOtp",
    UpdateUser: "/users/",

    // Tree

    GetTree: "/api/unknown",
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
