import { useState } from "react";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Park, ParkHours, Review } from "@prisma/client";
import ReviewForm, { ReviewFormInputs } from "../../forms/Review";
import ReviewCard from "./Card";
import { useSnackbar } from "notistack";

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
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [posting, setPosting] = useState(false);
  const { register, handleSubmit } = useForm<ReviewFormInputs>({
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
      enqueueSnackbar("New review added", {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
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
