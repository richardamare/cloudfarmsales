import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { paymenStatuses, type Sale } from "~/db/schema";
import { capitalize } from "~/lib/utils";
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
  docQuantity: parsedNumber,
  docUnitPrice: parsedNumber,
  docDeliveredQuantity: parsedNumber,
  customerId: z.string(),
  feedAmount: parsedNumber,
  feedUnitPrice: parsedNumber,
  paymentStatus: z.enum(paymenStatuses),
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
  const { data, error: customersError } = api.customers.getList.useQuery();

  const customers = data?.customers ?? [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      docQuantity: sale?.docQuantity,
      docUnitPrice: sale?.docUnitPrice,
      docDeliveredQuantity: sale?.docDeliveredQuantity,
      customerId: sale?.customerId,
      feedAmount: sale?.feedAmount,
      feedUnitPrice: sale?.feedUnitPrice,
      paymentStatus: sale?.paymentStatus,
    },
  });

  const create = api.sales.create.useMutation();
  const update = api.sales.update.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!sale) {
      create.mutate({ ...values });
      return;
    }

    if (sale) {
      update.mutate({ saleId: sale.id, ...values });
      return;
    }
  }

  useEffect(() => {
    if (customersError) {
      toast.error(customersError.message);
    }
    if (create.error) {
      toast.error(create.error.message);
    }

    if (update.error) {
      toast.error(update.error.message);
    }
  }, [customersError, create.error, update.error]);

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
                      {customers.map((customer) => (
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
          </div>
        </form>
      </Form>
    </>
  );
}
