
import { ReactNode } from "react";
import { MainNavbar } from "./MainNavbar";

interface TopbarLayoutProps {
  children: ReactNode;
}

export function TopbarLayout({ children }: TopbarLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
