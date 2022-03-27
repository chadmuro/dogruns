import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ParkType } from "@prisma/client";
import Layout from "../../components/Layout";
import ParkForm, {
  ParkFormInputs,
  parkSchema,
} from "../../components/forms/ParkForm";

const NewPark = () => {
  const [posting, setPosting] = useState(false);
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParkFormInputs>({
    resolver: yupResolver(parkSchema),
    defaultValues: {
      name: "",
      nameJapanese: "",
      address: "",
      addressJapanese: "",
      google: "",
      // image: "",
      type: ParkType.INDOOR,
      price: "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/auth/signin");
    }
  }, [status]);

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
      const response = await fetch("/api/park", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      await Router.push(`/park/hours/${data.id}`);
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

export default NewPark;
