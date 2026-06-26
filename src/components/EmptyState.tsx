import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function EmptyState() {
  return (
    <Card className="grid place-items-center py-12 text-center">
      <h2 className="text-xl font-bold text-slate-900">No subscriptions yet</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">Add your recurring plans and Vaultwise will start spotting waste before renewals hit.</p>
      <Link to="/add" className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
        <Plus className="h-4 w-4" />
        Add subscription
      </Link>
    </Card>
  );
}
