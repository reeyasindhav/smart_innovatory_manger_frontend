"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type MenuItem = {
  id: number;
  name: string;
};

export default function SaleForm() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuItemId, setMenuItemId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await apiGet("/menu");
        setMenu(data || []);
      } catch (err) {
        setError("Failed to load menu");
      }
    }
    loadMenu();
  }, []);

  async function submitSale(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    setSubmitting(true);
    if (!menuItemId || quantity <= 0) {
      setError("Select item and valid quantity");
      setSubmitting(false);
      return;
    }

    try {
      await apiPost("/sales", {
        menu_item_id: menuItemId,
        quantity,
      });
      setMessage("✅ Sale recorded successfully");
      setQuantity(1);
      setMenuItemId("");
    } catch (err: any) {
      setError(err.message || "Sale failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submitSale}
      className="max-w-md bg-white shadow rounded-lg p-6 space-y-4"
    >
      <div>
        <label
          htmlFor="menu"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Menu Item
        </label>
        <select
          id="menu"
          className="block w-full rounded-md border-gray-200 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={menuItemId}
          onChange={(e) =>
            setMenuItemId(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">Select item</option>
          {menu.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          className="block w-full rounded-md border-gray-200 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center gap-2 justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none ${
            submitting ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {submitting ? (
            <svg
              className="animate-spin h-4 w-4"
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
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : null}
          <span>{submitting ? "Recording..." : "Record Sale"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMenuItemId("");
            setQuantity(1);
            setMessage(null);
            setError(null);
          }}
          className="text-sm text-gray-600 hover:underline"
        >
          Reset
        </button>
      </div>

      <div aria-live="polite">
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </form>
  );
}
