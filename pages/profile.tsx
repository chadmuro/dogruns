import { Dog } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import DogForm, { NewDogInputs } from "../components/forms/Dog";
import Layout from "../components/Layout";
import DogCard from "../components/profile/DogCard";
import Button from "../components/shared/Button";

const Profile = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const {
    register,
    formState: { errors },
  } = useForm<NewDogInputs>({
    defaultValues: {
      name: "",
      image: "",
      breed: "",
      birthdate: "",
    },
  });

  const hideForm = () => {
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-xl">Profile</h1>
        <div className="flex leading-8 mb-2">
          <ul>
            <li>Name</li>
            <li>Email</li>
          </ul>
          <ul className="pl-4 flex-1">
            <li>Chad Muro</li>
            <li>test@test.com</li>
          </ul>
        </div>
        <DogCard />
        {showForm ? (
          <DogForm register={register} errors={errors} hideForm={hideForm} />
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
