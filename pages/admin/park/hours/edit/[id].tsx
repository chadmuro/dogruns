import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Park, ParkHours } from "@prisma/client";
import prisma from "../../../../../lib/prisma";
import Layout from "../../../../../components/Layout";
import ParkHoursForm, {
  ParkHoursFormInputs,
} from "../../../../../components/forms/ParkHoursForm";
// import { useSnackbar } from "notistack";

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
    include: { parkHours: true },
  });
  return {
    props: { park },
  };
};

type Props = {
  park: Park & { parkHours: ParkHours };
};

const ParkHours = ({ park }: Props) => {
  // const { enqueueSnackbar } = useSnackbar();
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
      monday: park.parkHours.monday,
      tuesday: park.parkHours.tuesday,
      wednesday: park.parkHours.wednesday,
      thursday: park.parkHours.thursday,
      friday: park.parkHours.friday,
      saturday: park.parkHours.saturday,
      sunday: park.parkHours.sunday,
      extra: park.parkHours.extra,
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
      };
      const response = await fetch(
        `/api/park_hours/edit/${park.parkHours.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      await Router.push(`/park/${data.parkId}`);
      // enqueueSnackbar("Park hours updated", {
      //   variant: "success",
      // });
    } catch (err: any) {
      // enqueueSnackbar(err.message, {
      //   variant: "error",
      // });
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
