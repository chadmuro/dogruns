import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Park, ParkType } from "@prisma/client";
import Layout from "../../../../components/Layout";
import ParkForm, {
  ParkFormInputs,
  parkSchema,
} from "../../../../components/forms/ParkForm";
import { GetServerSideProps } from "next";
import prisma from "../../../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const park = await prisma.park.findUnique({
    where: { id: params?.id as string },
  });
  return { props: { park } };
};

type Props = {
  park: Park;
};

const EditPark = ({ park }: Props) => {
  const [posting, setPosting] = useState(false);
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParkFormInputs>({
    resolver: yupResolver(parkSchema),
    defaultValues: {
      name: park.name,
      nameJapanese: park.nameJapanese,
      address: park.address,
      addressJapanese: park.addressJapanese,
      google: park.googleMapLink,
      // image: "",
      type: park.type as ParkType,
      price: park.price,
    },
  });

  useEffect(() => {
    if (status !== "loading" && !isAdmin) {
      Router.push("/");
    }
  }, [isAdmin]);

  const onSubmit: SubmitHandler<ParkFormInputs> = async (data) => {
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
      const response = await fetch(`/api/park/edit/${park.id}`, {
        method: "PUT",
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
        <ParkForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          posting={posting}
        />
      </main>
    </Layout>
  );
};

export default EditPark;
