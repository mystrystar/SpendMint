import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { seededArticles } from "../lib/constants";
import { formatCurrency } from "../lib/utils";
import { useVaultwise } from "../hooks/useVaultwise";

export function Content() {
  const { data, rewardArticle } = useVaultwise();
  const rewards = data?.rewards ?? [];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Read to earn</h1>
        <p className="mt-1 text-sm text-slate-600">Complete finance reads and earn tiny simulated gold or silver rewards.</p>
      </div>
      <section className="grid gap-4 lg:grid-cols-3">
        {seededArticles.map((article) => {
          const completed = rewards.some((reward) => reward.articleId === article.id);
          return (
            <Card key={article.id} className="flex min-h-64 flex-col">
              <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-primary">{article.category}</span>
              <h2 className="mt-4 text-xl font-extrabold text-slate-900">{article.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-sm font-bold text-slate-500">
                <span>{article.readTime}</span>
                <span>{formatCurrency(article.rewardAmount)} {article.rewardType}</span>
              </div>
              <Button
                className="mt-4 w-full"
                variant={completed ? "secondary" : "primary"}
                disabled={completed || rewardArticle.isPending}
                onClick={() => rewardArticle.mutate({ articleId: article.id, rewardType: article.rewardType, rewardAmount: article.rewardAmount })}
              >
                {completed ? <CheckCircle2 className="h-4 w-4" /> : null}
                {completed ? "Reward claimed" : "Complete and earn"}
              </Button>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
