import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "../../components/Layout";
import Button from "../../components/shared/Button";
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
    } catch (err) {
      console.error(err);
    }
    setPosting(false);
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
          <Button
            type="submit"
            text={
              posting ? (
                <>
                  <svg
                    role="status"
                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Posting
                </>
              ) : (
                "Submit"
              )
            }
            disabled={posting}
          />
        </form>
      </main>
    </Layout>
  );
};

export default NewPark;
