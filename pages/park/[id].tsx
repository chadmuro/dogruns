import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Park, ParkHours, Review, User } from "@prisma/client";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";
import Reviews from "../../components/park/Reviews";
import Rating from "../../components/park/Rating";
import Button from "../../components/shared/Button";
import { getSession, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Toast from "../../components/shared/Toast";
import useRouterRefresh from "../../hooks/useRouterRefresh";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  locale,
}) => {
  const session = await getSession({ req });
  const data = await prisma.park.findUnique({
    where: { id: params?.id as string },
    include: {
      parkHours: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      favoriteUsers: session
        ? {
            where: {
              parkId: params?.id as string,
              user: { email: session?.user?.email as string | undefined },
            },
          }
        : false,
    },
  });
  const park = JSON.parse(JSON.stringify(data));
  return {
    props: {
      park,
      ...(await serverSideTranslations(locale as string, [
        "common",
        "parkDetails",
      ])),
    },
  };
};

type Props = {
  park: Park & {
    parkHours: ParkHours;
    reviews: (Review & {
      user: {
        name: string;
        image: string;
      };
    })[];
    favoriteUsers: User[];
  };
};

const ParkDetails = ({ park }: Props) => {
  const [updating, setUpdating] = useState(false);
  const allReviews = park.reviews.map((review) => review.rating);
  const ratingSum = allReviews.reduce((a, b) => a + b, 0);
  const ratingAverage = ratingSum / allReviews.length || 0;
  const { data: session } = useSession();
  const router = useRouter();
  const isFavorited = session && park.favoriteUsers.length;
  const { t } = useTranslation("parkDetails");
  const isJapanese = router.locale === "ja";
  const refreshData = useRouterRefresh();

  const handleFavoriteClick = async (favoriteId?: string) => {
    if (!session) {
      return router.push("/auth/signin");
    }
    setUpdating(true);
    if (!isFavorited) {
      try {
        const response = await fetch(`/api/park/favorite/add/${park.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        refreshData();
        toast(<Toast variant="success" message="Park added to favorites" />);
      } catch (err: any) {
        toast(<Toast variant="error" message={err.message} />);
      }
    }
    if (isFavorited) {
      try {
        const response = await fetch(
          `/api/park/favorite/remove/${favoriteId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await response.json();
        refreshData();
        toast(
          <Toast variant="success" message="Park removed from favorites" />,
        );
      } catch (err: any) {
        toast(<Toast variant="error" message={err.message} />);
      }
    }
    setUpdating(false);
  };

  if (!park.published) {
    return (
      <Layout>
        <main>
          <h1 className="text-4xl mb-4">{park.name}</h1>
          <p>Thank you for your submission!</p>
          <p>Park details are currently under review...</p>
          <Link href="/">
            <a>
              <Button type="button" text="Back to Home" />
            </a>
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <section className="flex flex-col sm:flex-row mb-8">
          <div className="w-full relative h-80 sm:h-96 md:h-128">
            <Image
              loader={({ src, width }) => `${src}?w=${width}`}
              src={
                park.mainImage ||
                "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2062&q=80"
              }
              alt={park.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </section>
        <section className="flex flex-col mb-8">
          <div className="flex justify-between align-top">
            <h1 className="text-4xl mb-4">
              {isJapanese ? park.nameJapanese : park.name}
            </h1>
            <Button
              disabled={updating}
              onClick={() =>
                handleFavoriteClick(
                  park.favoriteUsers?.length
                    ? park.favoriteUsers[0].id
                    : undefined,
                )
              }
              type="button"
              text={
                <>
                  <svg
                    className={`w-7 h-7 sm:mr-1 ${
                      isFavorited ? "text-yellow-400" : "text-white"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <p className="hidden sm:block">
                    {isFavorited ? t("favorite-park") : t("add-favorite")}
                  </p>
                </>
              }
            />
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="mb-8 sm:mb-0 w-full sm:w-1/2">
              <h2 className="text-xl">{t("information")}</h2>
              <p className="mb-4">
                {isJapanese ? park.addressJapanese : park.address}
              </p>
              <div className="mb-4">
                <a
                  href={park.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    type="button"
                    text={
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="24"
                          height="24"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#48b564"
                            d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"
                          ></path>
                          <path
                            fill="#fcc60e"
                            d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"
                          ></path>
                          <path
                            fill="#2c85eb"
                            d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"
                          ></path>
                          <path
                            fill="#ed5748"
                            d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"
                          ></path>
                          <path
                            fill="#5695f6"
                            d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"
                          ></path>
                        </svg>
                        <p className="px-1">{`${t("google-maps")}`}</p>
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          ></path>
                        </svg>
                      </>
                    }
                  />
                </a>
              </div>
              <div>
                <div className="flex">
                  {park.reviews.length ? (
                    <>
                      <Rating rating={ratingAverage} />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {`${Math.round(ratingAverage * 100) / 100} out of 5`}
                      </p>
                    </>
                  ) : (
                    <p>No reviews yet</p>
                  )}
                </div>
                <p>{`${t("type")} : ${park.type}`}</p>
                <p>{`${t("price")} : ${park.price || "Free"}`}</p>
                <p>{`${t("additional-information")} : ${
                  park.additionalInformation || "None"
                }`}</p>
              </div>
            </div>
            <div className="flex w-full sm:w-1/2">
              <div className="hidden sm:block h-64 border-l-2 border-gray-500 px-2" />
              <div className="flex flex-col sm:pl-8 md:pl-16">
                <h2 className="text-xl">{t("park-hours")}</h2>
                <div className="flex leading-8 mb-2">
                  <ul>
                    <li>{t("monday")}</li>
                    <li>{t("tuesday")}</li>
                    <li>{t("wednesday")}</li>
                    <li>{t("thursday")}</li>
                    <li>{t("friday")}</li>
                    <li>{t("saturday")}</li>
                    <li>{t("sunday")}</li>
                  </ul>
                  <ul className="pl-4 flex-1">
                    <li>{park.parkHours?.monday || "Not available..."}</li>
                    <li>{park.parkHours?.tuesday || "Not available..."}</li>
                    <li>{park.parkHours?.wednesday || "Not available..."}</li>
                    <li>{park.parkHours?.thursday || "Not available..."}</li>
                    <li>{park.parkHours?.friday || "Not available..."}</li>
                    <li>{park.parkHours?.saturday || "Not available..."}</li>
                    <li>{park.parkHours?.sunday || "Not available..."}</li>
                  </ul>
                </div>
                <p>
                  {!!park.parkHours?.extra &&
                    `${t("park-hours-additional")}: ${park.parkHours?.extra}`}
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="h-1 border-b-2 border-gray-500 mx-4 mb-8" />
        <Reviews park={park} />
      </main>
    </Layout>
  );
};

export default ParkDetails;
