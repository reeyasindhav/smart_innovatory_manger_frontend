"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type InventoryItem = {
  id: number;
  name: string;
  unit: string;
};

export default function PurchaseForm() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [itemId, setItemId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await apiGet("/inventory");
        setItems(data);
      } catch {
        setError("Failed to load inventory");
      }
    }
    loadInventory();
  }, []);

  async function submitPurchase(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    setSubmitting(true);
    if (!itemId || quantity <= 0) {
      setError("Select item and valid quantity");
      setSubmitting(false);
      return;
    }

    try {
      await apiPost("/purchase", {
        inventory_item_id: itemId,
        quantity,
      });
      setMessage("✅ Stock added successfully");
      setQuantity(1);
      setItemId("");
    } catch (err: any) {
      setError(err.message || "Purchase failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submitPurchase}
      className="max-w-md bg-white shadow rounded-lg p-6 space-y-4"
    >
      <div>
        <label
          htmlFor="inventory"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Inventory Item
        </label>
        <select
          id="inventory"
          className="block w-full rounded-md border-gray-200 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-200"
          value={itemId}
          onChange={(e) =>
            setItemId(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">Select item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.unit})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="qty"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          className="block w-full rounded-md border-gray-200 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-200"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center gap-2 justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none ${
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
          <span>{submitting ? "Adding..." : "Add Stock"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setItemId("");
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
