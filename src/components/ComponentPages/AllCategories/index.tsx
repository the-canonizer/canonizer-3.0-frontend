import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { useIsMobile } from "src/hooks/useIsMobile";
import CatsList from "./UI/catsList";
import { RootState } from "src/store";
import { getAllTags } from "src/network/api/tagsApi";
import CustomSpinner from "components/shared/CustomSpinner";

const AllCats = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { tags } = useSelector((state: RootState) => ({
    tags: state?.tag?.tags,
  }));

  const [tagList, setTagList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const [totalTags, setTotalTags] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("desc");

  useEffect(() => {
    setTagList(tags);
  }, [tags]);

  const getTags = async () => {
    setIsLoading(true);
    const res = await getAllTags(page, perPage, search, sortBy as any);
    if (res?.status_code === 200) {
      // console.log("res---", res);
      const resData = res?.data;
      setPage(resData?.current_page);
      setPerPage(resData?.per_page);
      setTotalTags(resData?.total_rows);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getTags();
  }, [page, perPage, sortBy, search]);

  const onBackClick = (e) => {
    e?.preventDefault();
    router?.back();
  };

  const onPageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize);
  };

  const onSort = (e) => {
    e?.preventDefault();
    setSortBy((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <CustomSpinner key="registration-spinner" spinning={isLoading}>
      <CatsList
        onBackClick={onBackClick}
        onAllReadClick={undefined}
        isMobile={isMobile}
        tags={tagList}
        total={totalTags}
        onPageChange={onPageChange}
        pageSize={perPage}
        current={page}
        onSearchClick={undefined}
        onSort={onSort}
      />
    </CustomSpinner>
  );
};

export default AllCats;
