import { Review } from "@prisma/client";
import Rating from "../Rating";

interface ReviewCardProps {
  review: Review & {
    user: {
      name: string;
      image: string;
    };
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <article className="bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 p-4 mb-4">
      <div className="flex items-center mb-4 space-x-4">
        <img
          className="w-10 h-10 rounded-full"
          src={review.user.image}
          alt="reviewer name"
        />
        <div className="space-y-1 font-medium dark:text-white">
          <p>
            {review.user.name}
            <time
              dateTime="2014-08-16 19:00"
              className="block text-sm text-gray-500 dark:text-gray-400"
            >
              {review.createdAt}
            </time>
          </p>
        </div>
      </div>
      <div className="flex items-center mb-1">
        <Rating rating={review.rating} />
      </div>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-400 whitespace-pre">
        {review.comment}
      </p>
    </article>
  );
};

export default ReviewCard;
