import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";

const useAuthentication = () => {
  const { authenticated, id } = useSelector((state: RootState) => ({
    authenticated: state.auth?.authenticated,
    id: state.auth?.id,
  }));
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(authenticated);
  const [userID, setuserID] = useState(id);
  useEffect(() => {
    setIsUserAuthenticated(authenticated);
    setuserID(id);
  }, [authenticated, id]);

  return { isUserAuthenticated, userID };
};

export default useAuthentication;
