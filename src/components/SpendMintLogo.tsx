import { cn } from "../lib/utils";

export function SpendMintLogo({ className, title = "SpendMint" }: { className?: string; title?: string }) {
  return (
    <svg className={cn("h-10 w-10", className)} viewBox="0 0 64 64" role="img" aria-label={title}>
      <circle cx="30" cy="31" r="21" fill="#F9FCFB" stroke="#5FB8A5" strokeWidth="5" />
      <path d="M37 21c-2-2-5-3-8-3-5 0-8 3-8 7 0 10 17 4 17 14 0 4-4 7-9 7-4 0-8-2-10-5" fill="none" stroke="#2F8F83" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 43c8-1 12 2 12 9-7 2-12-1-12-9Z" fill="#5FB8A5" />
      <path d="M48 44c4 1 7 4 9 7" fill="none" stroke="#2F8F83" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M45 49c-1 7-5 10-12 8 0-7 5-10 12-8Z" fill="#8ECFC1" />
      <path d="M43 50c-4 1-7 3-9 6" fill="none" stroke="#2F8F83" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
