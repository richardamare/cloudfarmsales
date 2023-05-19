import { type Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type Customer } from "~/db/schema";
import { api } from "~/utils/api";
import { EditCustomerDialog } from "./customer-dialog";

interface CustomersTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function CustomersTableRowActions<TData>({
  row,
}: CustomersTableRowActionsProps<TData>) {
  const customer = row.original as Customer;

  const { mutate, error, isSuccess } = api.customers.delete.useMutation();

  function handleDelete() {
    mutate({ customerId: customer.id });
  }

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      toast.success("Customer deleted successfully");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <EditCustomerDialog
        customer={customer}
        open={open}
        onOpenChange={setOpen}
      />
    </Dialog>
  );
}
