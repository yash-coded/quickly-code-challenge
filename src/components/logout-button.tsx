"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="secondary" className="cursor-pointer">
        Logout
      </Button>
    </form>
  );
}
