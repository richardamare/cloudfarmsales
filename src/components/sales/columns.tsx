"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { Checkbox } from "~/components/ui/checkbox";
import { type Customer, type SaleWithCustomer } from "~/db/schema";
import { capitalize, formatPrice } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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
    accessorKey: "doc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Day-Old Chicken" />
    ),
    cell: ({ row }) => {
      const doc = row.getValue<{ total: number; remaining: number }>("doc");
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-[500px] truncate font-medium">
                {doc.remaining > 0 && (
                  <>
                    <span className="text-red-500">{doc.remaining}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span>{doc.total}</span>
                  </>
                )}
                {doc.remaining === 0 && (
                  <>
                    <span>{doc.total}</span>
                  </>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {doc.remaining > 0 && <p>Remaining / Total</p>}
              {doc.remaining === 0 && <p>Completed</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "feedAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feed Amount" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue<number>("feedAmount")} qq
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
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {capitalize(row.getValue("paymentStatus"))}
        </span>
      );
    },
  },
  {
    accessorKey: "soldAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sold At" />
    ),
    cell: ({ row }) => {
      const soldAt = new Date(row.getValue<string>("soldAt"));
      return (
        <span className="max-w-[500px] truncate font-medium">
          {soldAt.toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SalesTableRowActions row={row} />,
  },
];
