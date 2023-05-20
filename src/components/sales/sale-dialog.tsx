"use client";

import { PlusCircleIcon } from "lucide-react";
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
import { type Sale } from "~/db/schema";
import SaleForm from "./sale-form";

interface SaleDialogProps {
  sale?: Sale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SaleDialog({ sale, onOpenChange }: SaleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  function onSuccess() {
    onOpenChange(false);
  }

  return (
    <>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Add Sale</DialogTitle>
          <DialogDescription>Add a new sale to the database</DialogDescription>
        </DialogHeader>
        <SaleForm
          sale={sale}
          onSuccess={onSuccess}
          setIsLoading={setIsLoading}
        />
        <DialogFooter>
          <Button type="submit" form="sale-form">
            {isLoading && <LoadingSpinner />}
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
