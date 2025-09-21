"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import DefaultInput from "../input/default-input";
import { IoIosArrowForward, IoIosArrowBack  } from "react-icons/io";
import { Select } from 'antd';

interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T, any>[];
  globalFilter?: boolean;
  pageSize?: number;
}

export default function DataTable<T extends object>({
    data,
    columns,
    globalFilter = true,
    pageSize = 10
}: DataTableProps<T>) {

    const [filter, setFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter: filter,
        },
        onGlobalFilterChange: setFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize
            },
        }
    });

    return(
        <div className="w-full">
        {globalFilter && (
            <div className="px-[20px] mb-[20px] w-[350px]">
                <DefaultInput
                    placeholder="Search"
                    value={filter ?? ""} 
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        )}

        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr className="text-gray-600" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <th key={header.id} className="text-left px-2 py-[10px]">
                    {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                ))}
                </tr>
            ))}
            </thead>

            <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-200">
                {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-[15px] text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
                </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
                <tr>
                <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                    No data found
                </td>
                </tr>
            )}
            </tbody>
        </table>

        <div className="flex justify-between items-center mt-5 px-[20px]">
            <div>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
            </div>

            <div className="flex gap-2 items-center">
                {/* Prev button */}
                <button
                className="outline-gray-300 outline h-[30px] w-[30px] flex justify-center items-center rounded disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                <IoIosArrowBack className="text-[24px] font-semibold" />
                </button>

                {/* Page number buttons */}
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                <button
                    key={i}
                    onClick={() => table.setPageIndex(i)}
                    className={`px-3 py-1.5 rounded  ${
                    table.getState().pagination.pageIndex === i
                        ? "bg-primary text-white"
                        : "bg-white outline-gray-300 outline"
                    }`}
                >
                    {i + 1}
                </button>
                ))}

                {/* Next button */}
                <button
                className="outline outline-gray-300 h-[30px] w-[30px] flex justify-center items-center rounded disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                <IoIosArrowForward className="text-[24px] font-semibold text-black" />
                </button>

                {/* Page size selector */}
                <Select
                    style={{ width: 120 }}
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e))}
                    options={[
                        { value: 10, label: 'Show 10' },
                        { value: 20, label: 'Show 20' },
                        { value: 50, label: 'Show 50' },
                        { value: 100, label: 'Show 100' },
                    ]}
                />
            </div>
        </div>
    </div>
    );
}