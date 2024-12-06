import { FaStar } from "react-icons/fa";

interface Props {
  productId: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProductRating({ productId }: Props) {
  //temp
  const rating = 4.2;
  const count = 25;
  const className = `flex gap-1 items-center text-md mt-1 mb-4`;
  const countValue = `${count} reviews`;
  return (
    <span className={className}>
      <FaStar className="w-4 h-4 text-yellow-600" />
      {rating} ({countValue})
    </span>
  );
}

export default ProductRating;
