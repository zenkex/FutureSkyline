import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileProps {
    name: string;
    description: string;
    avatarUrl: string;
}

export function Profile({ name, description, avatarUrl }: ProfileProps) {
    return (
        <div className="flex items-center gap-10 bg-transparent p-6">
            <Avatar className="size-20 shrink-0">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-xl font-semibold">
                    {name.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
                <h2 className="text-2xl text-zinc-200 font-semibold">{name}</h2>
                <p className="text-sm text-zinc-400">{description}</p>
            </div>
        </div>
    )
}