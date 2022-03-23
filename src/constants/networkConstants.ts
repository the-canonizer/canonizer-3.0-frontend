const BaseCanonizerServiceUrl = process.env.NEXT_PUBLIC_BASE_SERVICE_URL;
const BaseCanonizerApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
const BaseImagesURL = process.env.NEXT_PUBLIC_BASE_IMAGES_URL;
const NetworkConstants = {
  URL: {
    BaseImagesURL,
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
    ChangePassword: `${BaseCanonizerApiUrl}/change-password`,
    GetUserProfileInfo: `${BaseCanonizerApiUrl}/user/profile`,
    UpdateUserProfileInfo: `${BaseCanonizerApiUrl}/update-profile`,
    GetMobileCarrier: `${BaseCanonizerApiUrl}/mobile-carrier`,
    SendOTP: `${BaseCanonizerApiUrl}/send-otp`,
    VerifyOTP: `${BaseCanonizerApiUrl}/verify-otp`,
    GetLanguageList: `${BaseCanonizerApiUrl}/get-languages`,
    // Forgot Password
    SendForgotPasswordOTP: `${BaseCanonizerApiUrl}/forgotpassword/sendOtp`,
    VerifyForgotPasswordOTP: `${BaseCanonizerApiUrl}/forgotpassword/verifyOtp`,
    UpdateForgotPassword: `${BaseCanonizerApiUrl}/forgotpassword/update`,
    //NickName
    AddNickName: `${BaseCanonizerApiUrl}/add-nick-name`,
    GetNickNameList: `${BaseCanonizerApiUrl}/get-nick-name-list`,
    UpdateNickName: `${BaseCanonizerApiUrl}/update-nick-name`,
    //Direct Supported camps
    GetDirectSupportedCamps: `${BaseCanonizerApiUrl}/get-direct-supported-camps`,
    //Delegated Supported Camps
    GetDelegatedSupportCamps: `${BaseCanonizerApiUrl}/get-delegated-supported-camps`,
    // Tree
    GetTree: `${BaseCanonizerServiceUrl}/api/v1/tree/get`,
    GetNewsFeed: `${BaseCanonizerApiUrl}/get/camp-newsfeed`,
    GetCampStatement: `${BaseCanonizerApiUrl}/get/camp-statement`,
    GetSupportingTree: `${BaseCanonizerApiUrl}/get/supporting-tree`,
    // resend otp for registration
    ResendOTPForRegistration: `${BaseCanonizerApiUrl}/user/reSendOtp`,

    // HomePage
    GetCanonizedTopics: `${BaseCanonizerServiceUrl}/api/v1/topic/getAll`,

    GetCanonizedNameSpaces: `${BaseCanonizerApiUrl}/get-all-namespaces`,
    GetWhatsNewContent: `${BaseCanonizerApiUrl}/get-whats-new-content`,
    GetCanonizedAlgorithms: `${BaseCanonizerApiUrl}/get-algorithms`,
    GetCanonizedRecentActivities: `${BaseCanonizerApiUrl}/get-recent-activities`,

    // topic
    CreateTopic: `${BaseCanonizerApiUrl}/topic/save`,

    // Camp
    CreateCamp: `${BaseCanonizerApiUrl}/camp/save`,

    //footer

    GetFooterSocialLinks: `${BaseCanonizerApiUrl}/get-social-media-links`,
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
