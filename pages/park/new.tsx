import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "../../components/Layout";
import StyledButton from "../../components/shared/StyledButton";
import Input from "../../components/shared/Input";
import { ParkType } from "@prisma/client";

type NewParkInputs = {
  name: string;
  nameJapanese: string;
  address: string;
  addressJapanese: string;
  google: string;
  // image: string;
  type: ParkType;
  price: string;
};

const parkSchema = yup
  .object({
    name: yup.string().required("Park name is required"),
    nameJapanese: yup.string().required("Park name is required"),
    address: yup.string().required("Park address is required"),
    addressJapanese: yup.string().required("Park address is required"),
    google: yup.string().required("Google Map link is required"),
    // image: yup.string().required("Main mage is required"),
    price: yup.string(),
  })
  .required();

const NewPark = () => {
  const [posting, setPosting] = useState(false);
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewParkInputs>({ resolver: yupResolver(parkSchema) });

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/auth/signin");
    }
  }, [status]);

  const onSubmit: SubmitHandler<NewParkInputs> = async (data) => {
    setPosting(true);
    const {
      name,
      nameJapanese,
      address,
      addressJapanese,
      google,
      price,
      type,
    } = data;
    try {
      const body = {
        name,
        nameJapanese,
        address,
        addressJapanese,
        google,
        type,
        price,
      };
      const response = await fetch("/api/park", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      await Router.push(`/park/draft/${data.id}`);
      setPosting(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <main>
        <form
          className="max-w-sm mx-auto mb-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-between">
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
              label="Park name (Japanese)"
              type="text"
              name="nameJapanese"
              placeholder="Name in Japanese"
              defaultValue=""
              register={register}
              error={errors.nameJapanese}
            />
          </div>
          <div className="flex justify-between">
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
              label="Park address (Japanese)"
              type="text"
              name="addressJapanese"
              placeholder="Address in Japanese"
              defaultValue=""
              register={register}
              error={errors.addressJapanese}
            />
          </div>
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
              {...register("type")}
              id="type"
              defaultValue={ParkType.INDOOR}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value={ParkType.INDOOR}>Indoor</option>
              <option value={ParkType.OUTDOOR}>Outdoor</option>
              <option value={ParkType.BOTH}>Indoor/Outdoor</option>
            </select>
          </div>
          <Input
            label="Price"
            type="text"
            name="price"
            placeholder="Price in yen"
            defaultValue=""
            register={register}
            error={errors.price}
          />
          <StyledButton type="submit" text="Submit" loading={posting} />
        </form>
      </main>
    </Layout>
  );
};

export default NewPark;
