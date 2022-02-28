import { useEffect, useState } from "react";
import { store } from "../store/index";

const useAuthentication = () => {
  const { auth } = store.getState();
  const [isLogin, setIsLogin] = useState(auth.authenticated);
  useEffect(() => {
    setIsLogin(auth.authenticated);
  }, [auth.authenticated]);

  return isLogin;
};

export default useAuthentication;
