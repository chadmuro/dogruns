import { yupResolver } from "@hookform/resolvers/yup";
import { Dog } from "@prisma/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import DogForm, { dogSchema, NewDogInputs } from "../components/forms/Dog";
import Layout from "../components/Layout";
import DogCard from "../components/profile/DogCard";
import Button from "../components/shared/Button";
import { getSession, useSession } from "next-auth/react";
import prisma from "../lib/prisma";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await getSession({ req });
  const dogs = await prisma.dog.findMany({
    where: {
      user: { email: session?.user?.email as string | undefined },
    },
  });
  const favoriteParks = await prisma.favorite.findMany({
    where: {
      user: { email: session?.user?.email as string | undefined },
    },
    select: {
      park: {
        select: {
          name: true,
        },
      },
    },
  });
  return {
    props: { dogs, favoriteParks },
  };
};

type Props = {
  dogs: Dog[];
  favoriteParks: { park: { name: string } }[];
};

const Profile = ({ dogs, favoriteParks }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [posting, setPosting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
    hideForm();
  };

  const favoriteParkNames = favoriteParks
    .map((park) => park.park.name)
    .join(", ");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NewDogInputs>({
    resolver: yupResolver(dogSchema),
    defaultValues: {
      name: "",
      image: [],
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
      formData.append("file", (image as any)[0]);
      formData.append("upload_preset", "dogruns_dogs");

      const cloudinaryData = await fetch(
        "https://api.cloudinary.com/v1_1/chadmuro/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const response = await cloudinaryData.json();
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

  const onEditSubmit: SubmitHandler<NewDogInputs> = async (data) => {
    setPosting(true);
    const { name, image, breed, birthdate } = data;
    try {
      if (!!image.length) {
        const formData = new FormData();
        formData.append("file", (image as any)[0]);
        formData.append("upload_preset", "dogruns_dogs");

        const cloudinaryData = await fetch(
          "https://api.cloudinary.com/v1_1/chadmuro/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const response = await cloudinaryData.json();
        const body = {
          name,
          image: response.secure_url,
          breed,
          birthdate,
        };
        await fetch(`/api/dog/edit/${selectedDog?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const body = {
          name,
          image: selectedDog?.image,
          breed,
          birthdate,
        };
        await fetch(`/api/dog/edit/${selectedDog?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      refreshData();
    } catch (err) {
      console.error(err);
    }
    setPosting(false);
  };

  useEffect(() => {
    if (selectedDog) {
      reset({
        name: selectedDog.name,
        breed: selectedDog.breed as string,
        birthdate: selectedDog.birthdate as string,
      });
    }
  }, [selectedDog]);

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
            <li>{session?.user?.name}</li>
            <li>{session?.user?.email}</li>
            <li>{favoriteParks.length ? favoriteParkNames : "None"}</li>
          </ul>
        </div>
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            selectedDog={selectedDog}
            setSelectedDog={setSelectedDog}
          />
        ))}
        {showForm || !!selectedDog ? (
          <DogForm
            register={register}
            errors={errors}
            posting={posting}
            hideForm={hideForm}
            onSubmit={
              !!selectedDog
                ? handleSubmit(onEditSubmit)
                : handleSubmit(onSubmit)
            }
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
