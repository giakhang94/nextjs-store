import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import Rating from "./Rating";
import Comment from "./Comment";

type ReviewCardProps = {
  reviewInfo: {
    comment: string;
    rating: number;
    name: string;
    image: string;
  };
  children?: React.ReactNode;
};
function ReviewCard(props: ReviewCardProps) {
  const { comment, rating, image, name } = props.reviewInfo;
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center">
          <Image
            src={image}
            alt="review img"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <h3 className="text-sm font-bold capitalize mb-1">{name}</h3>
            <Rating rating={rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Comment comment={comment} />
      </CardContent>
      <div className="absolute top-3 right-3">{props.children}</div>
    </Card>
  );
}

export default ReviewCard;
