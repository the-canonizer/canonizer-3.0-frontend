import { RootState } from "./../store/index";
import { useSelector } from "react-redux";

const usePermission = () => {
  const { permissions } = useSelector((state: RootState) => ({
    permissions: state?.auth?.permissions,
  }));

  const isAllowed = (permission) => permissions.includes(permission);
  return { isAllowed };
};

export default usePermission;
