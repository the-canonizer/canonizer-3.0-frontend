import { useRouter } from "next/router";
import { Button } from "antd";
import Link from "next/link";
import styles from "./searchSideBar.module.scss";
import Image from "next/image";
import filter from "src/assets/image/face.png";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

export default function SearchSideBar() {
  const router = useRouter();
  let { searchValue } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
  }));

  const campRoute = () => {
    router?.push("/search/topic");
  };

  return (
    <>
      <div className="leftSideBar_Card noFilter">
        {
          <div className="search_tabs">
            <Link
              href={{
                pathname: '/search',
                query: { q: searchValue },
              }}
            >
              <Button
                size="large"
                className={router?.asPath.includes("/search?") ? "active" : "btn"}
              >
                <a>All</a>
              </Button>
            </Link>
            <Link
              href={{
                pathname: '/search/topic',
                query: { q: searchValue },
              }}
            >
              <Button
                size="large"
                className={router?.asPath.includes("/search/topic?") ? "active" : "btn"}
              >
                <i className="icon-topic"></i>
                <a>Topic</a>
              </Button>
            </Link>
            <Link
              href={{
                pathname: '/search/camp',
                query: { q: searchValue },
              }}
            >
              <Button
                size="large"
                className={router?.asPath.includes("/search/camp?") ? "active" : "btn"}
              >
                <i className="icon-camp"></i>
                <a>Camp</a>
              </Button>
            </Link>
            <Link
              href={{
                pathname: '/search/camp_statement',
                query: { q: searchValue },
              }}
            >
              <Button
                size="large"
                className={
                  router?.asPath.includes("/search/camp_statement?") ? "active" : "btn"
                }
              >
                <i className="icon-camp"></i>
                <a>Camp Statement</a>
              </Button>
            </Link>
            <Link
              href={{
                pathname: '/search/nickname',
                query: { q: searchValue },
              }}
            >
              <Button
                size="large"
                className={
                  router?.asPath.includes("/search/nickname?") ? "active" : "btn"
                }
              >
                <Image
                  className={styles.nickname_icon}
                  id="nick_name"
                  alt="face Image"
                  src={filter}
                  width={15}
                  height={15}
                />
                <a>Nickname</a>
              </Button>
            </Link>
          </div>
        }
      </div>
    </>
  );
}
