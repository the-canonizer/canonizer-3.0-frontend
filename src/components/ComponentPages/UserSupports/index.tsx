import { useState } from "react";
import { useRouter } from "next/router";

import UserSupportUI from "./UI";

const UserSupports = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();

  return <UserSupportUI />;
};

export default UserSupports;
