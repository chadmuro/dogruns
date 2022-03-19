import { SubmitHandler, useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";

type NewParkInputs = {
  name: string;
  address: string;
};

const NewPark = () => {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<NewParkInputs>();

  const onSubmit: SubmitHandler<NewParkInputs> = (data) => {
    console.log(data);
  };

  return (
    <Layout>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Park name"
          type="text"
          name="name"
          placeholder="Park name"
          defaultValue=""
          register={register}
          required
          autoFocus
        />
        <Input
          label="Park address"
          type="text"
          name="address"
          placeholder="Park address"
          defaultValue=""
          register={register}
          required
        />
        <Input
          label="Google Map link"
          type="text"
          name="google"
          placeholder="Add a link to the Google Map"
          defaultValue=""
          register={register}
          required
        />
        <Input
          label="Main image"
          type="file"
          accept="image/*"
          name="image"
          placeholder="Select a main image"
          defaultValue=""
          register={register}
          required
        />
        <label
          htmlFor="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Select the park type
        </label>
        <div className="mb-6">
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>Indoor</option>
            <option>Outdoor</option>
            <option>Indoor/Outdoor</option>
          </select>
        </div>
        <Input
          label="Price"
          type="number"
          name="price"
          min={0}
          placeholder="Price in yen"
          defaultValue=""
          register={register}
          required
        />
        <Button type="submit" text="Submit" />
      </form>
    </Layout>
  );
};

export default NewPark;
