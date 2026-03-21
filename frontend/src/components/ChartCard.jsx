function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)]">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">{subtitle}</p>
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}

export default ChartCard
