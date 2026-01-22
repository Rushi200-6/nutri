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
    <div className="space-y-8 animate-fade-in-scale">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Manual Product Entry
        </h2>
        <p className="text-sm text-slate-600">
          Enter the product name to let AI fetch ingredients safely
        </p>
      </div>

      {/* Glass Card */}
      <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl 
                      border border-emerald-200/60 
                      shadow-[0_0_60px_rgba(16,185,129,0.25)] 
                      p-7 space-y-6">

        {/* Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>

        {/* Product Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. Amul Butter"
            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 
                       text-slate-800 placeholder-slate-400 transition"
          />
        </div>

        {/* Variant */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Variant (Optional)
          </label>
          <input
            type="text"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            placeholder="e.g. Salted, Low Fat"
            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 
                       text-slate-800 placeholder-slate-400 transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 space-y-3">
          <button
            onClick={onSearch}
            className="w-full py-3.5 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-emerald-500 to-green-600
                       hover:from-emerald-600 hover:to-green-700
                       shadow-lg shadow-emerald-500/30 
                       transition-all duration-200"
          >
            🔎 Fetch Ingredients with AI
          </button>

          <button
            onClick={onBack}
            className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition"
          >
            ← Back to Scan
          </button>
        </div>
      </div>
    </div>
  );
}
