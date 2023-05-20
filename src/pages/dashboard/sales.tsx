import Head from "next/head";
import { useEffect } from "react";
import toast from "react-hot-toast";
import LoadingPage from "~/components/global/loading-page";
import { columns } from "~/components/sales/columns";
import { AddSaleDialog } from "~/components/sales/sale-dialog";
import { DataTable } from "~/components/table/data-table";
import { api } from "~/utils/api";
import DashboardLayout from "../../components/dashboard/dashboard-layout";
import { handleAuthorisation } from "../../lib/authorisation";

export default function Page() {
  const { data, isLoading, error } = api.sales.getList.useQuery();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>Sales</title>
        <meta name="description" content="Sales" />
      </Head>
      <DashboardLayout>
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sales</h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of your sales
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <AddSaleDialog />
            </div>
          </div>
          {data?.sales && <DataTable data={data.sales} columns={columns} />}
        </div>
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps = handleAuthorisation;
