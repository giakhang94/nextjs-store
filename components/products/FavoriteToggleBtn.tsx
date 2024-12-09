import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Buttons";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

interface Props {
  className?: string;
  productId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function FavoriteToggleBtn({ productId, className }: Props) {
  const { userId } = auth();
  if (!userId) return <CardSignInButton />;
  const favoriteId = await fetchFavoriteId({ productId });
  return (
    <FavoriteToggleForm
      favoriteId={favoriteId}
      productId={productId}
    ></FavoriteToggleForm>
  );
}

export default FavoriteToggleBtn;
