import Link from "next/link";

const RequiredPermission = () => {
  return (
    <>
      <h1>Required permission to access this page</h1>
      <Link href="/">
        <a>Link to Home Page</a>
      </Link>
    </>
  );
};

RequiredPermission.displayName = "RequiredPermission";

export default RequiredPermission;
