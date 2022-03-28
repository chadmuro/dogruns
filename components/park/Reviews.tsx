import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Park, ParkHours, Review } from "@prisma/client";
import ReviewForm, { ReviewFormInputs } from "../forms/Review";

interface ReviewsProps {
  park: Park & {
    parkHours: ParkHours;
    reviews: Review[];
  };
}

const Reviews = ({ park }: ReviewsProps) => {
  const router = useRouter();
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
    } catch (err) {
      console.error(err);
    }
    setPosting(false);
  };

  console.log(park.reviews);

  return (
    <section>
      <h2 className="text-xl mb-4">Reviews</h2>
      <ReviewForm
        rating={rating}
        handleValueChange={handleValueChange}
        register={register}
        onSubmit={handleSubmit(onSubmit)}
        posting={posting}
      />
    </section>
  );
};

export default Reviews;
