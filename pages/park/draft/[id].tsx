import { useState, useEffect } from "react";
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
  const [posting, setPosting] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParkHourInputs>();

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/auth/signin");
    }
  }, [status]);

  const onSubmit: SubmitHandler<ParkHourInputs> = async (data) => {
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
      <main className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
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
          <Button
            type="submit"
            text={
              posting ? (
                <>
                  <svg
                    role="status"
                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Posting
                </>
              ) : (
                "Submit"
              )
            }
            disabled={posting}
          />
        </form>
      </main>
    </Layout>
  );
};

export default DraftPark;
