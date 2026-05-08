'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-teen-purple text-white font-bold px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-colors text-sm print:hidden"
    >
      Exportar PDF
    </button>
  )
}
