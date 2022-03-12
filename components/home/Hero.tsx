import Button from "../shared/Button";

const Hero = () => {
  return (
    <div className="lg:2/6 xl:w-2/4 my-20 lg:my-40 lg:ml-16 text-left">
      <h1 className="text-6xl font-semibold text-black dark:text-white leading-none">
        Tokyo Dog Runs
      </h1>
      <h3 className="my-6 text-xl font-light text-gray-500 dark:text-gray-300">
        Let your dogs run free and make new friends!
      </h3>
      <Button type="button" text="Sign up now" size="lg" />
    </div>
  );
};

export default Hero;
