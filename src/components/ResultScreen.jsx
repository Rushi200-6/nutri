export default function ResultScreen(props) {
  const {
    t,
    verdict,
    riskLevel,
    profile,
    barcode,
    ingredients,
    keyIngredient,
    explanation,
    onReanalyze,
    onScanAnother,
    onChangeProfile,
    height = null,
    weight = null,
  } = props;

  /* ---------------- CONTEXT BADGE LOGIC ---------------- */
  const getContextBadge = () => {
    if (verdict === "UNSAFE") {
      return {
        text: keyIngredient
          ? `Contains restricted ingredient: ${keyIngredient}`
          : `Violates ${profile} profile`,
        color: "bg-red-600/20 text-red-400 border-red-600/40",
        icon: "✕",
      };
    }

    if (verdict === "CAUTION") {
      return {
        text: "Health Advisory (BMI / Nutrition)",
        color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/40",
        icon: "⚠",
      };
    }

    return {
      text: "Profile Compatible",
      color: "bg-green-600/20 text-green-400 border-green-600/40",
      icon: "✓",
    };
  };

  const context = getContextBadge();

  const calculateBMI = () => {
    if (!height || !weight) return null;

    const h = height / 100;
    return (weight / (h * h)).toFixed(1);
  };

  const bmi = calculateBMI();

  const getBmiCategory = () => {
    if (!bmi) return null;
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ---------------- VERDICT CARD ---------------- */}
      <div
        className={`relative overflow-hidden bg-slate-900/50 backdrop-blur-xl rounded-2xl border-2 p-6 shadow-2xl ${verdict === "SAFE"
          ? "border-green-600/50"
          : verdict === "CAUTION"
            ? "border-yellow-600/50"
            : "border-red-600/50"
          }`}
      >
        <div
          className={`absolute top-0 right-0 w-48 h-48 opacity-10 blur-3xl rounded-full ${verdict === "SAFE"
            ? "bg-green-600"
            : verdict === "CAUTION"
              ? "bg-yellow-600"
              : "bg-red-600"
            }`}
        ></div>

        <div className="relative text-center space-y-4">
          {/* ICON */}
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mx-auto ${verdict === "SAFE"
              ? "bg-green-600/20 border-2 border-green-600/40"
              : verdict === "CAUTION"
                ? "bg-yellow-600/20 border-2 border-yellow-600/40"
                : "bg-red-600/20 border-2 border-red-600/40"
              }`}
          >
            <span
              className={`text-4xl ${verdict === "SAFE"
                ? "text-green-500"
                : verdict === "CAUTION"
                  ? "text-yellow-500"
                  : "text-red-500"
                }`}
            >
              {verdict === "SAFE" ? "✓" : verdict === "CAUTION" ? "⚠" : "✕"}
            </span>
          </div>

          {/* VERDICT TEXT */}
          <h2
            className={`text-4xl font-bold tracking-tight ${verdict === "SAFE"
              ? "text-green-500"
              : verdict === "CAUTION"
                ? "text-yellow-500"
                : "text-red-500"
              }`}
          >
            {verdict}
          </h2>

          {/* CONTEXT BADGE */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${context.color}`}
          >
            <span>{context.icon}</span>
            <span>{context.text}</span>
          </div>

          {/* PROFILE */}
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
            {profile}
          </p>
        </div>
      </div>

      {/* ---------------- CONFIDENCE METER ---------------- */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {t.confidence}
          </span>
          <span className="text-sm font-bold text-white">{riskLevel}</span>
        </div>

        <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${riskLevel === "High"
              ? "w-full bg-gradient-to-r from-red-600 to-red-500"
              : riskLevel === "Medium"
                ? "w-2/3 bg-gradient-to-r from-yellow-600 to-yellow-500"
                : "w-1/3 bg-gradient-to-r from-green-600 to-green-500"
              }`}
          ></div>
        </div>
      </div>

      {/* ---------------- INFO GRID ---------------- */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            {t.barcode}
          </p>
          <p className="text-sm font-semibold text-white">
            {barcode || "Manual Entry"}
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            {t.risk}
          </p>
          <p className="text-sm font-semibold text-white">{riskLevel}</p>
        </div>
      </div>

      {/* ---------------- DECISION BREAKDOWN (ADVANCED) ---------------- */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-2xl">
        <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
          🧠 Decision Breakdown
        </h3>

        {/* ALLERGY EVALUATION */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-2">
            Allergy Evaluation (PRIMARY)
          </p>

          {verdict === "UNSAFE" ? (
            <div className="space-y-2 text-sm">
              <p className="text-red-400 font-medium">
                ✖ Rule ALLERGY-01 violated
              </p>

              <div className="text-xs text-slate-400">
                <p className="mb-1">Triggered Allergies:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <span className="text-red-300 font-medium">
                      {keyIngredient}
                    </span>{" "}
                    → matched a selected allergy
                  </li>
                  {/* Future-safe: list multiple triggers here */}
                </ul>
              </div>

              <p className="text-xs text-slate-500">
                Allergy violations immediately mark food as UNSAFE.
              </p>
            </div>
          ) : (
            <p className="text-sm text-green-400">
              ✓ Rule ALLERGY-01 passed — no allergy conflicts
            </p>
          )}
        </div>

        {/* BMI EVALUATION */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-2">
            BMI Evaluation (SECONDARY)
          </p>

          {verdict === "CAUTION" ? (
            <p className="text-sm text-yellow-400">
              ⚠ Rule BMI-02 applied — health advisory issued
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              {height && weight ? (
                <>
                  ⦿ BMI was evaluated for health context only and did not override allergy safety
                </>
              ) : (
                <>
                  ⦿ BMI data was not provided and did not affect the final decision
                </>
              )}
            </p>
          )}
        </div>

        {/* FINAL LOGIC */}
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
          <p>
            Final Verdict:{" "}
            <span className="font-semibold text-white">{verdict}</span>
          </p>
          <p>
            Decision Priority: Allergy safety → BMI advisory → Nutrition
          </p>
        </div>
      </div>

      {/* ---------------- ANALYSIS DETAILS ---------------- */}
      <div className="space-y-2">
        <details className="group bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 overflow-hidden">
          <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-800/40">
            <span className="font-semibold text-white text-sm">
              {t.analysisReport}
            </span>
            <span className="text-slate-400 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <div className="px-5 pb-5 pt-2 border-t border-slate-800 space-y-3">
            {verdict !== "SAFE" && keyIngredient && (
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">
                  Flagged Ingredient
                </p>
                <p className="text-base font-semibold text-red-400">
                  {keyIngredient}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Explanation
              </p>
              <p className="text-sm text-slate-300">{explanation}</p>

              {/* BMI / VITALS CONTEXT */}
              {bmi && (
                <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">
                    Health Context (BMI)
                  </p>

                  <p className="text-lg font-semibold text-white">
                    BMI: {bmi}
                  </p>

                  <p
                    className={`text-sm font-medium mt-1 ${getBmiCategory() === "Normal"
                      ? "text-green-400"
                      : getBmiCategory() === "Overweight"
                        ? "text-yellow-400"
                        : "text-red-400"
                      }`}
                  >
                    {getBmiCategory()}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Used only for health advisory. BMI never marks food unsafe.
                  </p>
                </div>
              )}
            </div>
          </div>
        </details>

        <details className="group bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 overflow-hidden">
          <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-800/40">
            <span className="font-semibold text-white text-sm">
              {t.fullIngredients}
            </span>
            <span className="text-slate-400 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <div className="px-5 pb-5 pt-2 border-t border-slate-800 max-h-48 overflow-y-auto">
            <p className="text-xs text-slate-400">{ingredients}</p>
          </div>
        </details>
      </div>

      {/* ---------------- ACTION BUTTONS ---------------- */}
      <div className="space-y-3">
        <button
          onClick={onScanAnother}
          className="w-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 py-3.5 rounded-xl font-medium text-white transition-all"
        >
          Scan Another Product
        </button>

        <button
          onClick={onChangeProfile}
          className="w-full text-slate-500 hover:text-slate-400 text-sm py-2"
        >
          Change Profile
        </button>
      </div>
    </div>
  );
}