"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { Checkbox } from "~/components/ui/checkbox";
import { type Customer } from "~/db/schema";
import { CustomersTableRowActions } from "./customer-table-row-actions";

export const columns: ColumnDef<Customer>[] = [
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
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("customerId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <a
        href={`tel:${row.getValue<string>("phone")}`}
        className="cursor-pointer hover:underline"
      >
        {row.getValue("phone")}
      </a>
    ),
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
  },
  {
    accessorKey: "zone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Zone" />
    ),
  },
  {
    accessorKey: "tinNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TIN Number" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomersTableRowActions row={row} />,
  },
];
