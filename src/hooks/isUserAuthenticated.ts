import { store } from "../store/index";

const useAuthentication = () => {
  const { auth } = store.getState();
  const isUserAuthenticated = auth.token && !auth.authenticated ? true : false;

  return { isUserAuthenticated };
};

export default useAuthentication;
