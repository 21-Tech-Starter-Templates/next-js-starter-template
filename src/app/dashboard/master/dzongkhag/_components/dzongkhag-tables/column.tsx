'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<any, unknown>[] = [
  {
    accessorKey: 'serial_number',
    header: 'S.No',
    cell: ({ row, table }) => {
      const pagination = table.getState().pagination;
      return pagination.pageIndex * pagination.pageSize + row.index + 1;
    }
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'nameDzo',
    header: 'Dzongkha Name'
  },
  {
    header: 'Action',
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
