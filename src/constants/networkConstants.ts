const BaseCanonizerServiceUrl = process.env.NEXT_PUBLIC_BASE_SERVICE_URL;
const BaseCanonizerApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
const BaseImagesURL = process.env.NEXT_PUBLIC_BASE_IMAGES_URL;
const BaseVideosURL = process.env.NEXT_PUBLIC_BASE_VIDEOS_URL;
// const BaseCanonizerDevApiUrl = process.env.NEXT_PUBLIC_BASE_API_DEV_URL;
const NetworkConstants = {
  URL: {
    BaseImagesURL,
    BaseVideosURL,
    BaseAPI: BaseCanonizerApiUrl,
    Base: process.env.NEXT_PUBLIC_BASE_URL,
    Timeout: process.env.NEXT_PUBLIC_TIMEOUT,
    Client: {
      BaseHost: process.env.NEXT_PUBLIC_CLIENT_BASE_HOST,
      BasePort: process.env.NEXT_PUBLIC_CLIENT_BASE_PORT,
    },
    // Redirect URLs
    helpTopicUrl: "/topic/132-Help/1-Agreement?is_tree_open=1",
    algoInfoUrl: "/topic/53-Canonizer-Algorithms/1-Agreement?is_tree_open=1",
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
    EditProfileImage: `${BaseCanonizerApiUrl}/update-profile-picture`,
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
    RemoveOrUpdateDirectSupportCamps: `${BaseCanonizerApiUrl}/support/update`,
    //add direct Support
    AddSupport: `${BaseCanonizerApiUrl}/support/add`,
    //Delegated Support Camps
    RemoveSupportedCampsEntireTopic: `${BaseCanonizerApiUrl}/support/remove-delegate`,
    //Add delegated Support
    AddDelegatedSupport: `${BaseCanonizerApiUrl}/support/add-delegate`,
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
    //GlobalSearchUploadedFile
    GlobalSearchUploadedFile: `${BaseCanonizerApiUrl}/global-search-uploaded-files`,
    //Canonizer Global Search
    canonizerGlobalSearch: `${BaseCanonizerApiUrl}/search`,
    //AllSupportedCampsList
    AllSupportedCampsList: `${BaseCanonizerApiUrl}/user/supports/`,

    // Camp
    CreateCamp: `${BaseCanonizerApiUrl}/camp/save`,
    GetAllParents: `${BaseCanonizerApiUrl}/camp/all-parent`,
    GetCampNickNames: `${BaseCanonizerApiUrl}/camp/all-about-nickname`,
    CampStatementHistory: `${BaseCanonizerApiUrl}/get-statement-history`,
    GetCampHistory: `${BaseCanonizerApiUrl}/get-camp-history`,
    GetTopicHistory: `${BaseCanonizerApiUrl}/get-topic-history`,
    CommitChangeStatement: `${BaseCanonizerApiUrl}/commit/change`,
    DiscardChangeStatement: `${BaseCanonizerApiUrl}/discard/change`,

    AgreeToChange: `${BaseCanonizerApiUrl}/agree-to-change`,

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
    GetThreadData: `${BaseCanonizerApiUrl}/thread/`,

    //camp news feed add edit update
    GetEditCampNewsFeed: `${BaseCanonizerApiUrl}/edit-camp-newsfeed`,
    UpdateNewsFeed: `${BaseCanonizerApiUrl}/update-camp-newsfeed`,
    AddNewsFeed: `${BaseCanonizerApiUrl}/store-camp-newsfeed`,
    DeleteNewsFeed: `${BaseCanonizerApiUrl}/delete-camp-newsfeed`,

    //manage statement
    GetEditStatement: `${BaseCanonizerApiUrl}/edit-camp-statement`,
    GetEditCamp: `${BaseCanonizerApiUrl}/edit-camp`,
    GetEditTopic: `${BaseCanonizerApiUrl}/edit-topic`,
    GetParseCampStatement: `${BaseCanonizerApiUrl}/parse-camp-statement`,

    UpdateStatement: `${BaseCanonizerApiUrl}/store-camp-statement`,
    UpdateCamp: `${BaseCanonizerApiUrl}/manage-camp`,
    UpdateTopic: `${BaseCanonizerApiUrl}/manage-topic`,

    // subscriptions
    GetSubscriptions: `${BaseCanonizerApiUrl}/camp/subscription/list`,

    // email confirmation verify
    PostVerifyEmail: `${BaseCanonizerApiUrl}/user/post-verify-email`,
    OTPSendVerifyEmail: `${BaseCanonizerApiUrl}/user/resend-otp-verify-email`,

    //supportTotalScore
    TotalScore: `${BaseCanonizerApiUrl}/camp-total-support-score`,

    // compare statement
    CompareStatement: `${BaseCanonizerApiUrl}/get-statement-comparison`,
    ChangeSupporters: `${BaseCanonizerApiUrl}/get-change-supporters`,
    CheckCampStatus: `${BaseCanonizerApiUrl}/check-camp-status`,

    // notification list
    GetList: `${BaseCanonizerApiUrl}/notification-list`,
    MarkRead: `${BaseCanonizerApiUrl}/notification-is-read/update/`,

    //Get Active support topic
    GetActiveSupportTopic: `${BaseCanonizerApiUrl}/topic-support-list`,

    //Get Check if support exists
    GetCheckSupportExists: `${BaseCanonizerApiUrl}/support/check`,

    //supportTreeAndScoreCount
    SupportTree: `${BaseCanonizerApiUrl}/support-and-score-count`,

    //removeSupportedCamps
    RemoveCamps: `${BaseCanonizerApiUrl}/support/update`,
    CampSignCheck: `${BaseCanonizerApiUrl}/camp/sign/check`,
    CampSign: `${BaseCanonizerApiUrl}/camp/sign`,

    UpdateToken: `${BaseCanonizerApiUrl}/update-fcm-token`,

    // terms and services and privacy
    GetTermsAndServicesContent: `${BaseCanonizerApiUrl}/get-terms-and-services-content`,
    GetPrivacyPolicyContent: `${BaseCanonizerApiUrl}/get-privacy-policy-content`,

    // Meta Tags
    GetMetaContent: `${BaseCanonizerApiUrl}/meta-tags`,

    VideosContent: `${BaseCanonizerApiUrl}/videos`,

    GetNickSupportUser: `${BaseCanonizerApiUrl}/get-nick-support-user/`,

    // Evetline API
    EventLineEndpoint: `${BaseCanonizerServiceUrl}/api/v1/timeline/get`,
    GetRemovedReasons: `${BaseCanonizerApiUrl}/support-reason-list`,
    GetXMLData: `${BaseCanonizerApiUrl}/sitemaps`,
    CheckTopicCampExist: `${BaseCanonizerApiUrl}/notify-if-url-not-exist`,
    GetHotTopic: `${BaseCanonizerApiUrl}/hot-topic`,
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
    Authorization: () => ({
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
