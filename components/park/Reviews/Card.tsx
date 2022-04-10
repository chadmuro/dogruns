import { Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dateFormatter from "../../../utils/dateFormatter";
import Rating from "../Rating";

interface ReviewCardProps {
  review: Review & {
    user: {
      name: string;
      email: string;
      image: string;
    };
  };
  onDeleteSubmit: (id: string) => Promise<void>;
}

const ReviewCard = ({ review, onDeleteSubmit }: ReviewCardProps) => {
  const date = new Date(review.createdAt).toLocaleDateString("ja-JP");
  const { data: session } = useSession();

  return (
    <article className="bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 p-4 mb-4 w-full">
      <div className="flex justify-between items-start">
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
        {review.user.email === session?.user?.email && (
          <button
            id="delete-review"
            type="button"
            onClick={() => onDeleteSubmit(review.id)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        )}
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
