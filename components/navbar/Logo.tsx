"use client";
import * as React from "react";
import Link from "next/link";
import LogoImg from "@/assets/logo.png";
import DarkLogo from "@/assets/dark-logo.png";
import LogoPlaceholder from "@/assets/logo-placeholder.png";
import Image from "next/image";
import { useTheme } from "next-themes";
function Logo() {
  const { theme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  // Đảm bảo component chỉ render sau khi đã mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render một placeholder hoặc null trong khi chờ theme được xác định
    return (
      <Link href="/" className="flex items-center">
        <Image
          src={LogoPlaceholder} // Placeholder logo mặc định
          alt="logo-image"
          width={150}
          height={80}
          priority
        />
      </Link>
    );
  }
  return (
    <Link href="/" className="flex items-center" suppressHydrationWarning>
      {
        <Image
          src={theme === "light" || theme === "system" ? LogoImg : DarkLogo}
          alt="logo-image"
          width={150}
          height={80}
          priority
        />
      }
    </Link>
  );
}

export default Logo;
