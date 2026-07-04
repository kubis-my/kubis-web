'use client';

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from './button';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Skeleton } from './skeleton';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export interface PageInfo {
    endCursor?: number | null | undefined;
    hasNextPage: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
}

export interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    pageInfo: PageInfo;
    isLoading: boolean;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
    cursorHistory: (number | null | undefined)[];
    onNextPage: () => void;
    onPreviousPage: () => void;
    emptyMessage?: string;
    getRowId?: (row: TData) => string;
    onRowClick?: (row: TData, event: React.MouseEvent) => void;
    onRowMouseEnter?: (row: TData) => void;
    renderRow?: (row: Row<TData>) => React.ReactNode;
    renderSubRow?: (row: Row<TData>) => React.ReactNode;
    renderSkeletonRow?: () => React.ReactNode;
    pageSizeOptions?: number[];
    flexColumnId?: string;
    enableSorting?: boolean;
}

function DefaultSkeletonRow({ columnCount }: { columnCount: number }) {
    return (
        <TableRow>
            {Array.from({ length: columnCount }).map((_, index) => (
                <TableCell key={index} className="px-5 py-3">
                    <Skeleton className="h-4 w-24" />
                </TableCell>
            ))}
        </TableRow>
    );
}

function DefaultRow<TData>({
    row,
    flexColumnId,
    onRowClick,
    onRowMouseEnter,
}: {
    row: Row<TData>;
    flexColumnId?: string;
    onRowClick?: (row: TData, event: React.MouseEvent) => void;
    onRowMouseEnter?: (row: TData) => void;
}) {
    const handleRowClick = (e: React.MouseEvent) => {
        if (onRowClick) {
            // Prevent navigation when clicking on interactive elements
            const target = e.target as HTMLElement;
            if (target.closest('button') || target.closest('input') || target.closest('a')) {
                return;
            }
            onRowClick(row.original, e);
        }
    };

    const handleRowMouseEnter = onRowMouseEnter
        ? () => onRowMouseEnter(row.original)
        : undefined;

    return (
        <TableRow
            onClick={handleRowClick}
            onMouseEnter={handleRowMouseEnter}
            onFocus={handleRowMouseEnter}
            className={onRowClick ? 'hover:bg-muted/50 cursor-pointer transition-colors' : ''}
        >
            {row.getVisibleCells().map((cell) => {
                return (
                    <TableCell
                        key={cell.id}
                        className="px-5 py-3"
                        style={{
                            width:
                                flexColumnId && cell.column.id === flexColumnId
                                    ? 'auto'
                                    : `${cell.column.getSize()}px`,
                        }}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                );
            })}
        </TableRow>
    );
}

export function DataTable<TData>({
    columns,
    data,
    pageInfo,
    isLoading,
    pageSize,
    onPageSizeChange,
    cursorHistory,
    onNextPage,
    onPreviousPage,
    emptyMessage = 'No results found.',
    getRowId,
    onRowClick,
    onRowMouseEnter,
    renderRow,
    renderSubRow,
    renderSkeletonRow,
    pageSizeOptions = [10, 20, 30, 40, 50],
    flexColumnId,
    enableSorting = true,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        getRowId,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        manualPagination: true,
        pageCount: pageInfo.totalPages,
    });

    const renderTableRow = (row: Row<TData>) => {
        if (renderRow) {
            return renderRow(row);
        }

        const subRow = renderSubRow?.(row);

        if (subRow) {
            return (
                <React.Fragment key={row.id}>
                    <DefaultRow
                        row={row}
                        flexColumnId={flexColumnId}
                        onRowClick={onRowClick}
                        onRowMouseEnter={onRowMouseEnter}
                    />
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={columns.length} className="p-0">
                            {subRow}
                        </TableCell>
                    </TableRow>
                </React.Fragment>
            );
        }

        return (
            <DefaultRow
                key={row.id}
                row={row}
                flexColumnId={flexColumnId}
                onRowClick={onRowClick}
                onRowMouseEnter={onRowMouseEnter}
            />
        );
    };

    const renderTableSkeletonRow = (index: number) => {
        if (renderSkeletonRow) {
            return <React.Fragment key={`skeleton-${index}`}>{renderSkeletonRow()}</React.Fragment>;
        }
        return <DefaultSkeletonRow key={`skeleton-${index}`} columnCount={columns.length} />;
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="overflow-hidden rounded-lg border shadow-sm">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className="px-5 py-2"
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                width:
                                                    flexColumnId &&
                                                    header.column.id === flexColumnId
                                                        ? 'auto'
                                                        : `${header.getSize()}px`,
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: pageSize }).map((_, index) =>
                                renderTableSkeletonRow(index),
                            )
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => renderTableRow(row))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-4">
                {/* Left: Showing count */}
                <div className="text-muted-foreground text-sm">
                    Showing{' '}
                    <span className="text-foreground font-medium">
                        {pageInfo.total === 0 ? 0 : (cursorHistory.length - 1) * pageSize + 1}
                    </span>
                    {' - '}
                    <span className="text-foreground font-medium">
                        {Math.min(cursorHistory.length * pageSize, pageInfo.total)}
                    </span>
                    {' of '}
                    <span className="text-foreground font-medium">{pageInfo.total}</span>
                </div>

                {/* Center: Pagination controls */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={onPreviousPage}
                        disabled={cursorHistory.length === 1 || isLoading}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <IconChevronLeft className="size-4" />
                    </Button>
                    <div className="flex items-center gap-1 px-2 text-sm font-medium">
                        <span>{cursorHistory.length}</span>
                        <span className="text-muted-foreground">of</span>
                        <span>{pageInfo.totalPages}</span>
                    </div>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={onNextPage}
                        disabled={!pageInfo.hasNextPage || isLoading}
                    >
                        <span className="sr-only">Go to next page</span>
                        <IconChevronRight className="size-4" />
                    </Button>
                </div>

                {/* Right: Rows per page */}
                <div className="flex items-center gap-2">
                    <Label htmlFor="rows-per-page" className="hidden text-sm font-medium sm:inline">
                        Rows per page
                    </Label>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            onPageSizeChange(Number(value));
                        }}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-8 w-auto" id="rows-per-page">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
