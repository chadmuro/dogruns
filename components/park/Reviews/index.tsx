import { useState } from "react";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Park, ParkHours, Review } from "@prisma/client";
import ReviewForm, { ReviewFormInputs } from "../../forms/Review";
import ReviewCard from "./Card";
import { toast } from "react-toastify";
import Toast from "../../shared/Toast";

interface ReviewsProps {
  park: Park & {
    parkHours: ParkHours;
    reviews: (Review & {
      user: {
        name: string;
        image: string;
      };
    })[];
  };
}

const Reviews = ({ park }: ReviewsProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [posting, setPosting] = useState(false);
  const { register, handleSubmit, reset } = useForm<ReviewFormInputs>({
    defaultValues: {
      comment: "",
    },
  });

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRating(parseInt(event.target.value, 10));
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const onSubmit: SubmitHandler<ReviewFormInputs> = async (data) => {
    setPosting(true);
    const { comment } = data;
    try {
      const body = {
        parkId: park.id,
        comment,
        rating,
      };
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      refreshData();
      reset();
      setRating(5);
      toast(<Toast variant="success" message="New review added" />);
    } catch (err: any) {
      toast(<Toast variant="error" message={err.message} />);
    }
    setPosting(false);
  };

  return (
    <section>
      <h2 className="text-xl mb-4">Reviews</h2>
      {!!session ? (
        <ReviewForm
          rating={rating}
          handleValueChange={handleValueChange}
          register={register}
          onSubmit={handleSubmit(onSubmit)}
          posting={posting}
        />
      ) : (
        <p className="mb-8">Sign in to leave a review</p>
      )}
      {park.reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </section>
  );
};

export default Reviews;
