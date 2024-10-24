// src/components/Table/CustomDataTable.js
import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from '@mui/material';

const CustomDataTable = ({ data, columns }) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      keyField='_id'
      pagination
      highlightOnHover
      pointerOnHover
      responsive
      defaultSortField='name' // Set the default sort field
      defaultSortAsc={true}
    />
  );
};

export default CustomDataTable;
