import { shallowEqual, useSelector } from "react-redux";

const usePermission = () => {
  const { permissions } = useSelector(
    (state) => ({
      permissions: state?.auth?.permissions,
    }),
    shallowEqual
  );

  const isAllowed = (permission) => permissions.includes(permission);
  return { isAllowed };
};

export default usePermission;
