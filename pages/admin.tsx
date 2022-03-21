import { useEffect } from "react";
import { Park, ParkHours } from "@prisma/client";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { getSession, useSession } from "next-auth/react";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await getSession({ req });
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    res.statusCode = 403;
    return { props: { parks: [] } };
  }

  const parks = await prisma.park.findMany({
    where: {
      published: false,
    },
    include: {
      parkHours: true,
    },
  });
  return {
    props: { parks },
  };
};

type ParkWithHours = Park & { parkHours: ParkHours };

type Props = {
  parks: ParkWithHours[];
};

async function publishPark(id: string): Promise<void> {
  await fetch(`/api/park/publish/${id}`, {
    method: "PUT",
  });
  await Router.push(`/park/${id}`);
}

const Admin = ({ parks }: Props) => {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/auth/signin");
    }
  }, [status]);

  return (
    <Layout>
      {parks.map((park) => (
        <div key={park.id} className="mb-6">
          <div className="flex-col">
            <p>{`Park id: ${park.id}`}</p>
            <p>{`Park name: ${park.name}`}</p>
            <p>{`Park name (Japanese): ${park.nameJapanese}`}</p>
            <p>{`Park address: ${park.address}`}</p>
            <p>{`Park address (Japanese): ${park.addressJapanese}`}</p>
            <p>{`Google Map link: ${park.googleMapLink}`}</p>
            <p>{`Main Image: ${park.mainImage}`}</p>
            <p>{`Type: ${park.type}`}</p>
            <p>{`Price: ${park.price}`}</p>
            <p>{`Park hours Monday: ${park.parkHours?.monday}`}</p>
            <p>{`Park hours Tuesday: ${park.parkHours?.tuesday}`}</p>
            <p>{`Park hours Wednesday: ${park.parkHours?.wednesday}`}</p>
            <p>{`Park hours Thursday: ${park.parkHours?.thursday}`}</p>
            <p>{`Park hours Friday: ${park.parkHours?.friday}`}</p>
            <p>{`Park hours Saturday: ${park.parkHours?.saturday}`}</p>
            <p>{`Park hours Sunday: ${park.parkHours?.sunday}`}</p>
            <p>{`Park hours Extra: ${park.parkHours?.extra}`}</p>
            <div>
              <button
                type="button"
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => publishPark(park.id)}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-small rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-baseline"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      ))}
    </Layout>
  );
};

export default Admin;
