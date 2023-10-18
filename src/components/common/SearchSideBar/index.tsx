import { useRouter } from "next/router";
import { Button } from "antd";
import Link from "next/link";
import styles from "./searchSideBar.module.scss"
import Image from "next/image";
import filter from "src/assets/image/face_retouching_natural_FILL0_wght600_GRAD0_opsz24.svg"



export default function SearchSideBar() {
  const router = useRouter();
    const campRoute = () => {
        router?.push("/search/topic");
      };
  return (
    <>
      <div
        className="leftSideBar_Card noFilter"
      >
        {(
          <div className="search_tabs">
            <Link href="/search">
            <Button size="large" className={router.asPath == "/search" ?"active":"btn"}>
            <a>All</a>
            </Button>
            </Link>
            <Link href="/search/topic">
            <Button size="large" className={router.asPath == "/search/topic" ?"active":"btn"} >
              <i className="icon-topic"></i><a>Topic</a>
            </Button>
            </Link>
            <Link href="/search/camp">
            <Button size="large" className={router.asPath == "/search/camp" ?"active":"btn"}>
            <i className="icon-camp"></i><a>Camp</a>
            </Button>
            </Link>
            <Link href={"/search/camp_statement"}>
            <Button size="large" className={router.asPath == "/search/camp_statement" ?"active":"btn"}>
            <i className="icon-camp"></i><a>Camp Statement</a>
            </Button>
            </Link>
            <Link href="/search/nickname">
            <Button size="large" className={router.asPath == "/search/nickname" ?"active":"btn"}>
            <Image
              id="nick_name"
              alt="face Image"
              src={filter}
              width={17}
              height={17}
            /><a>Nickname</a>
            </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
