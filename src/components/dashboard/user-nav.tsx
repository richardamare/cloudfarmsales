import { useAuth, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function UserNav() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const emailAddress = user?.emailAddresses.find(
    (emailAddress) => emailAddress.id === user.primaryEmailAddressId
  );

  const name = user?.fullName;

  const abbreviatedName = name
    ?.split(" ")
    .map((word) => word[0])
    .join("");

  const avatarUrl = user?.profileImageUrl;

  function handleLogout() {
    signOut()
      .then(() => {
        router.push("/auth/sign-in").catch((e) => {
          const error = e as Error;
          toast.error(error.message);
        });
      })
      .catch((e) => {
        const error = e as Error;
        toast.error(error.message);
      });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={avatarUrl ?? "https://avatar.vercel.sh/1231.png"}
              alt="@shadcn"
            />
            <AvatarFallback>{abbreviatedName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {emailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
