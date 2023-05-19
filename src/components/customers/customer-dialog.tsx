import { PlusCircleIcon } from "lucide-react";
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
import { type Customer } from "~/db/schema";
import { api } from "~/utils/api";

interface CustomerDialogProps {
  customer?: Customer;
}

export default function CustomerDialog({ customer }: CustomerDialogProps) {
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [zone, setZone] = useState(customer?.zone ?? "");
  const [region, setRegion] = useState(customer?.region ?? "");

  const isNew = !customer;

  const {
    mutate: createMutate,
    error: createError,
    isLoading: createIsLoading,
    isSuccess: createIsSuccess,
  } = api.customers.create.useMutation();

  const {
    mutate: updateMutate,
    error: updateError,
    isLoading: updateIsLoading,
    isSuccess: updateIsSuccess,
  } = api.customers.update.useMutation();

  const isLoading = isNew ? createIsLoading : updateIsLoading;
  const isDisabled = !name || !phone || !zone || !region || isLoading;

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (isNew) {
      createMutate({
        name,
        phone,
        zone,
        region,
      });
    }

    if (!isNew && customer) {
      updateMutate({
        customerId: customer.id,
        name,
        phone,
        zone,
        region,
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
    }

    if (updateIsSuccess) {
      toast.success("Customer updated successfully");
    }
  }, [createIsSuccess, updateIsSuccess]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            {isNew ? "Add" : "Edit"} Customer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add" : "Edit"} Customer</DialogTitle>
            <DialogDescription>
              {isNew ? "Add a new customer" : "Edit an existing customer"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                className="col-span-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zone" className="text-right">
                Zone
              </Label>
              <Input
                id="zone"
                className="col-span-3"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">
                Region
              </Label>
              <Input
                id="region"
                className="col-span-3"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isDisabled} onClick={onSubmit}>
              {isLoading && <LoadingSpinner />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
