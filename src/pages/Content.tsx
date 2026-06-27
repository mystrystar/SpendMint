import { CheckCircle2, Coins, Gem, Info } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { GOLD_RATE_INR, LEARN_COPY, seededArticles, SILVER_RATE_INR } from "../lib/constants";
import { formatCurrency, formatDecimal } from "../lib/utils";
import { useVaultwise } from "../hooks/useVaultwise";
import type { Article } from "../types/domain";

function rewardDetails(article: Article) {
  const rate = article.rewardType === "gold" ? GOLD_RATE_INR : SILVER_RATE_INR;
  return { rate, grams: article.rewardAmount / rate };
}

export function Content() {
  const { data, rewardArticle } = useVaultwise();
  const rewards = data?.rewards ?? [];

  return (
    <div className="grid gap-8">
      <div>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-deep">Money learning</span>
        <h1 className="mt-4 text-3xl font-extrabold text-text">{LEARN_COPY.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{LEARN_COPY.subtitle}</p>
      </div>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {seededArticles.map((article) => {
          const completed = rewards.some((reward) => reward.articleId === article.id);
          const { rate, grams } = rewardDetails(article);
          const MetalIcon = article.rewardType === "gold" ? Gem : Coins;
          return (
            <Card key={article.id} className="flex min-h-[28rem] flex-col overflow-hidden p-0">
              <div className={article.rewardType === "gold" ? "bg-gold-soft p-5" : "bg-silver-soft p-5"}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-muted">{article.category}</span>
                  <MetalIcon className={article.rewardType === "gold" ? "h-6 w-6 text-gold" : "h-6 w-6 text-silver"} />
                </div>
                <h2 className="mt-5 text-xl font-extrabold leading-7 text-text">{article.title}</h2>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm leading-6 text-muted">{article.excerpt}</p>
                <div className="mt-5 rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-primary-deep">{LEARN_COPY.rewardBreakdown}</p>
                  <dl className="mt-3 grid gap-2 text-sm">
                    <div className="flex justify-between"><dt className="text-muted">{LEARN_COPY.rewardValue}</dt><dd className="font-bold text-text">{formatCurrency(article.rewardAmount)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">{LEARN_COPY.rate}</dt><dd className="font-bold text-text">{formatCurrency(rate)}/g</dd></div>
                    <div className="flex justify-between border-t border-border pt-2"><dt className="text-muted">{LEARN_COPY.metalCredited}</dt><dd className="font-extrabold text-primary-deep">{formatDecimal(grams, 6)} g {article.rewardType}</dd></div>
                  </dl>
                </div>
                <div className="mt-auto flex items-center justify-between pt-5 text-sm font-bold text-muted"><span>{article.readTime}</span><span>{formatCurrency(article.rewardAmount)} reward</span></div>
                <Button className="mt-4 w-full" variant={completed ? "secondary" : "primary"} disabled={completed || rewardArticle.isPending} onClick={() => rewardArticle.mutate({ articleId: article.id, rewardType: article.rewardType, rewardAmount: article.rewardAmount })}>
                  {completed ? <CheckCircle2 className="h-4 w-4" /> : null}{completed ? "Reward claimed" : "Complete and earn"}
                </Button>
              </div>
            </Card>
          );
        })}
      </section>

      <Card className="bg-primary-soft/35">
        <div className="flex items-center gap-3"><Info className="h-6 w-6 text-primary-deep" /><h2 className="text-2xl font-extrabold text-text">{LEARN_COPY.howRewardsWork}</h2></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {LEARN_COPY.qna.map(([question, answer]) => (
            <details key={question} className="group rounded-xl border border-border bg-white p-4">
              <summary className="cursor-pointer list-none font-bold text-text">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-muted">{answer}</p>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}
