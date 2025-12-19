"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import InventoryTable from "@/components/InventoryTable";

type InventoryItem = {
  id: number;
  name: string;
  unit: string;
  current_stock: number;
  reorder_level: number;
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-6 w-6 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
      ></path>
    </svg>
  );
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStockIds, setLowStockIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const inventory = await apiGet("/inventory");
      const alerts = await apiGet("/alerts/low-stock");

      setItems(inventory);
      setLowStockIds(
        alerts && alerts.items ? alerts.items.map((i: any) => i.id) : []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Inventory Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of current stock levels and low-stock alerts.
        </p>
      </header>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <label htmlFor="search" className="sr-only">
            Search items
          </label>
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items"
            className="border border-gray-200 rounded-md px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
            <span>{items.length} items</span>
          )}
        </div>
      </div>

      <section className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <InventoryTable
            items={items.filter((it) =>
              it.name.toLowerCase().includes(query.toLowerCase())
            )}
            lowStockIds={lowStockIds}
          />
        )}
      </section>
    </main>
  );
}
