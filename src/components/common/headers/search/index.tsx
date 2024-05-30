import SearchInputs from "@/components/shared/FormInputs/search";

const SearchHeader = () => {
  return (
    <div className="w-auto h-auto flex items-center">
      <SearchInputs placeholder="Search via keyword" />
    </div>
  );
};

export default SearchHeader;
