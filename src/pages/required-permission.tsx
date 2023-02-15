import Link from "next/link";

const RequiredPermission = () => {
  return (
    <>
      <h1>Required permission to access this page</h1>
      <Link href="/">Link to Home Page</Link>
    </>
  );
};

RequiredPermission.displayName = "RequiredPermission";

export default RequiredPermission;
