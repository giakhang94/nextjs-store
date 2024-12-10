import { FaStar, FaRegStar } from "react-icons/fa";

function Rating({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.ceil(rating)) return true;
    return false;
  });
  return (
    <div className="flex items-center space-x-1">
      {stars.map((start, index) => {
        if (start) {
          return <FaStar key={index} className="text-yellow-500" />;
        } else {
          return <FaRegStar key={index} className="text-yellow-500" />;
        }
      })}
    </div>
  );
}

export default Rating;
