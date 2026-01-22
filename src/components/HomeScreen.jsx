import logo from "../assets/nutriscope-logo.png";
import allergyIcon from "../assets/allergy-icon.png";
import bmiIcon from "../assets/bmi-icon.png";

export default function HomeScreen({ t, onSelectAllergy, onSelectBMI }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white/30 backdrop-blur-2xl
                    rounded-3xl shadow-2xl border border-white/40 p-6">

      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
          <img src={logo} className="w-14 h-14 object-contain" />
        </div>

        <h1 className="text-xl font-bold text-emerald-800">Nutri-Scope</h1>
        <p className="text-sm text-emerald-700">
          AI-powered food safety and nutrition scanner
        </p>
      </div>

      {/* Allergy Card */}
      <button
        onClick={onSelectAllergy}
        className="w-full flex items-center gap-4 p-4 mb-4
                   bg-white/60 rounded-2xl shadow-md hover:shadow-emerald-300/50
                   transition"
      >
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow">
          <img src={allergyIcon} className="w-8 h-8" />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-semibold text-emerald-900">Allergy Scan</h2>
          <p className="text-sm text-emerald-700">
            Detect unsafe ingredients based on your allergy profile.
          </p>
        </div>
      </button>

      {/* BMI Card */}
      <button
        onClick={onSelectBMI}
        className="w-full flex items-center gap-4 p-4
                   bg-white/60 rounded-2xl shadow-md hover:shadow-teal-300/50
                   transition"
      >
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow">
          <img src={bmiIcon} className="w-8 h-8" />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-semibold text-emerald-900">BMI Health Scan</h2>
          <p className="text-sm text-emerald-700">
            Personalized food safety using BMI and health context.
          </p>
        </div>
      </button>
    </div>
  );
}
