import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="inline-flex h-11 items-center gap-2 rounded-sm border border-line-strong px-3 text-sm font-medium text-ink hover:bg-paper"
      >
        <LogOut aria-hidden="true" className="size-4" />
        Keluar
      </button>
    </form>
  );
}
