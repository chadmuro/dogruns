import { Review } from "@prisma/client";
import Image from "next/image";
import dateFormatter from "../../../utils/dateFormatter";
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
  const date = new Date(review.createdAt).toLocaleDateString("ja-JP");

  return (
    <article className="bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 p-4 mb-4 w-full">
      <div className="flex items-center mb-4 space-x-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            className="absolute"
            src={review.user.image}
            alt="reviewer name"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="space-y-1 font-medium dark:text-white">
          <p>
            {review.user.name}
            <time
              dateTime="2014-08-16 19:00"
              className="block text-sm text-gray-500 dark:text-gray-400"
            >
              {dateFormatter.format(new Date(date))}
            </time>
          </p>
        </div>
      </div>
      <div className="flex items-center mb-1">
        <Rating rating={review.rating} />
      </div>
      <p className="mb-3 font-light text-gray-500 dark:text-gray-400 whitespace-pre-line break-words">
        {review.comment}
      </p>
    </article>
  );
};

export default ReviewCard;
