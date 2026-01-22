export default function ConfirmScreen({
  t,
  productName,
  ingredients,
  setIngredients,
  onAnalyze,
  onEdit,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="text-center space-y-3 mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-600/20 border border-green-600/30 mb-2">
          <svg
            className="w-7 h-7 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold tracking-tight text-white">
          {productName}
        </h2>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/30 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-green-400">
            Ingredients Retrieved
          </span>
        </div>
      </div>

      {/* INGREDIENT TEXTAREA */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-2xl">
        <label className="block text-xs font-medium text-slate-400 mb-3 uppercase tracking-wide">
          {t.ingredientList}
        </label>

        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full h-40 bg-slate-800/60 border border-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 px-4 py-3 rounded-xl text-sm text-slate-300 outline-none resize-none transition-all duration-200"
          placeholder="Ingredients will appear here..."
        />
      </div>

      {/* ACTIONS */}
      <div className="space-y-3">
        <button
          onClick={onAnalyze}
          disabled={!ingredients.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-700 disabled:to-slate-800 py-4 rounded-xl font-semibold text-white shadow-lg disabled:shadow-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.analyze}
        </button>

        <button
          onClick={onEdit}
          className="w-full text-slate-500 hover:text-slate-400 text-sm py-2 transition-colors"
        >
          {t.editDetails}
        </button>
      </div>
    </div>
  );
}