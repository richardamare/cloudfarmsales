import Head from "next/head";
import { columns } from "~/components/customers/columns";
import { AddCustomerDialog } from "~/components/customers/customer-dialog";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import LoadingPage from "~/components/global/loading-page";
import { DataTable } from "~/components/table/data-table";
import { api } from "~/utils/api";
import { handleAuthorisation } from "../../lib/authorisation";

export default function Page() {
  const { data, isLoading } = api.customers.getList.useQuery();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>Customers</title>
        <meta name="description" content="Customers" />
      </Head>

      <DashboardLayout>
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of your customers
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <AddCustomerDialog />
              {/* <DownloadCustomersButton /> */}
            </div>
          </div>
          {data?.customers && (
            <DataTable data={data.customers} columns={columns} filters={[]} />
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps = handleAuthorisation;
