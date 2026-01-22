import { useState } from "react";

export default function ProfileScreen({
  t,
  profiles,
  selectedProfile,
  onSelectProfile,
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

  /* ---------------- HELPERS ---------------- */

  const toggleAllergy = (value) => {
    if (selectedAllergies.includes(value)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== value));
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

  const hasAllergies = selectedAllergies.length > 0;

  const canContinue =
    (mode === "allergy" && hasAllergies) ||
    (mode === "bmi" && height && weight) ||
    (mode === "bmi+allergy" && height && weight);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8 animate-fade-in">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {t.title}
        </h1>
        <p className="text-sm text-slate-400">
          {t.subtitle}
        </p>
      </div>

      {/* PRESET ALLERGIES */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">
          Select Allergies (Multiple allowed)
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {profiles.map((p) => (
            <button
              key={p.value}
              onClick={() => toggleAllergy(p.value)}
              className={`px-4 py-3 rounded-xl border text-left transition
                ${selectedAllergies.includes(p.value)
                  ? "bg-blue-600/20 border-blue-500/50"
                  : "bg-slate-800/40 border-slate-700 hover:border-slate-600"
                }`}
            >
              <div className="font-medium text-white">
                {t.profiles[p.value].label}
              </div>
              <div className="text-xs text-slate-400">
                {t.profiles[p.value].desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CUSTOM ALLERGY */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400">
          Add Custom Allergy
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="e.g. Sesame, Shellfish"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          />

          <button
            onClick={addCustomAllergy}
            className="px-4 rounded-lg bg-blue-600 text-white font-medium"
          >
            Add
          </button>
        </div>
      </div>

      {/* SELECTED ALLERGIES DISPLAY */}
      {selectedAllergies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAllergies.map((a) => (
            <span
              key={a}
              className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-xs text-blue-300"
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {/* BMI INPUTS */}
      {mode === "bmi" && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height (cm)"
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight (kg)"
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>
      )}

      {/* CONTINUE */}
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700
                   disabled:from-slate-700 disabled:to-slate-800
                   font-semibold text-white transition disabled:opacity-50"
      >
        {t.continue}
      </button>
    </div>
  );
}