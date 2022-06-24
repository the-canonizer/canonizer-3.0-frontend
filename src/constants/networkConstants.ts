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
    CreateToken: `${BaseCanonizerApiUrl}/client-token`,
    LoginUser: `${BaseCanonizerApiUrl}/user/login`,
    LogoutUser: `${BaseCanonizerApiUrl}/user/logout`,
    RegisterUser: `${BaseCanonizerApiUrl}/register`,
    VerifyRegisterUser: `${BaseCanonizerApiUrl}/post-verify-otp`,
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
    SendForgotPasswordOTP: `${BaseCanonizerApiUrl}/forgot-password/send-otp`,
    VerifyForgotPasswordOTP: `${BaseCanonizerApiUrl}/forgot-password/verify-otp`,
    UpdateForgotPassword: `${BaseCanonizerApiUrl}/forgot-password/update`,
    //NickName
    AddNickName: `${BaseCanonizerApiUrl}/add-nick-name`,
    GetNickNameList: `${BaseCanonizerApiUrl}/get-nick-name-list`,
    UpdateNickName: `${BaseCanonizerApiUrl}/update-nick-name`,
    //Direct Supported camps
    GetDirectSupportedCamps: `${BaseCanonizerApiUrl}/get-direct-supported-camps`,
    RemoveSupportesCampsEntireTopic: `${BaseCanonizerApiUrl}/support/remove`,
    RemoveOrUpdateDirectSupportCamps: `${BaseCanonizerApiUrl}/support/update`,
    //Delegated Supported Camps
    GetDelegatedSupportCamps: `${BaseCanonizerApiUrl}/get-delegated-supported-camps`,
    // topic details page api's
    GetTree: `${BaseCanonizerServiceUrl}/api/v1/tree/get`,
    GetNewsFeed: `${BaseCanonizerApiUrl}/get-camp-newsfeed`,
    GetCampStatement: `${BaseCanonizerApiUrl}/get-camp-statement`,
    GetSupportingTree: `${BaseCanonizerApiUrl}/get/supporting-tree`,
    GetCurrentTopicRecord: `${BaseCanonizerApiUrl}/get-topic-record`,
    GetCurrentCampRecord: `${BaseCanonizerApiUrl}/get-camp-record`,
    subscribeToCamp: `${BaseCanonizerApiUrl}/camp/subscription`,
    GetCampBreadCrumb: `${BaseCanonizerApiUrl}/get-camp-breadcrumb`,
    GetTopicActivityLog: `${BaseCanonizerApiUrl}/get-camp-activity-log`,
    // resend otp for registration
    ResendOTPForRegistration: `${BaseCanonizerApiUrl}/user/resend-otp`,

    // HomePage
    GetCanonizedTopics: `${BaseCanonizerServiceUrl}/api/v1/topic/getAll`,

    GetCanonizedNameSpaces: `${BaseCanonizerApiUrl}/get-all-namespaces`,
    GetWhatsNewContent: `${BaseCanonizerApiUrl}/get-whats-new-content`,
    GetCanonizedAlgorithms: `${BaseCanonizerApiUrl}/get-algorithms`,
    GetCanonizedRecentActivities: `${BaseCanonizerApiUrl}/get-activity-log`,

    // topic
    CreateTopic: `${BaseCanonizerApiUrl}/topic/save`,

    //UploadFile
    UploadFile: `${BaseCanonizerApiUrl}/upload-files`,
    //UploadFileAndFolder
    GetUploadFileAndFolder: `${BaseCanonizerApiUrl}/uploaded-files`,
    //GetFilesInsideAFolder folder/files/1
    GETFILESINDISEFOLDER: `${BaseCanonizerApiUrl}/folder/files/`,
    //Delete Upload File
    DeleteUploadFile: `${BaseCanonizerApiUrl}/file/delete/`,
    //createFolder
    CreateFolder: `${BaseCanonizerApiUrl}/add-folder`,
    //DeleteFolder
    DeleteFolder: `${BaseCanonizerApiUrl}/folder/delete/`,
    //AllSupportedCampsList
    AllSupportedCampsList: `${BaseCanonizerApiUrl}/user/supports/`,

    // Camp
    CreateCamp: `${BaseCanonizerApiUrl}/camp/save`,
    GetAllParents: `${BaseCanonizerApiUrl}/camp/all-parent`,
    GetCampNickNames: `${BaseCanonizerApiUrl}/camp/all-about-nickname`,
    CampStatementHistory: `${BaseCanonizerApiUrl}/get-statement-history`,

    GetSocialLinkedAccounts: `${BaseCanonizerApiUrl}/user/social/list`,
    DeleteSocialLinkedAccount: `${BaseCanonizerApiUrl}/user/social/delete`,
    LinkUsersFromSocial: `${BaseCanonizerApiUrl}/user/social/social-link`,
    DeactivateUser: `${BaseCanonizerApiUrl}/user/deactivate`,
    GetNickNames: `${BaseCanonizerApiUrl}/camp/get-topic-nickname-used`,

    //footer

    GetFooterSocialLinks: `${BaseCanonizerApiUrl}/get-social-media-links`,

    // Camp Forum
    ThreadsList: `${BaseCanonizerApiUrl}/thread/list`,
    ThreadCreate: `${BaseCanonizerApiUrl}/thread/save`,
    ThreadUpdate: `${BaseCanonizerApiUrl}/thread/update`,
    PostSave: `${BaseCanonizerApiUrl}/post/save`,
    PostUpdate: `${BaseCanonizerApiUrl}/post/update`,
    PostList: `${BaseCanonizerApiUrl}/post/list`,
    PostDelete: `${BaseCanonizerApiUrl}/post/delete`,

    //camp news feed add edit update
    GetEditCampNewsFeed: `${BaseCanonizerApiUrl}/edit-camp-newsfeed`,
    UpdateNewsFeed: `${BaseCanonizerApiUrl}/update-camp-newsfeed`,
    AddNewsFeed: `${BaseCanonizerApiUrl}/store-camp-newsfeed`,
    DeleteNewsFeed: `${BaseCanonizerApiUrl}/delete-camp-newsfeed`,

    //manage statement
    GetEditStatement: `${BaseCanonizerApiUrl}/edit-camp-statement`,
    UpdateStatement: `${BaseCanonizerApiUrl}/store-camp-statement`,
    // subscriptions
    GetSubscriptions: `${BaseCanonizerApiUrl}/camp/subscription/list`,

    // email confirmation verify
    PostVerifyEmail: `${BaseCanonizerApiUrl}/user/post-verify-email`,
    OTPSendVerifyEmail: `${BaseCanonizerApiUrl}/user/resend-otp-verify-email`,

    // compare statement
    CompareStatement: `${BaseCanonizerApiUrl}/get-statement-comparison`,
  },
  Method: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
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
