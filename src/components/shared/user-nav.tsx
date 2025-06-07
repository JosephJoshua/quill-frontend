import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth";

export function UserNav() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };
  if (!user) return null;
  const userInitials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" className="relative h-8 w-8 rounded-full"><Avatar className="h-8 w-8"><AvatarImage src="" alt={`@${user.name}`} /><AvatarFallback>{userInitials}</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal"><div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none">{user.name}</p><p className="text-xs leading-none text-muted-foreground">{user.email}</p></div></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild><NavLink to="/profile" className="w-full">{t('userMenu.profile')}</NavLink></DropdownMenuItem>
          <DropdownMenuItem disabled>{t('userMenu.settings')}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>{t('userMenu.logout')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
