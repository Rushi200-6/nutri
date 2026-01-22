export default function ConfirmScreen({
  t,
  productName,
  ingredients,
  setIngredients,
  onAnalyze,
  onEdit,
}) {
  return (
    <div className="space-y-8 animate-fade-in-scale">

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Confirm Ingredients
        </h2>
        <p className="text-sm text-slate-600">
          Review and edit ingredients before safety analysis
        </p>
      </div>

      {/* Glass Card */}
      <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl 
                      border border-emerald-200/60 
                      shadow-[0_0_60px_rgba(16,185,129,0.25)] 
                      p-7 space-y-5">

        {/* Soft Glow Blob */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>

        {/* Product Name */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-800">{productName}</h3>
          <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full
                           bg-emerald-100 text-emerald-700 font-medium">
            Ingredients Retrieved
          </span>
        </div>

        {/* Ingredients Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t.ingredientList}
          </label>

          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full h-44 rounded-xl bg-white/80 border border-slate-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-400
                       px-4 py-3 text-sm text-slate-800 placeholder-slate-400
                       resize-none transition"
            placeholder="Ingredients will appear here..."
          />
        </div>

        {/* Actions */}
        <div className="pt-3 space-y-3">
          <button
            onClick={onAnalyze}
            disabled={!ingredients.trim()}
            className="w-full py-3.5 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-emerald-500 to-green-600
                       hover:from-emerald-600 hover:to-green-700
                       shadow-lg shadow-emerald-500/30
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🧠 Analyze Safety
          </button>

          <button
            onClick={onEdit}
            className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition"
          >
            ✎ Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}
