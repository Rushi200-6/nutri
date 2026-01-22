export default function 
LoadingOverlay({ isLoading, message }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        <div
          className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400/30 rounded-full animate-spin"
          style={{ animationDuration: "1.5s" }}
        ></div>
      </div>
      <p className="mt-6 text-slate-300 text-sm font-medium tracking-wide">
        {message}
      </p>
    </div>
  );
}