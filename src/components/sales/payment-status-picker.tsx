"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { paymenStatuses, type PaymentStatus } from "~/db/schema";
import { capitalize, cn } from "~/lib/utils";

interface PaymentStatusPickerProps {
  paymentStatus: PaymentStatus;
  setPaymentStatus: (paymentStatus: PaymentStatus) => void;
}

export default function PaymentStatusPicker({
  paymentStatus,
  setPaymentStatus,
}: PaymentStatusPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {paymentStatus ? capitalize(paymentStatus) : "Select status..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandEmpty>No status found.</CommandEmpty>
          <CommandGroup>
            {paymenStatuses.map((status) => (
              <CommandItem
                key={status}
                onSelect={() => {
                  setPaymentStatus(status);
                  setOpen(false);
                  console.log(paymentStatus);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    paymentStatus === status ? "opacity-100" : "opacity-0"
                  )}
                />
                {capitalize(status)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
