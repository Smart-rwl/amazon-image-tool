// components/ToolWorkspace.tsx
export default function ToolWorkspace({
  title,
  subtitle,
  left,
  right,
}: {
  title: string;
  subtitle: string;
  left: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-slate-400 mt-2">{subtitle}</p>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">{left}</div>
          {right && <div className="lg:col-span-4 space-y-6">{right}</div>}
        </div>

      </div>
    </div>
  );
}
