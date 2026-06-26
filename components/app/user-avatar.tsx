import { avatarEmoji } from "@/lib/avatars";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-8 text-base",
  md: "size-10 text-lg",
  lg: "size-16 text-3xl",
} as const;

/** Emoji avatar on a tinted disc. */
export function UserAvatar({
  avatar,
  size = "md",
  className,
}: {
  avatar: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/15",
        SIZES[size],
        className,
      )}
      aria-hidden
    >
      {avatarEmoji(avatar)}
    </span>
  );
}
