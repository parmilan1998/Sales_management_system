/* eslint-disable react/prop-types */
import { Table } from "antd";
import React from "react";

const SalesTable = ({
  page,
  limit,
  columns,
  dataSource,
  expandedRowRender,
  totalPages,
  setPage,
}) => {
  return (
    <div>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["parent-0"],
        }}
        dataSource={dataSource}
        size="middle"
        pagination={{
          total: totalPages * limit,
          current: page,
          pageSize: limit,
          onChange: (page) => setPage(page),
        }}
      />
    </div>
  );
};

export default SalesTable;
