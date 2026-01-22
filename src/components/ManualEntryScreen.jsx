export default function ManualEntryScreen({
  t,
  productName,
  variant,
  setProductName,
  setVariant,
  onSearch,
  onBack,
}) {
  return (
    <div className="space-y-6 animate-fade-in-scale">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {t.manualEntryTitle || "Enter Product Details"}
        </h2>
        <p className="text-sm text-slate-600">
          {t.manualEntrySubtitle || "We will fetch ingredients using AI"}
        </p>
      </div>

      {/* Glass Card */}
      <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-emerald-300/40 shadow-[0_0_40px_rgba(16,185,129,0.25)] p-6 space-y-4">

        {/* Product Name */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">
            {t.productName || "Product Name"}
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Parle-G Biscuits"
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border border-slate-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
          />
        </div>

        {/* Variant */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">
            {t.variant || "Variant (Optional)"}
          </label>
          <input
            type="text"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            placeholder="e.g. Chocolate Cream"
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border border-slate-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={onSearch}
            className="w-full py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-emerald-500 to-green-600
                       hover:from-emerald-600 hover:to-green-700
                       shadow-lg shadow-emerald-500/30 transition-all"
          >
            🔍 {t.searchIngredients || "Fetch Ingredients"}
          </button>

          <button
            onClick={onBack}
            className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition"
          >
            ← {t.back || "Go Back"}
          </button>
        </div>
      </div>
    </div>
  );
}
