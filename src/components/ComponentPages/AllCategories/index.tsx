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
  const [perPage] = useState(12);
  const [page] = useState(1);
  // const [totalTags, setTotalTags] = useState(0);
  const [search] = useState("");
  const [sortBy, setSortBy] = useState("asc");

  useEffect(() => {
    setTagList(tags);
  }, [tags]);

  const getTags = async () => {
    setIsLoading(true);
    const res = await getAllTags(null, null, search, sortBy as any);
    if (res?.status_code === 200) {
      // const resData = res?.data;
      // setPage(resData?.current_page);
      // setPerPage(resData?.per_page);
      // setTotalTags(resData?.total_rows);
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

  // const onPageChange = (page, pageSize) => {
  //   setPage(page);
  //   setPerPage(pageSize);
  // };

  const onSort = (e, type) => {
    e?.preventDefault();
    setSortBy(type);
  };

  // const onSearchClick = (e) => {
  //   // const val = e?.target?.value;
  //   // setSearch(val);
  // };

  // const onSearchKeyUp = (e) => {
  //   if (e?.which == 13) {
  //     const val = e?.target?.value;
  //     setSearch(val);
  //   }
  // };

  return (
    <CustomSpinner key="registration-spinner" spinning={isLoading}>
      <CatsList
        onBackClick={onBackClick}
        isMobile={isMobile}
        tags={tagList}
        // total={totalTags}
        // onPageChange={onPageChange}
        // pageSize={perPage}
        // current={page}
        // onSearchChange={onSearchClick}
        onSort={onSort}
        // onSearchKeyUp={onSearchKeyUp}
      />
    </CustomSpinner>
  );
};

export default AllCats;
