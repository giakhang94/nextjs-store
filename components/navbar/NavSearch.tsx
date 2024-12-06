"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";

function NavSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.replace(`/products?${params.toString()}`);
  }, 500);
  useEffect(() => {
    if (!searchParams.get("search")) {
      setSearch("");
    }
  }, [searchParams.get("search")]);
  return (
    <Input
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
      type="search"
      value={search}
      placeholder="search product..."
      className="max-w-xs dark:bg-muted"
    />
  );
}

export default NavSearch;
