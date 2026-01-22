export default function 
LanguageSelector({ language, setLanguage }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-slate-900/80 border border-slate-700 text-white text-sm px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="mr">मराठी</option>
      </select>
    </div>
  );
}