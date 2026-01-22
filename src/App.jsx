import { useEffect, useState } from "react";
import { translations } from "./data/translations";
import { profiles } from "./data/profiles";
import { callGemini } from "./services/geminiService";
import { fetchFoodByBarcode } from "./services/foodApiService";

import LoadingOverlay from "./components/LoadingOverlay";
import LanguageSelector from "./components/LanguageSelector";
import ScanScreen from "./components/ScanScreen";
import ProfileScreen from "./components/ProfileScreen";
import ManualEntryScreen from "./components/ManualEntryScreen";
import ConfirmScreen from "./components/ConfirmScreen";
import ResultScreen from "./components/ResultScreen";
import HomeScreen from "./components/HomeScreen";

const resetProductFlow = () => {
  setBarcode("");
  setProductName("");
  setVariant("");
  setIngredients("");
  setVerdict("");
  setRiskLevel("");
  setKeyIngredient("");
  setExplanation("");
};

export default function App() {
  /* ---------------- LANGUAGE ---------------- */
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const t = translations[language];

  /* ---------------- FLOW STATE ---------------- */
  const [step, setStep] = useState("home");
  const [mode, setMode] = useState(null);

  /* ---------------- PROFILE + VITALS ---------------- */
  const [profile, setProfile] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  /* ---------------- PRODUCT DATA ---------------- */
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [variant, setVariant] = useState("");
  const [ingredients, setIngredients] = useState("");

  /* ---------------- RESULT DATA ---------------- */
  const [verdict, setVerdict] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [keyIngredient, setKeyIngredient] = useState("");
  const [explanation, setExplanation] = useState("");

  /* ---------------- UI STATE ---------------- */
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  /* ---------------- CONTINUE RULE ---------------- */
  const canContinue =
    (mode === "allergy" && profile) ||
    (mode === "bmi" && height && weight);

  /* ---------------- BARCODE HANDLER ---------------- */
  const handleBarcodeFound = async (code) => {
    if (!canEnterScan()) {
      setInfoMessage("Please complete profile setup before scanning.");
      setStep("profile");
      return;
    }
    setBarcode(code);
    setScanSuccess(true);
    setTimeout(() => setScanSuccess(false), 1500);

    setIsLoading(true);
    setLoadingMessage(t.scanningDb);

    const resetProductFlow = () => {
      setBarcode("");
      setProductName("");
      setVariant("");
      setIngredients("");

      setVerdict("");
      setRiskLevel("");
      setKeyIngredient("");
      setExplanation("");
    };

    try {
      const result = await fetchFoodByBarcode(code);

      if (!result) {
        resetProductFlow();
        setInfoMessage("Product not found. Please enter details manually.");
        setStep("manual");
        setTimeout(() => setInfoMessage(""), 4000);
        return;
      }

      setProductName(result.name);

      if (result.ingredientsText) {
        setIngredients(result.ingredientsText);
        setStep("confirm");
      } else {
        setLoadingMessage(t.aiSearching);
        await fetchIngredientsOnline(result.name, "");
      }
    } catch (e) {
      console.error("Barcode handling failed:", e);
      setInfoMessage("Unable to scan product. Please enter details manually.");
      setStep("manual");
      setTimeout(() => setInfoMessage(""), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- AI INGREDIENT FETCH ---------------- */
  const fetchIngredientsOnline = async (name, variantInput) => {
    setIsLoading(true);
    setLoadingMessage(t.aiSearching);

    const fullName = variantInput ? `${name} ${variantInput}` : name;
    setProductName(fullName);

    try {
      const text = await callGemini(
        `Return comma-separated ingredients for "${fullName}".`
      );

      if (!text) throw new Error("No AI response");

      setIngredients(text);
      setStep("confirm");
    } catch (e) {
      console.error("AI fetch failed:", e);
      setIngredients("");
      setStep("manual");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllergyContext = () => {
    if (!selectedAllergies || selectedAllergies.length === 0) {
      return "None";
    }

    return selectedAllergies.join(", ");
  };

  /* ---------------- SAFETY ANALYSIS ---------------- */
  const analyzeSafety = async () => {
    setIsLoading(true);
    setLoadingMessage(t.analyzing);

    const prompt = `
You are a clinical-grade food safety decision system.

━━━━━━━━━━━━━━━━━━
PRIMARY RULE (ALLERGY — NON-NEGOTIABLE)
━━━━━━━━━━━━━━━━━━
The user has the following dietary restrictions and allergies:
${getAllergyContext()}

• You MUST evaluate EACH listed allergy separately.
• If ANY ingredient or its known derivatives violate ANY allergy:
  → verdict MUST be "UNSAFE"
  → risk_level MUST be "High"

• You MUST list ALL violated allergies in decision_breakdown.allergy_analysis.
• You MUST name the EXACT ingredient found in the product.
• NEVER say "possible allergen" if a match exists.

━━━━━━━━━━━━━━━━━━
SECONDARY RULE (BMI — ADVISORY ONLY)
━━━━━━━━━━━━━━━━━━
• BMI is OPTIONAL.
• BMI can ONLY downgrade SAFE → CAUTION.
• BMI must NEVER override allergy safety.
• If BMI is used, include bmi_analysis.
• If BMI is not relevant, set bmi_analysis to null.

━━━━━━━━━━━━━━━━━━
PRODUCT DATA
━━━━━━━━━━━━━━━━━━
Product Name: ${productName}
Ingredients: ${ingredients}

User Vitals:
Height: ${height || "Not provided"} cm
Weight: ${weight || "Not provided"} kg

━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT (STRICT JSON ONLY — NO EXTRA TEXT)
━━━━━━━━━━━━━━━━━━
{
  "verdict": "SAFE" | "UNSAFE" | "CAUTION",
  "risk_level": "Low" | "Medium" | "High",
  "key_ingredient": "Exact ingredient name or None",
  "explanation": "Short medical-grade explanation",

  "decision_breakdown": {
    "allergy_analysis": [
      {
        "profile": "Allergy or restriction name",
        "status": "VIOLATED" | "SAFE",
        "ingredient": "Exact ingredient name or None",
        "reason": "Why this ingredient violates the profile"
      }
    ],
    "bmi_analysis": {
      "bmi": Number,
      "category": "Underweight | Normal | Overweight | Obese",
      "impact": "Advisory only"
    } | null,
    "final_reason": "Clear summary reason for final verdict"
  }
}
`;

    try {
      const text = await callGemini(prompt);
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid JSON");

      const json = JSON.parse(match[0]);

      setVerdict(json.verdict.toUpperCase());
      let finalRisk = json.risk_level;

      if (json.verdict === "UNSAFE") {
        finalRisk = "High";
      }

      setRiskLevel(finalRisk);

      setKeyIngredient(json.key_ingredient);
      setExplanation(json.explanation);
      setStep("result");
    } catch (e) {
      console.error("Analysis failed:", e);

      if (mode === "allergy" && profile) {
        setVerdict("UNSAFE");
        setRiskLevel("High");
        setKeyIngredient("Possible allergen");
        setExplanation(
          "This product may contain ingredients that violate your allergy profile. Reliable confirmation was not possible, so it is marked unsafe for your protection."
        );
      } else {
        setVerdict("CAUTION");
        setRiskLevel("Low");
        setKeyIngredient("Unknown");
        setExplanation(
          "Analysis could not be completed reliably. Please review ingredients manually."
        );
      }

      setStep("result");
    } finally {
      setIsLoading(false);
    }
  };

  const canEnterScan = () => {
    if (!mode) return false;

    // Allergy-only mode → needs at least 1 allergy
    if (mode === "allergy") {
      return selectedAllergies.length > 0;
    }

    // BMI-only or BMI+Allergy mode
    if (mode === "bmi" || mode === "bmi+allergy") {
      if (!height || !weight) return false;
      return true; // allergies optional here
    }

    return false;
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <LanguageSelector language={language} setLanguage={setLanguage} />

      <div className="w-full max-w-lg">
        {scanSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-full bg-green-600/20 border border-green-600/40">
              ✓ {t.scanSuccess || "Product detected"}
            </div>
          </div>
        )}

        {isLoading && <LoadingOverlay message={loadingMessage} />}
        {infoMessage && <div className="mb-4 text-yellow-400">{infoMessage}</div>}

        {/* HOME */}
        {step === "home" && (
          <HomeScreen
            t={t}
            onSelectAllergy={() => {
              setMode("allergy");
              setProfile("");
              setHeight("");
              setWeight("");
              setStep("profile");
            }}
            onSelectBMI={() => {
              setMode("bmi");
              setProfile("");
              setHeight("");
              setWeight("");
              setStep("profile");
            }}
          />
        )}

        {/* PROFILE */}
        {step === "profile" && (
          <ProfileScreen
            t={t}
            profiles={profiles}
            selectedAllergies={selectedAllergies}
            setSelectedAllergies={setSelectedAllergies}
            mode={mode}
            height={height}
            weight={weight}
            setHeight={setHeight}
            setWeight={setWeight}
            onContinue={() => setStep("scan")}
          />
        )}

        {/* SCAN — GUARDED */}
        {step === "scan" && (
          canEnterScan() ? (
            <ScanScreen
              t={t}
              onDetected={handleBarcodeFound}
              onManualEntry={() => setStep("manual")}
              onChangeProfile={() => {
                setProfile("");
                setStep("profile");
              }}
            />
          ) : (
            <div className="bg-slate-900/60 border border-red-600/40 rounded-xl p-4 text-center text-sm text-red-400">
              Please complete profile setup before scanning.
            </div>
          )
        )}

        {/* MANUAL */}
        {step === "manual" && (
          <ManualEntryScreen
            t={t}
            productName={productName}
            variant={variant}
            setProductName={setProductName}
            setVariant={setVariant}
            onSearch={() => fetchIngredientsOnline(productName, variant)}
            onBack={() => {
              resetProductFlow();
              if (canEnterScan()) {
                setStep("scan");
              } else {
                setStep("profile");
              }
            }}
          />
        )}

        {/* CONFIRM */}
        {step === "confirm" && (
          <ConfirmScreen
            t={t}
            productName={productName}
            ingredients={ingredients}
            setIngredients={setIngredients}
            onAnalyze={analyzeSafety}
            onEdit={() => setStep("manual")}
          />
        )}

        {/* RESULT */}
        {step === "result" && (
          <ResultScreen
            t={t}
            verdict={verdict}
            riskLevel={riskLevel}
            profile={profile}
            barcode={barcode}
            ingredients={ingredients}
            keyIngredient={keyIngredient}
            explanation={explanation}
            height={height}
            weight={weight}

            onScanAnother={() => {
              resetProductFlow();
              setStep("scan");
            }}
            onChangeProfile={() => {
              resetProductFlow();
              setProfile("");
              setHeight("");
              setWeight("");
              setMode(null);
              setStep("home");
            }}
          />
        )}
      </div>
    </div>
  );
}