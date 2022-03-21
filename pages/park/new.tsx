import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "../../components/Layout";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";

type NewParkInputs = {
  name: string;
  address: string;
  google: string;
  // image: string;
  price: number;
};

const parkSchema = yup
  .object({
    name: yup.string().required("Park name is required"),
    address: yup.string().required("Park address is required"),
    google: yup.string().required("Google Map link is required"),
    // image: yup.string().required("Main mage is required"),
    price: yup.number().min(0).integer(),
  })
  .required();

const NewPark = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewParkInputs>({ resolver: yupResolver(parkSchema) });

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
          error={errors.name}
          autoFocus
        />
        <Input
          label="Park address"
          type="text"
          name="address"
          placeholder="Park address"
          defaultValue=""
          register={register}
          error={errors.address}
        />
        <Input
          label="Google Map link"
          type="text"
          name="google"
          placeholder="Add a link to the Google Map"
          defaultValue=""
          register={register}
          error={errors.google}
        />
        {/* <Input
          label="Main image"
          type="file"
          accept="image/*"
          name="image"
          placeholder="Select a main image"
          defaultValue=""
          register={register}
          error={errors.image}
        /> */}
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
          defaultValue={0}
          register={register}
          error={errors.price}
        />
        <Button type="submit" text="Submit" />
      </form>
    </Layout>
  );
};

export default NewPark;
