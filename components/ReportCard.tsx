type ReportCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export default function ReportCard({
  title,
  subtitle,
  children,
  actions,
  className = "",
}: ReportCardProps) {
  return (
    <div className={`border rounded p-4 mb-6 bg-white ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-1">{title}</h2>
          {subtitle ? (
            <div className="text-sm text-gray-500">{subtitle}</div>
          ) : null}
        </div>
        {actions ? <div className="ml-4">{actions}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
