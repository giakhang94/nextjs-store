import { fetchProductReviews } from "@/utils/actions";

import SectionTitle from "../global/SectionTitle";
import ReviewCard from "./ReviewCard";

async function ProductReviews({ productId }: { productId: string }) {
  const reviews = await fetchProductReviews(productId);
  if (reviews.length === 0)
    return (
      <div className="mt-8">
        <h1 className="text-2xl font-semibold">0 reviews</h1>
      </div>
    );
  return (
    <div className="mt-8">
      <SectionTitle text="Product reviews" />
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {reviews.map((review) => {
          const { comment, rating, authorName, authorImageUrl } = review;
          const reviewInfo = {
            comment,
            rating,
            image: authorImageUrl,
            name: authorName,
          };
          return <ReviewCard key={review.id} reviewInfo={reviewInfo} />;
        })}
      </div>
    </div>
  );
}

export default ProductReviews;
