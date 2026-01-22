import { useState } from "react";

export default function ProfileScreen({
  t,
  profiles,
  selectedAllergies,
  setSelectedAllergies,
  mode,
  height,
  setHeight,
  weight,
  setWeight,
  onContinue,
}) {
  const [customAllergy, setCustomAllergy] = useState("");

  const toggleAllergy = (value) => {
    if (selectedAllergies.includes(value)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== value));
    } else {
      setSelectedAllergies([...selectedAllergies, value]);
    }
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergy.trim();
    if (!trimmed) return;
    if (!selectedAllergies.includes(trimmed)) {
      setSelectedAllergies([...selectedAllergies, trimmed]);
    }
    setCustomAllergy("");
  };

  const canContinue =
    (mode === "allergy" && selectedAllergies.length > 0) ||
    (mode === "bmi" && height && weight) ||
    (mode === "bmi+allergy" && height && weight);

  return (
    <div className="space-y-8 animate-[fadeInUp_0.6s_ease-out]">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-emerald-900 drop-shadow-sm">
          {t.title}
        </h1>
        <p className="text-sm text-emerald-700/80">{t.subtitle}</p>
      </div>

      {/* ALLERGY CARDS */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-900">
          Select Allergies (Multiple allowed)
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {profiles.map((p) => {
            const active = selectedAllergies.includes(p.value);
            return (
              <button
                key={p.value}
                onClick={() => toggleAllergy(p.value)}
                className={`
                  relative px-4 py-3 rounded-2xl border backdrop-blur-xl
                  transition-all duration-300 transform
                  ${
                    active
                      ? "bg-emerald-200/40 border-emerald-400 scale-[1.05] shadow-[0_0_25px_rgba(52,211,153,0.7)]"
                      : "bg-white/30 border-white/40 hover:border-emerald-300 hover:shadow-md hover:scale-[1.02]"
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl animate-pulse"></div>
                )}

                <div className="relative">
                  <div className="font-medium text-emerald-900">
                    {t.profiles[p.value].label}
                  </div>
                  <div className="text-xs text-emerald-700">
                    {t.profiles[p.value].desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CUSTOM ALLERGY */}
      <div className="space-y-2">
        <label className="text-xs text-emerald-700">Add Custom Allergy</label>

        <div className="flex gap-2">
          <input
            type="text"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="e.g. Sesame, Shellfish"
            className="flex-1 bg-white/40 backdrop-blur border border-white/50 rounded-xl px-3 py-2 
                       text-emerald-900 placeholder-emerald-500
                       focus:ring-2 focus:ring-emerald-400 focus:scale-[1.02]
                       transition-all outline-none"
          />

          <button
            onClick={addCustomAllergy}
            className="px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium
                       shadow-[0_0_20px_rgba(52,211,153,0.6)]
                       hover:shadow-[0_0_30px_rgba(52,211,153,0.9)]
                       transition-all"
          >
            Add
          </button>
        </div>
      </div>

      {/* SELECTED TAGS */}
      {selectedAllergies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAllergies.map((a) => (
            <span
              key={a}
              className="px-3 py-1 rounded-full bg-emerald-200/40 border border-emerald-400/40
                         text-xs text-emerald-900 shadow-[0_0_15px_rgba(52,211,153,0.6)]
                         animate-[pop_0.3s_ease-out]"
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {/* BMI INPUTS */}
      {mode === "bmi" && (
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height (cm)"
              className="bg-white/40 border border-white/50 rounded-xl px-3 py-2 text-emerald-900
                         focus:ring-2 focus:ring-emerald-400 transition-all"
            />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight (kg)"
              className="bg-white/40 border border-white/50 rounded-xl px-3 py-2 text-emerald-900
                         focus:ring-2 focus:ring-emerald-400 transition-all"
            />
          </div>
        </div>
      )}

      {/* CONTINUE */}
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500
                   disabled:from-slate-300 disabled:to-slate-300
                   font-semibold text-white
                   shadow-[0_0_30px_rgba(52,211,153,0.6)]
                   hover:shadow-[0_0_45px_rgba(52,211,153,0.9)]
                   hover:scale-[1.03] active:scale-[0.98]
                   transition-all duration-300 disabled:opacity-50"
      >
        {t.continue}
      </button>
    </div>
  );
}
