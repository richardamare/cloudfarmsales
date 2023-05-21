import { type Row } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pen, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DeleteSaleAlertDialog } from "~/components/sales/sale-alert-dialog";
import { EditSaleDialog } from "~/components/sales/sale-dialog";
import { AlertDialog, AlertDialogTrigger } from "~/components/ui/alert-dialog";
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
import { api } from "~/utils/api";

interface SalesTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function SalesTableRowActions<TData>({
  row,
}: SalesTableRowActionsProps<TData>) {
  const sale = row.original as Sale;

  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();
  const deleteSale = api.sales.delete.useMutation();

  function handleDelete() {
    deleteSale.mutate({ saleId: sale.id });
  }

  useEffect(() => {
    if (deleteSale.isSuccess) {
      toast.success("Sale deleted successfully");
      router.reload();
    }
  }, [deleteSale.isSuccess, router]);

  useEffect(() => {
    if (deleteSale.error) {
      toast.error(deleteSale.error.message);
    }
  }, [deleteSale.error]);

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <AlertDialog>
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
            <DropdownMenuItem disabled>
              <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenEdit(true)}>
              <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <EditSaleDialog
          sale={sale}
          open={openEdit}
          onOpenChange={setOpenEdit}
        />
        <DeleteSaleAlertDialog onContinue={handleDelete} />
      </AlertDialog>
    </Dialog>
  );
}
