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
    permissionName: "create-topic",
  },
  CreateNewCampPage: {
    isAuthenticationRequired: true,
    isPermissionRequired: false,
    permissionName: "create-camp",
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
};

export default PermissionsForPages;
