type PermissionObj = {
  isAuthenticationRequired: boolean;
  isPermissionRequired?: boolean;
  permissionName?: string;
};

type PermissionsObj = {
  [key: string]: PermissionObj;
};

const PermissionsForPages: PermissionsObj = {
  TreesPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: true,
    permissionName: "view_tree",
  },
  CreateNewTopicPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "create_topic",
  },
  CreateNewCampPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "create_camp",
  },
  Settings: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "settings",
  },
  UploadFile: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "uploadFile",
  },
  CompareStatementPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "compare_statement",
  },
  NotificationsListPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "notification",
  },
  ManageSupport: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "manageSupport",
  },
  EditNewsPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "editNews",
  },
  CampForumCreatePage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "createThread",
  },
  CreateNewStatement: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "createStatement",
  },
  ManageStatementPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "manageStatement",
  },
  ManageCampPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "manageCamp",
  },
  ManageTopicPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "manageTopic",
  },
  AddNewsPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "addNews",
  },
  AllCategories: {
    isAuthenticationRequired: false,
    isPermissionRequired: false,
    permissionName: "all_categories",
  },
  CategoriesTopic: {
    isAuthenticationRequired: false,
    isPermissionRequired: false,
    permissionName: "all_categories",
  },
  AllUserCategories: {
    isAuthenticationRequired: false,
    isPermissionRequired: false,
    permissionName: "all_categories",
  },
};

export default PermissionsForPages;
