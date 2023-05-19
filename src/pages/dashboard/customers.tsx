import CustomerDialog from "~/components/customers/customer-dialog";

export default function Page() {
  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your customers
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <CustomerDialog />
            {/* <DownloadCustomersButton /> */}
          </div>
        </div>
        {/* <DataTable data={[]} columns={[]} filters={[]} /> */}
      </div>
    </>
  );
}
