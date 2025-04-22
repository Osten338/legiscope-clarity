
import { cn } from "@/lib/utils";

export interface TestimonialAuthor {
  name: string;
  role: string;
  companyName?: string;
  image?: string;
}

interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
  className?: string;
}

export function TestimonialCard({
  author,
  text,
  href,
  className,
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div';

  return (
    <Card
      href={href}
      className={cn(
        "group relative flex w-[320px] shrink-0 flex-col justify-between gap-4 rounded-2xl bg-white/5 p-6 shadow-sm transition-all duration-300 hover:bg-white/10",
        href && "cursor-pointer",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <p className="text-base text-white/80 line-clamp-4">"{text}"</p>
        <div className="flex items-center gap-3">
          {author.image && (
            <img
              src={author.image}
              alt={author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-white">{author.name}</p>
            <p className="text-sm text-white/60">
              {author.role}
              {author.companyName && ` · ${author.companyName}`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
