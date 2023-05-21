import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { paymenStatuses, type Sale } from "~/db/schema";
import { capitalize, cn } from "~/lib/utils";
import { api } from "~/utils/api";

const parsedNumber = z.string().transform((val, ctx) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Must be a number",
    });

    return z.NEVER;
  }

  const schema = z.number().int().positive();

  const result = schema.safeParse(parsed);

  if (!result.success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Must be a positive integer",
    });
  }

  return parsed;
});

const formSchema = z.object({
  docQuantity: z.number().int().positive(),
  docUnitPrice: z.number().int().positive(),
  docDeliveredQuantity: z.number().int().positive(),
  customerId: z.string(),
  feedAmount: z.number().int().positive(),
  feedUnitPrice: z.number().int().positive(),
  paymentStatus: z.enum(paymenStatuses),
  soldAt: z.date(),
});

interface SaleFormProps {
  sale?: Sale;
  onSuccess?: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function SaleForm({
  sale,
  onSuccess,
  setIsLoading,
}: SaleFormProps) {
  const customers = api.customers.getList.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      docQuantity: sale?.docQuantity,
      docUnitPrice: sale?.docUnitPrice ? sale.docUnitPrice / 100 : undefined,
      docDeliveredQuantity: sale?.docDeliveredQuantity,
      customerId: sale?.customerId,
      feedAmount: sale?.feedAmount,
      feedUnitPrice: sale?.feedUnitPrice ? sale.feedUnitPrice / 100 : undefined,
      paymentStatus: sale?.paymentStatus,
      soldAt: sale?.soldAt,
    },
  });

  const create = api.sales.create.useMutation();
  const update = api.sales.update.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!sale) {
      create.mutate({ ...values });
      return;
    }

    if (sale) {
      update.mutate({ id: sale.id, ...values });
      return;
    }
  }

  useEffect(() => {
    if (customers.error) {
      toast.error(customers.error.message);
    }
    if (create.error) {
      toast.error(create.error.message);
    }

    if (update.error) {
      toast.error(update.error.message);
    }
  }, [customers.error, create.error, update.error]);

  useEffect(() => {
    if (create.isSuccess) {
      toast.success("Sale created successfully");
    }
  }, [create.isSuccess]);

  useEffect(() => {
    if (update.isSuccess) {
      toast.success("Sale updated successfully");
    }
  }, [update.isSuccess]);

  useEffect(() => {
    if (create.isSuccess || update.isSuccess) {
      onSuccess?.();
    }
  }, [create.isSuccess, update.isSuccess, onSuccess]);

  useEffect(() => {
    setIsLoading(create.isLoading || update.isLoading);
  }, [create.isLoading, update.isLoading, setIsLoading]);

  return (
    <>
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit)}
          id="sale-form"
        >
          <div className="grid grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(customers.data?.customers ?? []).map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The customer who bought the feed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="docQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOC Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    The quantity of DOC sold to the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="docUnitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOC Unit Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    The unit price of DOC sold to the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="docDeliveredQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOC Delivered Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    The quantity of DOC delivered to the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feed Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    The amount of feed sold to the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedUnitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feed Unit Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    The unit price of feed sold to the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment status..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymenStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {capitalize(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The payment status of the sale.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soldAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sold At</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && isValid(new Date(field.value)) ? (
                            <>{format(new Date(field.value), "yyyy-MM-dd")}</>
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>The date the sale was made.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
