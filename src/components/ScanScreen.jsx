import BarcodeScanner from "./BarcodeScanner";

export default function ScanScreen({
  t,
  onDetected,
  onManualEntry,
  onChangeProfile,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {t.scanTitle}
        </h2>
        <p className="text-sm text-slate-400">{t.scanSubtitle}</p>
      </div>

      {/* SCANNER CARD */}
      <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border-2 border-slate-800 p-4 shadow-2xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none"></div>

        <div className="relative h-72 rounded-xl overflow-hidden bg-black border border-slate-700 shadow-inner">
          <BarcodeScanner onDetected={onDetected} />
        </div>

        {/* ACTIVE BADGE */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-slate-950/80 backdrop-blur-sm rounded-full border border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">
              {t.scannerActive}
            </span>
          </div>
        </div>
      </div>

      {/* HELP TEXT */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span>{t.barcodeTypes}</span>
        <span>{t.optimalLight}</span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-3">
        <button
          onClick={onManualEntry}
          className="w-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 py-3.5 rounded-xl font-medium text-white transition-all duration-200"
        >
          {t.manualEntry}
        </button>

        <button
          onClick={onChangeProfile}
          className="w-full text-slate-500 hover:text-slate-400 text-sm py-2 transition-colors"
        >
          {t.changeProfile}
        </button>
      </div>
    </div>
  );
}