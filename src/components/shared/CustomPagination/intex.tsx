import React, { useState } from "react";
import { Pagination } from "antd";

const CustomPagination = ({
  totalTopics,
  pageNumber,
  pageSize,
  loading,
  handlePageChange,
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
        defaultPageSize={10}
        current={pageNumber}
        pageSize={pageSize}
        showTotal={showTotal}
        pageSizeOptions={[10, 16]}
        showSizeChanger
        // showQuickJumper
        onChange={handlePageChange}
        onShowSizeChange={handlePageChange}
        disabled={loading}
      />
    </div>
  );
};

export default CustomPagination;
