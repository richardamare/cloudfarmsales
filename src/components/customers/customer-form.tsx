import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
import { type Customer } from "~/lib/db/schema";
import { api } from "~/lib/api";

const formSchema = z.object({
  name: z.string().nonempty(),
  phone: z.string().nonempty(),
  region: z.string(),
  zone: z.string(),
  tinNumber: z.string(),
  woreda: z.string(),
  kebele: z.string(),
});

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function CustomerForm({
  customer,
  onSuccess,
  setIsLoading,
}: CustomerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name,
      phone: customer?.phone,
      region: customer?.region,
      zone: customer?.zone,
      tinNumber: customer?.tinNumber,
      woreda: customer?.woreda,
      kebele: customer?.kebele,
    },
  });

  const create = api.customers.create.useMutation();
  const update = api.customers.update.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!customer) {
      create.mutate({ ...values });
      return;
    }

    if (customer) {
      update.mutate({ id: customer.id, ...values });
      return;
    }
  }

  useEffect(() => {
    if (create.error) {
      toast.error(create.error.message);
    }

    if (update.error) {
      toast.error(update.error.message);
    }
  }, [create.error, update.error]);

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
          id="customer-form"
        >
          <div className="grid grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>The name of the customer.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormDescription>
                    The phone number of the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Region" {...field} />
                  </FormControl>
                  <FormDescription>The region of the customer.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <FormControl>
                    <Input placeholder="Zone" {...field} />
                  </FormControl>
                  <FormDescription>The zone of the customer.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="woreda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Woreda</FormLabel>
                  <FormControl>
                    <Input placeholder="Woreda" {...field} />
                  </FormControl>
                  <FormDescription>The woreda of the customer.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kebele"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kebele</FormLabel>
                  <FormControl>
                    <Input placeholder="Kebele" {...field} />
                  </FormControl>
                  <FormDescription>The kebele of the customer.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tinNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="TIN Number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The TIN number of the customer.
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
