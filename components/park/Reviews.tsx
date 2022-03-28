import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ReviewForm, { ReviewFormInputs } from "../forms/Review";

const Reviews = () => {
  const [rating, setRating] = useState(1);
  const { register, handleSubmit } = useForm<ReviewFormInputs>({
    defaultValues: {
      comment: "",
    },
  });

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRating(parseInt(event.target.value, 10));
  }

  const onSubmit: SubmitHandler<ReviewFormInputs> = (data) => {
    console.log(data, rating);
  };

  return (
    <section>
      <h2 className="text-xl mb-4">Reviews</h2>
      <ReviewForm
        rating={rating}
        handleValueChange={handleValueChange}
        register={register}
        onSubmit={handleSubmit(onSubmit)}
      />
    </section>
  );
};

export default Reviews;
