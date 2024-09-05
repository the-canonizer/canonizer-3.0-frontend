import React from "react";
import { Pagination } from "antd";

const CustomPagination = ({
  totalTopics,
  pageNumber,
  pageSize,
  loading,
  handlePageChange,
  pageSizeOptions = [12, 18, 24],
  className = "",
}) => {
  const showTotal = (total) => `Total ${total} items`;

  return (
    <div>
      <Pagination
        className={`browse-pagination mt-14 ${className}`}
        size="small"
        total={totalTopics}
        defaultCurrent={1}
        defaultPageSize={12}
        current={pageNumber}
        pageSize={pageSize}
        showTotal={showTotal}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        onChange={handlePageChange}
        onShowSizeChange={handlePageChange}
        disabled={loading}
      />
    </div>
  );
};

export default CustomPagination;
