"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { Checkbox } from "~/components/ui/checkbox";
import { type Customer, type SaleWithCustomer } from "~/db/schema";
import { formatPrice } from "~/lib/utils";
import { SalesTableRowActions } from "./sales-table-row-actions";

export const columns: ColumnDef<SaleWithCustomer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v: boolean) => row.toggleSelected(!!v)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "saleId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("saleId")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue<Customer>("customer").name}
        </span>
      );
    },
  },
  {
    accessorKey: "docQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DOC Quantity" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue<number>("docQuantity")}
        </span>
      );
    },
  },
  {
    accessorKey: "docUnitPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DOC Unit Price" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {formatPrice(row.getValue<number>("docUnitPrice") / 100)}
        </span>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {formatPrice(row.getValue<number>("total") / 100)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SalesTableRowActions row={row} />,
  },
];
