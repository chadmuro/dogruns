import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Park, ParkHours } from "@prisma/client";
import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import SecondaryButton from "../../components/shared/SecondaryButton";
import { toast } from "react-toastify";
import Toast from "../../components/shared/Toast";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
}) => {
  const session = await getSession({ req });
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    res.statusCode = 403;
    return {
      props: {
        parks: [],
        ...(await serverSideTranslations(locale as string, ["common"])),
      },
    };
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
    props: {
      parks,
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

type ParkWithHours = Park & { parkHours: ParkHours };

type Props = {
  parks: ParkWithHours[];
};

const Admin = ({ parks }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function deletePark(id: string) {
    setDeleting(true);
    const response = await fetch(`api/park/delete/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    toast(<Toast variant="success" message="Park information deleted" />);
    refreshData();
    setDeleting(false);
  }

  async function publishPark(id: string) {
    setPublishing(true);
    const response = await fetch(`/api/park/publish/${id}`, {
      method: "PUT",
    });
    const data = await response.json();
    await Router.push(`/park/${id}`);
    toast(<Toast variant="success" message="Park information published" />);
    setPublishing(false);
  }

  useEffect(() => {
    if (status !== "loading" && !isAdmin) {
      Router.push("/");
    }
  }, [isAdmin, status]);

  let parkData: React.ReactNode;
  if (!parks.length) {
    parkData = <p>No new parks</p>;
  } else {
    parkData = (
      <>
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
              <div className="flex">
                <div className="pr-4">
                  <SecondaryButton
                    loading={deleting}
                    type="button"
                    text="Delete"
                    variant="secondary"
                    onClick={() => deletePark(park.id)}
                  />
                </div>
                <div className="pr-4">
                  <Link href={`/admin/park/edit/${park.id}`}>
                    <a>
                      <SecondaryButton
                        type="button"
                        text="Edit"
                        variant="secondary"
                      />
                    </a>
                  </Link>
                </div>
                <SecondaryButton
                  loading={publishing}
                  type="button"
                  onClick={() => publishPark(park.id)}
                  text="Publish"
                />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <Layout>
      <main>{parkData}</main>
    </Layout>
  );
};

export default Admin;
