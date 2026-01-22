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

export default function App() {
  const [language, setLanguage] = useState("en");
  const [step, setStep] = useState("home");
  const [mode, setMode] = useState(null);

  const [profile, setProfile] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [variant, setVariant] = useState("");
  const [ingredients, setIngredients] = useState("");

  const [verdict, setVerdict] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [keyIngredient, setKeyIngredient] = useState("");
  const [explanation, setExplanation] = useState("");

  const [loadingMessage, setLoadingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = translations[language];

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

  const canEnterScan = () => {
    if (!mode) return false;
    if (mode === "allergy") return selectedAllergies.length > 0;
    if (mode === "bmi" || mode === "bmi+allergy") return height && weight;
    return false;
  };

  const handleBarcodeFound = async (code) => {
    if (!canEnterScan()) {
      setInfoMessage("Please complete profile setup first.");
      setStep("profile");
      return;
    }

    setBarcode(code);
    setScanSuccess(true);
    setTimeout(() => setScanSuccess(false), 1500);

    setIsLoading(true);
    setLoadingMessage(t.scanningDb || "Scanning...");
    resetProductFlow();

    try {
      const result = await fetchFoodByBarcode(code);

      if (!result) {
        setInfoMessage("Product not found. Try manual entry.");
        setStep("manual");
        return;
      }

      setProductName(result.name);

      if (result.ingredientsText) {
        setIngredients(result.ingredientsText);
        setStep("confirm");
      } else {
        await fetchIngredientsOnline(result.name, "");
      }
    } catch (e) {
      console.error("Scan failed:", e);
      setStep("manual");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIngredientsOnline = async (name, variantInput) => {
    try {
      setIsLoading(true);
      setLoadingMessage(t.aiSearching || "AI Searching...");
      const fullName = variantInput ? `${name} ${variantInput}` : name;
      setProductName(fullName);

      const text = await callGemini(
        `Return comma-separated ingredients for "${fullName}".`
      );

      setIngredients(text);
      setStep("confirm");
    } catch (e) {
      console.error("Manual search failed:", e);
      setInfoMessage("Network issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSafety = async () => {
    setIsLoading(true);
    setLoadingMessage(t.analyzing || "Analyzing...");

    try {
      const text = await callGemini("Analyze product safety.");
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      const json = match ? JSON.parse(match[0]) : {};

      setVerdict((json.verdict || "CAUTION").toUpperCase());
      setRiskLevel(json.risk_level || "Low");
      setKeyIngredient(json.key_ingredient || "Unknown");
      setExplanation(json.explanation || "AI unavailable. Showing fallback result.");
      setStep("result");
    } catch (e) {
      console.error("Analysis crash prevented:", e);
      setVerdict("CAUTION");
      setRiskLevel("Low");
      setKeyIngredient("Unknown");
      setExplanation("Service temporarily unavailable.");
      setStep("result");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden
                    bg-gradient-to-br from-emerald-100 via-teal-100 to-green-100">

      {/* Soft glow blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-300/40 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-teal-300/40 rounded-full blur-[140px]"></div>

      <div className="relative w-full max-w-md bg-white/35 backdrop-blur-xl
                      rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)]
                      border border-white/40 p-6">

        {step !== "scan" && step !== "manual" && (
          <div className="absolute top-4 right-4 z-20">
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </div>
        )}

        {scanSuccess && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
            <div className="px-4 py-2 rounded-full bg-emerald-500/85 text-white shadow-lg">
              ✓ {t.scanSuccess || "Scan Successful"}
            </div>
          </div>
        )}

        {isLoading && <LoadingOverlay message={loadingMessage} />}
        {infoMessage && <div className="text-center text-sm text-amber-800">{infoMessage}</div>}

        {step === "home" && (
          <HomeScreen
            t={t}
            onSelectAllergy={() => { setMode("allergy"); setStep("profile"); }}
            onSelectBMI={() => { setMode("bmi"); setStep("profile"); }}
          />
        )}

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

        {step === "scan" && (
          <ScanScreen
            t={t}
            onDetected={handleBarcodeFound}
            onManualEntry={() => setStep("manual")}
            onChangeProfile={() => setStep("profile")}
          />
        )}

        {step === "manual" && (
          <ManualEntryScreen
            t={t}
            productName={productName}
            variant={variant}
            setProductName={setProductName}
            setVariant={setVariant}
            onSearch={() => fetchIngredientsOnline(productName, variant)}
            onBack={() => setStep("scan")}
          />
        )}

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

        {step === "result" && (
          <ResultScreen
            t={t}
            verdict={verdict}
            riskLevel={riskLevel}
            ingredients={ingredients}
            keyIngredient={keyIngredient}
            explanation={explanation}
            onScanAnother={() => setStep("scan")}
            onChangeProfile={() => setStep("home")}
          />
        )}
      </div>
    </div>
  );
}
