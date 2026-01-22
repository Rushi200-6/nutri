export default function HomeScreen({ t, onSelectAllergy, onSelectBMI }) {
    return (
        <div className="space-y-8 animate-fade-in text-center">

            {/* LOGO */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
                    <span className="text-3xl font-bold text-white">🧬</span>
                </div>

                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold text-white">
                        {t.appTitle}
                    </h1>

                    <p className="text-sm font-semibold tracking-wide text-slate-400">
                        NutriScope
                    </p>
                </div>

                <p className="text-sm text-slate-400 max-w-xs">
                    {t.appSubtitle || "Scan food products safely based on your health profile"}
                </p>
            </div>

            {/* OPTIONS */}
            <div className="space-y-4 text-left">

                {/* Allergy Only */}
                <button
                    onClick={onSelectAllergy}
                    className="w-full p-6 rounded-2xl bg-slate-900/60 border border-slate-700
                     hover:border-blue-500 hover:bg-slate-900 transition-all"
                >
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        🩺 Allergy Scan
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Scan products strictly based on allergies or dietary restrictions.
                    </p>
                </button>

                {/* BMI + Allergy */}
                <button
                    onClick={onSelectBMI}
                    className="w-full p-6 rounded-2xl bg-slate-900/60 border border-slate-700
                     hover:border-green-500 hover:bg-slate-900 transition-all"
                >
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        📊 BMI Health Scan
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Personalized safety analysis using BMI and allergy context.
                    </p>
                </button>

            </div>
        </div>
    );
}