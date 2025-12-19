"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import ReportCard from "@/components/ReportCard";

function Spinner() {
  return (
    <svg
      className="animate-spin h-6 w-6 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function ReportsPage() {
  const [ingredientUsage, setIngredientUsage] = useState<any[]>([]);
  const [salesSummary, setSalesSummary] = useState<any[]>([]);
  const [purchaseSummary, setPurchaseSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<number>(7);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const usage = await apiGet(`/reports/ingredient-usage?days=${days}`);
        const sales = await apiGet(`/reports/sales-summary?days=${days}`);
        const purchases = await apiGet(
          `/reports/purchase-summary?days=${days}`
        );

        setIngredientUsage(usage || []);
        setSalesSummary(sales || []);
        setPurchaseSummary(purchases || []);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [days]);

  function exportCSV(filename: string, rows: any[], headers: string[]) {
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => r[h] ?? "").join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalSales = salesSummary.reduce(
    (s, r) => s + (r.quantity_sold || 0),
    0
  );
  const totalRevenue = salesSummary.reduce((s, r) => s + (r.revenue || 0), 0);
  const totalPurchased = purchaseSummary.reduce(
    (s, r) => s + (r.purchased_quantity || 0),
    0
  );

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Reports</h1>
        <p className="text-gray-600 mt-1">
          Analytics and summaries for recent activity. Select a period to
          refresh the reports.
        </p>
      </header>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label htmlFor="period" className="text-sm text-gray-600">
            Period:
          </label>
          <select
            id="period"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border rounded-md px-2 py-1"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={() => {
              setDays(days);
            }}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-md"
          >
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner /> <span>Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-sm">
                <div className="text-xs text-gray-500">Total Items Sold</div>
                <div className="font-semibold">{totalSales}</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-gray-500">Revenue</div>
                <div className="font-semibold">₹{totalRevenue}</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-gray-500">Purchased Qty</div>
                <div className="font-semibold">{totalPurchased}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ReportCard
          title="Total Sales"
          subtitle={`Items sold: ${totalSales}`}
          actions={
            <button
              onClick={() =>
                exportCSV(`sales_${days}d.csv`, salesSummary, [
                  "menu_item",
                  "quantity_sold",
                  "revenue",
                ])
              }
              className="text-sm text-blue-600 hover:underline"
            >
              Export CSV
            </button>
          }
        >
          <div className="text-2xl font-bold">₹{totalRevenue}</div>
        </ReportCard>

        <ReportCard
          title="Purchases"
          subtitle={`Purchased qty: ${totalPurchased}`}
          actions={
            <button
              onClick={() =>
                exportCSV(`purchases_${days}d.csv`, purchaseSummary, [
                  "ingredient",
                  "purchased_quantity",
                ])
              }
              className="text-sm text-blue-600 hover:underline"
            >
              Export CSV
            </button>
          }
        >
          <div className="text-2xl font-bold">{totalPurchased}</div>
        </ReportCard>

        <ReportCard
          title="Top Ingredients"
          subtitle="Most used ingredients in period"
        >
          <ul className="text-sm space-y-2">
            {ingredientUsage.slice(0, 5).map((row, idx) => (
              <li key={idx} className="flex justify-between">
                <span className="text-gray-700">{row.ingredient}</span>
                <span className="font-semibold">{row.used_quantity}</span>
              </li>
            ))}
          </ul>
        </ReportCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Sales Summary"
          subtitle={`Last ${days} days`}
          className="overflow-auto"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Menu Item
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Quantity Sold
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {salesSummary.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {row.menu_item}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {row.quantity_sold}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    ₹{row.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportCard>

        <ReportCard
          title="Purchase Summary"
          subtitle={`Last ${days} days`}
          className="overflow-auto"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Ingredient
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Purchased Quantity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {purchaseSummary.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {row.ingredient}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {row.purchased_quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportCard>
      </div>
    </main>
  );
}
