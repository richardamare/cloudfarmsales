"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { type Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type Sale } from "~/db/schema";
import { api } from "../../utils/api";
import { EditSaleDialog } from "./sale-dialog";

interface SalesTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function SalesTableRowActions<TData>({
  row,
}: SalesTableRowActionsProps<TData>) {
  const sale = row.original as Sale;

  const [openEdit, setOpenEdit] = useState(false);

  //   const router = useRouter();

  const {
    mutate: deleteMutate,
    isSuccess: deleteIsSuccess,
    error: deleteError,
  } = api.sales.delete.useMutation();

  function handleDelete() {
    deleteMutate({ saleId: sale.id });
  }

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Sale deleted successfully");
    }
  }, [deleteIsSuccess]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message);
    }
  }, [deleteError]);

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleDelete}>
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditSaleDialog sale={sale} open={openEdit} onOpenChange={setOpenEdit} />
    </Dialog>
  );
}
