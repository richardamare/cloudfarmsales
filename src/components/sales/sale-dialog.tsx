"use client";

import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type Sale } from "~/db/schema";
import { api } from "../../utils/api";
import CustomerPicker from "../customers/customer-picker";

interface SaleDialogProps {
  sale?: Sale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SaleDialog({ sale, onOpenChange }: SaleDialogProps) {
  const [docQuantity, setDocQuantity] = useState(sale?.docQuantity ?? 0);
  const [docUnitPrice, setDocUnitPrice] = useState(sale?.docUnitPrice ?? 0);
  const [docDeliveredQuantity, setDocDeliveredQuantity] = useState(
    sale?.docDeliveredQuantity ?? 0
  );
  const [currency, setCurrency] = useState(sale?.currency ?? "ETB");
  const [customerId, setCustomerId] = useState<string>(sale?.customerId ?? "");

  const { data } = api.customers.getList.useQuery();

  const {
    mutate: createMutate,
    isLoading: createIsLoading,
    error: createError,
    isSuccess: createIsSuccess,
  } = api.sales.create.useMutation();
  const {
    mutate: updateMutate,
    isLoading: updateIsLoading,
    error: updateError,
    isSuccess: updateIsSuccess,
  } = api.sales.update.useMutation();

  const actionIsLoading = createIsLoading || updateIsLoading;

  const router = useRouter();
  const isNew = !sale;
  const isDisabled =
    !customerId ||
    !docQuantity ||
    !docUnitPrice ||
    !docDeliveredQuantity ||
    !currency ||
    actionIsLoading;

  function handleOnClick(e: React.SyntheticEvent) {
    e.preventDefault();

    if (isNew) {
      createMutate({
        customerId,
        docQuantity,
        docUnitPrice,
        docDeliveredQuantity,
        currency,
      });
    }

    if (!isNew) {
      updateMutate({
        saleId: sale.id,
        customerId,
        docQuantity,
        docUnitPrice,
        docDeliveredQuantity,
        currency,
      });
    }
  }

  useEffect(() => {
    if (createError) {
      toast.error(createError.message);
    }

    if (updateError) {
      toast.error(updateError.message);
    }
  }, [createError, updateError]);

  useEffect(() => {
    if (createIsSuccess) {
      toast.success("Customer added successfully");
      onOpenChange(false);
    }

    if (updateIsSuccess) {
      toast.success("Customer updated successfully");
      onOpenChange(false);
    }

    if (createIsSuccess || updateIsSuccess) {
      router.reload();
    }
  }, [createIsSuccess, updateIsSuccess, onOpenChange, router]);

  return (
    <>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Sale</DialogTitle>
          <DialogDescription>Add a new sale to the database</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="customer">Customer</Label>
            <CustomerPicker
              customers={data?.customers ?? []}
              customerId={customerId}
              setCustomerId={setCustomerId}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="docQuantity">DOC Quantity</Label>
            <Input
              type="number"
              id="docQuantity"
              className="col-span-3"
              value={docQuantity}
              onChange={(e) => setDocQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="docUnitPrice">DOC Unit Price</Label>
            <Input
              type="number"
              id="docUnitPrice"
              className="col-span-3"
              value={docUnitPrice}
              onChange={(e) => setDocUnitPrice(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="docDeliveredQuantity">DOC Delivered Quantity</Label>
            <Input
              type="number"
              id="docDeliveredQuantity"
              className="col-span-3"
              value={docDeliveredQuantity}
              onChange={(e) => setDocDeliveredQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              className="col-span-3"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleOnClick} disabled={isDisabled}>
            {actionIsLoading && <LoadingSpinner />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}

export function AddSaleDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Sale
        </Button>
      </DialogTrigger>
      <SaleDialog open={open} onOpenChange={setOpen} sale={undefined} />
    </Dialog>
  );
}

export function EditSaleDialog({ open, onOpenChange, sale }: SaleDialogProps) {
  return <SaleDialog open={open} onOpenChange={onOpenChange} sale={sale} />;
}
