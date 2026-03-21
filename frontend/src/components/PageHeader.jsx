function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="surface-card-strong p-6 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-blue-600">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 lg:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            {description}
          </p>
        </div>
        {action ? (
          <button className="btn-primary motion-button w-full shrink-0 px-5 py-3 text-sm font-semibold sm:w-auto">
            {action}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default PageHeader
