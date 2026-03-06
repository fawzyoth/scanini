interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
      {children && (
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">{children}</div>
      )}
    </div>
  );
}
