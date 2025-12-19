import SaleForm from "@/components/SaleForm";

export default function SalesPage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Record Sale</h1>
        <p className="text-gray-600 mt-1">
          Quickly record a sale against a menu item.
        </p>
      </header>

      <section className="bg-white shadow rounded-lg p-6">
        <SaleForm />
      </section>
    </main>
  );
}
