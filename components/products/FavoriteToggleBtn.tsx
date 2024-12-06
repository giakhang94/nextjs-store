"use client";
import { FaHeart } from "react-icons/fa";
import { Button } from "../ui/button";
import { useState } from "react";

interface Props {
  className?: string;
  productId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FavoriteToggleBtn({ productId, className }: Props) {
  const [favorite, setFavorite] = useState(false);
  const handleAddFavorite = (): void => {
    setFavorite((prev) => !prev);
  };
  return (
    <Button
      onClick={handleAddFavorite}
      size="icon"
      variant="outline"
      className={`p-2 cursor-pointer ${className}`}
    >
      <FaHeart className={`${favorite ? "text-blue-500" : ""}`} />
    </Button>
  );
}

export default FavoriteToggleBtn;
