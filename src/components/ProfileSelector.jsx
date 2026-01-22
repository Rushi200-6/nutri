export default function ProfileScreen({
  t,
  profiles, 
  selectedProfile, // <--- You were missing this
  onSelect,   // <--- THIS WAS MISSING
}) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white mb-1">
          {t.selectProfile}
        </h2>
        <p className="text-xs text-slate-500">
          {t.selectProfileDesc}
        </p>
      </div>

      <div className="space-y-2">
        {profiles.map((p) => (
          <button
            key={p.value}
            onClick={() => onSelect(p.value)}
            className={`w-full text-left px-4 py-4 rounded-xl border transition-all duration-200 ${
              selectedProfile === p.value
                ? "bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-900/20"
                : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  selectedProfile === p.value
                    ? "bg-blue-600/30"
                    : "bg-slate-700/50"
                }`}
              >
                <span className="text-xl">{p.icon}</span>
              </div>

              <div className="flex-1">
                <div className="font-medium text-sm text-white">
                  {t.profiles[p.value].label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {t.profiles[p.value].desc}
                </div>
              </div>

              {selectedProfile === p.value && (
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}