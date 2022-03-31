import { yupResolver } from "@hookform/resolvers/yup";
import { Dog } from "@prisma/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";
import DogForm, { dogSchema, NewDogInputs } from "../components/forms/Dog";
import Layout from "../components/Layout";
import DogCard from "../components/profile/DogCard";
import Button from "../components/shared/Button";
import { getSession, useSession } from "next-auth/react";
import prisma from "../lib/prisma";
import { GetServerSideProps } from "next";
import uploadImage from "../utils/uploadImage";

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
  const { enqueueSnackbar } = useSnackbar();

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
      let imageUrl;
      if (!!image.length) {
        imageUrl = await uploadImage(image, "dogruns_dogs");
      }
      const body = {
        name,
        image: imageUrl,
        breed,
        birthdate,
      };
      const response = await fetch("/api/dog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await response.json();
      enqueueSnackbar("New dog added", {
        variant: "success",
      });
      refreshData();
    } catch (err: any) {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    }
    setPosting(false);
  };

  const onEditSubmit: SubmitHandler<NewDogInputs> = async (data) => {
    setPosting(true);
    const { name, image, breed, birthdate } = data;
    try {
      let imageUrl: string | undefined;
      if (!!image.length) {
        imageUrl = await uploadImage(image, "dogruns_dogs");
      }
      const body = {
        name,
        image: imageUrl ? imageUrl : selectedDog?.image,
        breed,
        birthdate,
      };
      const response = await fetch(`/api/dog/edit/${selectedDog?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await response.json();
      enqueueSnackbar("Dog information updated", {
        variant: "success",
      });
      refreshData();
    } catch (err: any) {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
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
    } else {
      reset({
        name: "",
        breed: "",
        birthdate: "",
      });
    }
  }, [selectedDog]);

  return (
    <Layout>
      <div className="max-w-md mb-4">
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
