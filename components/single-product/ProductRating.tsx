import { fetchProductReviews } from "@/utils/actions";
import { FaStar } from "react-icons/fa";

interface Props {
  productId: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function ProductRating({ productId }: Props) {
  const reviewinfo = await fetchProductReviews(productId);
  //temp
  const count = reviewinfo.length;
  let totalStars = 0;
  if (count > 0) {
    totalStars = reviewinfo.reduce((accum, currentValue) => {
      accum = accum + currentValue.rating;
      return accum;
    }, 0);
  }
  const className = `flex gap-1 items-center text-md mt-1 mb-4`;
  const countValue = `${count} reviews`;
  return (
    <span className={className}>
      <FaStar className="w-4 h-4 text-yellow-600" />
      {count > 0 ? (totalStars / count).toFixed(1) : 0} ({countValue})
    </span>
  );
}

export default ProductRating;
