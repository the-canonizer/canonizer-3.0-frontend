const BaseCanonizerServiceUrl = process.env.NEXT_PUBLIC_BASE_SERVICE_URL;
const BaseCanonizerApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
const NetworkConstants = {
  URL: {
    BaseAPI: BaseCanonizerApiUrl,
    Base: process.env.NEXT_PUBLIC_BASE_URL,
    Timeout: process.env.NEXT_PUBLIC_TIMEOUT,
    Client: {
      BaseHost: process.env.NEXT_PUBLIC_CLIENT_BASE_HOST,
      BasePort: process.env.NEXT_PUBLIC_CLIENT_BASE_PORT,
    },
    // User
    CreateToken: `${BaseCanonizerApiUrl}/api/v3/client_token`,
    LoginUser: `${BaseCanonizerApiUrl}/api/v3/user/login`,
    LogoutUser: `${BaseCanonizerApiUrl}/api/v3/user/logout`,
    RegisterUser: `${BaseCanonizerApiUrl}/api/v3/register`,
    VerifyRegisterUser: `${BaseCanonizerApiUrl}/api/v3/verifyOtp`,
    UserSocialLogin: `${BaseCanonizerApiUrl}/api/v3/user/social/login`,
    UserSocialLoginCallback: `${BaseCanonizerApiUrl}/api/v3/user/social/callback`,
    CountryCodes: `${BaseCanonizerApiUrl}/api/v3/country/list`,
    UpdateUser: `${BaseCanonizerApiUrl}/api/v3/users/`,
    ChangePassword: `${BaseCanonizerApiUrl}/change-password`,
    GetUserProfileInfo: `${BaseCanonizerApiUrl}/user/profile`,
    UpdateUserProfileInfo: `${BaseCanonizerApiUrl}/update-profile`,
    GetMobileCarrier: `${BaseCanonizerApiUrl}/mobile-carrier`,
    SendOTP: `${BaseCanonizerApiUrl}/send-otp`,
    VerifyOTP: `${BaseCanonizerApiUrl}/verify-otp`,
    GetAlgorithmsList: `${BaseCanonizerApiUrl}/get_algorithms`,
    GetLanguageList: `${BaseCanonizerApiUrl}/get-languages`,
    // Forgot Password
    SendForgotPasswordOTP: `${BaseCanonizerApiUrl}/api/v3/forgotpassword/sendOtp`,
    VerifyForgotPasswordOTP: `${BaseCanonizerApiUrl}/api/v3/forgotpassword/verifyOtp`,
    UpdateForgotPassword: `${BaseCanonizerApiUrl}/api/v3/forgotpassword/update`,
    //NickName
    AddNickName: `${BaseCanonizerApiUrl}/add-nick-name`,
    GetNickNameList: `${BaseCanonizerApiUrl}/get-nick-name-list`,
    UpdateNickName: `${BaseCanonizerApiUrl}/update-nick-name`,
    // Tree
    GetTree: "/api/unknown",
    // resend otp for registration
    ResendOTPForRegistration: `${BaseCanonizerApiUrl}/api/v3/user/reSendOtp`,

    // HomePage
    GetCanonizedTopics: `${BaseCanonizerServiceUrl}/api/v1/topic/getAll`,

    GetCanonizedNameSpaces: `${BaseCanonizerApiUrl}/api/v3/get_all_namespaces`,
    GetWhatsNewContent: `${BaseCanonizerApiUrl}/api/v3/get_whats_new_content`,
    GetCanonizedAlgorithms: `${BaseCanonizerApiUrl}/api/v3/get_algorithms`,
    GetCanonizedRecentActivities: `${BaseCanonizerApiUrl}/api/v3/get_recent_activities`,

    //footer

    GetFooterSocialLinks: `${BaseCanonizerApiUrl}/api/v3/get_social_media_links`,
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
