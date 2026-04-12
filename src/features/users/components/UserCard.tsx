import { Mail, MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

type UserCardProps = {
  user: User;
  onSelect: () => void;
  className?: string;
};

export function UserCard({ user, onSelect, className }: UserCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full min-w-0 rounded-xl text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
    >
      <Card size="sm" className="h-full shadow-none">
        <CardHeader className="flex flex-row items-start gap-3 pb-2">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              className="size-14 shrink-0 rounded-full object-cover ring-1 ring-border"
            />
          ) : null}
          <div className="min-w-0 flex-1 space-y-0.5">
            <CardTitle className="text-base leading-snug text-primary">{user.title}</CardTitle>
            <p className="truncate font-mono text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0 text-xs text-muted-foreground">
          <p className="inline-flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {user.location}
          </p>
          <p className="inline-flex items-center gap-2 truncate">
            <Mail className="size-3.5 shrink-0" aria-hidden />
            {user.email}
          </p>
          <p className="inline-flex items-center gap-2">
            <Phone className="size-3.5 shrink-0" aria-hidden />
            {user.phone}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
