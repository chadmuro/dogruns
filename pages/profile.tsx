import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Dog } from "@prisma/client";
import { getSession, useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DogForm, { dogSchema, NewDogInputs } from "components/forms/Dog";
import Layout from "components/Layout";
import DogCard from "components/profile/DogCard";
import Button from "components/shared/Button";
import prisma from "lib/prisma";
import uploadImage from "utils/uploadImage";
import Toast from "components/shared/Toast";
import useRouterRefresh from "hooks/useRouterRefresh";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
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
    props: {
      dogs,
      favoriteParks,
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
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
  const [deleting, setDeleting] = useState(false);
  const { data: session } = useSession();
  const refreshData = useRouterRefresh();

  const favoriteParkNames = favoriteParks
    .map((park) => park.park.name)
    .join(", ");

  const {
    register,
    handleSubmit,
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
      refreshData();
      hideForm();
      toast(<Toast variant="success" message="New dog added" />);
    } catch (err: any) {
      toast(<Toast variant="error" message={err.message} />);
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
      refreshData();
      hideForm();
      toast(<Toast variant="success" message="Dog information updated" />);
    } catch (err: any) {
      toast(<Toast variant="error" message={err.message} />);
    }
    setPosting(false);
  };

  const onDeleteSubmit = async (id: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/dog/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      await response.json();
      refreshData();
      hideForm();
      toast(<Toast variant="success" message="Dog information deleted" />);
    } catch (err: any) {
      toast(<Toast variant="error" message={err.message} />);
    }
    setDeleting(false);
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
  }, [selectedDog, reset]);

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
            selectedDog={selectedDog}
            onSubmit={
              !!selectedDog
                ? handleSubmit(onEditSubmit)
                : handleSubmit(onSubmit)
            }
            onDeleteSubmit={onDeleteSubmit}
            deleting={deleting}
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
