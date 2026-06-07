const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    dotClass: 'bg-amber-400',
    animate: false,
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    dotClass: 'bg-blue-400',
    animate: true,
  },
  done: {
    label: 'Done',
    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    dotClass: 'bg-emerald-400',
    animate: false,
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={`status-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${config.className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full inline-block ${config.dotClass} ${
          config.animate ? 'animate-pulse' : ''
        }`}
      />
      {config.label}
    </span>
  );
}
