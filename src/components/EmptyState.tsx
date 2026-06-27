import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "./ui/Card";
import { APP_COPY } from "../lib/constants";

export function EmptyState() {
  return (
    <Card className="grid place-items-center py-12 text-center">
      <h2 className="text-xl font-bold text-slate-900">No subscriptions yet</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">Add your recurring plans and {APP_COPY.name} will start spotting waste before renewals hit.</p>
      <Link to="/add" className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-deep">
        <Plus className="h-4 w-4" />
        Add subscription
      </Link>
    </Card>
  );
}
