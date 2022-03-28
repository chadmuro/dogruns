import { UseFormRegister } from "react-hook-form";
import Button from "../../shared/Button";
import StarRating from "./StarRating";

export type ReviewFormInputs = {
  comment: string;
};

interface ReviewFormProps {
  rating: number;
  handleValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<ReviewFormInputs>;
  onSubmit: () => void;
  posting: boolean;
}

const ReviewForm = ({
  rating,
  handleValueChange,
  register,
  onSubmit,
  posting,
}: ReviewFormProps) => {
  return (
    <form className="mb-8" onSubmit={onSubmit}>
      <label
        htmlFor="comment"
        className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-400"
      >
        Your Review
      </label>
      <div className="flex mb-2">
        <StarRating
          value={1}
          handleValueChange={handleValueChange}
          rating={rating}
        />
        <StarRating
          value={2}
          handleValueChange={handleValueChange}
          rating={rating}
        />
        <StarRating
          value={3}
          handleValueChange={handleValueChange}
          rating={rating}
        />
        <StarRating
          value={4}
          handleValueChange={handleValueChange}
          rating={rating}
        />
        <StarRating
          value={5}
          handleValueChange={handleValueChange}
          rating={rating}
        />
      </div>
      <textarea
        {...register("comment")}
        id="comment"
        rows={4}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
        placeholder="Leave a comment..."
      />
      <Button type="submit" text="Submit a review" loading={posting} />
    </form>
  );
};

export default ReviewForm;
