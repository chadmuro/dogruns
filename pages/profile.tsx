import { yupResolver } from "@hookform/resolvers/yup";
import { Dog } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import DogForm, { dogSchema, NewDogInputs } from "../components/forms/Dog";
import Layout from "../components/Layout";
import DogCard from "../components/profile/DogCard";
import Button from "../components/shared/Button";

const Profile = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [posting, setPosting] = useState(false);
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewDogInputs>({
    resolver: yupResolver(dogSchema),
    defaultValues: {
      name: "",
      image: null,
      breed: "",
      birthdate: "",
    },
  });

  const hideForm = () => {
    setShowForm(false);
    setSelectedDog(null);
  };

  const onSubmit: SubmitHandler<NewDogInputs> = async (data) => {
    setPosting(true);
    const { name, image, breed, birthdate } = data;
    try {
      const formData = new FormData();
      formData.append("file", (image as FileList)[0]);
      formData.append("upload_preset", "dogruns_dogs");

      const cloudinaryData = await fetch(
        "https://api.cloudinary.com/v1_1/chadmuro/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const response = await cloudinaryData.json();
      console.log(response.secure_url);
      const body = {
        name,
        image: response.secure_url,
        breed,
        birthdate,
      };
      await fetch("/api/dog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      refreshData();
    } catch (err) {
      console.error(err);
    }
    setPosting(false);
  };

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-xl">Profile</h1>
        <div className="flex leading-8 mb-2">
          <ul>
            <li>Name:</li>
            <li>Email:</li>
            <li>Favorite Parks:</li>
          </ul>
          <ul className="pl-4 flex-1">
            <li>Chad Muro</li>
            <li>test@test.com</li>
            <li>Park 1, Park 2</li>
          </ul>
        </div>
        <DogCard selectedDog={selectedDog} setSelectedDog={setSelectedDog} />
        {showForm || !!selectedDog ? (
          <DogForm
            register={register}
            errors={errors}
            posting={posting}
            hideForm={hideForm}
            onSubmit={handleSubmit(onSubmit)}
          />
        ) : (
          <Button
            type="button"
            text="Add dog"
            onClick={() => setShowForm(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Profile;
