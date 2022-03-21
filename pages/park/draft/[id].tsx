import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Park } from "@prisma/client";
import prisma from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
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

type ParkHourInputs = {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  extra: string;
};

type Props = {
  park: Park;
};

const DraftPark = ({ park }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParkHourInputs>();

  console.log(park);

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/auth/signin");
    }
  }, [status]);

  const onSubmit: SubmitHandler<ParkHourInputs> = async (data) => {
    console.log(data);
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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl mb-8">{`${park.name} hours`}</h1>
        <form
          className="max-w-sm mx-auto mb-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Monday"
            type="text"
            name="monday"
            placeholder="Monday park hours"
            defaultValue=""
            register={register}
            error={errors.monday}
            autoFocus
          />
          <Input
            label="Tuesday"
            type="text"
            name="tuesday"
            placeholder="Tuesday park hours"
            defaultValue=""
            register={register}
            error={errors.tuesday}
          />
          <Input
            label="Wednesday"
            type="text"
            name="wednesday"
            placeholder="Wednesday park hours"
            defaultValue=""
            register={register}
            error={errors.wednesday}
          />
          <Input
            label="Thursday"
            type="text"
            name="thursday"
            placeholder="Thursday park hours"
            defaultValue=""
            register={register}
            error={errors.thursday}
          />
          <Input
            label="Friday"
            type="text"
            name="friday"
            placeholder="Friday park hours"
            defaultValue=""
            register={register}
            error={errors.friday}
          />
          <Input
            label="Saturday"
            type="text"
            name="saturday"
            placeholder="Saturday park hours"
            defaultValue=""
            register={register}
            error={errors.saturday}
          />
          <Input
            label="Sunday"
            type="text"
            name="sunday"
            placeholder="Sunday park hours"
            defaultValue=""
            register={register}
            error={errors.sunday}
          />
          <Input
            label="Additional Information"
            type="text"
            name="extra"
            placeholder="Add any additional information"
            defaultValue=""
            register={register}
            error={errors.extra}
          />
          <Button type="submit" text="Submit" />
        </form>
      </div>
    </Layout>
  );
};

export default DraftPark;
