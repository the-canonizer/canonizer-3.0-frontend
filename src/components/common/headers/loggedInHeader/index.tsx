import { Button } from "antd";
import { useDispatch } from "react-redux";

import { logoutUser } from "../../../../store/slices/authSlice";

const LoggedInHeader = () => {
  const dispatch = useDispatch();
  const logOut = () => {
    console.log("log out");
    dispatch(logoutUser());
  };
  return (
    <h1 style={{ backgroundColor: "#a5ec00" }}>
      Header for logged-in users <Button onClick={logOut}>Log out</Button>
    </h1>
  );
};

export default LoggedInHeader;
