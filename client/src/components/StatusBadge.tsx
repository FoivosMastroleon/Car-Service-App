type Status = "ok" | "due_soon" | "overdue" | "no_history";

const STYLES: Record<Status, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  due_soon: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  no_history: "bg-slate-100 text-slate-600",
};

const LABELS: Record<Status, string> = {
  ok: "OK",
  due_soon: "Due soon",
  overdue: "Overdue",
  no_history: "No history",
};

const StatusBadge = ({ status }: { status: Status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}>
    {LABELS[status]}
  </span>
);

export default StatusBadge;
