"use client";
import { useAuthenticated } from "@/hooks/auth";
import { NavUser } from "./nav-user";

export function SiteHeader() {
  const { user } = useAuthenticated.getState();

  console.log("user", user);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* <SidebarTrigger className="-ml-1" /> */}
        {/* <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        /> */}
        <h1 className="text-xl font-bold">Logs do Aplicativo</h1>
        <div className="ml-auto flex items-center gap-2">
          <NavUser
            user={{
              name: user?.name || "",
              email: user?.email || "",
              avatar: user?.avatar || "",
            }}
          />
        </div>
      </div>
    </header>
  );
}
