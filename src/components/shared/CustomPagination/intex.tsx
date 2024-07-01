import React, { useState } from "react";
import { Pagination } from "antd";

const CustomPagination = ({
  totalTopics,
  pageNumber,
  pageSize,
  showTotal,
  loading,
  handlePageChange,
}) => {
  const [quickJumperValue, setQuickJumperValue] = useState("");

  const handleQuickJumperChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && parseInt(value) > 0) {
      setQuickJumperValue(value);
    }
  };
  return (
    <div>
      <Pagination
        className="browse-pagination mt-14"
        size="small"
        total={totalTopics}
        defaultCurrent={1}
        defaultPageSize={10}
        current={pageNumber}
        pageSize={pageSize}
        showTotal={showTotal}
        pageSizeOptions={[10, 16]}
        showSizeChanger
        showQuickJumper
        onChange={handlePageChange}
        onShowSizeChange={handlePageChange}
        disabled={loading}
      />
      <input
        type="number"
        value={quickJumperValue}
        onChange={handleQuickJumperChange}
      />
    </div>
  );
};

export default CustomPagination;
