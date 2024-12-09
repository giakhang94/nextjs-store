"use client";
import { usePathname } from "next/navigation";
import { adminLInks } from "@/utils/links";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col gap-4 w-full">
      {adminLInks.map((link, index) => {
        return (
          <Button
            className="w-full capitalize block"
            key={index + link.label}
            asChild
            variant={pathname === link.href ? "default" : "ghost"}
          >
            <Link href={link.href}>
              <p className="text-left">{link.label}</p>
            </Link>
          </Button>
        );
      })}
    </aside>
  );
}

export default Sidebar;
