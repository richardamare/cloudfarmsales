import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import LoadingSpinner from "~/components/global/loading-spinner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { type Customer } from "~/lib/db/schema";
import { CustomerForm } from "./customer-form";

interface CustomerDialogProps {
  customer?: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CustomerDialog({ customer, onOpenChange }: CustomerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const isNew = !customer;

  function onSuccess() {
    onOpenChange(false);
    router.reload();
  }

  return (
    <>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add" : "Edit"} Customer</DialogTitle>
          <DialogDescription>
            {isNew ? "Add a new customer" : "Edit an existing customer"}
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          customer={customer}
          setIsLoading={setIsLoading}
          onSuccess={onSuccess}
        />
        <DialogFooter>
          <Button type="submit" form="customer-form">
            {isLoading && <LoadingSpinner />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <CustomerDialog open={open} onOpenChange={setOpen} customer={undefined} />
    </Dialog>
  );
}

export function EditCustomerDialog({
  open,
  onOpenChange,
  customer,
}: CustomerDialogProps) {
  return (
    <CustomerDialog
      open={open}
      onOpenChange={onOpenChange}
      customer={customer}
    />
  );
}
