import PurchaseForm from "@/components/PurchaseForm";

export default function PurchasePage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Purchase Stock</h1>
        <p className="text-gray-600 mt-1">
          Add incoming stock to inventory quickly and safely.
        </p>
      </header>

      <section className="bg-white shadow rounded-lg p-6">
        <PurchaseForm />
      </section>
    </main>
  );
}
