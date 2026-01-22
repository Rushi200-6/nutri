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
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {t.productSearch}
        </h2>
        <p className="text-sm text-slate-400">
          {t.productSearchDesc}
        </p>
      </div>

      {/* FORM */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
            {t.productName}
          </label>
          <input
            type="text"
            placeholder="e.g., Doritos Tortilla Chips"
            className="w-full bg-slate-800/60 border border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 px-4 py-3.5 rounded-xl text-white placeholder:text-slate-600 outline-none transition-all duration-200"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
            {t.variant}
          </label>
          <input
            type="text"
            placeholder="e.g., Nacho Cheese"
            className="w-full bg-slate-800/60 border border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 px-4 py-3.5 rounded-xl text-white placeholder:text-slate-600 outline-none transition-all duration-200"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="space-y-3">
        <button
          onClick={onSearch}
          disabled={!productName.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-700 disabled:to-slate-800 py-4 rounded-xl font-semibold text-white shadow-lg disabled:shadow-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.searchIngredients}
        </button>

        <button
          onClick={onBack}
          className="w-full text-slate-500 hover:text-slate-400 text-sm py-2 transition-colors"
        >
          {t.backToScanner}
        </button>
      </div>
    </div>
  );
}