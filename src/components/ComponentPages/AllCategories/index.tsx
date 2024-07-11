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
  const [search] = useState("");
  const [sortBy, setSortBy] = useState("asc");

  useEffect(() => {
    setTagList(tags);
  }, [tags]);

  const getTags = async () => {
    setIsLoading(true);
    await getAllTags(null, null, search, sortBy as any);
    setIsLoading(false);
  };

  useEffect(() => {
    getTags();
  }, [page, perPage, sortBy, search]);

  const onBackClick = (e) => {
    e?.preventDefault();
    router?.back();
  };

  const onSort = (e, type) => {
    e?.preventDefault();
    setSortBy(type);
  };

  return (
    <CustomSpinner key="registration-spinner" spinning={isLoading}>
      <CatsList
        onBackClick={onBackClick}
        isMobile={isMobile}
        tags={tagList}
        onSort={onSort}
      />
    </CustomSpinner>
  );
};

export default AllCats;
