import { CreditCard, DollarSign, Download, Package, Users } from "lucide-react";
import Head from "next/head";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { OverviewChart } from "~/components/dashboard/overview-chart";
import { PercentangeChange } from "~/components/dashboard/percent-change";
import { RecentSales } from "~/components/dashboard/recent-sales";
import LoadingSpinner from "~/components/global/loading-spinner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatNumber, formatPrice } from "~/lib/utils";
import { api } from "~/utils/api";

export default function Page() {
  const { data: reports, isLoading: isLoadingReports } =
    api.reports.dashboard.useQuery();

  const { data: yearlySales, isLoading: isLoadingSales } =
    api.reports.yearlySales.useQuery();

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Head>

      <DashboardLayout>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              {/* <DateRangePicker /> */}
              <Button size="sm" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingReports && <LoadingSpinner />}
                {!isLoadingReports && reports?.revenue && (
                  <>
                    <div className="text-2xl font-bold">
                      {formatPrice(reports.revenue.currentTotal)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <PercentangeChange
                        value={reports.revenue.percentageChange}
                      />
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingReports && <LoadingSpinner />}
                {!isLoadingReports && reports?.customers && (
                  <>
                    <div className="text-2xl font-bold">
                      {formatNumber(reports.customers.currentCount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <PercentangeChange
                        value={reports.customers.percentageChange}
                      />
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingReports && <LoadingSpinner />}
                {!isLoadingReports && reports?.sales && (
                  <>
                    <div className="text-2xl font-bold">
                      {formatNumber(reports.sales.currentCount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <PercentangeChange
                        value={reports.sales.percentageChange}
                      />
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  DOC Quantity
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingReports && <LoadingSpinner />}
                {!isLoadingReports && reports?.docQuantity && (
                  <>
                    <div className="text-2xl font-bold">
                      {formatNumber(reports.docQuantity.currentTotal)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <PercentangeChange
                        value={reports.docQuantity.percentageChange}
                      />
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoadingSales && (
                  <div className="h-64">
                    <LoadingSpinner />
                  </div>
                )}
                {!isLoadingSales && yearlySales?.sales && (
                  <OverviewChart data={yearlySales.sales} />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
