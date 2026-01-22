export default function ResultScreen({
  t,
  verdict,
  riskLevel,
  ingredients,
  keyIngredient,
  explanation,
  onScanAnother,
  onChangeProfile,
}) {
  const verdictColor =
    verdict === "SAFE"
      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
      : verdict === "UNSAFE"
      ? "bg-red-100 text-red-900 border-red-300"
      : "bg-yellow-100 text-yellow-900 border-yellow-300";

  return (
    <div className="space-y-4 text-emerald-900">

      {/* Verdict Card */}
      <div className={`rounded-2xl p-4 border shadow ${verdictColor}`}>
        <h2 className="text-xl font-bold text-center">{verdict}</h2>
        <p className="text-center text-sm mt-1">
          {t.riskLevel || "Risk Level"}: {riskLevel}
        </p>
      </div>

      {/* Key Ingredient */}
      <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-white/40 shadow">
        <h3 className="font-semibold text-emerald-800 mb-1">
          {t.keyIngredient || "Key Ingredient"}
        </h3>
        <p className="text-emerald-700">
          {keyIngredient || "Unknown"}
        </p>
      </div>

      {/* Explanation */}
      <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-white/40 shadow">
        <h3 className="font-semibold text-emerald-800 mb-1">
          {t.medicalExplanation || "Medical Explanation"}
        </h3>
        <p className="text-emerald-700 leading-relaxed text-sm">
          {explanation}
        </p>
      </div>

      {/* Ingredients */}
      <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-white/40 shadow">
        <h3 className="font-semibold text-emerald-800 mb-2">
          {t.ingredients || "Ingredient List"}
        </h3>
        <div className="text-emerald-700 text-sm whitespace-pre-wrap leading-relaxed">
          {ingredients}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onScanAnother}
        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
      >
        {t.scanAnother || "Scan Another"}
      </button>

      <button
        onClick={onChangeProfile}
        className="w-full text-sm text-emerald-800 hover:underline"
      >
        {t.changeProfile || "Change Profile"}
      </button>
    </div>
  );
}
