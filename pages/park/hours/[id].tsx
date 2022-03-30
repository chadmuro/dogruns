import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar } from "notistack";
import { Park } from "@prisma/client";
import prisma from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import ParkHoursForm, {
  ParkHoursFormInputs,
} from "../../../components/forms/ParkHoursForm";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { park: null } };
  }

  const park = await prisma.park.findUnique({
    where: {
      id: params?.id as string,
    },
  });
  return {
    props: { park },
  };
};

type Props = {
  park: Park;
};

const ParkHours = ({ park }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [posting, setPosting] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParkHoursFormInputs>({
    defaultValues: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
      extra: "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/auth/signin");
    }
  }, [status]);

  const onSubmit: SubmitHandler<ParkHoursFormInputs> = async (data) => {
    setPosting(true);
    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      extra,
    } = data;
    try {
      const body = {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        extra,
        parkId: id,
      };
      const response = await fetch("/api/park_hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      await Router.push(`/park/${data.parkId}`);
      enqueueSnackbar("Park hours added", {
        variant: "success",
      });
    } catch (err: any) {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    }
    setPosting(false);
  };

  return (
    <Layout>
      <main className="max-w-sm mx-auto">
        <h1 className="text-xl mb-8">{`${park.name} hours`}</h1>
        <ParkHoursForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          posting={posting}
        />
      </main>
    </Layout>
  );
};

export default ParkHours;
