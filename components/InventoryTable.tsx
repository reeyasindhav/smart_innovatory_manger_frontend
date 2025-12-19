type InventoryItem = {
  id: number;
  name: string;
  unit: string;
  current_stock: number;
  reorder_level: number;
};

export default function InventoryTable({
  items,
  lowStockIds,
}: {
  items: InventoryItem[];
  lowStockIds: number[];
}) {
  return (
    <div>
      {/* Desktop / wide screens: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <caption className="sr-only">Inventory items</caption>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Item
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Stock
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Reorder Level
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((item) => {
              const isLow = lowStockIds.includes(item.id);
              return (
                <tr key={item.id} className={isLow ? "bg-red-50" : ""}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">{item.unit}</div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {item.current_stock}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {item.reorder_level}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {isLow ? (
                      <span className="inline-flex items-center gap-2 text-red-600 font-semibold">
                        ⚠ Low
                      </span>
                    ) : (
                      <span className="text-green-600">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {items.map((item) => {
          const isLow = lowStockIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`p-3 bg-white shadow-sm rounded-lg border ${
                isLow ? "border-red-200" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">{item.unit}</div>
                </div>
                <div className="text-sm">
                  {isLow ? (
                    <span className="text-red-600 font-semibold">⚠ Low</span>
                  ) : (
                    <span className="text-green-600">OK</span>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-6 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Stock</div>
                  <div className="font-semibold">{item.current_stock}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Reorder</div>
                  <div className="font-semibold">{item.reorder_level}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
