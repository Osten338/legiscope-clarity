
import { ReactNode } from "react";
import { MainNavbar } from "./MainNavbar";

interface TopbarLayoutProps {
  children: ReactNode;
}

export function TopbarLayout({ children }: TopbarLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      <div className="lg:pl-[240px] pt-16 lg:pt-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}
