export default function LogicReveal({ verdict, keyIngredient, bmi, hasAllergies, t }) {
  
  // ---------------- LOGIC RECONSTRUCTION ----------------
  // We infer the steps based on the final verdict to ensure consistency
  
  // STEP 1: ALLERGY GATEKEEPER
  const step1 = {
    status: verdict === "UNSAFE" ? "FAIL" : "PASS",
    label: "Allergy Gatekeeper",
    detail: verdict === "UNSAFE" 
      ? `Violation Detected: ${keyIngredient || "Restricted Ingredient"}`
      : "No profile violations found."
  };

  // STEP 2: HEALTH CONTEXT (BMI)
  let step2 = { status: "PASS", label: "Health Context", detail: "Within acceptable limits." };
  
  if (verdict === "UNSAFE") {
    // CRITICAL: Proof of Hierarchy
    step2.status = "SKIPPED";
    step2.detail = "Bypassed for immediate safety.";
  } else if (!bmi) {
    step2.status = "NA";
    step2.detail = "Data not provided.";
  } else if (verdict === "CAUTION") {
    step2.status = "WARN";
    step2.detail = "Advisory issued (Nutritional Density / BMI).";
  }

  // ---------------- HELPER: STATUS STYLES ----------------
  const getStyles = (status) => {
    switch (status) {
      case "FAIL": return "bg-red-500/10 border-red-500/50 text-red-400";
      case "WARN": return "bg-yellow-500/10 border-yellow-500/50 text-yellow-400";
      case "SKIPPED": return "bg-slate-700/20 border-slate-700 text-slate-500 opacity-75"; // Visual "Ghosting"
      case "NA": return "bg-slate-800/30 border-slate-700 text-slate-600";
      default: return "bg-green-500/10 border-green-500/50 text-green-400"; // PASS
    }
  };

  const getIcon = (status) => {
    switch (status) {
      case "FAIL": return "✕";
      case "WARN": return "!";
      case "SKIPPED": return "🛡"; // Shield icon shows "Protection Mode"
      case "NA": return "-";
      default: return "✓";
    }
  };

  if (!hasAllergies && !bmi) return null; // Don't show if no profile set

  return (
    <div className="mt-4 space-y-3">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-2">
         <div className="h-px bg-slate-800 flex-1"></div>
         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Decision Logic Trace
         </span>
         <div className="h-px bg-slate-800 flex-1"></div>
      </div>

      {/* STEP 1 CARD */}
      <div className={`flex items-start gap-3 p-3 rounded-xl border ${getStyles(step1.status)} transition-all`}>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${getStyles(step1.status)}`}>
          1
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold uppercase tracking-wide">{step1.label}</h4>
            <span className="text-xs font-bold px-1.5 rounded bg-slate-950/30 border border-white/10">
              {getIcon(step1.status)} {step1.status}
            </span>
          </div>
          <p className="text-xs mt-1 opacity-90 font-medium">
            {step1.detail}
          </p>
        </div>
      </div>

      {/* CONNECTOR LINE */}
      <div className="pl-6 -my-2">
        <div className={`w-0.5 h-4 ${step1.status === "FAIL" ? "bg-slate-800" : "bg-green-500/30"}`}></div>
      </div>

      {/* STEP 2 CARD */}
      <div className={`flex items-start gap-3 p-3 rounded-xl border ${getStyles(step2.status)} transition-all`}>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${getStyles(step2.status)}`}>
          2
        </div>
        <div>
          <div className="flex items-center gap-2">
             <h4 className="text-sm font-bold uppercase tracking-wide">{step2.label}</h4>
             <span className="text-xs font-bold px-1.5 rounded bg-slate-950/30 border border-white/10">
              {getIcon(step2.status)} {step2.status === "NA" ? "N/A" : step2.status}
            </span>
          </div>
          <p className="text-xs mt-1 opacity-90 font-medium">
            {step2.detail}
          </p>
        </div>
      </div>
    </div>
  );
}