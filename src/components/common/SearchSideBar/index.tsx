import { useRouter } from "next/router";
import { Button } from "antd";
import Link from "next/link";
import styles from "./searchSideBar.module.scss";
import Image from "next/image";
import filter from "src/assets/image/face.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import CustomSkelton from "../customSkelton";
import { setClickAdvanceFilterOption } from "src/store/slices/searchSlice";

export default function SearchSideBar() {
  const router = useRouter();
  let { searchValue } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
  }));
  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.searchLoading,
  }));

  const campRoute = () => {
    router?.push("/search/topic");
  };
  const dispatch = useDispatch()

  return (
    <>
      <div className="leftSideBar_Card noFilter">
        {loading ? (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={5}
            stylingClass="listSkeleton"
            isButton={false}
          />
        ) : (
          <div className="search_tabs">
            <Link
              href={{
                pathname: "/search",
                query: { q: searchValue },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  className={
                    router?.asPath.includes("/search?") ? "active" : "btn"
                  }
                  disabled={router?.pathname == "/search" ? true : false}
                >
                  All
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/topic",
                query: { q: searchValue },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  className={
                    router?.asPath.includes("/search/topic?") ? "active" : "btn"
                  }
                  disabled={router?.pathname == "/search/topic" ? true : false}
                >
                  <i className="icon-topic"></i>
                  <a>Topic</a>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/camp",
                query: { q: searchValue },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  className={
                    router?.asPath.includes("/search/camp?") ? "active" : "btn"
                  }
                  disabled={router?.pathname == "/search/camp" ? true : false}
                >
                  <i className="icon-camp"></i>
                  <a>Camp</a>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/camp_statement",
                query: { q: searchValue },
              }}
              passHref
            >
              <a>
                <Button
                  size="large"
                  className={
                    router?.asPath.includes("/search/camp_statement?")
                      ? "active"
                      : "btn"
                  }
                  disabled={
                    router?.pathname == "/search/camp_statement" ? true : false
                  }
                >
                  <i className="icon-camp"></i>
                  <a>Camp Statement</a>
                </Button>
              </a>
            </Link>
            <Link
              href={{
                pathname: "/search/nickname",
                query: { q: searchValue },
              }}
              passHref
            >
              <a>
              <Button
                size="large"
                className={
                  router?.asPath.includes("/search/nickname?")
                    ? "active"
                    : "btn"
                }
                disabled={router.pathname == "/search/nickname" ? true : false}
                onClick={(()=>{ dispatch(setClickAdvanceFilterOption(false))})}
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
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
