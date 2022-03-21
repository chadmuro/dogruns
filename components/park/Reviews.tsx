import Button from "../shared/Button";

const Reviews = () => {
  return (
    <section>
      <h2 className="text-xl">Reviews</h2>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Write a review
      </button>
    </section>
  );
};

export default Reviews;
