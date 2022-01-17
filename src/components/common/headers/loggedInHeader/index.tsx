import { Button } from "antd";
import { useDispatch } from "react-redux";

import { logout } from "../../../../network/services/auth";
import { AppDispatch } from "../../../../store";

const LoggedInHeader = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logOut = async () => {
    await dispatch(logout());
  };

  return (
    <h1 style={{ backgroundColor: "#a5ec00" }}>
      Header for logged-in users <Button onClick={logOut}>Log out</Button>
    </h1>
  );
};

export default LoggedInHeader;
