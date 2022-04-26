import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";

const useAuthentication = () => {
  const authenticated = useSelector(
    (state: RootState) => state.auth?.authenticated
  );
  const [isLogin, setIsLogin] = useState(authenticated);
  useEffect(() => {
    setIsLogin(authenticated);
  }, [authenticated]);

  return !isLogin;
};

export default useAuthentication;
