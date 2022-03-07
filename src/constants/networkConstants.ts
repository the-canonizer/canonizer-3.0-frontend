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
    CreateToken: `${BaseCanonizerApiUrl}/client_token`,
    LoginUser: `${BaseCanonizerApiUrl}/user/login`,
    LogoutUser: `${BaseCanonizerApiUrl}/user/logout`,
    RegisterUser: `${BaseCanonizerApiUrl}/register`,
    VerifyRegisterUser: `${BaseCanonizerApiUrl}/verifyOtp`,
    UserSocialLogin: `${BaseCanonizerApiUrl}/user/social/login`,
    UserSocialLoginCallback: `${BaseCanonizerApiUrl}/user/social/callback`,
    CountryCodes: `${BaseCanonizerApiUrl}/country/list`,
    UpdateUser: `${BaseCanonizerApiUrl}/users/`,
    ChangePassword: `${BaseCanonizerApiUrl}/changepassword`,
    GetUserProfileInfo: `${BaseCanonizerApiUrl}/user/profile`,
    UpdateUserProfileInfo: `${BaseCanonizerApiUrl}/updateprofile`,
    GetMobileCarrier: `${BaseCanonizerApiUrl}/mobilecarrier`,
    SendOTP: `${BaseCanonizerApiUrl}/sendotp`,
    VerifyOTP: `${BaseCanonizerApiUrl}/verifyotp`,
    GetAlgorithmsList: `${BaseCanonizerApiUrl}/get_algorithms`,
    GetLanguageList: `${BaseCanonizerApiUrl}/get_languages`,
    // Forgot Password
    SendForgotPasswordOTP: `${BaseCanonizerApiUrl}/forgotpassword/sendOtp`,
    VerifyForgotPasswordOTP: `${BaseCanonizerApiUrl}/forgotpassword/verifyOtp`,
    UpdateForgotPassword: `${BaseCanonizerApiUrl}/forgotpassword/update`,
    //NickName
    AddNickName: `${BaseCanonizerApiUrl}/add_nick_name`,
    GetNickNameList: `${BaseCanonizerApiUrl}/get_nick_name_list`,
    UpdateNickName: `${BaseCanonizerApiUrl}/update_nick_name`,
    // Tree
    GetTree: "/api/unknown",
    // resend otp for registration
    ResendOTPForRegistration: `${BaseCanonizerApiUrl}/user/reSendOtp`,

    // HomePage
    GetCanonizedTopics: `${BaseCanonizerServiceUrl}/api/v1/topic/getAll`,

    GetCanonizedNameSpaces: `${BaseCanonizerApiUrl}/get_all_namespaces`,
    GetWhatsNewContent: `${BaseCanonizerApiUrl}/get_whats_new_content`,
    GetCanonizedAlgorithms: `${BaseCanonizerApiUrl}/get_algorithms`,
    GetCanonizedRecentActivities: `${BaseCanonizerApiUrl}/get_recent_activities`,

    //footer

    GetFooterSocialLinks: `${BaseCanonizerApiUrl}/get_social_media_links`,
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
