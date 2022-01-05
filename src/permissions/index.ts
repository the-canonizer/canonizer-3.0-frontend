type PermissionObj = {
  isAuthenticationRequired: boolean;
  isPermissionRequired: boolean;
  permissionName: string;
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
};

export default PermissionsForPages;
