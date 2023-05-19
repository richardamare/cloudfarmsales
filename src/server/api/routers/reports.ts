import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { db } from "~/db";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reportsRouter = createTRPCRouter({
  dashboard: protectedProcedure.query(async () => {
    try {
      const start = new Date();
      const end = new Date();

      const previousStart = new Date(start);
      previousStart.setMonth(previousStart.getMonth() - 1);

      const previousEnd = new Date(end);
      previousEnd.setMonth(previousEnd.getMonth() - 1);

      const range: ReportRange = {
        start,
        end,
        previousStart,
        previousEnd,
      };

      const customers = await getCustomersReport(range);
      const sales = await getSalesReport(range);
      const revenue = await getRevenue(range);
      const docQuantity = await getDOCQuantity(range);

      return { customers, sales, revenue, docQuantity };
    } catch (e) {
      const err = e as Error;
      console.log("[ SERVER ]: Failed to get dashboard reports", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get dashboard reports: ${err.message}`,
      });
    }
  }),
  yearlySales: protectedProcedure.query(async () => {
    try {
      const result = await db.execute<{ month: string; total: number }>(sql`
          SELECT
            to_char(date_trunc('month', created_at), 'Mon') AS month,
            SUM(doc_quantity * doc_unit_price) AS total
          FROM sales
          WHERE date_trunc('year', created_at) = date_trunc('year', CURRENT_DATE)
          GROUP BY month
          ORDER BY month
        `);

      const sales = result.rows;

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      const salesReport = months.map((month) => {
        const sale = sales.find((sale) => sale.month === month);

        if (sale)
          return {
            name: sale.month,
            total: sale.total / 100,
          };

        return { name: month, total: 0 };
      });

      return { sales: salesReport };
    } catch (e) {
      const err = e as Error;
      console.log("[ SERVER ]: Failed to get yearly sales", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get yearly sales: ${err.message}`,
      });
    }
  }),
});

type ReportRange = {
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
};

async function getCustomersReport({
  start,
  end,
  previousEnd,
  previousStart,
}: ReportRange) {
  try {
    const currentMonth = await db.execute<{ count: number }>(
      sql`
          SELECT COUNT(*)
          FROM customers
          WHERE created_at >= ${start} AND created_at <= ${end}
        `
    );
    const previousMonth = await db.execute<{ count: number }>(
      sql`
          SELECT COUNT(*)
          FROM customers
          WHERE created_at >= ${previousStart} AND created_at <= ${previousEnd}
        `
    );

    if (!currentMonth.rows[0] || !previousMonth.rows[0]) {
      return {
        currentCount: 0,
        percentageChange: 0,
      };
    }

    const currentCount = currentMonth.rows[0].count;
    const previousCount = previousMonth.rows[0].count;
    const percentageChange = (currentCount - previousCount) / previousCount;

    return {
      currentCount,
      percentageChange,
    };
  } catch (e) {
    const err = e as Error;
    console.error("[ SERVER ]: Failed to get customers report", err);
    throw Error(`Failed to get customers report: ${err.message}`);
  }
}

async function getSalesReport({
  start,
  end,
  previousEnd,
  previousStart,
}: ReportRange) {
  try {
    const currentMonth = await db.execute<{ count: number }>(
      sql`
          SELECT COUNT(*)
          FROM sales
          WHERE created_at >= ${start} AND created_at <= ${end}
        `
    );
    const previousMonth = await db.execute<{ count: number }>(
      sql`
          SELECT COUNT(*)
          FROM sales
          WHERE created_at >= ${previousStart} AND created_at <= ${previousEnd}
        `
    );

    if (!currentMonth.rows[0] || !previousMonth.rows[0]) {
      return {
        currentCount: 0,
        percentageChange: 0,
      };
    }

    const currentCount = currentMonth.rows[0].count;
    const previousCount = previousMonth.rows[0].count;
    const percentageChange = (currentCount - previousCount) / previousCount;

    return {
      currentCount,
      percentageChange,
    };
  } catch (e) {
    const err = e as Error;
    console.error("[ SERVER ]: Failed to get sales report", err);
    throw Error(`Failed to get sales report: ${err.message}`);
  }
}

async function getRevenue({
  start,
  end,
  previousEnd,
  previousStart,
}: ReportRange) {
  try {
    const currentMonth = await db.execute<{ total: number }>(
      sql`
          SELECT SUM(doc_quantity * doc_unit_price) AS total
          FROM sales
          WHERE created_at >= ${start} AND created_at <= ${end}
        `
    );

    const previousMonth = await db.execute<{ total: number }>(
      sql`
          SELECT SUM(doc_quantity * doc_unit_price) AS total
          FROM sales
          WHERE created_at >= ${previousStart} AND created_at <= ${previousEnd}
        `
    );

    if (!currentMonth.rows[0] || !previousMonth.rows[0]) {
      return {
        currentTotal: 0,
        percentageChange: 0,
      };
    }

    const currentTotal = currentMonth.rows[0].total;
    const previousTotal = previousMonth.rows[0].total;
    const percentageChange = (currentTotal - previousTotal) / previousTotal;

    return {
      currentTotal,
      percentageChange,
    };
  } catch (e) {
    const err = e as Error;
    console.error("[ SERVER ]: Failed to get total revenue", err);
    throw Error(`Failed to get total revenue: ${err.message}`);
  }
}

async function getDOCQuantity({
  start,
  end,
  previousEnd,
  previousStart,
}: ReportRange) {
  try {
    const currentMonth = await db.execute<{ total: number }>(
      sql`
          SELECT SUM(doc_quantity) AS total
          FROM sales
          WHERE created_at >= ${start} AND created_at <= ${end}
        `
    );

    const previousMonth = await db.execute<{ total: number }>(
      sql`
          SELECT SUM(doc_quantity) AS total
          FROM sales
          WHERE created_at >= ${previousStart} AND created_at <= ${previousEnd}
        `
    );

    if (!currentMonth.rows[0] || !previousMonth.rows[0]) {
      return {
        currentTotal: 0,
        percentageChange: 0,
      };
    }

    const currentTotal = currentMonth.rows[0].total;
    const previousTotal = previousMonth.rows[0].total;
    const percentageChange = (currentTotal - previousTotal) / previousTotal;

    return {
      currentTotal,
      percentageChange,
    };
  } catch (e) {
    const err = e as Error;
    console.error("[ SERVER ]: Failed to get total revenue", err);
    throw Error(`Failed to get total revenue: ${err.message}`);
  }
}
